import express from 'express';
import protect from '../auth/auth.middleware.js';
import validate from '../../middleware/validate.middleware.js';
import { aiLimiter } from '../../middleware/rateLimit.middleware.js';
import { suggestionRules } from '../../validators/ai.validators.js';
import { getStatus, suggest } from './ai.controller.js';

const router = express.Router();

router.use(protect);
router.get('/status', getStatus);
// protect runs first, so the limiter counts per user rather than per IP.
router.post('/suggestions', aiLimiter, validate(suggestionRules), suggest);

export default router;
