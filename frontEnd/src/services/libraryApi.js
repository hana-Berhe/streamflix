import { json, request } from "./http";

// ---- My List ----
export const getMyList = () => request("/my-list");

export const addToMyList = (payload) =>
  request("/my-list", { method: "POST", body: json(payload) });

export const removeFromMyList = (source, movieId) =>
  request(`/my-list/${source}/${movieId}`, { method: "DELETE" });

// ---- Ratings (-1 Not for me, 1 I like this, 2 Love this!) ----
export const getRatings = () => request("/ratings");

export const rateTitle = (payload) =>
  request("/ratings", { method: "PUT", body: json(payload) });

export const removeRating = (source, movieId) =>
  request(`/ratings/${source}/${movieId}`, { method: "DELETE" });
