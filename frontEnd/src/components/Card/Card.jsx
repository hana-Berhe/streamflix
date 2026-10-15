import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { openDetails } from "../../features/ui/uiSlice";
import PreviewCard from "./PreviewCard";
import styles from "./Card.module.css";

const HOVER_DELAY = 450; // Netflix waits a beat before expanding a title

const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * A title in a row or grid. Hover (on desktop) opens an expanded preview;
 * click or Enter opens the full "More info" modal.
 */
function Card({ movie, layout = "poster" }) {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const timer = useRef(null);
  const [anchor, setAnchor] = useState(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const startPreview = () => {
    if (!canHover()) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (ref.current) setAnchor(ref.current.getBoundingClientRect());
    }, HOVER_DELAY);
  };

  const image =
    layout === "backdrop" ? movie.backdrop || movie.poster : movie.poster || movie.backdrop;

  return (
    <>
      <button
        ref={ref}
        type="button"
        className={`${styles.card} ${layout === "backdrop" ? styles.landscape : ""}`}
        onMouseEnter={startPreview}
        onMouseLeave={() => clearTimeout(timer.current)}
        onClick={() => dispatch(openDetails(movie))}
        aria-label={`${movie.title}. Open details`}
      >
        {image ? (
          <img className={styles.image} src={image} alt="" loading="lazy" draggable="false" />
        ) : (
          <span className={styles.noImage}>{movie.title}</span>
        )}
        {layout === "backdrop" && <span className={styles.caption}>{movie.title}</span>}
        {movie.badge && <span className={styles.badge}>{movie.badge}</span>}
      </button>

      {anchor && <PreviewCard movie={movie} anchor={anchor} onClose={() => setAnchor(null)} />}
    </>
  );
}

export default Card;
