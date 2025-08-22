import express from 'express';
import { ReportController } from '../controllers/index.js';
import { requireRoot } from '../middlewares/auth.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { dashboardReportSchema } from '../schema/index.js';

const router = express.Router();
const reportController = new ReportController();

// GET /reports/attendances: total de atendimentos por profissional (apenas adm)
router.get('/attendances', requireRoot, validateSchema(dashboardReportSchema, 'query'), reportController.getAttendanceReport);

export default router; 