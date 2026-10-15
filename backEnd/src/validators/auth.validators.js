import { body } from 'express-validator';

/**
 * Same rules as the frontend form (StreamFlexFrontEnd/src/utils/validate.js).
 * The server repeats them because anyone can call the API directly.
 */

// bcrypt only uses the first 72 bytes of a password; longer ones would be silently truncated.
const PASSWORD_MAX = 72;

const emailRule = () =>
  body('email')
    .exists({ values: 'falsy' })
    .withMessage('Email is required')
    .bail()
    .isString()
    .withMessage('Email must be text')
    .bail()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Email must be 255 characters or fewer')
    .bail()
    .isEmail()
    .withMessage('Enter a valid email address')
    .bail()
    .toLowerCase();

export const registerRules = [
  body('fullName')
    .exists({ values: 'falsy' })
    .withMessage('Full name is required')
    .bail()
    .isString()
    .withMessage('Full name must be text')
    .bail()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be 2 to 100 characters'),

  emailRule(),

  body('password')
    .exists({ values: 'falsy' })
    .withMessage('Password is required')
    .bail()
    .isString()
    .withMessage('Password must be text')
    .bail()
    .isLength({ min: 6, max: PASSWORD_MAX })
    .withMessage(`Password must be 6 to ${PASSWORD_MAX} characters`)
    .bail()
    .matches(/^\S+$/)
    .withMessage("Password can't contain spaces")
    .bail()
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
    .withMessage('Password must include an uppercase letter, a lowercase letter, and a number'),
];

// Login only checks shape. It must not reveal the password rules or which part was wrong.
export const loginRules = [
  emailRule(),
  body('password')
    .exists({ values: 'falsy' })
    .withMessage('Password is required')
    .bail()
    .isString()
    .isLength({ max: 200 })
    .withMessage('Invalid email or password'),
];
