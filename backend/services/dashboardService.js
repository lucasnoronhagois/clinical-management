import { Op } from 'sequelize';
import { Attendance } from '../models/index.js';
import { Patient } from '../models/index.js';

export default class DashboardService {

  async getStatistics(filters) {
    const { company_id, start_date, end_date } = filters;

    if (!company_id) {
      throw new Error('Empresa é obrigatória');
    }

    // Validação: data final não pode ser anterior à inicial
    if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
      throw new Error('A data final não pode ser anterior à data inicial');
    }

    // Período padrão (últimos 30 dias) se não fornecido
    let startDate = start_date ? new Date(start_date) : new Date();
    let endDate = end_date ? new Date(end_date) : new Date();
    
    if (!start_date) {
      startDate.setDate(startDate.getDate() - 30); // 30 dias atrás
    }
    if (!end_date) {
      endDate.setHours(23, 59, 59, 999); // Fim do dia atual
    }

    // Buscar atendimentos no período
    const attendances = await Attendance.findAll({
      where: {
        company_id,
        start_date: {
          [Op.between]: [startDate, endDate]
        },
        is_deleted: false
      }
    });

    // Buscar pacientes criados no período
    const patients = await Patient.findAll({
      where: {
        company_id,
        created_at: {
          [Op.between]: [startDate, endDate]
        },
        is_deleted: false
      }
    });

    // Estatísticas adicionais
    const totalAttendances = attendances.length;
    const totalPatients = patients.length;

    // Atendimentos por dia (para gráfico se necessário)
    const attendancesByDay = {};
    attendances.forEach(attendance => {
      const date = new Date(attendance.start_date).toISOString().split('T')[0];
      attendancesByDay[date] = (attendancesByDay[date] || 0) + 1;
    });

    // Pacientes por dia
    const patientsByDay = {};
    patients.forEach(patient => {
      const date = new Date(patient.created_at).toISOString().split('T')[0];
      patientsByDay[date] = (patientsByDay[date] || 0) + 1;
    });

    return {
      period: {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString()
      },
      statistics: {
        total_attendances: totalAttendances,
        total_patients: totalPatients
      },
      details: {
        attendances_by_day: attendancesByDay,
        patients_by_day: patientsByDay
      }
    };
  }
} 