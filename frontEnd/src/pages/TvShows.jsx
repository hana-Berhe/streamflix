import Banner from "../components/Banner/Banner";
import Row from "../components/Row/Row";
import { requests } from "../services/tmdb";
import { localTitles } from "../utils/normalizeMovie";
import page from "../styles/page.module.css";

const series = localTitles.filter((m) => m.mediaType === "tv");

function TvShows() {
  return (
    <main>
      <Banner request={requests.popularTv} fallback={series[0]} />
      <div className={page.rows}>
        <Row title="Top 10 TV Shows This Week" request={requests.trendingTv} fallback={series} variant="top10" />
        <Row title="Popular on StreamFlex" request={requests.popularTv} fallback={series} />
        <Row title="Original Series" request={requests.originals} />
        <Row title="Critically Acclaimed TV" request={requests.topRatedTv} />
        <Row title="Airing This Week" request={requests.onTheAir} />
        <Row title="TV Dramas" request={requests.tvDrama} fallback={series.filter((m) => m.genres.includes("Drama"))} />
        <Row title="TV Comedies" request={requests.tvComedy} />
        <Row title="Crime TV Shows" request={requests.tvCrime} />
        <Row title="Sci-Fi & Fantasy TV" request={requests.tvSciFi} />
        <Row title="Animation" request={requests.tvAnimation} />
      </div>
    </main>
  );
}

export default TvShows;
