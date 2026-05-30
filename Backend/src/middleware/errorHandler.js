const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid user ID';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(', ');
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    const value = field ? err.keyValue[field] : 'value';
    message = `${field || 'Duplicate field'} already exists: ${value}`;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
