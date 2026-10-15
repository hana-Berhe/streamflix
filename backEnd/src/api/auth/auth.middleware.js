import jwt from 'jsonwebtoken';
import config from '../../config/env.js';
import AppError from '../../utils/AppError.js';
import { AUTH_COOKIE_NAME } from '../../utils/cookieOptions.js';

/**
 * Requires a valid session cookie. Sets req.userId for the handlers after it.
 * The frontend treats any 401 from a protected route as "session expired".
 */
const protect = (req, res, next) => {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    return next(new AppError('Sign in to continue', 401, { code: 'UNAUTHENTICATED' }));
  }

  try {
    const { userId } = jwt.verify(token, config.jwt.secret);
    req.userId = userId;
    return next();
  } catch (error) {
    const expired = error.name === 'TokenExpiredError';
    return next(
      new AppError(
        expired ? 'Your session has expired. Sign in again.' : 'Sign in to continue',
        401,
        {
          code: expired ? 'SESSION_EXPIRED' : 'UNAUTHENTICATED',
        }
      )
    );
  }
};

export default protect;
