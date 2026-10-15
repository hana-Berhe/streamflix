import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as libraryApi from "../../services/libraryApi";
import { fromSaved, titleKey, toPayload } from "../../utils/normalizeMovie";
import { showToast } from "../ui/uiSlice";
import { clearUser } from "../user/userSlice";

// Netflix's three-option rating.
export const RATING = {
  NOT_FOR_ME: -1,
  LIKE: 1,
  LOVE: 2,
};

export const fetchRatings = createAsyncThunk("ratings/fetch", async () => {
  const data = await libraryApi.getRatings();
  return data.items.map((item) => ({ movie: fromSaved(item), rating: item.rating }));
});

/**
 * Sets a rating, or clears it when `rating` is null (clicking the active option again).
 * Optimistic, with rollback on failure.
 */
export const rateTitle = (movie, rating) => async (dispatch, getState) => {
  const key = titleKey(movie);
  const previous = getState().ratings.byKey[key] || null;

  dispatch(ratingSet({ key, entry: rating ? { movie, rating } : null }));

  try {
    if (rating) {
      await libraryApi.rateTitle({ ...toPayload(movie), rating });
    } else {
      await libraryApi.removeRating(movie.source, movie.id);
    }
  } catch (error) {
    dispatch(ratingSet({ key, entry: previous }));
    if (error.status !== 401) dispatch(showToast("Your rating couldn't be saved. Try again."));
  }
};

const ratingsSlice = createSlice({
  name: "ratings",
  initialState: { byKey: {}, order: [], status: "idle" },
  reducers: {
    ratingSet: (state, action) => {
      const { key, entry } = action.payload;
      state.order = state.order.filter((k) => k !== key);
      if (entry) {
        state.byKey[key] = entry;
        state.order.unshift(key); // most recent first
      } else {
        delete state.byKey[key];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRatings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRatings.fulfilled, (state, action) => {
        state.byKey = {};
        state.order = [];
        action.payload.forEach((entry) => {
          const key = titleKey(entry.movie);
          state.byKey[key] = entry;
          state.order.push(key);
        });
        state.status = "succeeded";
      })
      .addCase(fetchRatings.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(clearUser, () => ({ byKey: {}, order: [], status: "idle" }));
  },
});

const { ratingSet } = ratingsSlice.actions;

export const selectRating = (movie) => (state) =>
  state.ratings.byKey[titleKey(movie)]?.rating ?? null;

export default ratingsSlice.reducer;
