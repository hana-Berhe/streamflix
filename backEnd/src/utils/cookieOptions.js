import config from '../config/env.js';

export const authCookieOptions = {
  httpOnly: true, // not readable from JavaScript, so XSS can't steal the session
  secure: config.cookie.secure,
  sameSite: config.cookie.sameSite,
  path: '/',
};

export const AUTH_COOKIE_NAME = 'token';
export const AUTH_COOKIE_MAX_AGE = config.jwt.maxAgeMs;
