import express from 'express';
import { loginUser, logoutUser, registerUser } from './auth.controller.js';
import validate from '../../middleware/validate.middleware.js';
import { authLimiter } from '../../middleware/rateLimit.middleware.js';
import { loginRules, registerRules } from '../../validators/auth.validators.js';

const router = express.Router();

// Order: rate limit first (cheapest rejection), then validation, then the handler.
router.post('/register', authLimiter, validate(registerRules), registerUser);
router.post('/login', authLimiter, validate(loginRules), loginUser);
router.post('/logout', logoutUser);

// The current user is available at GET /api/users/me.

export default router;
