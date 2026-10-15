/** Shape returned to the client for My List and ratings rows (snake_case DB → camelCase API). */
export const toClientTitle = (row) => ({
  movieId: row.movie_id,
  source: row.source,
  mediaType: row.media_type,
  title: row.title,
  posterPath: row.poster_path,
  backdropPath: row.backdrop_path,
});
