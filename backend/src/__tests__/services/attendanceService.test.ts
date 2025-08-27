import AttendanceService from '../../services/attendanceService';
import { Attendance } from '../../models/index';

// Mock do modelo Attendance
jest.mock('../../models/index', () => ({
  ...jest.requireActual('../../models/index'),
  Attendance: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  }
}));

describe('AttendanceService', () => {
  let attendanceService: AttendanceService;
  let mockAttendance: any;
  let mockUser: any;

  beforeEach(() => {
    // Setup antes de cada teste
    attendanceService = new AttendanceService();
    
    // Mock do atendimento
    mockAttendance = {
      id: 1,
      patient_id: 1,
      user_id: 1,
      place_id: 1,
      start_date: new Date('2024-01-15T10:00:00'),
      end_date: null,
      confirmed_at: null,
      confirmed_by: null,
      notes: 'Consulta de rotina',
      company_id: 1,
      is_deleted: false,
      update: jest.fn(),
      patient: { id: 1, name: 'Maria Santos' },
      user: { id: 1, name: 'Dr. João Silva' },
      place: { id: 1, name: 'Sala 1' }
    };

    // Mock do usuário
    mockUser = {
      id: 1,
      company_id: 1
    };

    // Limpar todos os mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('find', () => {
    it('deve retornar um atendimento quando encontrado', async () => {
      // Arrange
      const attendanceId = '1';
      (Attendance.findByPk as jest.Mock).mockResolvedValue(mockAttendance);

      // Act
      const result = await attendanceService.find(attendanceId);

      // Assert
      expect(Attendance.findByPk).toHaveBeenCalledWith(attendanceId);
      expect(result).toEqual(mockAttendance);
    });

    it('deve lançar erro quando atendimento não encontrado', async () => {
      // Arrange
      const attendanceId = '999';
      (Attendance.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(attendanceService.find(attendanceId)).rejects.toThrow('Atendimento não encontrado.');
    });
  });

  describe('list', () => {
    it('deve retornar lista de atendimentos ativos com filtro de empresa', async () => {
      // Arrange
      const filters = { company_id: '1' };
      const mockAttendances = [mockAttendance];
      
      (Attendance.findAll as jest.Mock).mockResolvedValue(mockAttendances);

      // Act
      const result = await attendanceService.list(filters);

      // Assert
      expect(Attendance.findAll).toHaveBeenCalledWith({
        where: { 
          is_deleted: false,
          company_id: 1
        },
        include: [
          { association: 'patient', attributes: ['id', 'name'] },
          { association: 'user', attributes: ['id', 'name'] },
          { association: 'place', attributes: ['id', 'name'] }
        ],
        order: [['start_date', 'DESC']]
      });
      expect(result).toEqual(mockAttendances);
    });

    it('deve retornar lista sem filtro de empresa quando não fornecido', async () => {
      // Arrange
      const filters = {};
      const mockAttendances = [mockAttendance];
      
      (Attendance.findAll as jest.Mock).mockResolvedValue(mockAttendances);

      // Act
      const result = await attendanceService.list(filters);

      // Assert
      expect(Attendance.findAll).toHaveBeenCalledWith({
        where: { 
          is_deleted: false
        },
        include: [
          { association: 'patient', attributes: ['id', 'name'] },
          { association: 'user', attributes: ['id', 'name'] },
          { association: 'place', attributes: ['id', 'name'] }
        ],
        order: [['start_date', 'DESC']]
      });
      expect(result).toEqual(mockAttendances);
    });

    it('deve converter company_id para número quando fornecido', async () => {
      // Arrange
      const filters = { company_id: '5' };
      const mockAttendances = [mockAttendance];
      
      (Attendance.findAll as jest.Mock).mockResolvedValue(mockAttendances);

      // Act
      await attendanceService.list(filters);

      // Assert
      const callArgs = (Attendance.findAll as jest.Mock).mock.calls[0][0];
      expect(callArgs.where.company_id).toBe(5);
      expect(typeof callArgs.where.company_id).toBe('number');
    });
  });

  describe('create', () => {
    it('deve criar um novo atendimento com sucesso', async () => {
      // Arrange
      const attendanceData = {
        patient_id: 1,
        user_id: 1,
        place_id: 1,
        start_date: '2024-01-15T10:00:00',
        notes: 'Consulta de rotina',
        company_id: 1
      };
      
      const expectedAttendanceData = {
        ...attendanceData,
        is_deleted: false
      };
      
      (Attendance.create as jest.Mock).mockResolvedValue({
        id: 2,
        ...expectedAttendanceData
      });

      // Act
      const result = await attendanceService.create(attendanceData);

      // Assert
      expect(Attendance.create).toHaveBeenCalledWith(expectedAttendanceData);
      expect(result).toHaveProperty('id', 2);
      expect(result).toHaveProperty('patient_id', 1);
    });

    it('deve criar atendimento com usuário fornecido', async () => {
      // Arrange
      const attendanceData = {
        patient_id: 1,
        place_id: 1,
        start_date: '2024-01-15T10:00:00'
      };
      
      (Attendance.create as jest.Mock).mockResolvedValue({
        id: 3,
        ...attendanceData,
        is_deleted: false
      });

      // Act
      await attendanceService.create(attendanceData, mockUser);

      // Assert
      expect(Attendance.create).toHaveBeenCalledWith({
        ...attendanceData,
        is_deleted: false
      });
    });

    it('deve definir is_deleted como false por padrão', async () => {
      // Arrange
      const attendanceData = {
        patient_id: 1,
        user_id: 1,
        place_id: 1,
        start_date: '2024-01-15T10:00:00'
      };
      
      (Attendance.create as jest.Mock).mockResolvedValue({
        id: 4,
        ...attendanceData,
        is_deleted: false
      });

      // Act
      await attendanceService.create(attendanceData);

      // Assert
      const callArgs = (Attendance.create as jest.Mock).mock.calls[0][0];
      expect(callArgs.is_deleted).toBe(false);
    });
  });

  describe('createMultiple', () => {
    it('deve criar múltiplos atendimentos', async () => {
      // Arrange
      const attendancesData = [
        {
          patient_id: 1,
          user_id: 1,
          place_id: 1,
          start_date: '2024-01-15T10:00:00'
        },
        {
          patient_id: 2,
          user_id: 1,
          place_id: 1,
          start_date: '2024-01-15T11:00:00'
        }
      ];
      
      (Attendance.create as jest.Mock)
        .mockResolvedValueOnce({ id: 1, ...attendancesData[0], is_deleted: false })
        .mockResolvedValueOnce({ id: 2, ...attendancesData[1], is_deleted: false });

      // Act
      const result = await attendanceService.createMultiple(attendancesData);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id', 1);
      expect(result[1]).toHaveProperty('id', 2);
      expect(Attendance.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('update', () => {
    it('deve atualizar atendimento existente', async () => {
      // Arrange
      const attendanceId = '1';
      const updateData = {
        notes: 'Atendimento atualizado',
        start_date: '2024-01-15T11:00:00'
      };
      
      (Attendance.findByPk as jest.Mock).mockResolvedValue(mockAttendance);
      mockAttendance.update.mockResolvedValue({
        ...mockAttendance,
        ...updateData
      });

      // Act
      const result = await attendanceService.update(attendanceId, updateData);

      // Assert
      expect(Attendance.findByPk).toHaveBeenCalledWith(attendanceId);
      expect(mockAttendance.update).toHaveBeenCalledWith(updateData);
    });

    it('deve lançar erro quando atendimento não encontrado para atualização', async () => {
      // Arrange
      const attendanceId = '999';
      const updateData = { notes: 'Atualização' };
      
      (Attendance.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(attendanceService.update(attendanceId, updateData)).rejects.toThrow('Atendimento não encontrado.');
    });
  });

  describe('confirm', () => {
    it('deve confirmar atendimento com usuário', async () => {
      // Arrange
      const attendanceId = '1';
      const mockDate = new Date('2024-01-15T10:30:00');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
      
      (Attendance.findByPk as jest.Mock).mockResolvedValue(mockAttendance);
      mockAttendance.update.mockResolvedValue({
        ...mockAttendance,
        confirmed_at: mockDate,
        confirmed_by: mockUser.id
      });

      // Act
      const result = await attendanceService.confirm(attendanceId, mockUser);

      // Assert
      expect(Attendance.findByPk).toHaveBeenCalledWith(attendanceId);
      expect(mockAttendance.update).toHaveBeenCalledWith({
        confirmed_at: mockDate,
        confirmed_by: mockUser.id
      });
    });

    it('deve confirmar atendimento sem usuário', async () => {
      // Arrange
      const attendanceId = '1';
      const mockDate = new Date('2024-01-15T10:30:00');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
      
      (Attendance.findByPk as jest.Mock).mockResolvedValue(mockAttendance);
      mockAttendance.update.mockResolvedValue({
        ...mockAttendance,
        confirmed_at: mockDate,
        confirmed_by: undefined
      });

      // Act
      const result = await attendanceService.confirm(attendanceId);

      // Assert
      expect(Attendance.findByPk).toHaveBeenCalledWith(attendanceId);
      expect(mockAttendance.update).toHaveBeenCalledWith({
        confirmed_at: mockDate,
        confirmed_by: undefined
      });
    });
  });

  describe('finish', () => {
    it('deve finalizar atendimento com usuário', async () => {
      // Arrange
      const attendanceId = '1';
      const mockDate = new Date('2024-01-15T11:30:00');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
      
      (Attendance.findByPk as jest.Mock).mockResolvedValue(mockAttendance);
      mockAttendance.update.mockResolvedValue({
        ...mockAttendance,
        end_date: mockDate
      });

      // Act
      const result = await attendanceService.finish(attendanceId, mockUser);

      // Assert
      expect(Attendance.findByPk).toHaveBeenCalledWith(attendanceId);
      expect(mockAttendance.update).toHaveBeenCalledWith({
        end_date: mockDate
      });
    });

    it('deve finalizar atendimento sem usuário', async () => {
      // Arrange
      const attendanceId = '1';
      const mockDate = new Date('2024-01-15T11:30:00');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
      
      (Attendance.findByPk as jest.Mock).mockResolvedValue(mockAttendance);
      mockAttendance.update.mockResolvedValue({
        ...mockAttendance,
        end_date: mockDate
      });

      // Act
      const result = await attendanceService.finish(attendanceId);

      // Assert
      expect(Attendance.findByPk).toHaveBeenCalledWith(attendanceId);
      expect(mockAttendance.update).toHaveBeenCalledWith({
        end_date: mockDate
      });
    });
  });

  describe('delete', () => {
    it('deve deletar atendimento (soft delete)', async () => {
      // Arrange
      const attendanceId = '1';
      (Attendance.findByPk as jest.Mock).mockResolvedValue(mockAttendance);
      mockAttendance.update.mockResolvedValue({
        ...mockAttendance,
        is_deleted: true
      });

      // Act
      const result = await attendanceService.delete(attendanceId);

      // Assert
      expect(Attendance.findByPk).toHaveBeenCalledWith(attendanceId);
      expect(mockAttendance.update).toHaveBeenCalledWith({ is_deleted: true });
      expect(result).toEqual({ message: 'Atendimento deletado.' });
    });

    it('deve lançar erro quando atendimento não encontrado para deletar', async () => {
      // Arrange
      const attendanceId = '999';
      (Attendance.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(attendanceService.delete(attendanceId)).rejects.toThrow('Atendimento não encontrado.');
    });
  });
});
