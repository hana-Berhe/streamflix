import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomePicks } from "../../features/ai/aiSlice";
import Row from "../Row/Row";
import styles from "./AiPicksRow.module.css";

/**
 * "Top picks for <name>" — AI suggestions from the user's ratings and My List.
 * Waits until both have loaded, then fetches once per session.
 */
function AiPicksRow() {
  const dispatch = useDispatch();
  const home = useSelector((state) => state.ai.home);
  const ratingsStatus = useSelector((state) => state.ratings.status);
  const listStatus = useSelector((state) => state.myList.status);
  const name = useSelector((state) => state.user.user?.full_name?.split(" ")[0]);

  const ready = ratingsStatus === "succeeded" && listStatus === "succeeded";

  useEffect(() => {
    if (ready && home.status === "idle") dispatch(fetchHomePicks());
  }, [ready, home.status, dispatch]);

  if (home.status === "failed" || (home.status === "succeeded" && !home.items.length)) {
    return null;
  }

  const title =
    home.mode === "fallback" ? home.label : `Top picks for ${name || "you"}`;

  return (
    <Row
      title={title}
      items={home.items}
      loading={!ready || home.status !== "succeeded"}
      action={
        <Link className={styles.more} to="/browse/for-you">
          Ask for something specific
        </Link>
      }
    />
  );
}

export default AiPicksRow;
