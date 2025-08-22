import { Sequelize } from 'sequelize';
import { Attendance } from '../models/index.js';
import { User } from '../models/index.js'

export default class ReportService {

  async getAttendanceReport(filters) {
    const { company_id, role } = filters;

    if (!company_id) {
      throw new Error('Empresa é um campo obrigatório');
    }

    let results = [];

    if (!role || role === 'DOCTOR') {
      // Buscar atendimentos por médicos (user_id)
      const doctorTotals = await Attendance.findAll({
        attributes: [
          'user_id',
          [Sequelize.fn('COUNT', Sequelize.col('Attendance.id')), 'total_attendances']
        ],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'role'],
            where: { 
              role: 'DOCTOR',
              is_deleted: false 
            }
          }
        ],
        where: {
          company_id,
          is_deleted: false
        },
        group: ['user_id'],
        order: [[Sequelize.fn('COUNT', Sequelize.col('Attendance.id')), 'DESC']]
      });

      // Formatar resultados dos médicos
      const doctorResults = doctorTotals.map(item => ({
        id: item.user.id,
        name: item.user.name,
        role: item.user.role,
        total_attendances: parseInt(item.dataValues.total_attendances)
      }));

      results = results.concat(doctorResults);
    }

    if (!role || role === 'RECEPTIONIST') {
      // Buscar atendimentos por recepcionistas (receptionist_id)
      const receptionistTotals = await Attendance.findAll({
        attributes: [
          'receptionist_id',
          [Sequelize.fn('COUNT', Sequelize.col('Attendance.id')), 'total_attendances']
        ],
        include: [
          {
            model: User,
            as: 'receptionist',
            attributes: ['id', 'name', 'role'],
            where: { 
              role: 'RECEPTIONIST',
              is_deleted: false 
            }
          }
        ],
        where: {
          company_id,
          is_deleted: false,
          receptionist_id: {
            [Sequelize.Op.not]: null
          }
        },
        group: ['receptionist_id'],
        order: [[Sequelize.fn('COUNT', Sequelize.col('Attendance.id')), 'DESC']]
      });

      // Formatar resultados dos recepcionistas
      const receptionistResults = receptionistTotals.map(item => ({
        id: item.receptionist.id,
        name: item.receptionist.name,
        role: item.receptionist.role,
        total_attendances: parseInt(item.dataValues.total_attendances)
      }));

      results = results.concat(receptionistResults);
    }

    // Ordenar todos os resultados por total de atendimentos (decrescente)
    results.sort((a, b) => b.total_attendances - a.total_attendances);

    return results;
  }
} 