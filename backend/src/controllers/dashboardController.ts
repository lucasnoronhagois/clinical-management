import { Request, Response } from 'express';
import DashboardService from '../services/dashboardService';

const dashboardService = new DashboardService();

export default class DashboardController {

  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        company_id: req.query.company_id as string,
        start_date: req.query.start_date as string,
        end_date: req.query.end_date as string
      };

      const statistics = await dashboardService.getStatistics(filters);
      res.json(statistics);
    } catch (error: any) {
      if (error.message === 'company_id é obrigatório') {
        res.status(400).json({ error: error.message });
        return;
      }
      if (error.message === 'A data final não pode ser anterior à data inicial') {
        res.status(400).json({ error: error.message });
        return;
      }
      console.error('Erro ao buscar estatísticas do dashboard:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
