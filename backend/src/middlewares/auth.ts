import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    root?: boolean;
  };
}

export function requireRoot(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user || !req.user.root) {
    res.status(403).json({ error: 'Acesso permitido apenas para administradores.' });
    return;
  }
  next();
}
