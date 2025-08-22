import DashboardService from '../services/dashboardService.js';

const dashboardService = new DashboardService();

export default class DashboardController {

  async getStatistics(req, res) {
    try {
      const filters = {
        company_id: req.query.company_id,
        start_date: req.query.start_date,
        end_date: req.query.end_date
      };

      const statistics = await dashboardService.getStatistics(filters);
      res.json(statistics);
    } catch (error) {
      if (error.message === 'company_id é obrigatório') {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === 'A data final não pode ser anterior à data inicial') {
        return res.status(400).json({ error: error.message });
      }
      console.error('Erro ao buscar estatísticas do dashboard:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 