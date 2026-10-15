import config from '../config/env.js';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

/** Any request that matched no route. */
export const notFound = (req, res, next) => {
  next(
    new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, { code: 'NOT_FOUND' })
  );
};

/**
 * Translates known low-level errors into user-facing AppErrors.
 * Returns null for anything unexpected.
 */
const toAppError = (err) => {
  if (err instanceof AppError) return err;

  // Thrown by express.json() for malformed or oversized bodies.
  if (err.type === 'entity.parse.failed') {
    return new AppError('Request body is not valid JSON', 400, { code: 'INVALID_JSON' });
  }
  if (err.type === 'entity.too.large') {
    return new AppError('Request body is too large', 413, { code: 'PAYLOAD_TOO_LARGE' });
  }

  // MySQL unique-key violation (e.g. two sign-ups racing for one email).
  if (err.code === 'ER_DUP_ENTRY') {
    return new AppError('This record already exists', 409, { code: 'DUPLICATE' });
  }

  return null;
};

/**
 * Central error handler: the only place error responses are built.
 * Every error response has the same shape:
 *   { message, code?, errors?, requestId }
 */
// Express recognises error handlers by their four arguments, so `next` must stay.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const known = toAppError(err);
  const status = known?.statusCode ?? 500;

  if (!known || status >= 500) {
    logger.error(err.message || 'Unhandled error', {
      requestId: req.id,
      method: req.method,
      path: req.originalUrl,
      status,
      stack: err.stack,
    });
  }

  // AppErrors are written to be shown to users. Unexpected errors may contain
  // internals (SQL, file paths), so production hides them behind a generic message.
  let message;
  if (known) message = known.message;
  else if (config.isProduction) message = 'Something went wrong. Try again later.';
  else message = err.message;

  const body = { message, requestId: req.id };

  if (known?.code) body.code = known.code;
  if (known?.errors?.length) body.errors = known.errors;

  return res.status(status).json(body);
};
