import express from 'express';
import { allowRoles } from '../middlewares/allowRoles.js';
import { AttendanceController } from '../controllers/index.js'
import { validateSchema } from '../middlewares/validateSchema.js';
import { createAttendanceSchema, updateAttendanceSchema, listAttendancesSchema, idSchema } from '../schema/index.js'
const router = express.Router();
const attendanceController = new AttendanceController();

// GET: listar atendimentos (DOCTOR e RECEPTIONIST)
router.get('/', allowRoles('DOCTOR', 'RECEPTIONIST'), validateSchema(listAttendancesSchema, 'query'), attendanceController.list);

// POST: criar atendimento (DOCTOR e RECEPTIONIST)
router.post('/', allowRoles('DOCTOR', 'RECEPTIONIST'), validateSchema(createAttendanceSchema, 'body'), attendanceController.create);

// GET: obter atendimento por id
router.get('/:id', allowRoles('DOCTOR', 'RECEPTIONIST'), validateSchema(idSchema, 'params'), attendanceController.find);

// PUT: atualizar atendimento por id (apenas DOCTOR)
router.put('/:id', allowRoles('DOCTOR', 'RECEPTIONIST'), validateSchema(updateAttendanceSchema, 'body'), attendanceController.update);

// PUT: confirmar atendimento por id
router.put('/:id/confirm', allowRoles('DOCTOR', 'RECEPTIONIST'), validateSchema(idSchema, 'params'), attendanceController.confirm);

// PUT: finalizar atendimento por id
router.put('/:id/finish', allowRoles('DOCTOR', 'RECEPTIONIST'), validateSchema(idSchema, 'params'), attendanceController.finish);

// DELETE: soft delete (marca is_deleted como TRUE) (apenas DOCTOR)
router.delete('/:id', allowRoles('DOCTOR', 'RECEPTIONIST'),  validateSchema(idSchema, 'params'),attendanceController.delete);

export default router; 