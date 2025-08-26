import express from 'express';
import { ReportController } from '../controllers/index';

const router = express.Router();
const reportController = new ReportController();

router.get('/attendances', reportController.getAttendanceReport.bind(reportController));
router.get('/test', (req, res) => {
  res.json({ message: 'Reports route working' });
});

export default router;
