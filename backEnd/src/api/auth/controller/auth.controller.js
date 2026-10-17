import { StatusCodes } from "http-status-codes";
import { registerService, loginService } from "../service/auth.service.js";
import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_MAX_AGE,
  authCookieOptions,
} from "../../../utility/authCookie.js";

const registerController = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const userId = await registerService({ fullName, email, password });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Account created. Sign in to continue.",
      userId,
    });
  } catch (error) {
    next(error);
  }
};

// The token goes only into the httpOnly cookie, never into the JSON body,
// so JavaScript in the browser can't read it.
const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { token, user } = await loginService({ email, password });

    res.cookie(AUTH_COOKIE_NAME, token, {
      ...authCookieOptions,
      maxAge: AUTH_COOKIE_MAX_AGE,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const logoutController = (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, authCookieOptions);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Logout successful",
  });
};

export { registerController, loginController, logoutController };
