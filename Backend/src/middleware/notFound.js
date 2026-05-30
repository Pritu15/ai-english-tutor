import AppError from '../utils/appError.js';

const notFound = (req, _res, next) => {
  next(new AppError(`Not found - ${req.originalUrl}`, 404));
};

export default notFound;
