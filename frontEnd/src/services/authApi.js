import { json, request } from "./http";

export const register = (payload) =>
  request("/auth/register", { method: "POST", body: json(payload), skipAuthEvent: true });

export const login = (payload) =>
  request("/auth/login", { method: "POST", body: json(payload), skipAuthEvent: true });

// skipAuthEvent: a 401 here just means "not signed in", not "session expired".
export const getMe = () => request("/users/me", { skipAuthEvent: true });

export const logout = () => request("/auth/logout", { method: "POST", skipAuthEvent: true });
