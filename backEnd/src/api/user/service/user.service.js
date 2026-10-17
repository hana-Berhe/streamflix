import { safeExecute } from "../../../../schema/db.config.js";
import { UnauthenticatedError } from "../../../utility/errors/errors.js";

export const getUserService = async (userId) => {
  const rows = await safeExecute(
    "SELECT id, full_name, email, created_at FROM users WHERE id = ?",
    [userId],
  );

  // The token is valid but the account was deleted: treat as signed out
  if (rows.length === 0) {
    throw new UnauthenticatedError("Sign in to continue");
  }

  return rows[0];
};
