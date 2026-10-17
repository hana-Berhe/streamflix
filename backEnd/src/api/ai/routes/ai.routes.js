import express from "express";
import {
  getAiStatusController,
  getSuggestionsController,
} from "../controller/ai.controller.js";
import { suggestionsValidation } from "../validations/ai.validation.js";
import { authenticateUser } from "../../../middleware/authentication.js";
import { createUserRateLimit } from "../../../middleware/user-rate-limit.js";

const aiRouter = express.Router();

// Gemini calls cost money: 8 per minute for each user
const aiRateLimit = createUserRateLimit({ max: 8, what: "suggestion requests" });

/**
 * @route GET /api/ai/status
 * @desc Tell the frontend if Gemini is set up
 * @access Protected
 */
aiRouter.get("/status", authenticateUser, getAiStatusController);

/**
 * @route POST /api/ai/suggestions
 * @desc Get AI movie picks based on the user's ratings and My List
 * @access Protected
 */
aiRouter.post(
  "/suggestions",
  authenticateUser,
  aiRateLimit,
  suggestionsValidation,
  getSuggestionsController,
);

export { aiRouter };
