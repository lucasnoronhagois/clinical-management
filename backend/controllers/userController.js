import UserService from '../services/userService.js';

const userService = new UserService();

export default class UserController {
  async find(req, res) {
    try {
      const user = await userService.find(req.params.id);
      res.json(user);
    } catch (error) {
      if (error.message === 'Usuário não encontrado.') {
        return res.status(404).json({ errorMessage: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async list(req, res) {
    try {
      const filters = {
        company_id: req.query.company_id,
        name: req.query.name,
        role: req.query.role,
        page: req.query.page,
        limit: req.query.limit
      };

      // Adicionar filtro de company_id baseado no usuário logado
      if (!filters.company_id && !req.user?.root) {
        filters.company_id = req.user?.company_id;
      }

      const result = await userService.list(filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      let user;
      
      if (Array.isArray(req.body)) {
        user = await userService.createMultiple(req.body);
      } else {
        user = await userService.create(req.body);
      }
      
      res.status(201).json(user);
    } catch (error) {
      if (error.message === 'LOGIN_USADO') {
        return res.status(500).json({ code: 'LOGIN_USADO' });
      }
      
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const messages = error.errors ? error.errors.map(e => e.message) : [error.message];
        return res.status(400).json({ error: messages.join('; ') });
      }
      
      res.status(500).json({ error: error.message, code: 'ERROR_CREATING_USER' });
    }
  }

  async update(req, res) {
    try {
      const user = await userService.update(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      if (error.message === 'Usuário não encontrado.') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await userService.delete(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Usuário não encontrado.') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
} 