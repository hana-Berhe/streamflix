import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { FaChevronDown, FaPlay } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { openDetails, openPlayer } from "../../features/ui/uiSlice";
import MyListButton from "../MyListButton/MyListButton";
import RatingButton from "../Rating/RatingButton";
import circle from "../Rating/CircleButton.module.css";
import styles from "./PreviewCard.module.css";

const EDGE = 16;

/**
 * The expanded card Netflix shows on hover. Rendered in a portal so it can
 * grow past the row's overflow clipping, centred on the original card.
 */
function PreviewCard({ movie, anchor, onClose }) {
  const dispatch = useDispatch();
  const entered = useRef(false);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  const viewport = document.documentElement.clientWidth;
  const width = Math.min(Math.max(anchor.width * 1.55, 300), viewport - EDGE * 2);
  const left = Math.min(Math.max(anchor.left + anchor.width / 2 - width / 2, EDGE), viewport - width - EDGE);
  const top = anchor.top + window.scrollY + anchor.height / 2;
  const origin =
    left <= EDGE ? "left center" : left >= viewport - width - EDGE ? "right center" : "center center";

  useEffect(() => {
    // If the pointer already left before the preview appeared, don't leave it hanging.
    const timer = setTimeout(() => !entered.current && closeRef.current(), 350);
    const close = () => closeRef.current();
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, []);

  const play = () => {
    dispatch(openPlayer(movie));
    onClose();
  };

  const moreInfo = () => {
    dispatch(openDetails(movie));
    onClose();
  };

  const match = movie.voteAverage ? Math.round(movie.voteAverage * 10) : null;
  const media = movie.backdrop || movie.poster;

  return createPortal(
    <div
      className={styles.preview}
      style={{ top, left, width, transformOrigin: origin }}
      onMouseEnter={() => {
        entered.current = true;
      }}
      onMouseLeave={onClose}
    >
      <button type="button" className={styles.media} onClick={moreInfo} aria-label={`${movie.title}. Open details`}>
        {movie.previewVideo ? (
          <video
            className={styles.mediaImg}
            src={movie.previewVideo}
            poster={media}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : media ? (
          <img className={styles.mediaImg} src={media} alt="" />
        ) : null}
        <span className={styles.mediaTitle}>{movie.title}</span>
      </button>

      <div className={styles.info}>
        <div className={styles.actions}>
          <button
            type="button"
            className={`${circle.circle} ${circle.primary}`}
            onClick={play}
            aria-label={`Play ${movie.title}`}
          >
            <FaPlay />
          </button>
          <MyListButton movie={movie} />
          <RatingButton movie={movie} />
          <button
            type="button"
            className={`${circle.circle} ${styles.more}`}
            onClick={moreInfo}
            aria-label="More info"
            title="More info"
          >
            <FaChevronDown />
          </button>
        </div>

        <div className={styles.meta}>
          {match !== null && (
            <span className={styles.match} title="Audience score from TMDB">
              {match}% match
            </span>
          )}
          {movie.maturity && <span className={styles.box}>{movie.maturity}</span>}
          {movie.year && <span>{movie.year}</span>}
          <span className={styles.box}>HD</span>
        </div>

        {movie.genres?.length > 0 && (
          <ul className={styles.genres}>
            {movie.genres.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        )}

        {movie.reason && (
          <p className={styles.reason}>
            <HiSparkles aria-hidden="true" /> {movie.reason}
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default PreviewCard;
