import CompanyService from '../../services/companyService';
import { Company } from '../../models/index';

// Mock do modelo Company
jest.mock('../../models/index', () => ({
  ...jest.requireActual('../../models/index'),
  Company: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  }
}));

describe('CompanyService', () => {
  let companyService: CompanyService;
  let mockCompany: any;

  beforeEach(() => {
    // Setup antes de cada teste
    companyService = new CompanyService();
    
    // Mock da empresa
    mockCompany = {
      id: 1,
      name: 'Clínica São Lucas',
      cnpj: '12.345.678/0001-90',
      email: 'contato@clinicasaolucas.com',
      phone: '(11) 3333-4444',
      address: 'Rua das Clínicas, 100',
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
    it('deve retornar uma empresa quando encontrada', async () => {
      // Arrange
      const companyId = '1';
      (Company.findByPk as jest.Mock).mockResolvedValue(mockCompany);

      // Act
      const result = await companyService.find(companyId);

      // Assert
      expect(Company.findByPk).toHaveBeenCalledWith(companyId);
      expect(result).toEqual(mockCompany);
    });

    it('deve lançar erro quando empresa não encontrada', async () => {
      // Arrange
      const companyId = '999';
      (Company.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(companyService.find(companyId)).rejects.toThrow('Empresa não encontrada.');
    });
  });

  describe('list', () => {
    it('deve retornar lista de empresas ativas', async () => {
      // Arrange
      const mockCompanies = [mockCompany];
      (Company.findAll as jest.Mock).mockResolvedValue(mockCompanies);

      // Act
      const result = await companyService.list();

      // Assert
      expect(Company.findAll).toHaveBeenCalledWith({
        where: { is_deleted: false },
        order: [['name', 'ASC']]
      });
      expect(result).toEqual(mockCompanies);
    });

    it('deve retornar lista vazia quando não há empresas', async () => {
      // Arrange
      (Company.findAll as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await companyService.list();

      // Assert
      expect(result).toEqual([]);
      expect(Company.findAll).toHaveBeenCalledWith({
        where: { is_deleted: false },
        order: [['name', 'ASC']]
      });
    });
  });

  describe('create', () => {
    it('deve criar uma nova empresa com sucesso', async () => {
      // Arrange
      const companyData = {
        name: 'Clínica Nova Esperança',
        cnpj: '98.765.432/0001-10',
        email: 'contato@clinicanova.com',
        phone: '(11) 5555-6666',
        address: 'Av. da Saúde, 200'
      };
      
      const expectedCompanyData = {
        ...companyData,
        is_deleted: false
      };
      
      (Company.create as jest.Mock).mockResolvedValue({
        id: 2,
        ...expectedCompanyData
      });

      // Act
      const result = await companyService.create(companyData);

      // Assert
      expect(Company.create).toHaveBeenCalledWith(expectedCompanyData);
      expect(result).toHaveProperty('id', 2);
      expect(result).toHaveProperty('name', 'Clínica Nova Esperança');
    });

    it('deve definir is_deleted como false por padrão', async () => {
      // Arrange
      const companyData = {
        name: 'Clínica Teste',
        cnpj: '11.222.333/0001-44'
      };
      
      (Company.create as jest.Mock).mockResolvedValue({
        id: 3,
        ...companyData,
        is_deleted: false
      });

      // Act
      await companyService.create(companyData);

      // Assert
      const callArgs = (Company.create as jest.Mock).mock.calls[0][0];
      expect(callArgs.is_deleted).toBe(false);
    });
  });

  describe('update', () => {
    it('deve atualizar empresa existente', async () => {
      // Arrange
      const companyId = '1';
      const updateData = {
        name: 'Clínica São Lucas Atualizada',
        email: 'novo@clinicasaolucas.com'
      };
      
      (Company.findByPk as jest.Mock).mockResolvedValue(mockCompany);
      mockCompany.update.mockResolvedValue({
        ...mockCompany,
        ...updateData
      });

      // Act
      const result = await companyService.update(companyId, updateData);

      // Assert
      expect(Company.findByPk).toHaveBeenCalledWith(companyId);
      expect(mockCompany.update).toHaveBeenCalledWith(updateData);
      expect(Company.findByPk).toHaveBeenCalledWith(companyId);
      expect(mockCompany.update).toHaveBeenCalledWith(updateData);
    });

    it('deve lançar erro quando empresa não encontrada para atualização', async () => {
      // Arrange
      const companyId = '999';
      const updateData = { name: 'Nome Atualizado' };
      
      (Company.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(companyService.update(companyId, updateData)).rejects.toThrow('Empresa não encontrada.');
    });
  });

  describe('delete', () => {
    it('deve deletar empresa (soft delete)', async () => {
      // Arrange
      const companyId = '1';
      (Company.findByPk as jest.Mock).mockResolvedValue(mockCompany);
      mockCompany.update.mockResolvedValue({
        ...mockCompany,
        is_deleted: true
      });

      // Act
      const result = await companyService.delete(companyId);

      // Assert
      expect(Company.findByPk).toHaveBeenCalledWith(companyId);
      expect(mockCompany.update).toHaveBeenCalledWith({ is_deleted: true });
      expect(result).toEqual({ message: 'Empresa deletada.' });
    });

    it('deve lançar erro quando empresa não encontrada para deletar', async () => {
      // Arrange
      const companyId = '999';
      (Company.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(companyService.delete(companyId)).rejects.toThrow('Empresa não encontrada.');
    });
  });
});
