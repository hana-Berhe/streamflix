import express from "express";
import {
  getMyListController,
  addToMyListController,
  removeFromMyListController,
} from "../controller/myList.controller.js";
import {
  addToMyListValidation,
  removeFromMyListValidation,
} from "../validations/myList.validation.js";
import { authenticateUser } from "../../../middleware/authentication.js";

const myListRouter = express.Router();

/**
 * @route GET /api/my-list
 * @desc Get the user's saved titles, newest first
 * @access Protected
 */
myListRouter.get("/", authenticateUser, getMyListController);

/**
 * @route POST /api/my-list
 * @desc Save a title to My List
 * @access Protected
 */
myListRouter.post(
  "/",
  authenticateUser,
  addToMyListValidation,
  addToMyListController,
);

/**
 * @route DELETE /api/my-list/:source/:movieId
 * @desc Remove a title from My List
 * @access Protected
 */
myListRouter.delete(
  "/:source/:movieId",
  authenticateUser,
  removeFromMyListValidation,
  removeFromMyListController,
);

export { myListRouter };
