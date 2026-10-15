import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FaInfoCircle, FaPlay } from "react-icons/fa";
import { openDetails, openPlayer } from "../../features/ui/uiSlice";
import { fetchRow, hasTmdbKey } from "../../services/tmdb";
import { localTitles } from "../../utils/normalizeMovie";
import styles from "./Banner.module.css";

const truncate = (text, max) => (text && text.length > max ? `${text.slice(0, max - 1)}…` : text);

/**
 * Hero billboard. Picks a random title from `request` that has a backdrop
 * and a description; uses `fallback` (default: first local title) otherwise.
 */
function Banner({ request, fallback = localTitles[0] }) {
  const dispatch = useDispatch();
  const [movie, setMovie] = useState(hasTmdbKey && request ? null : fallback);

  useEffect(() => {
    if (!hasTmdbKey || !request) {
      setMovie(fallback);
      return undefined;
    }

    let cancelled = false;
    fetchRow(request)
      .then((results) => {
        const candidates = results.filter((m) => m.backdrop && m.overview);
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        if (!cancelled) setMovie(pick || fallback);
      })
      .catch(() => !cancelled && setMovie(fallback));

    return () => {
      cancelled = true;
    };
    // fallback is a stable default per page; re-run only when the request changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  if (!movie) return <section className={`${styles.banner} ${styles.loading}`} aria-busy="true" />;

  const image = movie.backdrop?.replace("/w1280/", "/original/") || movie.poster;

  return (
    <section className={styles.banner} aria-label={`Featured: ${movie.title}`}>
      <img className={styles.image} src={image} alt="" />
      <div className={styles.shadeLeft} />
      <div className={styles.shadeBottom} />

      <div className={styles.content}>
        <h1 className={styles.title}>{movie.title}</h1>
        {movie.overview && <p className={styles.overview}>{truncate(movie.overview, 160)}</p>}

        <div className={styles.buttons}>
          <button type="button" className={styles.play} onClick={() => dispatch(openPlayer(movie))}>
            <FaPlay aria-hidden="true" /> Play
          </button>
          <button type="button" className={styles.info} onClick={() => dispatch(openDetails(movie))}>
            <FaInfoCircle aria-hidden="true" /> More Info
          </button>
        </div>
      </div>

      {movie.maturity && <span className={styles.maturity}>{movie.maturity}</span>}
    </section>
  );
}

export default Banner;
