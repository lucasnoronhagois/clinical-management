import { Company } from '../models/index';

export default class CompanyService {
  async find(id: string): Promise<any> {
    const company = await Company.findByPk(id);
    if (!company) {
      throw new Error('Empresa não encontrada.');
    }
    return company;
  }

  async list(): Promise<any[]> {
    return await Company.findAll({
      where: { is_deleted: false },
      order: [['name', 'ASC']]
    });
  }

  async create(data: any): Promise<any> {
    return await Company.create({
      ...data,
      is_deleted: false
    });
  }

  async update(id: string, data: any): Promise<any> {
    const company = await this.find(id);
    await company.update(data);
    return company;
  }

  async delete(id: string): Promise<{ message: string }> {
    const company = await this.find(id);
    await company.update({ is_deleted: true });
    return { message: 'Empresa deletada.' };
  }
}
