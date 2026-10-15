import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlay, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import { closeDetails, openDetails, openPlayer } from "../../features/ui/uiSlice";
import { selectIsInMyList, toggleMyList } from "../../features/myList/myListSlice";
import { fetchDetails, hasTmdbKey } from "../../services/tmdb";
import { formatRuntime, localTitles, titleKey } from "../../utils/normalizeMovie";
import useModalBehavior from "../../hooks/useModalBehavior";
import MyListButton from "../MyListButton/MyListButton";
import RatingButton from "../Rating/RatingButton";
import circle from "../Rating/CircleButton.module.css";
import styles from "./DetailsModal.module.css";

const localDetails = (movie) => ({
  ...movie,
  cast: [],
  creators: [],
  directors: [],
  similar: localTitles.filter(
    (m) => titleKey(m) !== titleKey(movie) && m.genres.some((g) => movie.genres.includes(g)),
  ),
});

function SimilarCard({ movie }) {
  const dispatch = useDispatch();
  const inList = useSelector(selectIsInMyList(movie));

  return (
    <li className={styles.similar}>
      <button
        type="button"
        className={styles.similarMedia}
        onClick={() => dispatch(openDetails(movie))}
        aria-label={`${movie.title}. Open details`}
      >
        {(movie.backdrop || movie.poster) && <img src={movie.backdrop || movie.poster} alt="" loading="lazy" />}
        <span className={styles.similarTitle}>{movie.title}</span>
      </button>
      <div className={styles.similarBody}>
        <div className={styles.similarMeta}>
          <div>
            {movie.voteAverage ? (
              <span className={styles.match}>{Math.round(movie.voteAverage * 10)}% match</span>
            ) : null}
            {movie.year && <span className={styles.year}>{movie.year}</span>}
          </div>
          <button
            type="button"
            className={circle.circle}
            onClick={() => dispatch(toggleMyList(movie))}
            aria-label={inList ? `Remove ${movie.title} from My List` : `Add ${movie.title} to My List`}
            aria-pressed={inList}
          >
            {inList ? <FaCheck /> : <FaPlus />}
          </button>
        </div>
        {movie.overview && <p className={styles.similarOverview}>{movie.overview}</p>}
      </div>
    </li>
  );
}

/** The "More info" modal: details, cast, rating, My List, and "More like this". */
function DetailsModal() {
  const dispatch = useDispatch();
  const movie = useSelector((state) => state.ui.details);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const dialogRef = useRef(null);

  const close = () => dispatch(closeDetails());
  const closeRef = useModalBehavior(Boolean(movie), close);

  useEffect(() => {
    if (!movie) {
      setDetails(null);
      return undefined;
    }

    dialogRef.current?.scrollTo({ top: 0 });
    setError("");

    if (movie.source !== "tmdb" || !hasTmdbKey) {
      setDetails(localDetails(movie));
      return undefined;
    }

    let cancelled = false;
    setDetails({ ...movie, similar: [], cast: [], creators: [], directors: [], loading: true });
    fetchDetails(movie)
      .then((data) => !cancelled && setDetails({ ...data, reason: movie.reason }))
      .catch(() => {
        if (cancelled) return;
        setDetails({ ...movie, similar: [], cast: [], creators: [], directors: [] });
        setError("Some details couldn't be loaded.");
      });

    return () => {
      cancelled = true;
    };
  }, [movie]);

  if (!movie || !details) return null;

  const d = details;
  const length = d.mediaType === "tv" && d.seasons
    ? `${d.seasons} Season${d.seasons > 1 ? "s" : ""}`
    : formatRuntime(d.runtime);
  const people = d.mediaType === "tv" ? d.creators : d.directors;

  return (
    <div className={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
      >
        <div className={styles.hero}>
          {(d.backdrop || d.poster) && (
            <img
              className={styles.heroImage}
              src={d.backdrop?.replace("/w1280/", "/original/") || d.poster}
              alt=""
            />
          )}
          <div className={styles.heroShade} />
          <button ref={closeRef} type="button" className={styles.close} onClick={close} aria-label="Close">
            <FaTimes />
          </button>

          <div className={styles.heroContent}>
            <h2 id="details-title" className={styles.title}>{d.title}</h2>
            <div className={styles.heroActions}>
              <button type="button" className={styles.play} onClick={() => dispatch(openPlayer(d))}>
                <FaPlay aria-hidden="true" /> Play
              </button>
              <MyListButton movie={movie} size="lg" />
              <RatingButton movie={movie} size="lg" />
            </div>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.columns}>
            <div>
              <div className={styles.meta}>
                {d.voteAverage ? (
                  <span className={styles.match}>{Math.round(d.voteAverage * 10)}% match</span>
                ) : null}
                {d.year && <span>{d.year}</span>}
                {length && <span>{length}</span>}
                <span className={styles.box}>HD</span>
              </div>
              {d.maturity && (
                <div className={styles.maturityLine}>
                  <span className={styles.box}>{d.maturity}</span>
                </div>
              )}
              {d.reason && <p className={styles.reason}>{d.reason}</p>}
              {d.tagline && <p className={styles.tagline}>{d.tagline}</p>}
              <p className={styles.overview}>
                {d.overview || (d.loading ? "" : "No description is available for this title.")}
              </p>
              {error && <p className={styles.error}>{error}</p>}
            </div>

            <dl className={styles.facts}>
              {d.cast?.length > 0 && (
                <div>
                  <dt>Cast:</dt>
                  <dd>{d.cast.slice(0, 3).join(", ")}</dd>
                </div>
              )}
              {d.genres?.length > 0 && (
                <div>
                  <dt>Genres:</dt>
                  <dd>{d.genres.join(", ")}</dd>
                </div>
              )}
            </dl>
          </div>

          {d.similar?.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>More like this</h3>
              <ul className={styles.similarGrid}>
                {d.similar.map((m) => (
                  <SimilarCard key={titleKey(m)} movie={m} />
                ))}
              </ul>
            </section>
          )}

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              About <strong>{d.title}</strong>
            </h3>
            <dl className={styles.about}>
              {people?.length > 0 && (
                <div>
                  <dt>{d.mediaType === "tv" ? "Creators:" : "Director:"}</dt>
                  <dd>{people.join(", ")}</dd>
                </div>
              )}
              {d.cast?.length > 0 && (
                <div>
                  <dt>Cast:</dt>
                  <dd>{d.cast.join(", ")}</dd>
                </div>
              )}
              {d.genres?.length > 0 && (
                <div>
                  <dt>Genres:</dt>
                  <dd>{d.genres.join(", ")}</dd>
                </div>
              )}
              {d.maturity && (
                <div>
                  <dt>Maturity rating:</dt>
                  <dd>
                    <span className={styles.box}>{d.maturity}</span>
                  </dd>
                </div>
              )}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}

export default DetailsModal;
