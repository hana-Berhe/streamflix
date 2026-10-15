import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as libraryApi from "../../services/libraryApi";
import { fromSaved, titleKey, toPayload } from "../../utils/normalizeMovie";
import { showToast } from "../ui/uiSlice";
import { clearUser } from "../user/userSlice";

export const fetchMyList = createAsyncThunk("myList/fetch", async () => {
  const data = await libraryApi.getMyList();
  return data.items.map(fromSaved);
});

/**
 * Adds or removes a title. The UI updates instantly (optimistic) and
 * rolls back with a toast if the server call fails.
 */
export const toggleMyList = (movie) => async (dispatch, getState) => {
  const key = titleKey(movie);
  const wasInList = getState().myList.items.some((m) => titleKey(m) === key);

  if (wasInList) {
    dispatch(removed(key));
  } else {
    dispatch(added(movie));
  }

  try {
    if (wasInList) {
      await libraryApi.removeFromMyList(movie.source, movie.id);
    } else {
      await libraryApi.addToMyList(toPayload(movie));
    }
  } catch (error) {
    if (wasInList) dispatch(added(movie));
    else dispatch(removed(key));
    if (error.status !== 401) dispatch(showToast("My List couldn't be updated. Try again."));
  }
};

const myListSlice = createSlice({
  name: "myList",
  initialState: { items: [], status: "idle" },
  reducers: {
    added: (state, action) => {
      const key = titleKey(action.payload);
      if (!state.items.some((m) => titleKey(m) === key)) {
        state.items.unshift(action.payload);
      }
    },
    removed: (state, action) => {
      state.items = state.items.filter((m) => titleKey(m) !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyList.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchMyList.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(clearUser, () => ({ items: [], status: "idle" }));
  },
});

const { added, removed } = myListSlice.actions;

export const selectIsInMyList = (movie) => (state) =>
  state.myList.items.some((m) => titleKey(m) === titleKey(movie));

export default myListSlice.reducer;
