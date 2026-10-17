import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../utility/errors/errors.js";
import { AUTH_COOKIE_NAME } from "../utility/authCookie.js";

// The login token lives in an httpOnly cookie set by the backend.
const authenticateUser = (req, res, next) => {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    throw new UnauthenticatedError("Sign in to continue");
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new UnauthenticatedError("Your session has expired. Sign in again.");
    }
    throw new UnauthenticatedError("Sign in to continue");
  }

  req.user = { id: payload.userId };
  next();
};

export { authenticateUser };
