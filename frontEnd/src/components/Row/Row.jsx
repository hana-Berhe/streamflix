import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import useTmdbRow from "../../hooks/useTmdbRow";
import { titleKey } from "../../utils/normalizeMovie";
import Card from "../Card/Card";
import styles from "./Row.module.css";

const POSTER_BREAKPOINTS = {
  0: { slidesPerView: 2.3, slidesPerGroup: 2 },
  500: { slidesPerView: 3.3, slidesPerGroup: 3 },
  800: { slidesPerView: 4.3, slidesPerGroup: 4 },
  1100: { slidesPerView: 5.3, slidesPerGroup: 5 },
  1400: { slidesPerView: 6.3, slidesPerGroup: 6 },
};

const TOP10_BREAKPOINTS = {
  0: { slidesPerView: 1.6, slidesPerGroup: 1 },
  500: { slidesPerView: 2.4, slidesPerGroup: 2 },
  800: { slidesPerView: 3.4, slidesPerGroup: 3 },
  1100: { slidesPerView: 4.4, slidesPerGroup: 4 },
  1400: { slidesPerView: 5.4, slidesPerGroup: 5 },
};

/**
 * A horizontal row of titles.
 * Pass `request` (+ optional `fallback`) to load from TMDB, or `items` to render a list you already have.
 * variant="top10" renders the big rank numbers.
 */
function Row({ title, request, fallback, items, loading: loadingProp = false, variant, action }) {
  const live = useTmdbRow(items ? null : request, fallback);
  const isTop10 = variant === "top10";

  let movies = items ?? live.movies;
  const loading = items ? loadingProp : live.loading;
  if (isTop10) movies = movies.slice(0, 10);

  if (!loading && !movies.length) return null;

  return (
    <section className={styles.row} aria-label={title}>
      <div className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        {action}
      </div>

      {loading ? (
        <div className={styles.skeletons} aria-hidden="true">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      ) : (
        <Swiper
          className={styles.swiper}
          modules={[Navigation]}
          navigation
          spaceBetween={isTop10 ? 4 : 8}
          breakpoints={isTop10 ? TOP10_BREAKPOINTS : POSTER_BREAKPOINTS}
          watchOverflow
        >
          {movies.map((movie, index) => (
            <SwiperSlide key={titleKey(movie)}>
              {isTop10 ? (
                <div className={styles.top10}>
                  <span className={styles.rank} aria-label={`Number ${index + 1}`}>
                    {index + 1}
                  </span>
                  <div className={styles.top10Card}>
                    <Card movie={movie} />
                  </div>
                </div>
              ) : (
                <Card movie={movie} />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}

export default Row;
