import { Request, Response } from 'express';
import CompanyService from '../services/companyService';

const companyService = new CompanyService();

export default class CompanyController {

  async find(req: Request, res: Response): Promise<void> {
    try {
      const company = await companyService.find(req.params.id);
      res.json(company);
    } catch (error: any) {
      if (error.message === 'Empresa não encontrada.') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const companies = await companyService.list();
      res.json(companies);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const company = await companyService.create(req.body);
      res.status(201).json(company);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const company = await companyService.update(req.params.id, req.body);
      res.json(company);
    } catch (error: any) {
      if (error.message === 'Empresa não encontrada.') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await companyService.delete(req.params.id);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Empresa não encontrada.') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }
}
