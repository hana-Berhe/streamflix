import { body } from 'express-validator';

const stringList = (field, { maxItems, maxLength }) => [
  body(field)
    .optional()
    .isArray({ max: maxItems })
    .withMessage(`${field} must be a list of at most ${maxItems} titles`),
  body(`${field}.*`)
    .isString()
    .withMessage(`Each ${field} entry must be text`)
    .bail()
    .trim()
    .isLength({ min: 1, max: maxLength })
    .withMessage(`Each ${field} entry must be 1 to ${maxLength} characters`),
];

/** Body of POST /api/ai/suggestions */
export const suggestionRules = [
  body('prompt')
    .optional()
    .isString()
    .withMessage('prompt must be text')
    .bail()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Describe what you want in 300 characters or fewer'),

  body('count')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('count must be between 1 and 20')
    .toInt(),

  // Titles already on screen, so "Show different titles" returns new ones.
  ...stringList('exclude', { maxItems: 60, maxLength: 200 }),

  // When the client has no TMDB key, the only titles it can display.
  ...stringList('catalog', { maxItems: 100, maxLength: 200 }),
];
