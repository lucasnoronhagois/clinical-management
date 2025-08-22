import express from 'express';
import { CompanyController } from '../controllers/index.js'
import { validateSchema } from '../middlewares/validateSchema.js';
import { createCompanySchema, updateCompanySchema, listCompaniesSchema, idSchema } from '../schema/index.js';

const router = express.Router();
const companyController = new CompanyController();

// GET: lista todas as companies
router.get('/', validateSchema(listCompaniesSchema, 'query'), companyController.list);

// GET: obter uma company por id
router.get('/:id', validateSchema(idSchema, 'params'), companyController.find);

// POST: cria uma nova company
router.post('/', validateSchema(createCompanySchema, 'body'), companyController.create);

// PUT: atualizar uma company por id
router.put('/:id', validateSchema(updateCompanySchema, 'body'), companyController.update);

// DELETE: soft delete (marca is_deleted como TRUE, mas mantenho no banco)
router.delete('/:id', validateSchema(idSchema, 'params'), companyController.delete);

export default router; 