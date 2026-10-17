import express from "express";
import { getMeController } from "../controller/user.controller.js";
import { authenticateUser } from "../../../middleware/authentication.js";

const userRouter = express.Router();

/**
 * @route GET /api/users/me
 * @desc Return the logged-in user
 * @access Protected
 */
userRouter.get("/me", authenticateUser, getMeController);

export { userRouter };
