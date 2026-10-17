import { safeExecute } from "../../../../schema/db.config.js";

export const getRatingsService = async (userId) => {
  const sql = `
    SELECT
      movie_id AS movieId,
      source,
      media_type AS mediaType,
      title,
      poster_path AS posterPath,
      backdrop_path AS backdropPath,
      rating
    FROM ratings
    WHERE user_id = ?
    ORDER BY updated_at DESC
  `;
  return safeExecute(sql, [userId]);
};

// Adds a new rating, or updates it if the user already rated this title
export const rateTitleService = async (userId, item) => {
  const sql = `
    INSERT INTO ratings
      (user_id, movie_id, source, media_type, title, poster_path, backdrop_path, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      rating = VALUES(rating),
      title = VALUES(title),
      poster_path = VALUES(poster_path),
      backdrop_path = VALUES(backdrop_path)
  `;
  await safeExecute(sql, [
    userId,
    item.movieId,
    item.source,
    item.mediaType,
    item.title,
    item.posterPath,
    item.backdropPath,
    item.rating,
  ]);
};

export const removeRatingService = async (userId, source, movieId) => {
  await safeExecute(
    "DELETE FROM ratings WHERE user_id = ? AND source = ? AND movie_id = ?",
    [userId, source, movieId],
  );
};
