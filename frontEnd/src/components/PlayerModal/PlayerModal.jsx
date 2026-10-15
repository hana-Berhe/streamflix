import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
import { closePlayer } from "../../features/ui/uiSlice";
import { fetchTrailerKey, hasTmdbKey } from "../../services/tmdb";
import useModalBehavior from "../../hooks/useModalBehavior";
import styles from "./PlayerModal.module.css";

/**
 * Full-screen player opened by every Play button.
 * Local titles play their bundled clip; TMDB titles play the official YouTube trailer.
 */
function PlayerModal() {
  const dispatch = useDispatch();
  const movie = useSelector((state) => state.ui.playing);
  const [trailer, setTrailer] = useState({ status: "idle", key: null });

  const close = () => dispatch(closePlayer());
  const backRef = useModalBehavior(Boolean(movie), close);

  useEffect(() => {
    if (!movie || movie.previewVideo) return undefined;

    if (movie.source !== "tmdb" || !hasTmdbKey) {
      setTrailer({ status: "none", key: null });
      return undefined;
    }

    let cancelled = false;
    setTrailer({ status: "loading", key: null });
    fetchTrailerKey(movie)
      .then((key) => !cancelled && setTrailer({ status: key ? "ready" : "none", key }))
      .catch(() => !cancelled && setTrailer({ status: "none", key: null }));

    return () => {
      cancelled = true;
    };
  }, [movie]);

  if (!movie) return null;

  let content;
  if (movie.previewVideo) {
    content = (
      <video
        className={styles.screen}
        src={movie.previewVideo}
        poster={movie.backdrop || movie.poster}
        autoPlay
        controls
        playsInline
      />
    );
  } else if (trailer.status === "ready") {
    content = (
      <iframe
        className={styles.screen}
        src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1`}
        title={`${movie.title} trailer`}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    );
  } else {
    content = (
      <div className={styles.empty}>
        {(movie.backdrop || movie.poster) && (
          <img className={styles.emptyImage} src={movie.backdrop || movie.poster} alt="" />
        )}
        <p className={styles.emptyText}>
          {trailer.status === "loading" ? "Loading trailer…" : "No trailer is available for this title."}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.player} role="dialog" aria-modal="true" aria-label={`Playing ${movie.title}`}>
      <div className={styles.topBar}>
        <button ref={backRef} type="button" className={styles.back} onClick={close} aria-label="Back to browse">
          <FaArrowLeft />
        </button>
        <span className={styles.nowPlaying}>{movie.title}</span>
      </div>
      {content}
    </div>
  );
}

export default PlayerModal;
