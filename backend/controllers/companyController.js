import CompanyService from '../services/companyService.js';

const companyService = new CompanyService();

export default class CompanyController {

  async find(req, res) {
    try {
      const company = await companyService.find(req.params.id);
      res.json(company);
    } catch (error) {
      if (error.message === 'Empresa não encontrada.') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async list(req, res) {
    try {
      const companies = await companyService.list();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const company = await companyService.create(req.body);
      res.status(201).json(company);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const company = await companyService.update(req.params.id, req.body);
      res.json(company);
    } catch (error) {
      if (error.message === 'Empresa não encontrada.') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await companyService.delete(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Empresa não encontrada.') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
} 