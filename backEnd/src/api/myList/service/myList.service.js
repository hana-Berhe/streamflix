import { safeExecute } from "../../../../schema/db.config.js";

export const getMyListService = async (userId) => {
  const sql = `
    SELECT
      movie_id AS movieId,
      source,
      media_type AS mediaType,
      title,
      poster_path AS posterPath,
      backdrop_path AS backdropPath
    FROM my_list
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;
  return safeExecute(sql, [userId]);
};

// INSERT IGNORE: adding the same title twice is not an error
export const addToMyListService = async (userId, item) => {
  const sql = `
    INSERT IGNORE INTO my_list
      (user_id, movie_id, source, media_type, title, poster_path, backdrop_path)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  await safeExecute(sql, [
    userId,
    item.movieId,
    item.source,
    item.mediaType,
    item.title,
    item.posterPath,
    item.backdropPath,
  ]);
};

export const removeFromMyListService = async (userId, source, movieId) => {
  await safeExecute(
    "DELETE FROM my_list WHERE user_id = ? AND source = ? AND movie_id = ?",
    [userId, source, movieId],
  );
};
