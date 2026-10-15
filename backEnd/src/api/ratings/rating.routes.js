import express from 'express';
import protect from '../auth/auth.middleware.js';
import validate from '../../middleware/validate.middleware.js';
import { ratingBodyRules, titleKeyParamRules } from '../../validators/title.validators.js';
import { getRatings, rateTitle, removeRating } from './rating.controller.js';

const router = express.Router();

router.use(protect);
router.get('/', getRatings);
router.put('/', validate(ratingBodyRules), rateTitle);
router.delete('/:source/:movieId', validate(titleKeyParamRules), removeRating);

export default router;
