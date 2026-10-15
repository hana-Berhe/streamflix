import Row from "../components/Row/Row";
import { requests } from "../services/tmdb";
import { localTitles } from "../utils/normalizeMovie";
import page from "../styles/page.module.css";

const byBadge = (badge) => localTitles.filter((m) => m.badge === badge);

function NewPopular() {
  return (
    <main className={page.pageRows}>
      <div className={page.headingRow}>
        <h1 className={page.heading}>New &amp; Popular</h1>
      </div>
      <Row title="New on StreamFlex" request={requests.nowPlaying} fallback={byBadge("New")} />
      <Row title="Top 10 TV Shows This Week" request={requests.trendingTv} fallback={byBadge("Top 10")} variant="top10" />
      <Row title="Coming Soon" request={requests.upcoming} />
      <Row title="Top 10 Movies This Week" request={requests.trendingMovies} variant="top10" />
      <Row title="Worth the Wait" request={requests.onTheAir} fallback={byBadge("Recently added")} />
    </main>
  );
}

export default NewPopular;
