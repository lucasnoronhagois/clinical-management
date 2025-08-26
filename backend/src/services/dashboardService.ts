import { Op } from 'sequelize';
import { User, Patient, Attendance, Company } from '../models/index';

interface DashboardFilters {
  company_id?: string;
  start_date?: string;
  end_date?: string;
}

interface DashboardStatistics {
  totalPatients: number;
  totalAttendances: number;
  totalUsers: number;
  attendancesByMonth: Array<{
    month: string;
    count: number;
  }>;
  patientsByMonth: Array<{
    month: string;
    count: number;
  }>;
  details: {
    attendances_by_day: { [key: string]: number };
    patients_by_day: { [key: string]: number };
  };
}

export default class DashboardService {
  async getStatistics(filters: DashboardFilters): Promise<DashboardStatistics> {
    if (!filters.company_id) {
      throw new Error('company_id é obrigatório');
    }

    const companyId = parseInt(filters.company_id);
    let dateFilter = {};

    if (filters.start_date && filters.end_date) {
      const startDate = new Date(filters.start_date);
      const endDate = new Date(filters.end_date);
      
      if (endDate < startDate) {
        throw new Error('A data final não pode ser anterior à data inicial');
      }

      dateFilter = {
        [Op.between]: [startDate, endDate]
      };
    }

    try {
      // Buscar estatísticas básicas
      const [totalPatients, totalAttendances, totalUsers] = await Promise.all([
        Patient.count({
          where: {
            company_id: companyId,
            is_deleted: false
          }
        }),
        Attendance.count({
          where: {
            company_id: companyId,
            is_deleted: false
          }
        }),
        User.count({
          where: {
            company_id: companyId,
            is_deleted: false
          }
        })
      ]);

      // Buscar atendimentos por dia
      const attendancesByDay = await this.getAttendancesByDay(companyId, dateFilter);
      
      // Buscar pacientes por dia
      const patientsByDay = await this.getPatientsByDay(companyId, dateFilter);



      return {
        totalPatients,
        totalAttendances,
        totalUsers,
        attendancesByMonth: [],
        patientsByMonth: [],
        details: {
          attendances_by_day: attendancesByDay,
          patients_by_day: patientsByDay
        }
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas do dashboard:', error);
      throw new Error('Erro interno ao buscar estatísticas');
    }
  }

  private async getAttendancesByDay(companyId: number, dateFilter: any): Promise<{ [key: string]: number }> {
    const attendances = await Attendance.findAll({
      where: {
        company_id: companyId,
        is_deleted: false,
        ...(Object.keys(dateFilter).length > 0 && { start_date: dateFilter })
      },
      attributes: [
        [Attendance.sequelize!.fn('DATE', Attendance.sequelize!.col('start_date')), 'date'],
        [Attendance.sequelize!.fn('COUNT', Attendance.sequelize!.col('id')), 'count']
      ],
      group: [Attendance.sequelize!.fn('DATE', Attendance.sequelize!.col('start_date'))],
      order: [[Attendance.sequelize!.fn('DATE', Attendance.sequelize!.col('start_date')), 'ASC']],
      raw: true
    });

    return attendances.reduce((acc: { [key: string]: number }, item: any) => {
      acc[item.date] = parseInt(item.count);
      return acc;
    }, {});
  }

  private async getPatientsByDay(companyId: number, dateFilter: any): Promise<{ [key: string]: number }> {
    const patients = await Patient.findAll({
      where: {
        company_id: companyId,
        is_deleted: false,
        ...(Object.keys(dateFilter).length > 0 && { created_at: dateFilter })
      },
      attributes: [
        [Patient.sequelize!.fn('DATE', Patient.sequelize!.col('created_at')), 'date'],
        [Patient.sequelize!.fn('COUNT', Patient.sequelize!.col('id')), 'count']
      ],
      group: [Patient.sequelize!.fn('DATE', Patient.sequelize!.col('created_at'))],
      order: [[Patient.sequelize!.fn('DATE', Patient.sequelize!.col('created_at')), 'ASC']],
      raw: true
    });

    return patients.reduce((acc: { [key: string]: number }, item: any) => {
      acc[item.date] = parseInt(item.count);
      return acc;
    }, {});
  }
}
