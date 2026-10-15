import { checkExact, matchedData, validationResult } from 'express-validator';
import AppError from '../utils/AppError.js';

const formatError = (error) => {
  // checkExact reports extra fields as one grouped error.
  if (error.type === 'unknown_fields') {
    const names = error.fields.map((f) => f.path).join(', ');
    return {
      field: names,
      location: error.fields[0]?.location,
      message: `Unexpected field(s): ${names}`,
    };
  }
  return { field: error.path, location: error.location, message: error.msg };
};

/**
 * Wraps a list of express-validator rules into route middleware.
 *
 *   router.post("/", validate(addTitleRules), controller)
 *
 * 1. Runs every rule (validators + sanitizers like trim/toInt).
 * 2. Rejects fields the rules don't mention (checkExact), so clients can't
 *    sneak extra data through.
 * 3. On failure: 400 with { message, errors: [{ field, location, message }] }.
 *    `message` is the first problem, ready to show in the UI.
 * 4. On success: puts ONLY the validated, sanitized values on req.validated.
 *    Controllers read from there, never from req.body directly.
 */
const validate = (rules = []) => [
  ...rules,
  // Without explicit chains, checkExact treats every field validated above as known.
  checkExact(undefined, { message: 'Unexpected field' }),
  (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const errors = result.array({ onlyFirstError: true }).map(formatError);
      return next(new AppError(errors[0].message, 400, { code: 'VALIDATION_ERROR', errors }));
    }

    req.validated = matchedData(req, { onlyValidData: true });
    return next();
  },
];

export default validate;
