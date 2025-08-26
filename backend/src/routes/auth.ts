import express from 'express';
import { AuthController } from '../controllers/index';
import { requireRoot } from '../middlewares/auth';
import { validateSchema } from '../middlewares/validateSchema';
import { loginSchema, changePasswordSchema, resetPasswordSchema, userSchema } from '../schema/index';

const router = express.Router();
const authController = new AuthController();

// Rota de login (sempre pública - não precisa do jwt)
router.post('/login', validateSchema(loginSchema, 'body'), authController.login.bind(authController));

// Rota protegida: register (precisa ser admin)
router.post('/register', requireRoot, validateSchema(userSchema, 'body'), authController.register.bind(authController));

// Rota para alterar senha
router.post('/change-password', validateSchema(changePasswordSchema), authController.changePassword.bind(authController));

// Rota para reset de senha
router.post('/reset-password', validateSchema(resetPasswordSchema), authController.resetPassword.bind(authController));

export default router;
