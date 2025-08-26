import { Request, Response } from 'express';
import AttendanceService from '../services/attendanceService';

interface AuthenticatedRequest extends Request {
  user?: {
    id?: number;
    company_id?: number;
  };
}

const attendanceService = new AttendanceService();

export default class AttendanceController {
  async find(req: Request, res: Response): Promise<void> {
    try {
      const attendance = await attendanceService.find(req.params.id);
      res.json(attendance);
    } catch (error: any) {
      if (error.message === 'Atendimento não encontrado.') {
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
      
      const attendances = await attendanceService.list(filters);
      res.json(attendances);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      let attendance;
      
      if (Array.isArray(req.body)) {
        attendance = await attendanceService.createMultiple(req.body, req.user);
      } else {
        attendance = await attendanceService.create(req.body, req.user);
      }
      
      res.status(201).json(attendance);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const attendance = await attendanceService.update(req.params.id, req.body);
      res.json(attendance);
    } catch (error: any) {
      if (error.message === 'Atendimento não encontrado.') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }

  async confirm(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const attendance = await attendanceService.confirm(req.params.id, req.user);
      res.json(attendance);
    } catch (error: any) {
      if (error.message === 'Atendimento não encontrado.') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }

  async finish(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const attendance = await attendanceService.finish(req.params.id, req.user);
      res.json(attendance);
    } catch (error: any) {
      if (error.message === 'Atendimento não encontrado.') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await attendanceService.delete(req.params.id);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Atendimento não encontrado.') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }
}
