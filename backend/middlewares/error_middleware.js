export default async function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode
    || (err.code === 11000 ? 409 : undefined)
    || (err.name === 'ValidationError' || err.name === 'CastError' ? 400 : 500);
  if (statusCode >= 500)
    console.error(err);
  res.status(statusCode).json({ error: err.message || 'Error interno del servidor' });
}