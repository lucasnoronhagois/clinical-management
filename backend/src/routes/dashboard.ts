import express from 'express';
import { DashboardController } from '../controllers/index';

const router = express.Router();
const dashboardController = new DashboardController();

router.get('/statistics', dashboardController.getStatistics.bind(dashboardController));

export default router;
