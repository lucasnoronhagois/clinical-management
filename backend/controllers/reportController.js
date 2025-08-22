import ReportService from '../services/reportService.js';

const reportService = new ReportService();


export default class ReportController {

  async getAttendanceReport(req, res) {
    try {
      const filters = {
        company_id: req.query.company_id,
        role: req.query.role
      };

      const report = await reportService.getAttendanceReport(filters);
      res.json(report);
    } catch (error) {
      if (error.message === 'Empresa é um campo obrigatório') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
} 