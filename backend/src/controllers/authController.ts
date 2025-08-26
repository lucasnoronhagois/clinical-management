import { Request, Response } from 'express';
import AuthService from '../services/authService';

const authService = new AuthService();

export default class AuthController {

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Email/Login e senha são obrigatórios.') {
        res.status(400).json({ error: error.message });
        return;
      }
      if (error.message === 'Usuário ou senha inválidos.') {
        res.status(401).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Erro ao autenticar usuário.', details: error.message });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      if (error.message === 'Campos obrigatórios faltando.') {
        res.status(400).json({ error: error.message });
        return;
      }
      if (error.message === 'Email, Login ou CPF já cadastrado.') {
        res.status(409).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Erro ao registrar usuário.', details: error.message });
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.changePassword(req.body);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.resetPassword(req.body);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
