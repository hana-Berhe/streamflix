/**
 * An expected, user-facing error ("Email is already registered").
 * The error handler sends its message and status to the client as-is.
 * Anything that is NOT an AppError is treated as a bug: logged in full,
 * and hidden behind a generic message in production.
 */
class AppError extends Error {
  /**
   * @param {string} message  safe to show to the user
   * @param {number} statusCode HTTP status
   * @param {object} [options]
   * @param {string} [options.code] machine-readable code the frontend can branch on
   * @param {Array}  [options.errors] per-field details (validation)
   */
  constructor(message, statusCode = 500, { code, errors } = {}) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.isOperational = true;
  }
}

export default AppError;
