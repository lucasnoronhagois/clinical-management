import { Request, Response } from 'express';
import UserService from '../services/userService';

interface AuthenticatedRequest extends Request {
  user?: {
    root?: boolean;
    company_id?: number;
  };
}

const userService = new UserService();

export default class UserController {
  async find(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.find(req.params.id);
      res.json(user);
    } catch (error: any) {
      if (error.message === 'Usuário não encontrado.') {
        res.status(404).json({ errorMessage: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }

  async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const filters = {
        company_id: req.query.company_id as string,
        name: req.query.name as string,
        role: req.query.role as string,
        page: req.query.page as string,
        limit: req.query.limit as string
      };

      // Adicionar filtro de company_id baseado no usuário logado
      if (!filters.company_id && !req.user?.root) {
        filters.company_id = req.user?.company_id?.toString() || '';
      }

      const result = await userService.list(filters);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      let user;
      
      if (Array.isArray(req.body)) {
        user = await userService.createMultiple(req.body);
      } else {
        user = await userService.create(req.body);
      }
      
      res.status(201).json(user);
    } catch (error: any) {
      if (error.message === 'LOGIN_USADO') {
        res.status(500).json({ code: 'LOGIN_USADO' });
        return;
      }
      
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const messages = error.errors ? error.errors.map((e: any) => e.message) : [error.message];
        res.status(400).json({ error: messages.join('; ') });
        return;
      }
      
      res.status(500).json({ error: error.message, code: 'ERROR_CREATING_USER' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.update(req.params.id, req.body);
      res.json(user);
    } catch (error: any) {
      if (error.message === 'Usuário não encontrado.') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await userService.delete(req.params.id);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Usuário não encontrado.') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }
}
