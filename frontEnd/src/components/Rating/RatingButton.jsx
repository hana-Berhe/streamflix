import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegThumbsDown, FaRegThumbsUp, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { RATING, rateTitle, selectRating } from "../../features/ratings/ratingsSlice";
import circle from "./CircleButton.module.css";
import styles from "./RatingButton.module.css";

const DoubleThumbs = ({ filled }) => {
  const Icon = filled ? FaThumbsUp : FaRegThumbsUp;
  return (
    <span className={styles.double} aria-hidden="true">
      <Icon />
      <Icon />
    </span>
  );
};

const OPTIONS = [
  {
    value: RATING.NOT_FOR_ME,
    label: "Not for me",
    icon: (active) => (active ? <FaThumbsDown /> : <FaRegThumbsDown />),
  },
  {
    value: RATING.LIKE,
    label: "I like this",
    icon: (active) => (active ? <FaThumbsUp /> : <FaRegThumbsUp />),
  },
  {
    value: RATING.LOVE,
    label: "Love this!",
    icon: (active) => <DoubleThumbs filled={active} />,
  },
];

/**
 * Netflix-style rating: a thumbs button that expands into
 * "Not for me" / "I like this" / "Love this!" on hover or tap.
 * Choosing the active option again clears the rating.
 */
function RatingButton({ movie, size = "md" }) {
  const dispatch = useDispatch();
  const rating = useSelector(selectRating(movie));
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const current = OPTIONS.find((o) => o.value === rating);

  const choose = (e, value) => {
    e.stopPropagation();
    dispatch(rateTitle(movie, rating === value ? null : value));
    setOpen(false);
  };

  return (
    <div
      className={`${styles.wrap} ${size === "lg" ? styles.large : ""}`}
      onMouseEnter={() => {
        clearTimeout(closeTimer.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        closeTimer.current = setTimeout(() => setOpen(false), 150);
      }}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <button
        type="button"
        className={`${circle.circle} ${size === "lg" ? circle.large : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-label={current ? `Rated: ${current.label}. Change rating` : "Rate this title"}
        aria-expanded={open}
      >
        {current ? current.icon(true) : <FaRegThumbsUp />}
      </button>

      {open && (
        <div className={styles.pill} role="group" aria-label="Rate this title">
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={styles.option}
              data-label={option.label}
              aria-label={option.label}
              aria-pressed={rating === option.value}
              onClick={(e) => choose(e, option.value)}
            >
              {option.icon(rating === option.value)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default RatingButton;
