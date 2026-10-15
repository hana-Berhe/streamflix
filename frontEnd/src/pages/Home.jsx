import { useSelector } from "react-redux";
import Banner from "../components/Banner/Banner";
import Row from "../components/Row/Row";
import AiPicksRow from "../components/AiPicks/AiPicksRow";
import { requests } from "../services/tmdb";
import { localTitles } from "../utils/normalizeMovie";
import page from "../styles/page.module.css";

// Local fallbacks used when there's no TMDB key (or a request fails).
const local = {
  top10: localTitles.filter((m) => m.badge === "Top 10").concat(localTitles).slice(0, 10),
  originals: localTitles.slice(6, 16),
  topRated: localTitles.slice(9, 16).concat(localTitles.slice(0, 4)),
  action: localTitles.filter((m) => m.genres.some((g) => ["Action", "Adventure"].includes(g))),
  drama: localTitles.filter((m) => m.genres.includes("Drama")),
  thrills: localTitles.filter((m) => m.genres.some((g) => ["Horror", "Thriller"].includes(g))),
  fresh: localTitles.filter((m) => m.badge === "New" || m.badge === "Recently added"),
};

function Home() {
  const myList = useSelector((state) => state.myList.items);

  return (
    <main>
      <Banner request={requests.originals} />
      <div className={page.rows}>
        <AiPicksRow />
        <Row title="Top 10 This Week" request={requests.trending} fallback={local.top10} variant="top10" />
        {myList.length > 0 && <Row title="My List" items={myList} />}
        <Row title="Originals" request={requests.originals} fallback={local.originals} />
        <Row title="New Releases" request={requests.nowPlaying} fallback={local.fresh} />
        <Row title="Top Rated" request={requests.topRated} fallback={local.topRated} />
        <Row title="Action Movies" request={requests.action} fallback={local.action} />
        <Row title="Comedies" request={requests.comedy} />
        <Row title="Scary Movies" request={requests.horror} fallback={local.thrills} />
        <Row title="Romance" request={requests.romance} />
        <Row title="Documentaries" request={requests.documentaries} />
        <Row title="Dramas" request={requests.tvDrama} fallback={local.drama} />
      </div>
    </main>
  );
}

export default Home;
