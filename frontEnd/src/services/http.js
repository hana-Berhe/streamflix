const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Fired when a protected request comes back 401 (session expired),
// so the browse layout can send the user back to sign in.
export const AUTH_EXPIRED_EVENT = "auth:expired";

export const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && !options.skipAuthEvent) {
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    // Backend error shape: { message, code?, errors?: [{ field, message }], requestId }
    const error = new Error(data.message || "Something went wrong. Try again.");
    error.status = response.status;
    error.code = data.code;
    error.errors = data.errors || [];
    error.requestId = data.requestId;
    throw error;
  }

  return data;
};

export const json = (body) => JSON.stringify(body);
