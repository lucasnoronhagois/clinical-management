import express from 'express';
import { UserController } from '../controllers/index';
import { validateSchema } from '../middlewares/validateSchema';
import { userSchema } from '../schema/index';

const router = express.Router();
const userController = new UserController();

router.get('/', userController.list.bind(userController));
router.get('/:id', userController.find.bind(userController));
router.post('/', validateSchema(userSchema), userController.create.bind(userController));
router.put('/:id', validateSchema(userSchema), userController.update.bind(userController));
router.delete('/:id', userController.delete.bind(userController));

export default router;
