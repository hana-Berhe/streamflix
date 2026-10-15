import { getAiSuggestions } from "./aiApi";
import { fetchRecommendations, findTitle, hasTmdbKey } from "./tmdb";
import { localTitles, titleKey } from "../utils/normalizeMovie";

const dedupe = (items, excludeKeys) => {
  const seen = new Set(excludeKeys);
  return items.filter((m) => {
    if (!m) return false;
    const key = titleKey(m);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const tasteKeys = (ratings, myList) => [
  ...Object.keys(ratings.byKey),
  ...myList.items.map(titleKey),
];

/** Matches each AI suggestion to a real title (TMDB, or the local catalog without a key). */
const resolveSuggestions = async (suggestions) => {
  const resolved = await Promise.all(
    suggestions.map(async (s) => {
      try {
        const movie = hasTmdbKey
          ? await findTitle(s)
          : localTitles.find((t) => t.title.toLowerCase() === s.title.toLowerCase());
        return movie ? { ...movie, reason: s.reason } : null;
      } catch {
        return null;
      }
    }),
  );
  return resolved.filter(Boolean);
};

/**
 * Without AI: recommend from what the user liked.
 * TMDB "recommendations" for up to 3 liked titles, or shared genres in the local catalog.
 */
const fallbackPicks = async ({ ratings, myList, count }) => {
  const liked = ratings.order
    .map((key) => ratings.byKey[key])
    .filter((entry) => entry.rating > 0)
    .map((entry) => entry.movie);

  const seeds = liked.length ? liked : myList.items;
  if (!seeds.length) return { items: [], mode: "empty", label: "" };

  const exclude = tasteKeys(ratings, myList);
  const tmdbSeeds = seeds.filter((m) => m.source === "tmdb").slice(0, 3);

  if (hasTmdbKey && tmdbSeeds.length) {
    const lists = await Promise.all(
      tmdbSeeds.map((seed) =>
        fetchRecommendations(seed)
          .then((items) => items.map((m) => ({ ...m, reason: `Because you liked ${seed.title}` })))
          .catch(() => []),
      ),
    );
    // Interleave so the row isn't all from one seed.
    const mixed = [];
    for (let i = 0; i < 20; i += 1) lists.forEach((list) => list[i] && mixed.push(list[i]));
    return {
      items: dedupe(mixed, exclude).slice(0, count),
      mode: "fallback",
      label: `Because you liked ${tmdbSeeds[0].title}`,
    };
  }

  const genres = new Set(seeds.flatMap((m) => m.genres));
  const items = localTitles
    .filter((m) => m.genres.some((g) => genres.has(g)))
    .map((m) => ({ ...m, reason: `More ${m.genres.find((g) => genres.has(g))}, like titles you enjoyed` }));

  return {
    items: dedupe(items, exclude).slice(0, count),
    mode: "fallback",
    label: `Because you liked ${seeds[0].title}`,
  };
};

/**
 * Personalised picks. Tries the AI first; if the server has no AI key (503)
 * or the call fails, falls back to "Because you liked" recommendations.
 *
 * @returns {Promise<{items: object[], mode: "ai"|"fallback"|"empty", label: string, error?: string}>}
 */
export const getPicks = async ({ ratings, myList, prompt = "", count = 12, exclude = [] }) => {
  const savedKeys = tasteKeys(ratings, myList);

  try {
    const { suggestions, basedOn } = await getAiSuggestions({
      prompt,
      count,
      exclude,
      catalog: hasTmdbKey ? [] : localTitles.map((t) => t.title),
    });

    if (basedOn === "empty") return { items: [], mode: "empty", label: "" };

    const items = dedupe(await resolveSuggestions(suggestions), savedKeys);
    return { items, mode: "ai", label: prompt ? "Suggestions for you" : "Top picks for you" };
  } catch (error) {
    const notConfigured = error.code === "AI_NOT_CONFIGURED";
    if (prompt && !notConfigured) {
      // A specific request failed: say so rather than silently showing something else.
      return { items: [], mode: "error", label: "", error: error.message };
    }
    const fallback = await fallbackPicks({ ratings, myList, count });
    return { ...fallback, aiUnavailable: notConfigured };
  }
};
