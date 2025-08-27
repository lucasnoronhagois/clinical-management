import DashboardService from '../../services/dashboardService';
import { User, Patient, Attendance, Company } from '../../models/index';

// Mock dos modelos
jest.mock('../../models/index', () => ({
  ...jest.requireActual('../../models/index'),
  User: {
    count: jest.fn()
  },
  Patient: {
    count: jest.fn(),
    findAll: jest.fn(),
    sequelize: {
      fn: jest.fn(),
      col: jest.fn()
    }
  },
  Attendance: {
    count: jest.fn(),
    findAll: jest.fn(),
    sequelize: {
      fn: jest.fn(),
      col: jest.fn()
    }
  },
  Company: {
    count: jest.fn()
  }
}));

describe('DashboardService', () => {
  let dashboardService: DashboardService;

  beforeEach(() => {
    // Setup antes de cada teste
    dashboardService = new DashboardService();
    
    // Limpar todos os mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStatistics', () => {
    it('deve retornar estatísticas básicas com sucesso', async () => {
      // Arrange
      const filters = { company_id: '1' };
      
      (Patient.count as jest.Mock).mockResolvedValue(50);
      (Attendance.count as jest.Mock).mockResolvedValue(200);
      (User.count as jest.Mock).mockResolvedValue(10);
      (Attendance.findAll as jest.Mock).mockResolvedValue([]);
      (Patient.findAll as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await dashboardService.getStatistics(filters);

      // Assert
      expect(Patient.count).toHaveBeenCalledWith({
        where: {
          company_id: 1,
          is_deleted: false
        }
      });
      expect(Attendance.count).toHaveBeenCalledWith({
        where: {
          company_id: 1,
          is_deleted: false
        }
      });
      expect(User.count).toHaveBeenCalledWith({
        where: {
          company_id: 1,
          is_deleted: false
        }
      });
      expect(result).toEqual({
        totalPatients: 50,
        totalAttendances: 200,
        totalUsers: 10,
        attendancesByMonth: [],
        patientsByMonth: [],
        details: {
          attendances_by_day: {},
          patients_by_day: {}
        }
      });
    });

    it('deve retornar estatísticas com filtro de datas', async () => {
      // Arrange
      const filters = {
        company_id: '1',
        start_date: '2024-01-01',
        end_date: '2024-01-31'
      };
      
      (Patient.count as jest.Mock).mockResolvedValue(30);
      (Attendance.count as jest.Mock).mockResolvedValue(150);
      (User.count as jest.Mock).mockResolvedValue(8);
      (Attendance.findAll as jest.Mock).mockResolvedValue([]);
      (Patient.findAll as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await dashboardService.getStatistics(filters);

      // Assert
      expect(result).toEqual({
        totalPatients: 30,
        totalAttendances: 150,
        totalUsers: 8,
        attendancesByMonth: [],
        patientsByMonth: [],
        details: {
          attendances_by_day: {},
          patients_by_day: {}
        }
      });
    });

    it('deve lançar erro quando company_id não fornecido', async () => {
      // Arrange
      const filters = {};

      // Act & Assert
      await expect(dashboardService.getStatistics(filters)).rejects.toThrow('company_id é obrigatório');
    });

    it('deve lançar erro quando data final é anterior à data inicial', async () => {
      // Arrange
      const filters = {
        company_id: '1',
        start_date: '2024-01-31',
        end_date: '2024-01-01'
      };

      // Act & Assert
      await expect(dashboardService.getStatistics(filters)).rejects.toThrow('A data final não pode ser anterior à data inicial');
    });

    it('deve converter company_id para número', async () => {
      // Arrange
      const filters = { company_id: '5' };
      
      (Patient.count as jest.Mock).mockResolvedValue(0);
      (Attendance.count as jest.Mock).mockResolvedValue(0);
      (User.count as jest.Mock).mockResolvedValue(0);
      (Attendance.findAll as jest.Mock).mockResolvedValue([]);
      (Patient.findAll as jest.Mock).mockResolvedValue([]);

      // Act
      await dashboardService.getStatistics(filters);

      // Assert
      expect(Patient.count).toHaveBeenCalledWith({
        where: {
          company_id: 5,
          is_deleted: false
        }
      });
      expect(Attendance.count).toHaveBeenCalledWith({
        where: {
          company_id: 5,
          is_deleted: false
        }
      });
      expect(User.count).toHaveBeenCalledWith({
        where: {
          company_id: 5,
          is_deleted: false
        }
      });
    });

    it('deve retornar estatísticas com dados de atendimentos por dia', async () => {
      // Arrange
      const filters = { company_id: '1' };
      
      (Patient.count as jest.Mock).mockResolvedValue(10);
      (Attendance.count as jest.Mock).mockResolvedValue(50);
      (User.count as jest.Mock).mockResolvedValue(5);
      
      const mockAttendancesByDay = [
        { date: '2024-01-15', count: '5' },
        { date: '2024-01-16', count: '3' }
      ];
      (Attendance.findAll as jest.Mock).mockResolvedValue(mockAttendancesByDay);
      (Patient.findAll as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await dashboardService.getStatistics(filters);

      // Assert
      expect(result.details.attendances_by_day).toEqual({
        '2024-01-15': 5,
        '2024-01-16': 3
      });
    });

    it('deve retornar estatísticas com dados de pacientes por dia', async () => {
      // Arrange
      const filters = { company_id: '1' };
      
      (Patient.count as jest.Mock).mockResolvedValue(10);
      (Attendance.count as jest.Mock).mockResolvedValue(50);
      (User.count as jest.Mock).mockResolvedValue(5);
      (Attendance.findAll as jest.Mock).mockResolvedValue([]);
      
      const mockPatientsByDay = [
        { date: '2024-01-15', count: '2' },
        { date: '2024-01-16', count: '1' }
      ];
      (Patient.findAll as jest.Mock).mockResolvedValue(mockPatientsByDay);

      // Act
      const result = await dashboardService.getStatistics(filters);

      // Assert
      expect(result.details.patients_by_day).toEqual({
        '2024-01-15': 2,
        '2024-01-16': 1
      });
    });

    it('deve lidar com erro interno e relançar', async () => {
      // Arrange
      const filters = { company_id: '1' };
      
      (Patient.count as jest.Mock).mockRejectedValue(new Error('Erro de banco de dados'));

      // Act & Assert
      await expect(dashboardService.getStatistics(filters)).rejects.toThrow('Erro interno ao buscar estatísticas');
    });
  });

  describe('getAttendancesByDay (private method)', () => {
    it('deve buscar atendimentos por dia sem filtro de data', async () => {
      // Arrange
      const companyId = 1;
      const dateFilter = {};
      
      const mockAttendances = [
        { date: '2024-01-15', count: '5' },
        { date: '2024-01-16', count: '3' }
      ];
      (Attendance.findAll as jest.Mock).mockResolvedValue(mockAttendances);

      // Act - Usando reflection para acessar método privado
      const result = await (dashboardService as any).getAttendancesByDay(companyId, dateFilter);

      // Assert
      expect(Attendance.findAll).toHaveBeenCalledWith({
        where: {
          company_id: companyId,
          is_deleted: false
        },
        attributes: expect.any(Array),
        group: expect.any(Array),
        order: expect.any(Array),
        raw: true
      });
      expect(result).toEqual({
        '2024-01-15': 5,
        '2024-01-16': 3
      });
    });

    it('deve buscar atendimentos por dia com filtro de data', async () => {
      // Arrange
      const companyId = 1;
      const dateFilter = { $between: [new Date('2024-01-01'), new Date('2024-01-31')] };
      
      const mockAttendances = [
        { date: '2024-01-15', count: '5' }
      ];
      (Attendance.findAll as jest.Mock).mockResolvedValue(mockAttendances);

      // Act
      const result = await (dashboardService as any).getAttendancesByDay(companyId, dateFilter);

      // Assert
      expect(Attendance.findAll).toHaveBeenCalledWith({
        where: {
          company_id: companyId,
          is_deleted: false,
          start_date: dateFilter
        },
        attributes: expect.any(Array),
        group: expect.any(Array),
        order: expect.any(Array),
        raw: true
      });
      expect(result).toEqual({
        '2024-01-15': 5
      });
    });
  });

  describe('getPatientsByDay (private method)', () => {
    it('deve buscar pacientes por dia sem filtro de data', async () => {
      // Arrange
      const companyId = 1;
      const dateFilter = {};
      
      const mockPatients = [
        { date: '2024-01-15', count: '2' },
        { date: '2024-01-16', count: '1' }
      ];
      (Patient.findAll as jest.Mock).mockResolvedValue(mockPatients);

      // Act
      const result = await (dashboardService as any).getPatientsByDay(companyId, dateFilter);

      // Assert
      expect(Patient.findAll).toHaveBeenCalledWith({
        where: {
          company_id: companyId,
          is_deleted: false
        },
        attributes: expect.any(Array),
        group: expect.any(Array),
        order: expect.any(Array),
        raw: true
      });
      expect(result).toEqual({
        '2024-01-15': 2,
        '2024-01-16': 1
      });
    });

    it('deve buscar pacientes por dia com filtro de data', async () => {
      // Arrange
      const companyId = 1;
      const dateFilter = { $between: [new Date('2024-01-01'), new Date('2024-01-31')] };
      
      const mockPatients = [
        { date: '2024-01-15', count: '2' }
      ];
      (Patient.findAll as jest.Mock).mockResolvedValue(mockPatients);

      // Act
      const result = await (dashboardService as any).getPatientsByDay(companyId, dateFilter);

      // Assert
      expect(Patient.findAll).toHaveBeenCalledWith({
        where: {
          company_id: companyId,
          is_deleted: false,
          created_at: dateFilter
        },
        attributes: expect.any(Array),
        group: expect.any(Array),
        order: expect.any(Array),
        raw: true
      });
      expect(result).toEqual({
        '2024-01-15': 2
      });
    });
  });
});
