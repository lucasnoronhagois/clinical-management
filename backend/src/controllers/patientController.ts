import { Request, Response } from 'express';
import PatientService from '../services/patientService';

const patientService = new PatientService();

export default class PatientController {

  async find(req: Request, res: Response): Promise<void> {
    try {
      const patient = await patientService.find(req.params.id);
      res.json(patient);
    } catch (error: any) {
      if (error.message === 'Paciente não encontrado.') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        company_id: req.query.company_id as string
      };
      
      const patients = await patientService.list(filters);
      res.json(patients);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      let patient;
      
      if (Array.isArray(req.body)) {
        patient = await patientService.createMultiple(req.body);
      } else {
        patient = await patientService.create(req.body);
      }
      
      res.status(201).json(patient);
    } catch (error: any) {
      console.error('PatientController: Erro ao criar paciente:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const patient = await patientService.update(req.params.id, req.body);
      res.json(patient);
    } catch (error: any) {
      if (error.message === 'Paciente não encontrado.') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await patientService.delete(req.params.id);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Paciente não encontrado.') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }
}
