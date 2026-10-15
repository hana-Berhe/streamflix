import { HiSparkles } from "react-icons/hi2";
import { titleKey } from "../../utils/normalizeMovie";
import Card from "../Card/Card";
import styles from "./TitleGrid.module.css";

/** Wrapping grid of titles (search results, My List, For You). */
function TitleGrid({ items, showReasons = false }) {
  return (
    <ul className={styles.grid}>
      {items.map((movie) => (
        <li key={titleKey(movie)} className={styles.item}>
          <Card movie={movie} />
          {showReasons && movie.reason && (
            <p className={styles.reason}>
              <HiSparkles aria-hidden="true" />
              <span>{movie.reason}</span>
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

export default TitleGrid;
