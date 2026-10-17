import { body } from "express-validator";
import { validationErrorHandler } from "../../../middleware/validation-handler.js";

// A list of movie titles, like ["Dark", "Arrival"]
const titleListRules = (field, maxItems) => [
  body(field)
    .optional()
    .isArray({ max: maxItems })
    .withMessage(`${field} must be a list of at most ${maxItems} titles`),
  body(`${field}.*`)
    .isString()
    .isLength({ min: 1, max: 200 })
    .withMessage(`Each ${field} title must be 1 to 200 characters`),
];

export const suggestionsValidation = [
  body("prompt")
    .optional()
    .isString()
    .withMessage("prompt must be text")
    .bail()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Describe what you want in 300 characters or fewer"),
  body("count")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("count must be between 1 and 20")
    .toInt(),
  // Titles already on screen, so "Show different titles" gets new ones
  ...titleListRules("exclude", 60),
  // When the frontend has no TMDB key, these are the only titles it can show
  ...titleListRules("catalog", 100),

  validationErrorHandler,
];
