import AuthService from '../../services/authService';
import { User } from '../../models/index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock dos módulos
jest.mock('../../models/index', () => ({
  ...jest.requireActual('../../models/index'),
  User: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

describe('AuthService', () => {
  let authService: AuthService;
  let mockUser: any;

  beforeEach(() => {
    // Setup antes de cada teste
    authService = new AuthService();
    
    // Mock do usuário
    mockUser = {
      id: 1,
      name: 'Dr. João Silva',
      email: 'joao@clinic.com',
      login: 'joao.silva',
      password: 'hashedPassword123',
      cpf: '123.456.789-09',
      phone: '(11) 99999-9999',
      role: 'DOCTOR',
      root: false,
      company_id: 1,
      get: jest.fn().mockReturnValue({
        id: 1,
        name: 'Dr. João Silva',
        email: 'joao@clinic.com',
        login: 'joao.silva',
        password: 'hashedPassword123',
        cpf: '123.456.789-09',
        phone: '(11) 99999-9999',
        role: 'DOCTOR',
        root: false,
        company_id: 1
      })
    };

    // Limpar todos os mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('deve fazer login com sucesso usando email', async () => {
      // Arrange
      const credentials = {
        login: 'joao@clinic.com',
        password: 'senha123'
      };
      
      const mockToken = 'jwt.token.here';
      const mockTokenPayload = {
        id: 1,
        name: 'Dr. João Silva',
        email: 'joao@clinic.com',
        role: 'DOCTOR',
        root: false,
        company_id: 1
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      // Act
      const result = await authService.login(credentials);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        where: {
          [Symbol.for('or')]: [
            { email: 'joao@clinic.com' },
            { login: 'joao@clinic.com' }
          ]
        }
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('senha123', 'hashedPassword123');
      expect(jwt.sign).toHaveBeenCalledWith(
        mockTokenPayload,
        expect.any(String),
        { expiresIn: '8h' }
      );
      expect(result).toEqual({ token: mockToken });
    });

    it('deve fazer login com sucesso usando login', async () => {
      // Arrange
      const credentials = {
        login: 'joao.silva',
        password: 'senha123'
      };
      
      const mockToken = 'jwt.token.here';
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      // Act
      const result = await authService.login(credentials);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        where: {
          [Symbol.for('or')]: [
            { email: 'joao.silva' },
            { login: 'joao.silva' }
          ]
        }
      });
      expect(result).toEqual({ token: mockToken });
    });

    it('deve lançar erro quando credenciais estão vazias', async () => {
      // Arrange
      const credentials = {
        login: '',
        password: ''
      };

      // Act & Assert
      await expect(authService.login(credentials)).rejects.toThrow('Email/Login e senha são obrigatórios.');
    });

    it('deve lançar erro quando usuário não encontrado', async () => {
      // Arrange
      const credentials = {
        login: 'usuario.inexistente@email.com',
        password: 'senha123'
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(authService.login(credentials)).rejects.toThrow('Usuário ou senha inválidos.');
    });

    it('deve lançar erro quando senha incorreta', async () => {
      // Arrange
      const credentials = {
        login: 'joao@clinic.com',
        password: 'senha_incorreta'
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(authService.login(credentials)).rejects.toThrow('Usuário ou senha inválidos.');
    });
  });

  describe('register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      // Arrange
      const userData = {
        name: 'Maria Santos',
        email: 'maria@clinic.com',
        login: 'maria.santos',
        password: 'senha123',
        cpf: '987.654.321-00',
        phone: '(11) 88888-8888',
        role: 'RECEPTIONIST' as const,
        company_id: 1
      };

      const hashedPassword = 'hashedPassword456';
      const newUser = {
        ...userData,
        id: 2,
        password: hashedPassword,
        root: false
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (User.create as jest.Mock).mockResolvedValue({
        ...newUser,
        get: jest.fn().mockReturnValue(newUser)
      });

      // Act
      const result = await authService.register(userData);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        where: {
          [Symbol.for('or')]: [
            { email: 'maria@clinic.com' },
            { login: 'maria.santos' },
            { cpf: '987.654.321-00' }
          ]
        }
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
      expect(User.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword,
        root: false
      });
      expect(result.password).toBeUndefined();
    });

    it('deve registrar usuário com root true quando especificado', async () => {
      // Arrange
      const userData = {
        name: 'Admin',
        email: 'admin@clinic.com',
        login: 'admin',
        password: 'senha123',
        cpf: '111.222.333-44',
        role: 'DOCTOR' as const,
        root: true,
        company_id: 1
      };

      const hashedPassword = 'hashedPassword789';
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (User.create as jest.Mock).mockResolvedValue({
        ...userData,
        id: 3,
        password: hashedPassword,
        get: jest.fn().mockReturnValue({
          ...userData,
          id: 3,
          password: hashedPassword
        })
      });

      // Act
      await authService.register(userData);

      // Assert
      expect(User.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword,
        root: true
      });
    });

    it('deve lançar erro quando campos obrigatórios estão faltando', async () => {
      // Arrange
      const userData = {
        name: 'Maria Santos',
        email: 'maria@clinic.com',
        // login faltando
        password: 'senha123',
        cpf: '987.654.321-00',
        role: 'RECEPTIONIST' as const,
        company_id: 1
      };

      // Act & Assert
      await expect(authService.register(userData as any)).rejects.toThrow('Campos obrigatórios faltando.');
    });

    it('deve lançar erro quando email já existe', async () => {
      // Arrange
      const userData = {
        name: 'Maria Santos',
        email: 'joao@clinic.com', // Email já existe
        login: 'maria.santos',
        password: 'senha123',
        cpf: '987.654.321-00',
        role: 'RECEPTIONIST' as const,
        company_id: 1
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Act & Assert
      await expect(authService.register(userData)).rejects.toThrow('Email, Login ou CPF já cadastrado.');
    });

    it('deve lançar erro quando login já existe', async () => {
      // Arrange
      const userData = {
        name: 'Maria Santos',
        email: 'maria@clinic.com',
        login: 'joao.silva', // Login já existe
        password: 'senha123',
        cpf: '987.654.321-00',
        role: 'RECEPTIONIST' as const,
        company_id: 1
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Act & Assert
      await expect(authService.register(userData)).rejects.toThrow('Email, Login ou CPF já cadastrado.');
    });

    it('deve lançar erro quando CPF já existe', async () => {
      // Arrange
      const userData = {
        name: 'Maria Santos',
        email: 'maria@clinic.com',
        login: 'maria.santos',
        password: 'senha123',
        cpf: '123.456.789-09', // CPF já existe
        role: 'RECEPTIONIST' as const,
        company_id: 1
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Act & Assert
      await expect(authService.register(userData)).rejects.toThrow('Email, Login ou CPF já cadastrado.');
    });
  });

  describe('changePassword', () => {
    it('deve alterar senha com sucesso', async () => {
      // Arrange
      const data = {
        currentPassword: 'senha_atual',
        newPassword: 'nova_senha'
      };

      // Act
      const result = await authService.changePassword(data);

      // Assert
      expect(result).toEqual({ message: 'Senha alterada com sucesso.' });
    });

    it('deve lançar erro quando senhas não fornecidas', async () => {
      // Arrange
      const data = {
        currentPassword: '',
        newPassword: ''
      };

      // Act & Assert
      await expect(authService.changePassword(data)).rejects.toThrow('Senha atual e nova senha são obrigatórias.');
    });
  });

  describe('resetPassword', () => {
    it('deve enviar email de reset com sucesso', async () => {
      // Arrange
      const data = {
        email: 'joao@clinic.com'
      };

      // Act
      const result = await authService.resetPassword(data);

      // Assert
      expect(result).toEqual({ message: 'Email de reset de senha enviado com sucesso.' });
    });

    it('deve lançar erro quando email não fornecido', async () => {
      // Arrange
      const data = {
        email: ''
      };

      // Act & Assert
      await expect(authService.resetPassword(data)).rejects.toThrow('Email é obrigatório.');
    });
  });
});
