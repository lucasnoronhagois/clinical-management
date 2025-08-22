import express from 'express';
import { AuthController } from '../controllers/index.js'
import { requireRoot } from '../middlewares/auth.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { loginSchema, changePasswordSchema, resetPasswordSchema } from '../schema/index.js';

const router = express.Router();
const authController = new AuthController();

// Rota de login (sempre pública - não precisa do jwt)
router.post('/login', validateSchema(loginSchema, 'body'), authController.login);

// Rota protegida: register (precisa ser admin)
router.post('/register', requireRoot, validateSchema(loginSchema, 'body'), authController.register);
//conferir local pra criação
export default router; 