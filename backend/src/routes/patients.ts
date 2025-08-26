import express from 'express';
import { PatientController } from '../controllers/index';
import { validateSchema } from '../middlewares/validateSchema';
import { patientSchema } from '../schema/index';

const router = express.Router();
const patientController = new PatientController();

router.get('/', patientController.list.bind(patientController));
router.get('/:id', patientController.find.bind(patientController));
router.post('/', validateSchema(patientSchema), patientController.create.bind(patientController));
router.put('/:id', validateSchema(patientSchema), patientController.update.bind(patientController));
router.delete('/:id', patientController.delete.bind(patientController));

export default router;
