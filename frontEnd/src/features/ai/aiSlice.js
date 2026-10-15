import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getPicks } from "../../services/recommendations";
import { clearUser } from "../user/userSlice";

/**
 * Home-page "Top picks" row. Fetched once per session (AI calls cost money);
 * the For You page has a refresh button and free-text requests.
 */
export const fetchHomePicks = createAsyncThunk("ai/fetchHomePicks", async (_, { getState }) => {
  const { ratings, myList } = getState();
  return getPicks({ ratings, myList, count: 12 });
});

const aiSlice = createSlice({
  name: "ai",
  initialState: { home: { items: [], mode: null, label: "", status: "idle" } },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomePicks.pending, (state) => {
        state.home.status = "loading";
      })
      .addCase(fetchHomePicks.fulfilled, (state, action) => {
        state.home = { ...action.payload, status: "succeeded" };
      })
      .addCase(fetchHomePicks.rejected, (state) => {
        state.home.status = "failed";
      })
      .addCase(clearUser, () => ({ home: { items: [], mode: null, label: "", status: "idle" } }));
  },
});

export default aiSlice.reducer;
