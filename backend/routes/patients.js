import express from 'express';
import { PatientController } from '../controllers/index.js'
import { validateSchema } from '../middlewares/validateSchema.js';
import { createPatientSchema, updatePatientSchema, listPatientsSchema, idSchema } from '../schema/index.js';

const router = express.Router();
const patientController = new PatientController();

// GET: listar todos os pacientes ou filtrar por company_id
router.get('/', validateSchema(listPatientsSchema, 'query'), patientController.list);

// POST: cria um novo paciente
router.post('/', validateSchema(createPatientSchema, 'body'), patientController.create);

// GET: obter um paciente por id
router.get('/:id', validateSchema(idSchema, 'params'), patientController.find);

// PUT: atualizar um paciente por id
router.put('/:id', validateSchema(updatePatientSchema, 'body'), patientController.update);

// DELETE: soft delete (marca is_deleted como TRUE, mas mantenho no banco)
router.delete('/:id', validateSchema(idSchema, 'params'), patientController.delete);

export default router; 