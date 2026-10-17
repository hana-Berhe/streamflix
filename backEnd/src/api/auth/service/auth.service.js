import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { safeExecute } from "../../../../schema/db.config.js";
import {
  BadRequestError,
  UnauthenticatedError,
} from "../../../utility/errors/errors.js";

const BCRYPT_ROUNDS = 12;

/**
 * Saves a new user with a hashed password.
 * @returns {Promise<number>} The new user's id.
 */
export const registerService = async ({ fullName, email, password }) => {
  const rows = await safeExecute("SELECT id FROM users WHERE email = ?", [email]);
  if (rows.length > 0) {
    throw new BadRequestError("Email is already registered");
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const result = await safeExecute(
    "INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)",
    [fullName, email, passwordHash],
  );

  return result.insertId;
};

/**
 * Checks the email and password and makes a JWT.
 * @returns {Promise<{token: string, user: Object}>}
 */
export const loginService = async ({ email, password }) => {
  const rows = await safeExecute(
    "SELECT id, full_name, email, password_hash FROM users WHERE email = ? LIMIT 1",
    [email],
  );
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new UnauthenticatedError("Invalid email or password");
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "1h",
  });

  return {
    token,
    // Same field names as GET /api/users/me, so the frontend has one user shape
    user: { id: user.id, full_name: user.full_name, email: user.email },
  };
};
