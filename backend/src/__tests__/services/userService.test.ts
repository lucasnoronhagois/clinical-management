import UserService from '../../services/userService';
import { User } from '../../models/index';
import bcrypt from 'bcrypt';

// Mock do modelo User
jest.mock('../../models/index', () => ({
  User: {
    findByPk: jest.fn(),
    findOne: jest.fn(),
    findAndCountAll: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
    update: jest.fn()
  }
}));

// Mock do bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn()
}));

describe('UserService', () => {
  let userService: UserService;
  let mockUser: any;

  beforeEach(() => {
    // Setup antes de cada teste
    userService = new UserService();
    
    // Mock do usuário
    mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@test.com',
      login: 'joao.silva',
      role: 'DOCTOR',
      cpf: '123.456.789-09',
      phone: '(11) 99999-9999',
      company_id: 1,
      password: 'hashedPassword123',
      root: false,
      is_deleted: false,
      update: jest.fn()
    };

    // Limpar todos os mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('find', () => {
    it('deve retornar um usuário quando encontrado', async () => {
      // Arrange
      const userId = '1';
      const expectedUser = {
        id: 1,
        login: 'joao.silva'
      };
      (User.findByPk as jest.Mock).mockResolvedValue(expectedUser);

      // Act
      const result = await userService.find(userId);

      // Assert
      expect(User.findByPk).toHaveBeenCalledWith(userId, {
        attributes: ['id', 'login']
      });
      expect(result).toEqual(expectedUser);
    });

    it('deve lançar erro quando usuário não encontrado', async () => {
      // Arrange
      const userId = '999';
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(userService.find(userId)).rejects.toThrow('Usuário não encontrado.');
    });
  });

  describe('findForUpdate', () => {
    it('deve retornar usuário ativo para atualização', async () => {
      // Arrange
      const userId = '1';
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Act
      const result = await userService.findForUpdate(userId);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        where: {
          id: userId,
          is_deleted: false
        }
      });
      expect(result).toEqual(mockUser);
    });

    it('deve lançar erro quando usuário não encontrado para atualização', async () => {
      // Arrange
      const userId = '999';
      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(userService.findForUpdate(userId)).rejects.toThrow('Usuário não encontrado.');
    });
  });

  describe('list', () => {
    it('deve retornar lista de usuários com paginação', async () => {
      // Arrange
      const filters = {
        company_id: '1',
        page: '1',
        limit: '10'
      };
      
      const mockUsers = [mockUser];
      const mockCount = 1;
      
      (User.findAndCountAll as jest.Mock).mockResolvedValue({
        rows: mockUsers,
        count: mockCount
      });

      // Act
      const result = await userService.list(filters);

      // Assert
      expect(User.findAndCountAll).toHaveBeenCalledWith({
        where: { 
          is_deleted: false,
          company_id: 1
        },
        attributes: { exclude: ['password'] },
        order: [['name', 'ASC']],
        limit: 10,
        offset: 0
      });
      expect(result.users).toEqual(mockUsers);
      expect(result.pagination).toEqual({
        currentPage: 1,
        totalPages: 1,
        totalItems: 1,
        itemsPerPage: 10
      });
    });

    it('deve filtrar por nome quando fornecido', async () => {
      // Arrange
      const filters = {
        company_id: '1',
        name: 'João'
      };
      
      (User.findAndCountAll as jest.Mock).mockResolvedValue({
        rows: [mockUser],
        count: 1
      });

      // Act
      await userService.list(filters);

      // Assert
      const callArgs = (User.findAndCountAll as jest.Mock).mock.calls[0][0];
      expect(callArgs.where.is_deleted).toBe(false);
      expect(callArgs.where.company_id).toBe(1);
      expect(callArgs.where.name).toBeDefined();
      expect(callArgs.attributes).toEqual({ exclude: ['password'] });
      expect(callArgs.order).toEqual([['name', 'ASC']]);
    });

    it('deve filtrar por role quando fornecido', async () => {
      // Arrange
      const filters = {
        company_id: '1',
        role: 'DOCTOR'
      };
      
      (User.findAndCountAll as jest.Mock).mockResolvedValue({
        rows: [mockUser],
        count: 1
      });

      // Act
      await userService.list(filters);

      // Assert
      expect(User.findAndCountAll).toHaveBeenCalledWith({
        where: { 
          is_deleted: false,
          company_id: 1,
          role: 'DOCTOR'
        },
        attributes: { exclude: ['password'] },
        order: [['name', 'ASC']]
      });
    });
  });

  describe('create', () => {
    it('deve criar um novo usuário com sucesso', async () => {
      // Arrange
      const userData = {
        name: 'Maria Santos',
        email: 'maria@test.com',
        login: 'maria.santos',
        password: 'senha123',
        cpf: '987.654.321-00',
        phone: '(11) 88888-8888',
        role: 'RECEPTIONIST' as const,
        company_id: 1
      };
      
      (User.count as jest.Mock).mockResolvedValue(0);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword456');
      (User.create as jest.Mock).mockResolvedValue({
        ...userData,
        id: 2,
        password: 'hashedPassword456',
        root: false,
        is_deleted: false
      });

      // Act
      const result = await userService.create(userData);

      // Assert
      expect(User.count).toHaveBeenCalledWith({
        where: { login: 'maria.santos' }
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
      expect(User.create).toHaveBeenCalledWith({
        ...userData,
        password: 'hashedPassword456',
        root: false,
        is_deleted: false
      });
      expect(result).toHaveProperty('id', 2);
      expect(result).toHaveProperty('name', 'Maria Santos');
    });

    it('deve lançar erro quando login já existe', async () => {
      // Arrange
      const userData = {
        name: 'João Silva',
        email: 'joao@test.com',
        login: 'joao.silva',
        password: 'senha123',
        cpf: '123.456.789-09',
        role: 'DOCTOR' as const,
        company_id: 1
      };
      
      (User.count as jest.Mock).mockResolvedValue(1);

      // Act & Assert
      await expect(userService.create(userData)).rejects.toThrow('LOGIN_USADO');
    });

    it('deve lançar erro quando senha não fornecida', async () => {
      // Arrange
      const userData = {
        name: 'João Silva',
        email: 'joao@test.com',
        login: 'joao.silva',
        cpf: '123.456.789-09',
        role: 'DOCTOR' as const,
        company_id: 1
      };
      
      (User.count as jest.Mock).mockResolvedValue(0);

      // Act & Assert
      await expect(userService.create(userData)).rejects.toThrow('Senha é obrigatória');
    });
  });

  describe('update', () => {
    it('deve atualizar usuário existente', async () => {
      // Arrange
      const userId = '1';
      const updateData = {
        name: 'João Silva Atualizado',
        email: 'joao.novo@test.com'
      };
      
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      mockUser.update.mockResolvedValue({
        ...mockUser,
        ...updateData
      });

      // Act
      const result = await userService.update(userId, updateData);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        where: {
          id: userId,
          is_deleted: false
        }
      });
      expect(mockUser.update).toHaveBeenCalledWith(updateData);
    });

    it('deve criptografar senha quando atualizada', async () => {
      // Arrange
      const userId = '1';
      const updateData = {
        password: 'novaSenha123'
      };
      
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNewPassword');
      mockUser.update.mockResolvedValue({
        ...mockUser,
        password: 'hashedNewPassword'
      });

      // Act
      await userService.update(userId, updateData);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith('novaSenha123', 10);
      expect(mockUser.update).toHaveBeenCalledWith({
        password: 'hashedNewPassword'
      });
    });
  });

  describe('delete', () => {
    it('deve deletar usuário (soft delete)', async () => {
      // Arrange
      const userId = '1';
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      mockUser.update.mockResolvedValue({
        ...mockUser,
        is_deleted: true
      });

      // Act
      const result = await userService.delete(userId);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        where: {
          id: userId,
          is_deleted: false
        }
      });
      expect(mockUser.update).toHaveBeenCalledWith({ is_deleted: true });
      expect(result).toEqual({ message: 'Usuário deletado.' });
    });
  });

  describe('createMultiple', () => {
    it('deve criar múltiplos usuários', async () => {
      // Arrange
      const usersData = [
        {
          name: 'Usuário 1',
          email: 'user1@test.com',
          login: 'user1',
          password: 'senha123',
          cpf: '111.111.111-11',
          role: 'DOCTOR' as const,
          company_id: 1
        },
        {
          name: 'Usuário 2',
          email: 'user2@test.com',
          login: 'user2',
          password: 'senha456',
          cpf: '222.222.222-22',
          role: 'RECEPTIONIST' as const,
          company_id: 1
        }
      ];
      
      (User.count as jest.Mock).mockResolvedValue(0);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (User.create as jest.Mock)
        .mockResolvedValueOnce({ id: 1, ...usersData[0] })
        .mockResolvedValueOnce({ id: 2, ...usersData[1] });

      // Act
      const result = await userService.createMultiple(usersData);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id', 1);
      expect(result[1]).toHaveProperty('id', 2);
    });
  });
});
