import { configureStore } from "@reduxjs/toolkit";
import typingReducer from "./features/typing/typingSlice";

const store = configureStore({
  reducer: {
    typing: typingReducer,
  },
});

export default store;
