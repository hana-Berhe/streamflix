import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice.js";
import myListReducer from "../features/myList/myListSlice.js";
import ratingsReducer from "../features/ratings/ratingsSlice.js";
import uiReducer from "../features/ui/uiSlice.js";
import aiReducer from "../features/ai/aiSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    myList: myListReducer,
    ratings: ratingsReducer,
    ui: uiReducer,
    ai: aiReducer,
  },
});
