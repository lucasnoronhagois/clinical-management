import { Patient } from "../models/index.js";
import { Company } from "../models/index.js"

export default class PatientService {

  async find(id) {
    const patient = await Patient.findByPk(id, {
      include: [{ model: Company, as: 'company' }]
    });

    if (!patient) {
      throw new Error('Paciente não encontrado.');
    }

    return patient;
  }

  async list(filters) {
    const { company_id } = filters;

    const whereClause = company_id ?
      { company_id, is_deleted: false } :
      { is_deleted: false };

    return await Patient.findAll({
      where: whereClause
    });
  }

  async create(patientData) {
    // Validar dados obrigatórios
    const { name, birth_date, company_id } = patientData;
    if (!name || !birth_date || !company_id) {
      throw new Error('Nome, data de nascimento e Empresa são obrigatórios.');
    }

    return await Patient.create(patientData);
  }

  async update(id, updateData) {
    const patient = await Patient.findByPk(id);

    if (!patient) {
      throw new Error('Paciente não encontrado.');
    }

    await patient.update(updateData);
    return patient;
  }

  async delete(id) {
    const patient = await Patient.findByPk(id);

    if (!patient) {
      throw new Error('Paciente não encontrado.');
    }

    await patient.update({ is_deleted: true });
    return { message: 'Paciente deletado.' };
  }
} 