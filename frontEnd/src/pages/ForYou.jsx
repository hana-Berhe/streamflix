import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { HiSparkles } from "react-icons/hi2";
import TitleGrid from "../components/TitleGrid/TitleGrid";
import { getPicks } from "../services/recommendations";
import styles from "./ForYou.module.css";
import page from "../styles/page.module.css";

const IDEAS = [
  "Something funny under two hours",
  "A slow-burn mystery series",
  "Feel-good movie for family night",
  "Mind-bending sci-fi",
  "A Korean thriller",
];

/**
 * AI suggestions page. With an empty request it recommends from the user's
 * ratings and My List; with text it answers that request using the same taste profile.
 */
function ForYou() {
  const ratings = useSelector((state) => state.ratings);
  const myList = useSelector((state) => state.myList);
  const home = useSelector((state) => state.ai.home);
  const name = useSelector((state) => state.user.user?.full_name?.split(" ")[0]);

  const [prompt, setPrompt] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);

  const ready = ratings.status === "succeeded" && myList.status === "succeeded";
  const ratedCount = Object.keys(ratings.byKey).length;

  const run = async (text, { refresh = false } = {}) => {
    const id = ++requestId.current;
    setLoading(true);
    setLastPrompt(text);
    try {
      // "Show different titles" excludes what is already on screen.
      const shown = refresh ? (result?.items || []).map((m) => m.title) : [];
      const data = await getPicks({ ratings, myList, prompt: text, count: 18, exclude: shown });
      if (id === requestId.current) setResult(data);
    } catch {
      if (id === requestId.current) {
        setResult({ items: [], mode: "error", error: "Suggestions couldn't be loaded. Try again." });
      }
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  };

  // First visit: reuse the home-page picks if we already have them (saves an AI call).
  useEffect(() => {
    if (!ready || result) return;
    if (home.status === "succeeded" && home.items.length) setResult(home);
    else run("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const submit = (e) => {
    e.preventDefault();
    run(prompt.trim());
  };

  let body = null;
  if (loading) {
    body = (
      <div className={styles.thinking} role="status">
        <HiSparkles aria-hidden="true" /> Finding titles for you…
      </div>
    );
  } else if (result?.mode === "error") {
    body = <p className={styles.error}>{result.error || "Suggestions couldn't be loaded. Try again."}</p>;
  } else if (result?.mode === "empty" || (result && !result.items.length && !lastPrompt)) {
    body = (
      <div className={page.empty}>
        <strong>Rate a few titles to get personal picks.</strong>
        Use the thumbs button on any title, or add some to My List.
        <br />
        You can also describe what you&apos;re in the mood for above.
      </div>
    );
  } else if (result && !result.items.length) {
    body = (
      <div className={page.empty}>
        <strong>No matching titles found.</strong>
        Try describing it differently.
      </div>
    );
  } else if (result) {
    body = (
      <>
        <div className={styles.resultsHead}>
          <h2 className={styles.resultsTitle}>
            {lastPrompt
              ? `For “${lastPrompt}”`
              : result.mode === "fallback"
                ? result.label
                : `Top picks for ${name || "you"}`}
          </h2>
          <button type="button" className={styles.refresh} onClick={() => run(lastPrompt, { refresh: true })}>
            Show different titles
          </button>
        </div>
        {result.aiUnavailable && (
          <p className={styles.note}>
            AI suggestions aren&apos;t set up on the server yet, so these are based on titles you liked.
          </p>
        )}
        <TitleGrid items={result.items} showReasons />
      </>
    );
  }

  return (
    <main className={page.page}>
      <h1 className={page.heading}>Suggestions for you</h1>
      <p className={page.muted}>
        Picked from your ratings and My List
        {ratedCount ? ` (${ratedCount} rated title${ratedCount === 1 ? "" : "s"})` : ""}. Describe
        what you want to watch and the suggestions will match it.
      </p>

      <form className={styles.form} onSubmit={submit}>
        <HiSparkles className={styles.formIcon} aria-hidden="true" />
        <input
          className={styles.input}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What are you in the mood for?"
          aria-label="Describe what you want to watch"
          maxLength={300}
        />
        <button className={styles.submit} type="submit" disabled={loading}>
          Get suggestions
        </button>
      </form>

      <div className={styles.ideas}>
        {IDEAS.map((idea) => (
          <button
            key={idea}
            type="button"
            className={styles.idea}
            onClick={() => {
              setPrompt(idea);
              run(idea);
            }}
            disabled={loading}
          >
            {idea}
          </button>
        ))}
      </div>

      <div className={styles.results}>{body}</div>
    </main>
  );
}

export default ForYou;
