import { Attendance } from '../models/index';

interface AttendanceFilters {
  company_id?: string;
}

interface User {
  id?: number;
  company_id?: number;
}

export default class AttendanceService {
  async find(id: string): Promise<any> {
    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      throw new Error('Atendimento não encontrado.');
    }
    return attendance;
  }

  async list(filters: AttendanceFilters): Promise<any[]> {
    const whereClause: any = { is_deleted: false };
    
    if (filters.company_id) {
      whereClause.company_id = parseInt(filters.company_id);
    }

    return await Attendance.findAll({
      where: whereClause,
      include: [
        { association: 'patient', attributes: ['id', 'name'] },
        { association: 'user', attributes: ['id', 'name'] },
        { association: 'place', attributes: ['id', 'name'] }
      ],
      order: [['start_date', 'DESC']]
    });
  }

  async create(data: any, user?: User): Promise<any> {
    return await Attendance.create({
      ...data,
      is_deleted: false
    });
  }

  async createMultiple(data: any[], user?: User): Promise<any[]> {
    const attendances = [];
    for (const attendanceData of data) {
      const attendance = await this.create(attendanceData, user);
      attendances.push(attendance);
    }
    return attendances;
  }

  async update(id: string, data: any): Promise<any> {
    const attendance = await this.find(id);
    await attendance.update(data);
    return attendance;
  }

  async confirm(id: string, user?: User): Promise<any> {
    const attendance = await this.find(id);
    await attendance.update({
      confirmed_at: new Date(),
      confirmed_by: user?.id
    });
    return attendance;
  }

  async finish(id: string, user?: User): Promise<any> {
    const attendance = await this.find(id);
    await attendance.update({
      end_date: new Date()
    });
    return attendance;
  }

  async delete(id: string): Promise<{ message: string }> {
    const attendance = await this.find(id);
    await attendance.update({ is_deleted: true });
    return { message: 'Atendimento deletado.' };
  }
}
