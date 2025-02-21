import { createSlice } from "@reduxjs/toolkit";
import { NewsLetters } from "../actions/index.js";

const initialState = {
  loading: false,
  newsletters: [],
};

export default createSlice({
  name: "newsletters",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(NewsLetters.getNewsLetter.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      NewsLetters.getNewsLetter.fulfilled,
      (state, { payload }) => {
        state.loading = false;
        state.newsletters = payload;
      }
    );
    builder.addCase(NewsLetters.getNewsLetter.rejected, (state) => {
      state.loading = false;
    });
  },
}).reducer;
