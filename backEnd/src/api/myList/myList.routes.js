import express from 'express';
import protect from '../auth/auth.middleware.js';
import validate from '../../middleware/validate.middleware.js';
import { titleBodyRules, titleKeyParamRules } from '../../validators/title.validators.js';
import { addToMyList, getMyList, removeFromMyList } from './myList.controller.js';

const router = express.Router();

router.use(protect);
router.get('/', getMyList);
router.post('/', validate(titleBodyRules), addToMyList);
router.delete('/:source/:movieId', validate(titleKeyParamRules), removeFromMyList);

export default router;
