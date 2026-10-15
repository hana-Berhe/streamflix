import * as authService from './auth.service.js';
import {
  AUTH_COOKIE_MAX_AGE,
  AUTH_COOKIE_NAME,
  authCookieOptions,
} from '../../utils/cookieOptions.js';

// Express 5 forwards errors from async handlers to the error middleware
// automatically, so controllers don't need try/catch.

export const registerUser = async (req, res) => {
  const user = await authService.register(req.validated);
  res.status(201).json({ message: 'Account created. Sign in to continue.', userId: user.id });
};

export const loginUser = async (req, res) => {
  const { token, user } = await authService.login(req.validated);
  res.cookie(AUTH_COOKIE_NAME, token, { ...authCookieOptions, maxAge: AUTH_COOKIE_MAX_AGE });
  res.status(200).json({ message: 'Login successful', user });
};

export const logoutUser = (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, authCookieOptions);
  res.status(200).json({ message: 'Logout successful' });
};
