export function requireRoot(req, res, next) {
  if (!req.user || !req.user.root) {
    return res.status(403).json({ error: 'Acesso permitido apenas para administradores.' });
  }
  next();
}

//renomear para acessLevel