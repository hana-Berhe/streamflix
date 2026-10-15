import axios from "axios";
import { fromTmdb } from "../utils/normalizeMovie";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const hasTmdbKey = Boolean(API_KEY && !API_KEY.startsWith("replace_"));

const client = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 10000,
  params: { api_key: API_KEY, language: "en-US" },
});

// type: what to treat results as when TMDB doesn't say (discover/* endpoints).
export const requests = {
  trending: { path: "/trending/all/week" },
  trendingMovies: { path: "/trending/movie/week", type: "movie" },
  trendingTv: { path: "/trending/tv/week", type: "tv" },
  originals: { path: "/discover/tv", params: { with_networks: 213 }, type: "tv" },
  topRated: { path: "/movie/top_rated", type: "movie" },
  popularMovies: { path: "/movie/popular", type: "movie" },
  nowPlaying: { path: "/movie/now_playing", type: "movie" },
  upcoming: { path: "/movie/upcoming", type: "movie" },
  action: { path: "/discover/movie", params: { with_genres: 28 }, type: "movie" },
  comedy: { path: "/discover/movie", params: { with_genres: 35 }, type: "movie" },
  horror: { path: "/discover/movie", params: { with_genres: 27 }, type: "movie" },
  romance: { path: "/discover/movie", params: { with_genres: 10749 }, type: "movie" },
  sciFi: { path: "/discover/movie", params: { with_genres: 878 }, type: "movie" },
  thriller: { path: "/discover/movie", params: { with_genres: 53 }, type: "movie" },
  documentaries: { path: "/discover/movie", params: { with_genres: 99 }, type: "movie" },
  popularTv: { path: "/tv/popular", type: "tv" },
  topRatedTv: { path: "/tv/top_rated", type: "tv" },
  onTheAir: { path: "/tv/on_the_air", type: "tv" },
  tvDrama: { path: "/discover/tv", params: { with_genres: 18 }, type: "tv" },
  tvComedy: { path: "/discover/tv", params: { with_genres: 35 }, type: "tv" },
  tvCrime: { path: "/discover/tv", params: { with_genres: 80 }, type: "tv" },
  tvSciFi: { path: "/discover/tv", params: { with_genres: 10765 }, type: "tv" },
  tvAnimation: { path: "/discover/tv", params: { with_genres: 16 }, type: "tv" },
};

export const languageRequest = (code, type) => ({
  path: `/discover/${type}`,
  params: { with_original_language: code, sort_by: "popularity.desc", "vote_count.gte": 50 },
  type,
});

const isTitle = (r) => r.poster_path && (!r.media_type || r.media_type === "movie" || r.media_type === "tv");

export const fetchRow = async ({ path, params, type }) => {
  const { data } = await client.get(path, { params });
  return (data.results || []).filter(isTitle).map((r) => fromTmdb(r, type));
};

const pickTrailer = (videos = []) => {
  const youtube = videos.filter((v) => v.site === "YouTube");
  const pick =
    youtube.find((v) => v.type === "Trailer" && v.official) ||
    youtube.find((v) => v.type === "Trailer") ||
    youtube.find((v) => v.type === "Teaser") ||
    youtube[0];
  return pick?.key || null;
};

const pickCertification = (data, mediaType) => {
  if (mediaType === "tv") {
    return data.content_ratings?.results?.find((r) => r.iso_3166_1 === "US")?.rating || null;
  }
  const us = data.release_dates?.results?.find((r) => r.iso_3166_1 === "US");
  return us?.release_dates?.find((d) => d.certification)?.certification || null;
};

const detailsCache = new Map();

export const fetchDetails = async (movie) => {
  const cacheKey = `${movie.mediaType}:${movie.id}`;
  if (detailsCache.has(cacheKey)) return detailsCache.get(cacheKey);

  const append =
    movie.mediaType === "tv"
      ? "videos,credits,similar,content_ratings"
      : "videos,credits,similar,release_dates";

  const { data } = await client.get(`/${movie.mediaType}/${movie.id}`, {
    params: { append_to_response: append },
  });

  const details = {
    ...fromTmdb(data, movie.mediaType),
    genres: (data.genres || []).map((g) => g.name),
    tagline: data.tagline || "",
    runtime: data.runtime || data.episode_run_time?.[0] || null,
    seasons: data.number_of_seasons || null,
    maturity: pickCertification(data, movie.mediaType),
    cast: (data.credits?.cast || []).slice(0, 6).map((c) => c.name),
    creators: (data.created_by || []).map((c) => c.name),
    directors: (data.credits?.crew || []).filter((c) => c.job === "Director").map((c) => c.name),
    trailerKey: pickTrailer(data.videos?.results),
    similar: (data.similar?.results || [])
      .filter(isTitle)
      .slice(0, 12)
      .map((r) => fromTmdb(r, movie.mediaType)),
  };

  detailsCache.set(cacheKey, details);
  return details;
};

export const fetchTrailerKey = async (movie) => {
  const cached = detailsCache.get(`${movie.mediaType}:${movie.id}`);
  if (cached) return cached.trailerKey;
  const { data } = await client.get(`/${movie.mediaType}/${movie.id}/videos`);
  return pickTrailer(data.results);
};

export const searchTitles = async (query) => {
  const { data } = await client.get("/search/multi", {
    params: { query, include_adult: false },
  });
  return (data.results || []).filter(isTitle).map((r) => fromTmdb(r));
};

export const fetchRecommendations = async (movie) => {
  const { data } = await client.get(`/${movie.mediaType}/${movie.id}/recommendations`);
  return (data.results || []).filter(isTitle).map((r) => fromTmdb(r, movie.mediaType));
};

/** Finds the TMDB entry for a title suggested by the AI. */
export const findTitle = async ({ title, year, mediaType }) => {
  const yearParam = mediaType === "tv" ? "first_air_date_year" : "primary_release_year";

  if (year) {
    const { data } = await client.get(`/search/${mediaType}`, {
      params: { query: title, [yearParam]: year },
    });
    const hit = (data.results || []).find(isTitle);
    if (hit) return fromTmdb(hit, mediaType);
  }

  // The model sometimes gets the year or the movie/TV type wrong: retry loosely.
  const { data } = await client.get("/search/multi", { params: { query: title } });
  const hit = (data.results || []).find(isTitle);
  return hit ? fromTmdb(hit) : null;
};
