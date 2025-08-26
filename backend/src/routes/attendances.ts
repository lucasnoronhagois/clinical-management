import express from 'express';
import { AttendanceController } from '../controllers/index';
import { validateSchema } from '../middlewares/validateSchema';
import { attendanceSchema } from '../schema/index';

const router = express.Router();
const attendanceController = new AttendanceController();

router.get('/', attendanceController.list.bind(attendanceController));
router.get('/:id', attendanceController.find.bind(attendanceController));
router.post('/', validateSchema(attendanceSchema), attendanceController.create.bind(attendanceController));
router.put('/:id', validateSchema(attendanceSchema), attendanceController.update.bind(attendanceController));
router.put('/:id/confirm', attendanceController.confirm.bind(attendanceController));
router.put('/:id/finish', attendanceController.finish.bind(attendanceController));
router.delete('/:id', attendanceController.delete.bind(attendanceController));

export default router;
