import { Request, Response } from 'express';
import ReportService from '../services/reportService';

const reportService = new ReportService();

export default class ReportController {

  async getAttendanceReport(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        company_id: req.query.company_id as string,
        role: req.query.role as string
      };

      const report = await reportService.getAttendanceReport(filters);
      res.json(report);
    } catch (error: any) {
      if (error.message === 'Empresa é um campo obrigatório') {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }
}
