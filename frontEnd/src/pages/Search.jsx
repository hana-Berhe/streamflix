import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TitleGrid from "../components/TitleGrid/TitleGrid";
import { hasTmdbKey, searchTitles } from "../services/tmdb";
import { localTitles } from "../utils/normalizeMovie";
import page from "../styles/page.module.css";

const searchLocal = (q) => {
  const needle = q.toLowerCase();
  return localTitles.filter(
    (m) =>
      m.title.toLowerCase().includes(needle) ||
      m.genres.some((g) => g.toLowerCase().includes(needle)),
  );
};

function Search() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const [state, setState] = useState({ items: [], loading: false, error: "" });

  useEffect(() => {
    if (!q) {
      setState({ items: [], loading: false, error: "" });
      return undefined;
    }

    if (!hasTmdbKey) {
      setState({ items: searchLocal(q), loading: false, error: "" });
      return undefined;
    }

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: "" }));
    searchTitles(q)
      .then((items) => !cancelled && setState({ items, loading: false, error: "" }))
      .catch(() => !cancelled && setState({ items: searchLocal(q), loading: false, error: "Search is unavailable right now. Showing matches from this device." }));

    return () => {
      cancelled = true;
    };
  }, [q]);

  return (
    <main className={page.page}>
      {state.error && <p className={page.muted}>{state.error}</p>}

      {state.loading ? null : state.items.length ? (
        <>
          <p className={page.muted} style={{ marginBottom: 24 }}>
            Results for &ldquo;{q}&rdquo;
          </p>
          <TitleGrid items={state.items} />
        </>
      ) : q ? (
        <div className={page.empty}>
          <strong>Your search for &ldquo;{q}&rdquo; did not have any matches.</strong>
          Suggestions:
          <br />
          <ul className={page.emptyList}>
            <li>Try different keywords</li>
            <li>Looking for a movie or TV show?</li>
            <li>Try using a movie, TV show title, or a genre</li>
          </ul>
        </div>
      ) : (
        <p className={page.muted}>Search for a movie, TV show, or genre.</p>
      )}
    </main>
  );
}

export default Search;
