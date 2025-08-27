import PatientService from '../../services/patientService';
import { Patient } from '../../models/index';

// Mock do modelo Patient
jest.mock('../../models/index', () => ({
  ...jest.requireActual('../../models/index'),
  Patient: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  }
}));

describe('PatientService', () => {
  let patientService: PatientService;
  let mockPatient: any;

  beforeEach(() => {
    // Setup antes de cada teste
    patientService = new PatientService();
    
    // Mock do paciente
    mockPatient = {
      id: 1,
      name: 'Maria Santos',
      email: 'maria@email.com',
      cpf: '123.456.789-09',
      phone: '(11) 99999-9999',
      birth_date: new Date('1990-01-01'),
      address: 'Rua das Flores, 123',
      company_id: 1,
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
    it('deve retornar um paciente quando encontrado', async () => {
      // Arrange
      const patientId = '1';
      (Patient.findByPk as jest.Mock).mockResolvedValue(mockPatient);

      // Act
      const result = await patientService.find(patientId);

      // Assert
      expect(Patient.findByPk).toHaveBeenCalledWith(patientId);
      expect(result).toEqual(mockPatient);
    });

    it('deve lançar erro quando paciente não encontrado', async () => {
      // Arrange
      const patientId = '999';
      (Patient.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(patientService.find(patientId)).rejects.toThrow('Paciente não encontrado.');
    });
  });

  describe('list', () => {
    it('deve retornar lista de pacientes ativos', async () => {
      // Arrange
      const filters = { company_id: '1' };
      const mockPatients = [mockPatient];
      
      (Patient.findAll as jest.Mock).mockResolvedValue(mockPatients);

      // Act
      const result = await patientService.list(filters);

      // Assert
      expect(Patient.findAll).toHaveBeenCalledWith({
        where: { 
          is_deleted: false,
          company_id: 1
        },
        order: [['name', 'ASC']]
      });
      expect(result).toEqual(mockPatients);
    });

    it('deve retornar lista sem filtro de empresa quando não fornecido', async () => {
      // Arrange
      const filters = {};
      const mockPatients = [mockPatient];
      
      (Patient.findAll as jest.Mock).mockResolvedValue(mockPatients);

      // Act
      const result = await patientService.list(filters);

      // Assert
      expect(Patient.findAll).toHaveBeenCalledWith({
        where: { 
          is_deleted: false
        },
        order: [['name', 'ASC']]
      });
      expect(result).toEqual(mockPatients);
    });
  });

  describe('create', () => {
    it('deve criar um novo paciente com sucesso', async () => {
      // Arrange
      const patientData = {
        name: 'João Silva',
        email: 'joao@email.com',
        cpf: '987.654.321-00',
        phone: '(11) 88888-8888',
        birth_date: '1985-05-15',
        address: 'Av. Paulista, 1000',
        company_id: '1'
      };
      
      const expectedPatientData = {
        ...patientData,
        birth_date: new Date('1985-05-15'),
        company_id: 1,
        is_deleted: false
      };
      
      (Patient.create as jest.Mock).mockResolvedValue({
        id: 2,
        ...expectedPatientData
      });

      // Act
      const result = await patientService.create(patientData);

      // Assert
      expect(Patient.create).toHaveBeenCalledWith(expectedPatientData);
      expect(result).toHaveProperty('id', 2);
      expect(result).toHaveProperty('name', 'João Silva');
    });

    it('deve converter birth_date para Date', async () => {
      // Arrange
      const patientData = {
        name: 'Ana Costa',
        email: 'ana@email.com',
        cpf: '111.222.333-44',
        birth_date: '1992-12-25',
        company_id: '1'
      };
      
      (Patient.create as jest.Mock).mockResolvedValue({
        id: 3,
        ...patientData,
        birth_date: new Date('1992-12-25'),
        company_id: 1,
        is_deleted: false
      });

      // Act
      await patientService.create(patientData);

      // Assert
      const callArgs = (Patient.create as jest.Mock).mock.calls[0][0];
      expect(callArgs.birth_date).toBeInstanceOf(Date);
      expect(callArgs.birth_date.getFullYear()).toBe(1992);
      expect(callArgs.birth_date.getMonth()).toBe(11); // Dezembro (0-indexed)
      expect(callArgs.birth_date.toISOString().split('T')[0]).toBe('1992-12-25');
    });

    it('deve converter company_id para número', async () => {
      // Arrange
      const patientData = {
        name: 'Pedro Lima',
        email: 'pedro@email.com',
        cpf: '555.666.777-88',
        company_id: '5'
      };
      
      (Patient.create as jest.Mock).mockResolvedValue({
        id: 4,
        ...patientData,
        company_id: 5,
        is_deleted: false
      });

      // Act
      await patientService.create(patientData);

      // Assert
      const callArgs = (Patient.create as jest.Mock).mock.calls[0][0];
      expect(callArgs.company_id).toBe(5);
      expect(typeof callArgs.company_id).toBe('number');
    });
  });

  describe('createMultiple', () => {
    it('deve criar múltiplos pacientes', async () => {
      // Arrange
      const patientsData = [
        {
          name: 'Paciente 1',
          email: 'paciente1@email.com',
          cpf: '111.111.111-11',
          company_id: '1'
        },
        {
          name: 'Paciente 2',
          email: 'paciente2@email.com',
          cpf: '222.222.222-22',
          company_id: '1'
        }
      ];
      
      (Patient.create as jest.Mock)
        .mockResolvedValueOnce({ id: 1, ...patientsData[0], company_id: 1, is_deleted: false })
        .mockResolvedValueOnce({ id: 2, ...patientsData[1], company_id: 1, is_deleted: false });

      // Act
      const result = await patientService.createMultiple(patientsData);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id', 1);
      expect(result[1]).toHaveProperty('id', 2);
      expect(Patient.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('update', () => {
    it('deve atualizar paciente existente', async () => {
      // Arrange
      const patientId = '1';
      const updateData = {
        name: 'Maria Santos Atualizada',
        email: 'maria.nova@email.com'
      };
      
      (Patient.findByPk as jest.Mock).mockResolvedValue(mockPatient);
      mockPatient.update.mockResolvedValue(mockPatient);

      // Act
      const result = await patientService.update(patientId, updateData);

      // Assert
      expect(Patient.findByPk).toHaveBeenCalledWith(patientId);
      expect(mockPatient.update).toHaveBeenCalledWith(updateData);
    });

    it('deve lançar erro quando paciente não encontrado para atualização', async () => {
      // Arrange
      const patientId = '999';
      const updateData = { name: 'Nome Atualizado' };
      
      (Patient.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(patientService.update(patientId, updateData)).rejects.toThrow('Paciente não encontrado.');
    });
  });

  describe('delete', () => {
    it('deve deletar paciente (soft delete)', async () => {
      // Arrange
      const patientId = '1';
      (Patient.findByPk as jest.Mock).mockResolvedValue(mockPatient);
      mockPatient.update.mockResolvedValue({
        ...mockPatient,
        is_deleted: true
      });

      // Act
      const result = await patientService.delete(patientId);

      // Assert
      expect(Patient.findByPk).toHaveBeenCalledWith(patientId);
      expect(mockPatient.update).toHaveBeenCalledWith({ is_deleted: true });
      expect(result).toEqual({ message: 'Paciente deletado.' });
    });

    it('deve lançar erro quando paciente não encontrado para deletar', async () => {
      // Arrange
      const patientId = '999';
      (Patient.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(patientService.delete(patientId)).rejects.toThrow('Paciente não encontrado.');
    });
  });
});
