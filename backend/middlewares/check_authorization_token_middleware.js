import { getDependency } from '../dependency.js';
import { httpError } from '../utils/http_error.js';

export default async function checkAuthorizationTokenMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const [schema, token, extra] = authHeader.split(' ');
    if (schema?.toLowerCase() !== 'bearer' || !token || extra)
      throw httpError(401, 'El encabezado de autorización no es válido');

    const sessionService = getDependency('sessionService');
    const session = await sessionService.getByToken(token);
    if (!session)
      throw httpError(401, 'La sesión no es válida o ha expirado');

    const userService = getDependency('userService');
    const user = await userService.getByUsername(session.username);
    if (!user)
      throw httpError(401, 'La cuenta asociada a esta sesión ya no existe');

    session.role = user.role === 'user' ? 'customer' : user.role;
    req.session = session;
  }

  next();
}