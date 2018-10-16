import { createError } from '../utils/error.util';

const requiresSignin = (req, res, next) => {
  if(!req.session || !req.session.userId)
    return next(createError('Access denied. User must be logged in.', 401));

  return next();
}

export { requiresSignin };