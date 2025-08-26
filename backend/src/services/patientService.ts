import { Patient } from '../models/index';

interface PatientFilters {
  company_id?: string;
}

export default class PatientService {
  async find(id: string): Promise<any> {
    const patient = await Patient.findByPk(id);
    if (!patient) {
      throw new Error('Paciente não encontrado.');
    }
    return patient;
  }

  async list(filters: PatientFilters): Promise<any[]> {
    const whereClause: any = { is_deleted: false };
    
    if (filters.company_id) {
      whereClause.company_id = parseInt(filters.company_id);
    }

    return await Patient.findAll({
      where: whereClause,
      order: [['name', 'ASC']]
    });
  }

  async create(data: any): Promise<any> {
    // Converter tipos
    const patientData = {
      ...data,
      birth_date: new Date(data.birth_date),
      company_id: parseInt(data.company_id),
      is_deleted: false
    };
    
    return await Patient.create(patientData);
  }

  async createMultiple(data: any[]): Promise<any[]> {
    const patients = [];
    for (const patientData of data) {
      const patient = await this.create(patientData);
      patients.push(patient);
    }
    return patients;
  }

  async update(id: string, data: any): Promise<any> {
    const patient = await this.find(id);
    await patient.update(data);
    return patient;
  }

  async delete(id: string): Promise<{ message: string }> {
    const patient = await this.find(id);
    await patient.update({ is_deleted: true });
    return { message: 'Paciente deletado.' };
  }
}
