import express from 'express';
import { CompanyController } from '../controllers/index';
import { validateSchema } from '../middlewares/validateSchema';
import { companySchema } from '../schema/index';

const router = express.Router();
const companyController = new CompanyController();

router.get('/', companyController.list.bind(companyController));
router.get('/:id', companyController.find.bind(companyController));
router.post('/', validateSchema(companySchema), companyController.create.bind(companyController));
router.put('/:id', validateSchema(companySchema), companyController.update.bind(companyController));
router.delete('/:id', companyController.delete.bind(companyController));

export default router;
