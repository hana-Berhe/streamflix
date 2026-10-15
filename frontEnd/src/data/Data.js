import KillerSally from "../assets/images/10061.jpg";
import Pepsi from "../assets/images/10066.jpg";
import FitForTv from "../assets/images/10067.jpg";
import champion from "../assets/images/10079.jpg";
import TheArt from "../assets/images/10072.jpg";
import coldStorage from "../assets/images/coldStorage.webp";
import hamnet from "../assets/images/hamnet.webp";
import hoppers from "../assets/images/hoppers.webp";
import marshals from "../assets/images/marshals.webp";
import monarch from "../assets/images/monarchLegacyOfMonsters.webp";
import pursuit from "../assets/images/pursuitOfJade.webp";
import scream from "../assets/images/scream7.webp";
import TheBride from "../assets/images/TheBride.webp";
import Vladimir from "../assets/images/vladimir.webp";
import YoungSherlock from "../assets/images/youngSherlock.webp";
import WareMachine from "../assets/images/WareMachine.webp";

// Short, silent "Ken Burns" preview clips generated from each poster,
// served from /public/previews so they can be referenced by plain URL
// (movie.id.mp4) without an import per movie.
const previewUrl = (id) => `/previews/${id}.mp4`;

export const movies = [
  {
    id: 1,
    title: "Monarch",
    poster_path: monarch,
    previewVideo: previewUrl(1),
    matureRating: "U/A 16+",
    category: "Series",
    quality: "HD",
    genres: ["Action", "Thriller", "Adventure"],
    badge: "Recently added",
  },
  {
    id: 2,
    previewVideo: previewUrl(2),
    title: "Killer Sally",
    poster_path: KillerSally,
    matureRating: "U/A 16+",
    category: "Movie",
    quality: "HD",
    genres: ["Crime", "Drama", "Thriller"],
    badge: "Recently added",
  },
  {
    id: 3,
    previewVideo: previewUrl(3),
    title: "Pepsi, Where's My Jet?",
    poster_path: Pepsi,
    matureRating: "U/A 16+",
    category: "Movie",
    quality: "HD",
    genres: ["Sci-Fi", "Thriller", "Action"],
    badge: "Recently added",
  },
  {
    id: 4,
    previewVideo: previewUrl(4),
    title: "Fit For Tv",
    poster_path: FitForTv,
    matureRating: "U/A 13+",
    category: "Movie",
    quality: "HD",
    genres: ["Adventure", "Fantasy"],
    badge: "Recently added",
  },
  {
    id: 5,
    previewVideo: previewUrl(5),
    title: "Champion",
    poster_path: champion,
    matureRating: "U/A 13+",
    category: "Movie",
    quality: "HD",
    genres: ["Adventure", "Fantasy"],
    badge: "Top 10",
  },
  {
    id: 6,
    previewVideo: previewUrl(6),
    title: "The Art of Sarah",
    poster_path: TheArt,
    matureRating: "U/A 13+",
    category: "Movie",
    quality: "HD",
    genres: ["Adventure", "Fantasy"],
    badge: "Recently added",
  },
  {
    id: 7,
    previewVideo: previewUrl(7),
    title: "Cold Storage",
    poster_path: coldStorage,
    matureRating: "U/A 13+",
    category: "Movie",
    quality: "HD",
    genres: ["Thriller", "Sci-Fi"],
    badge: "New",
  },
  {
    id: 8,
    previewVideo: previewUrl(8),
    title: "Hamnet",
    poster_path: hamnet,
    matureRating: "U/A 13+",
    category: "Movie",
    quality: "HD",
    genres: ["Drama"],
    badge: "Recently added",
  },
  {
    id: 9,
    previewVideo: previewUrl(9),
    title: "Marshals",
    poster_path: marshals,
    matureRating: "U/A 13+",
    category: "Series",
    quality: "HD",
    genres: ["Crime", "Drama"],
    badge: "Top 10",
  },
  {
    id: 10,
    previewVideo: previewUrl(10),
    title: "Hoppers",
    poster_path: hoppers,
    matureRating: "U/A 7+",
    category: "Movie",
    quality: "HD",
    genres: ["Family", "Animation"],
    badge: "Recently added",
  },
  {
    id: 11,
    previewVideo: previewUrl(11),
    title: "Pursuit of Jade",
    poster_path: pursuit,
    matureRating: "U/A 16+",
    category: "Movie",
    quality: "HD",
    genres: ["Action", "Crime"],
    badge: "New",
  },
  {
    id: 12,
    previewVideo: previewUrl(12),
    title: "Scream 7",
    poster_path: scream,
    matureRating: "A 18+",
    category: "Movie",
    quality: "HD",
    genres: ["Horror", "Thriller"],
    badge: "Top 10",
  },
  {
    id: 13,
    previewVideo: previewUrl(13),
    title: "The Bride",
    poster_path: TheBride,
    matureRating: "U/A 16+",
    category: "Movie",
    quality: "HD",
    genres: ["Horror", "Drama"],
    badge: "Recently added",
  },
  {
    id: 14,
    previewVideo: previewUrl(14),
    title: "Vladimir",
    poster_path: Vladimir,
    matureRating: "U/A 13+",
    category: "Series",
    quality: "HD",
    genres: ["Drama", "Comedy"],
    badge: "New",
  },
  {
    id: 15,
    previewVideo: previewUrl(15),
    title: "Young Sherlock",
    poster_path: YoungSherlock,
    matureRating: "U/A 13+",
    category: "Series",
    quality: "HD",
    genres: ["Mystery", "Adventure"],
    badge: "Recently added",
  },
  {
    id: 16,
    previewVideo: previewUrl(16),
    title: "War Machine",
    poster_path: WareMachine,
    matureRating: "U/A 16+",
    category: "Movie",
    quality: "HD",
    genres: ["Action", "War"],
    badge: "Top 10",
  },
];

// Curated local "rows" so the UI has several rails to scroll even
// without a live TMDB API key configured.
export const localRows = [
  { title: "Trending Now", movies: movies.slice(0, 10) },
  { title: "Originals", movies: [...movies.slice(6, 16), ...movies.slice(0, 2)] },
  { title: "Popular on StreamFlex", movies: [...movies.slice(3, 12), movies[0]] },
  { title: "Top Rated", movies: [...movies.slice(9, 16), ...movies.slice(0, 4)] },
  { title: "Action & Adventure", movies: movies.filter((m) => m.genres.includes("Action") || m.genres.includes("Adventure")) },
  { title: "Continue Watching", movies: [...movies.slice(5, 10), ...movies.slice(11, 16)] },
];
