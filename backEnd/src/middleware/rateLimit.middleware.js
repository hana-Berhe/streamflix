import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import AppError from '../utils/AppError.js';

// Rate-limit rejections go through the central error handler, so they have the
// same { message, code, requestId } shape as every other error.
const rejectWith = (message) => (req, res, next) =>
  next(new AppError(message, 429, { code: 'RATE_LIMITED' }));

/** Login / register: slows down password guessing. 20 attempts per 15 minutes per IP. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: rejectWith('Too many attempts. Try again in a few minutes.'),
});

/** AI calls cost money: 8 per minute per signed-in user. */
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req) => (req.userId ? `user:${req.userId}` : ipKeyGenerator(req.ip)),
  handler: rejectWith('Too many suggestion requests. Wait a minute and try again.'),
});
