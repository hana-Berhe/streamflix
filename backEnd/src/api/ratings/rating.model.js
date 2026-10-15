import db from '../../config/db.js';

export const findByUser = async (userId) => {
  const [rows] = await db.execute(
    `SELECT movie_id, source, media_type, title, poster_path, backdrop_path, rating, updated_at
     FROM ratings
     WHERE user_id = ?
     ORDER BY updated_at DESC`,
    [userId]
  );
  return rows;
};

export const upsert = async (userId, t, rating) => {
  await db.execute(
    `INSERT INTO ratings
       (user_id, movie_id, source, media_type, title, poster_path, backdrop_path, rating)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       rating = VALUES(rating),
       title = VALUES(title),
       poster_path = VALUES(poster_path),
       backdrop_path = VALUES(backdrop_path)`,
    [userId, t.movieId, t.source, t.mediaType, t.title, t.posterPath, t.backdropPath, rating]
  );
};

export const remove = async (userId, source, movieId) => {
  await db.execute('DELETE FROM ratings WHERE user_id = ? AND source = ? AND movie_id = ?', [
    userId,
    source,
    movieId,
  ]);
};
