import { useDispatch, useSelector } from "react-redux";
import { FaCheck, FaPlus } from "react-icons/fa";
import { selectIsInMyList, toggleMyList } from "../../features/myList/myListSlice";
import styles from "../Rating/CircleButton.module.css";

function MyListButton({ movie, size = "md" }) {
  const dispatch = useDispatch();
  const inList = useSelector(selectIsInMyList(movie));
  const label = inList ? "Remove from My List" : "Add to My List";

  return (
    <button
      type="button"
      className={`${styles.circle} ${size === "lg" ? styles.large : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(toggleMyList(movie));
      }}
      aria-label={label}
      title={label}
      aria-pressed={inList}
    >
      {inList ? <FaCheck /> : <FaPlus />}
    </button>
  );
}

export default MyListButton;
