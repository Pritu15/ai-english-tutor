import mongoose from 'mongoose';
import AppError from '../utils/appError.js';

const validateObjectId = (req, _res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Invalid user ID', 400));
  }

  return next();
};

export default validateObjectId;
