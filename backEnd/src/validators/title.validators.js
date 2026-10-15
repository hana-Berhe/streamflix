import { body, param } from 'express-validator';

export const SOURCES = ['tmdb', 'local'];
export const MEDIA_TYPES = ['movie', 'tv'];
export const RATINGS = [-1, 1, 2]; // Not for me, I like this, Love this!

// Only TMDB image URLs are stored. Local images are resolved on the client,
// so this also blocks storing arbitrary URLs (e.g. javascript: links) in the database.
const TMDB_IMAGE_URL = /^https:\/\/image\.tmdb\.org\/t\/p\/[\w]+\/[\w.-]+$/;

const imageUrlRule = (field) =>
  body(field)
    .optional({ values: 'null' })
    .isString()
    .withMessage(`${field} must be text`)
    .bail()
    .isLength({ max: 500 })
    .withMessage(`${field} is too long`)
    .bail()
    .matches(TMDB_IMAGE_URL)
    .withMessage(`${field} must be a TMDB image URL`);

/** Body of POST /api/my-list: a snapshot of the title being saved. */
export const titleBodyRules = [
  body('movieId')
    .exists({ values: 'null' })
    .withMessage('movieId is required')
    .bail()
    .isInt({ min: 1, max: 4294967295 })
    .withMessage('movieId must be a positive integer')
    .toInt(),

  body('source')
    .isIn(SOURCES)
    .withMessage(`source must be one of: ${SOURCES.join(', ')}`),

  body('mediaType')
    .isIn(MEDIA_TYPES)
    .withMessage(`mediaType must be one of: ${MEDIA_TYPES.join(', ')}`),

  body('title')
    .exists({ values: 'falsy' })
    .withMessage('title is required')
    .bail()
    .isString()
    .withMessage('title must be text')
    .bail()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('title must be 1 to 255 characters'),

  imageUrlRule('posterPath'),
  imageUrlRule('backdropPath'),
];

/** Body of PUT /api/ratings: the same snapshot plus the rating. */
export const ratingBodyRules = [
  ...titleBodyRules,
  body('rating')
    .exists({ values: 'null' })
    .withMessage('rating is required')
    .bail()
    .isInt()
    .withMessage('rating must be -1, 1 or 2')
    .bail()
    .toInt()
    .custom((value) => RATINGS.includes(value))
    .withMessage('rating must be -1 (Not for me), 1 (I like this) or 2 (Love this!)'),
];

/** URL params of DELETE /api/my-list/:source/:movieId and /api/ratings/:source/:movieId */
export const titleKeyParamRules = [
  param('source')
    .isIn(SOURCES)
    .withMessage(`source must be one of: ${SOURCES.join(', ')}`),
  param('movieId').isInt({ min: 1 }).withMessage('movieId must be a positive integer').toInt(),
];
