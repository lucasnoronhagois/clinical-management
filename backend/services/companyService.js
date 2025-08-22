import { Company } from "../models/index.js"

export default class CompanyService {

  async find(id) {
    const company = await Company.findByPk(id);

    if (!company) {
      throw new Error('Empresa não encontrada.');
    }

    return company;
  }

  async list() {
    return await Company.findAll({
      where: { is_deleted: false }
    });
  }

  async create(companyData) {
    const {
      name,
      email,
      zip_code,
      adress_street,
      adress_number,
      adress_complement,
      adress_neighborhood,
      adress_city,
      adress_state,
      is_deleted
    } = companyData;

    // Validar campos obrigatórios
    if (!name || !email || !zip_code || !adress_street || !adress_number || !adress_neighborhood || !adress_city || !adress_state) {
      throw new Error('Confira os campos.');
    }

    return await Company.create({
      name,
      email,
      zip_code,
      adress_street,
      adress_number,
      adress_complement,
      adress_neighborhood,
      adress_city,
      adress_state,
      is_deleted: is_deleted === undefined ? false : is_deleted
    });
  }

  async update(id, updateData) {
    const company = await this.find(id);
    await company.update(updateData);
    return company;
  }

  async delete(id) {
    const company = await this.find(id);
    await company.update({ is_deleted: true });
    return { message: 'Empresa deletada.' };
  }
} 