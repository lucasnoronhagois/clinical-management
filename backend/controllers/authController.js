import AuthService from '../services/authService.js';

const authService = new AuthService();

export default class AuthController {

  async login(req, res) {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (error) {
      if (error.message === 'Email/Login e senha são obrigatórios.') {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === 'Usuário ou senha inválidos.') {
        return res.status(401).json({ error: error.message });
      }
      res.status(500).json({ error: 'Erro ao autenticar usuário.', details: error.message });
    }
  }

  async register(req, res) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      if (error.message === 'Campos obrigatórios faltando.') {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === 'Email, Login ou CPF já cadastrado.') {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: 'Erro ao registrar usuário.', details: error.message });
    }
  }
} 