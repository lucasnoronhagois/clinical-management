import ReportService from '../../services/reportService';
import { User, Patient, Attendance, Company } from '../../models/index';

// Mock dos modelos
jest.mock('../../models/index', () => ({
  ...jest.requireActual('../../models/index'),
  User: {
    findAll: jest.fn()
  },
  Patient: {
    count: jest.fn()
  },
  Attendance: {
    count: jest.fn()
  },
  Company: {
    count: jest.fn()
  }
}));

describe('ReportService', () => {
  let reportService: ReportService;

  beforeEach(() => {
    // Setup antes de cada teste
    reportService = new ReportService();
    
    // Limpar todos os mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAttendanceReport', () => {
    it('deve gerar relatório de atendimentos para médicos com sucesso', async () => {
      // Arrange
      const filters = { company_id: '1', role: 'DOCTOR' };
      
      const mockUsers = [
        { id: 1, name: 'Dr. João Silva', role: 'DOCTOR' },
        { id: 2, name: 'Dr. Maria Santos', role: 'DOCTOR' }
      ];

      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);
      (Attendance.count as jest.Mock)
        .mockResolvedValueOnce(15) // Dr. João Silva
        .mockResolvedValueOnce(20); // Dr. Maria Santos

      // Act
      const result = await reportService.getAttendanceReport(filters);

      // Assert
      expect(User.findAll).toHaveBeenCalledWith({
        where: {
          company_id: 1,
          is_deleted: false,
          role: 'DOCTOR'
        },
        attributes: ['id', 'name', 'role']
      });
      expect(Attendance.count).toHaveBeenCalledWith({
        where: {
          user_id: 1,
          company_id: 1,
          is_deleted: false
        }
      });
      expect(Attendance.count).toHaveBeenCalledWith({
        where: {
          user_id: 2,
          company_id: 1,
          is_deleted: false
        }
      });
      expect(result).toEqual([
        { id: 2, name: 'Dr. Maria Santos', role: 'DOCTOR', total_attendances: 20 },
        { id: 1, name: 'Dr. João Silva', role: 'DOCTOR', total_attendances: 15 }
      ]);
    });

    it('deve gerar relatório de atendimentos para recepcionistas com sucesso', async () => {
      // Arrange
      const filters = { company_id: '1', role: 'RECEPTIONIST' };
      
      const mockUsers = [
        { id: 3, name: 'Ana Costa', role: 'RECEPTIONIST' },
        { id: 4, name: 'Pedro Lima', role: 'RECEPTIONIST' }
      ];

      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);
      (Attendance.count as jest.Mock)
        .mockResolvedValueOnce(25) // Ana Costa
        .mockResolvedValueOnce(10); // Pedro Lima

      // Act
      const result = await reportService.getAttendanceReport(filters);

      // Assert
      expect(User.findAll).toHaveBeenCalledWith({
        where: {
          company_id: 1,
          is_deleted: false,
          role: 'RECEPTIONIST'
        },
        attributes: ['id', 'name', 'role']
      });
      expect(Attendance.count).toHaveBeenCalledWith({
        where: {
          receptionist_id: 3,
          company_id: 1,
          is_deleted: false
        }
      });
      expect(Attendance.count).toHaveBeenCalledWith({
        where: {
          receptionist_id: 4,
          company_id: 1,
          is_deleted: false
        }
      });
      expect(result).toEqual([
        { id: 3, name: 'Ana Costa', role: 'RECEPTIONIST', total_attendances: 25 },
        { id: 4, name: 'Pedro Lima', role: 'RECEPTIONIST', total_attendances: 10 }
      ]);
    });

    it('deve usar DOCTOR como role padrão quando não especificado', async () => {
      // Arrange
      const filters = { company_id: '1' };
      
      const mockUsers = [
        { id: 1, name: 'Dr. João Silva', role: 'DOCTOR' }
      ];

      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);
      (Attendance.count as jest.Mock).mockResolvedValue(15);

      // Act
      const result = await reportService.getAttendanceReport(filters);

      // Assert
      expect(User.findAll).toHaveBeenCalledWith({
        where: {
          company_id: 1,
          is_deleted: false,
          role: 'DOCTOR'
        },
        attributes: ['id', 'name', 'role']
      });
      expect(result).toEqual([
        { id: 1, name: 'Dr. João Silva', role: 'DOCTOR', total_attendances: 15 }
      ]);
    });

    it('deve converter company_id para número', async () => {
      // Arrange
      const filters = { company_id: '5', role: 'DOCTOR' };
      
      const mockUsers = [
        { id: 1, name: 'Dr. João Silva', role: 'DOCTOR' }
      ];

      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);
      (Attendance.count as jest.Mock).mockResolvedValue(10);

      // Act
      await reportService.getAttendanceReport(filters);

      // Assert
      expect(User.findAll).toHaveBeenCalledWith({
        where: {
          company_id: 5,
          is_deleted: false,
          role: 'DOCTOR'
        },
        attributes: ['id', 'name', 'role']
      });
      expect(Attendance.count).toHaveBeenCalledWith({
        where: {
          user_id: 1,
          company_id: 5,
          is_deleted: false
        }
      });
    });

    it('deve lançar erro quando company_id não fornecido', async () => {
      // Arrange
      const filters = { role: 'DOCTOR' };

      // Act & Assert
      await expect(reportService.getAttendanceReport(filters)).rejects.toThrow('Empresa é um campo obrigatório');
    });

    it('deve lançar erro quando falha ao buscar usuários', async () => {
      // Arrange
      const filters = { company_id: '1', role: 'DOCTOR' };

      (User.findAll as jest.Mock).mockRejectedValue(new Error('Erro de banco de dados'));

      // Act & Assert
      await expect(reportService.getAttendanceReport(filters)).rejects.toThrow('Erro interno ao gerar relatório');
    });

    it('deve lidar com erro ao contar atendimentos de um usuário específico', async () => {
      // Arrange
      const filters = { company_id: '1', role: 'DOCTOR' };
      
      const mockUsers = [
        { id: 1, name: 'Dr. João Silva', role: 'DOCTOR' },
        { id: 2, name: 'Dr. Maria Santos', role: 'DOCTOR' }
      ];

      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);
      (Attendance.count as jest.Mock)
        .mockRejectedValueOnce(new Error('Erro ao contar atendimentos')) // Erro no primeiro usuário
        .mockResolvedValueOnce(20); // Sucesso no segundo usuário

      // Act
      const result = await reportService.getAttendanceReport(filters);

      // Assert
      expect(result).toEqual([
        { id: 2, name: 'Dr. Maria Santos', role: 'DOCTOR', total_attendances: 20 }
      ]);
    });

    it('deve retornar lista vazia quando não há usuários', async () => {
      // Arrange
      const filters = { company_id: '1', role: 'DOCTOR' };

      (User.findAll as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await reportService.getAttendanceReport(filters);

      // Assert
      expect(result).toEqual([]);
    });

    it('deve ordenar resultados por total de atendimentos (decrescente)', async () => {
      // Arrange
      const filters = { company_id: '1', role: 'DOCTOR' };
      
      const mockUsers = [
        { id: 1, name: 'Dr. João Silva', role: 'DOCTOR' },
        { id: 2, name: 'Dr. Maria Santos', role: 'DOCTOR' },
        { id: 3, name: 'Dr. Pedro Costa', role: 'DOCTOR' }
      ];

      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);
      (Attendance.count as jest.Mock)
        .mockResolvedValueOnce(10) // Dr. João Silva
        .mockResolvedValueOnce(30) // Dr. Maria Santos
        .mockResolvedValueOnce(5);  // Dr. Pedro Costa

      // Act
      const result = await reportService.getAttendanceReport(filters);

      // Assert
      expect(result).toEqual([
        { id: 2, name: 'Dr. Maria Santos', role: 'DOCTOR', total_attendances: 30 },
        { id: 1, name: 'Dr. João Silva', role: 'DOCTOR', total_attendances: 10 },
        { id: 3, name: 'Dr. Pedro Costa', role: 'DOCTOR', total_attendances: 5 }
      ]);
    });

    it('deve lidar com erro interno e relançar', async () => {
      // Arrange
      const filters = { company_id: '1', role: 'DOCTOR' };

      (User.findAll as jest.Mock).mockRejectedValue(new Error('Erro interno'));

      // Act & Assert
      await expect(reportService.getAttendanceReport(filters)).rejects.toThrow('Erro interno ao gerar relatório');
    });

    it('deve contar atendimentos corretamente para diferentes roles', async () => {
      // Arrange
      const filters = { company_id: '1' };
      
      const mockUsers = [
        { id: 1, name: 'Dr. João Silva', role: 'DOCTOR' },
        { id: 2, name: 'Ana Costa', role: 'RECEPTIONIST' }
      ];

      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);
      (Attendance.count as jest.Mock)
        .mockResolvedValueOnce(15) // Médico (user_id)
        .mockResolvedValueOnce(25); // Recepcionista (receptionist_id)

      // Act
      const result = await reportService.getAttendanceReport(filters);

      // Assert
      expect(Attendance.count).toHaveBeenCalledWith({
        where: {
          user_id: 1,
          company_id: 1,
          is_deleted: false
        }
      });
      expect(Attendance.count).toHaveBeenCalledWith({
        where: {
          receptionist_id: 2,
          company_id: 1,
          is_deleted: false
        }
      });
      expect(result).toEqual([
        { id: 2, name: 'Ana Costa', role: 'RECEPTIONIST', total_attendances: 25 },
        { id: 1, name: 'Dr. João Silva', role: 'DOCTOR', total_attendances: 15 }
      ]);
    });
  });
});
