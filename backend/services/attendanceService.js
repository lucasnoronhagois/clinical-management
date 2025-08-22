import { Attendance } from "../models/index.js";
import { Patient } from "../models/index.js"
import { User } from "../models/index.js"
import { Place } from "../models/index.js"

export default class AttendanceService {
  async find(id) {
    const attendance = await Attendance.findByPk(id);

    if (!attendance) {
      throw new Error('Atendimento não encontrado.');
    }

    return attendance;
  }

  async list(filters) {
    const { company_id } = filters;

    const whereClause = company_id ?
      { company_id, is_deleted: false } :
      { is_deleted: false };

    return await Attendance.findAll({
      where: whereClause,
      include: [
        { model: Patient, as: 'patient' },
        { model: User, as: 'user' },
        { model: User, as: 'receptionist' },
        { model: Place, as: 'place' }
      ]
    });
  }

  async create(attendanceData, currentUser) {
    // receptionist_id se o usuário for recepcionista
    const finalData = {
      ...attendanceData,
      receptionist_id: currentUser.role === 'RECEPTIONIST' ? currentUser.id : null
    };

    return await Attendance.create(finalData);
  }

  async createMultiple(attendancesData, currentUser) {
    // receptionist_id para cada atendimento se o usuário for recepcionista
    const processedData = attendancesData.map(attendance => ({
      ...attendance,
      receptionist_id: currentUser.role === 'RECEPTIONIST' ? currentUser.id : null
    }));

    return await Attendance.bulkCreate(processedData, { returning: true });
  }

  async update(id, updateData) {
    const attendance = await this.find(id);
    await attendance.update(updateData);
    return attendance;
  }

  async confirm(id, currentUser) {
    const attendance = await this.find(id);
    
    // Atualizar campos de confirmação
    const updateData = {
      confirmed_at: new Date(),
      confirmed_by: currentUser.id
    };
    
    await attendance.update(updateData);
    return attendance;
  }

  async finish(id, currentUser) {
    const attendance = await this.find(id);
    
    // Atualizar campos de finalização
    const updateData = {
      end_date: new Date()
    };
    
    await attendance.update(updateData);
    return attendance;
  }

  async delete(id) {
    const attendance = await this.find(id);
    await attendance.update({ is_deleted: true });
    return { message: 'Atendimento deletado.' };
  }
} 