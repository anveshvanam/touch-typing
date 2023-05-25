import { createSlice } from "@reduxjs/toolkit";

const typingSlice = createSlice({
  name: "typing",
  initialState: {
    text: "",
    userInput: "",
  },
  reducers: {
    setText: (state, action) => {
      state.text = action.payload;
    },
    setUserInput: (state, action) => {
      state.userInput = action.payload;
    },
  },
});

export const { setText, setUserInput } = typingSlice.actions;
export default typingSlice.reducer;
