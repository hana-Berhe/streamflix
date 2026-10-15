import { createSlice } from "@reduxjs/toolkit";

// Which title is open in the player / "More info" modal, plus a one-line toast.
const uiSlice = createSlice({
  name: "ui",
  initialState: { playing: null, details: null, toast: null },
  reducers: {
    openPlayer: (state, action) => {
      state.playing = action.payload;
    },
    closePlayer: (state) => {
      state.playing = null;
    },
    openDetails: (state, action) => {
      state.details = action.payload;
    },
    closeDetails: (state) => {
      state.details = null;
    },
    showToast: (state, action) => {
      state.toast = { message: action.payload, id: Date.now() };
    },
    hideToast: (state) => {
      state.toast = null;
    },
  },
});

export const { openPlayer, closePlayer, openDetails, closeDetails, showToast, hideToast } =
  uiSlice.actions;

export default uiSlice.reducer;
