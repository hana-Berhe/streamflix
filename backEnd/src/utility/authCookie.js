export const AUTH_COOKIE_NAME = "token";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 1000; // 1 hour, same as the token

const sameSite = process.env.COOKIE_SAMESITE || "lax";

export const authCookieOptions = {
  httpOnly: true, // JavaScript in the browser can't read it
  // Browsers only accept sameSite "none" cookies over HTTPS
  secure: process.env.NODE_ENV === "production" || sameSite === "none",
  sameSite,
  path: "/",
};
