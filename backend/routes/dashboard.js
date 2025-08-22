import express from 'express';
import { DashboardController } from '../controllers/index.js'
import { validateSchema } from '../middlewares/validateSchema.js';
import { dashboardDataSchema } from '../schema/index.js';

const router = express.Router();
const dashboardController = new DashboardController();

// GET /dashboard: Estatísticas por período
router.get('/', validateSchema(dashboardDataSchema, 'query'), dashboardController.getStatistics);

export default router; 