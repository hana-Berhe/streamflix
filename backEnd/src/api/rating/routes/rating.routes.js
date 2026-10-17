import express from "express";
import {
  getRatingsController,
  rateTitleController,
  removeRatingController,
} from "../controller/rating.controller.js";
import {
  rateTitleValidation,
  removeRatingValidation,
} from "../validations/rating.validation.js";
import { authenticateUser } from "../../../middleware/authentication.js";

const ratingRouter = express.Router();

/**
 * @route GET /api/ratings
 * @desc Get the user's ratings
 * @access Protected
 */
ratingRouter.get("/", authenticateUser, getRatingsController);

/**
 * @route PUT /api/ratings
 * @desc Rate a title, or change the rating
 * @access Protected
 */
ratingRouter.put("/", authenticateUser, rateTitleValidation, rateTitleController);

/**
 * @route DELETE /api/ratings/:source/:movieId
 * @desc Remove a rating
 * @access Protected
 */
ratingRouter.delete(
  "/:source/:movieId",
  authenticateUser,
  removeRatingValidation,
  removeRatingController,
);

export { ratingRouter };
