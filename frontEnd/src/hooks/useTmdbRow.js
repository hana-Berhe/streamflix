import { useEffect, useRef, useState } from "react";
import { fetchRow, hasTmdbKey } from "../services/tmdb";

/**
 * Loads one row from TMDB. Falls back to the bundled local titles when there
 * is no API key or the request fails, so one bad row never blanks the page.
 * `request` must be stable (a constant from tmdb.js, or memoised).
 */
export default function useTmdbRow(request, fallback = []) {
  const fallbackRef = useRef(fallback);
  fallbackRef.current = fallback;

  const live = Boolean(hasTmdbKey && request);
  const [state, setState] = useState({ movies: live ? [] : fallback, loading: live });

  useEffect(() => {
    if (!hasTmdbKey || !request) {
      setState({ movies: fallbackRef.current, loading: false });
      return undefined;
    }

    let cancelled = false;
    setState((s) => ({ ...s, loading: true }));

    fetchRow(request)
      .then((movies) => {
        if (!cancelled) {
          setState({ movies: movies.length ? movies : fallbackRef.current, loading: false });
        }
      })
      .catch((error) => {
        console.warn(`TMDB row ${request.path} failed, using local titles:`, error.message);
        if (!cancelled) setState({ movies: fallbackRef.current, loading: false });
      });

    return () => {
      cancelled = true;
    };
  }, [request]);

  return state;
}
