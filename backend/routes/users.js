import express from 'express';
import { UserController } from '../controllers/index.js';
import { requireRoot } from '../middlewares/auth.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { createUserSchema, updateUserSchema, listUsersSchema, idSchema } from '../schema/index.js';

const router = express.Router();
const userController = new UserController();

// GET: lista todos os usuários ou filtra por company_id
router.get('/', validateSchema(listUsersSchema, 'query'), userController.list);

// POST: cria um novo usuário (apenas adm)
router.post('/', requireRoot, validateSchema(createUserSchema, 'body'), userController.create);

// GET: obter um usuário por id (qualquer autenticado)
router.get('/:id', validateSchema(idSchema, 'params'), userController.find);

// PUT: atualizar um usuário por id (apenas adm)
router.put('/:id', requireRoot, validateSchema(updateUserSchema, 'body'), userController.update);

// DELETE: soft delete (apenas adm)
router.delete('/:id', requireRoot, validateSchema(idSchema, 'params'), userController.delete);

export default router; 