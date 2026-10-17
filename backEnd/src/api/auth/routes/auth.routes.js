import express from "express";
const authRouter = express.Router();
import {
  registerController,
  loginController,
  logoutController,
} from "../controller/auth.controller.js";
import {
  registerValidation,
  loginValidation,
} from "../validations/auth.validation.js";
import {
  loginRateLimit,
  registerRateLimit,
} from "../../../middleware/auth-rate-limit.js";

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post(
  "/register",
  registerRateLimit,
  registerValidation,
  registerController,
);

/**
 * @route POST /api/auth/login
 * @desc Check email and password, then set the auth cookie
 * @access Public
 */
authRouter.post("/login", loginRateLimit, loginValidation, loginController);

/**
 * @route POST /api/auth/logout
 * @desc Clear the auth cookie
 * @access Public
 */
authRouter.post("/logout", logoutController);

export { authRouter };
