import { body } from "express-validator";
import { validationErrorHandler } from "../../../middleware/validation-handler.js";

// Same rules as the frontend form (frontEnd/src/utils/validate.js)
export const registerValidation = [
  body("fullName")
    .isString()
    .withMessage("Full name is required")
    .bail()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be 2 to 100 characters"),
  body("email")
    .isString()
    .withMessage("Email is required")
    .bail()
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Enter a valid email address")
    .isLength({ max: 255 })
    .withMessage("Email is too long"),
  body("password")
    .isString()
    .withMessage("Password is required")
    .bail()
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])\S{6,72}$/)
    .withMessage(
      "Password must be 6 to 72 characters with an uppercase letter, a lowercase letter, and a number, and no spaces.",
    ),

  validationErrorHandler,
];

export const loginValidation = [
  body("email")
    .isString()
    .withMessage("Email is required")
    .bail()
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Enter a valid email address"),
  body("password")
    .isString()
    .withMessage("Password is required")
    .bail()
    .notEmpty()
    .withMessage("Password is required"),

  validationErrorHandler,
];
