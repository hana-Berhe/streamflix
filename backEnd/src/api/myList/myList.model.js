import db from '../../config/db.js';

export const findByUser = async (userId) => {
  const [rows] = await db.execute(
    `SELECT movie_id, source, media_type, title, poster_path, backdrop_path, created_at
     FROM my_list
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
};

export const add = async (userId, t) => {
  // INSERT IGNORE makes "add" idempotent: adding twice is not an error.
  await db.execute(
    `INSERT IGNORE INTO my_list
       (user_id, movie_id, source, media_type, title, poster_path, backdrop_path)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, t.movieId, t.source, t.mediaType, t.title, t.posterPath, t.backdropPath]
  );
};

export const remove = async (userId, source, movieId) => {
  await db.execute('DELETE FROM my_list WHERE user_id = ? AND source = ? AND movie_id = ?', [
    userId,
    source,
    movieId,
  ]);
};
