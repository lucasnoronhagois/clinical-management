import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    role?: string;
  };
}

export function allowRoles(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role!)) {
      res.status(403).json({ error: 'Acesso não autorizado.' });
      return;
    }
    next();
  };
}
