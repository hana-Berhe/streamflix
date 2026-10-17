import { body, param } from "express-validator";
import { validationErrorHandler } from "../../../middleware/validation-handler.js";

// Only TMDB image links can be saved, so nobody can store a random URL
const TMDB_IMAGE_URL = /^https:\/\/image\.tmdb\.org\/t\/p\/\w+\/[\w.-]+$/;

const imageRule = (field) =>
  body(field)
    .optional({ values: "null" })
    .isString()
    .withMessage(`${field} must be a TMDB image link`)
    .bail()
    .isLength({ max: 500 })
    .withMessage(`${field} must be a TMDB image link`)
    .bail()
    .matches(TMDB_IMAGE_URL)
    .withMessage(`${field} must be a TMDB image link`);

// The movie info the frontend sends. Ratings use the same rules.
export const titleRules = [
  body("movieId")
    .isInt({ min: 1 })
    .withMessage("movieId must be a positive number")
    .toInt(),
  body("source")
    .isIn(["tmdb", "local"])
    .withMessage("source must be tmdb or local"),
  body("mediaType")
    .isIn(["movie", "tv"])
    .withMessage("mediaType must be movie or tv"),
  body("title")
    .isString()
    .withMessage("title is required")
    .bail()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("title must be 1 to 255 characters"),
  imageRule("posterPath"),
  imageRule("backdropPath"),
];

// The /:source/:movieId part of delete URLs
export const titleKeyRules = [
  param("source")
    .isIn(["tmdb", "local"])
    .withMessage("source must be tmdb or local"),
  param("movieId")
    .isInt({ min: 1 })
    .withMessage("movieId must be a positive number")
    .toInt(),
];

export const addToMyListValidation = [...titleRules, validationErrorHandler];
export const removeFromMyListValidation = [...titleKeyRules, validationErrorHandler];
