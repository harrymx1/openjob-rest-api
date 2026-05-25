export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  let status = 500;
  let message = err.message || 'Internal server error';
  const msg = message.toLowerCase();

  // Prioritas khusus untuk refresh token (harus 400, bukan 404)
  if (msg.includes('refresh token')) {
    status = 400;
  } 
  // Error database UUID invalid
  else if (err.code === '22P02') {
    status = 404;
    message = 'Resource not found (invalid ID format)';
  }
  // Not found (setelah refresh token)
  else if (msg.includes('not found')) {
    status = 404;
  }
  else if (msg.includes('email already exists')) {
    status = 400;
  }
  else if (msg.includes('invalid email') || msg.includes('invalid password')) {
    status = 401;
  }
  else if (err.code === '23505') {
    status = 400;
    message = 'Duplicate entry';
  }
  else if (err.code === '23503') {
    status = 400;
    message = 'Invalid reference';
  }

  res.status(status).json({ status: 'failed', message });
};