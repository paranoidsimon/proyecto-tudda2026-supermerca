export default function checkRoleMiddleware(requiredRoles) {
  return (req, res, next) => {
    if (!req.session) {
      res.status(401).json({ error: 'Debes iniciar sesión para realizar esta acción' });
      return;
    }

    if (!requiredRoles.includes(req.session.role)) {
      res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
      return;
    }

    next();
  };
}