import { movies as localMovies } from "../data/Data";
import bannerImage from "../assets/images/banner.jpeg";

export const POSTER_BASE = "https://image.tmdb.org/t/p/w500";
export const BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";
export const ORIGINAL_BASE = "https://image.tmdb.org/t/p/original";

const GENRES = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
  10759: "Action & Adventure", 10762: "Kids", 10763: "News", 10764: "Reality",
  10765: "Sci-Fi & Fantasy", 10766: "Soap", 10767: "Talk", 10768: "War & Politics",
};

/**
 * Every component works with this one shape, whether the title came from
 * TMDB, the bundled local data, or a saved My List / rating row.
 *
 * { id, source, mediaType, title, overview, poster, backdrop, year,
 *   voteAverage, maturity, genres, badge, previewVideo }
 */
export const titleKey = (movie) => `${movie.source}:${movie.id}`;

export const fromTmdb = (item, typeHint) => {
  const mediaType =
    item.media_type === "tv" || item.media_type === "movie"
      ? item.media_type
      : typeHint || (item.first_air_date !== undefined ? "tv" : "movie");
  const date = item.release_date || item.first_air_date || "";
  const genreIds = item.genre_ids || item.genres?.map((g) => g.id) || [];

  return {
    id: item.id,
    source: "tmdb",
    mediaType,
    title: item.title || item.name || "Untitled",
    overview: item.overview || "",
    poster: item.poster_path ? `${POSTER_BASE}${item.poster_path}` : null,
    backdrop: item.backdrop_path ? `${BACKDROP_BASE}${item.backdrop_path}` : null,
    year: date ? Number(date.slice(0, 4)) : null,
    voteAverage: typeof item.vote_average === "number" ? item.vote_average : null,
    maturity: item.adult ? "18+" : null,
    genres: genreIds.map((id) => GENRES[id]).filter(Boolean).slice(0, 3),
    badge: null,
    previewVideo: null,
  };
};

const LOCAL_OVERVIEWS = {
  1: "Follow one family's journey, both in the past and the present day, in the aftermath of the battle between Godzilla and the M.U.T.O.s that revealed the existence of monsters to the world.",
};

export const fromLocal = (m) => ({
  id: m.id,
  source: "local",
  mediaType: m.category === "Series" ? "tv" : "movie",
  title: m.title,
  overview: m.overview || LOCAL_OVERVIEWS[m.id] || "",
  poster: m.poster_path,
  backdrop: m.id === 1 ? bannerImage : m.poster_path,
  year: m.year || null,
  voteAverage: null,
  maturity: m.matureRating || null,
  genres: m.genres || [],
  badge: m.badge || null,
  previewVideo: m.previewVideo || null,
});

export const localTitles = localMovies.map(fromLocal);

export const findLocal = (id) => localTitles.find((m) => m.id === id) || null;

/** Turns a My List / ratings row from the API back into a title. */
export const fromSaved = (item) => {
  if (item.source === "local") {
    const local = findLocal(item.movieId);
    if (local) return local;
  }

  return {
    id: item.movieId,
    source: item.source,
    mediaType: item.mediaType,
    title: item.title,
    overview: "",
    poster: item.posterPath,
    backdrop: item.backdropPath,
    year: null,
    voteAverage: null,
    maturity: null,
    genres: [],
    badge: null,
    previewVideo: null,
  };
};

/** Snapshot sent to the backend when saving or rating a title. */
export const toPayload = (movie) => ({
  movieId: movie.id,
  source: movie.source,
  mediaType: movie.mediaType,
  title: movie.title,
  // Local images are bundled by Vite and get new URLs each build, so only TMDB URLs are stored.
  posterPath: movie.source === "tmdb" ? movie.poster : null,
  backdropPath: movie.source === "tmdb" ? movie.backdrop : null,
});

export const formatRuntime = (minutes) => {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};
