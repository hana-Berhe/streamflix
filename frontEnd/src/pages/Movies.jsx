import Banner from "../components/Banner/Banner";
import Row from "../components/Row/Row";
import { requests } from "../services/tmdb";
import { localTitles } from "../utils/normalizeMovie";
import page from "../styles/page.module.css";

const films = localTitles.filter((m) => m.mediaType === "movie");
const withGenre = (...genres) => films.filter((m) => m.genres.some((g) => genres.includes(g)));

function Movies() {
  return (
    <main>
      <Banner request={requests.popularMovies} fallback={films[6] || films[0]} />
      <div className={page.rows}>
        <Row title="Top 10 Movies This Week" request={requests.trendingMovies} fallback={films} variant="top10" />
        <Row title="Popular Movies" request={requests.popularMovies} fallback={films} />
        <Row title="In Theaters Now" request={requests.nowPlaying} />
        <Row title="Critically Acclaimed Movies" request={requests.topRated} />
        <Row title="Action & Adventure" request={requests.action} fallback={withGenre("Action", "Adventure")} />
        <Row title="Sci-Fi Movies" request={requests.sciFi} fallback={withGenre("Sci-Fi", "Fantasy")} />
        <Row title="Thrillers" request={requests.thriller} fallback={withGenre("Thriller", "Crime")} />
        <Row title="Comedies" request={requests.comedy} />
        <Row title="Horror Movies" request={requests.horror} fallback={withGenre("Horror")} />
        <Row title="Romantic Movies" request={requests.romance} />
      </div>
    </main>
  );
}

export default Movies;
