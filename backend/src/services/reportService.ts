import { Op } from 'sequelize';
import { User, Patient, Attendance, Company } from '../models/index';

interface ReportFilters {
  company_id?: string;
  role?: string;
}

export default class ReportService {
  async getAttendanceReport(filters: ReportFilters): Promise<Array<{
    id: number;
    name: string;
    role: string;
    total_attendances: number;
  }>> {
    if (!filters.company_id) {
      throw new Error('Empresa é um campo obrigatório');
    }

         const companyId = parseInt(filters.company_id);
     const role = filters.role || 'DOCTOR'; // Por padrão, mostrar médicos

         try {
       // Buscar todos os usuários da empresa
      const usersWhereClause: any = {
        company_id: companyId,
        is_deleted: false
      };

      if (role) {
        usersWhereClause.role = role;
      }

            let users;
      try {
        users = await User.findAll({
          where: usersWhereClause,
          attributes: ['id', 'name', 'role']
        });

      } catch (userError) {
        console.error('Erro ao buscar usuários:', userError);
        throw new Error('Erro ao buscar usuários');
      }

             // Para cada usuário, contar os atendimentos
       const results = [];
       for (const user of users) {
         try {
           let attendanceCount;
           
           if (user.role === 'RECEPTIONIST') {
             // Para recepcionistas, contar atendimentos onde eles são o receptionist_id
             attendanceCount = await Attendance.count({
               where: {
                 receptionist_id: user.id,
                 company_id: companyId,
                 is_deleted: false
               }
             });
           } else {
             // Para médicos, contar atendimentos onde eles são o user_id
             attendanceCount = await Attendance.count({
               where: {
                 user_id: user.id,
                 company_id: companyId,
                 is_deleted: false
               }
             });
           }

                     results.push({
             id: user.id,
             name: user.name,
             role: user.role,
             total_attendances: attendanceCount
           });
         } catch (error) {
           console.error(`Erro ao contar atendimentos para usuário ${user.id}:`, error);
         }
       }

             // Ordenar por total de atendimentos (decrescente)
       const sortedResults = results
         .sort((a, b) => b.total_attendances - a.total_attendances);

       return sortedResults;
    } catch (error) {
      console.error('Erro ao gerar relatório de atendimentos:', error);
      throw new Error('Erro interno ao gerar relatório');
    }
  }
}
