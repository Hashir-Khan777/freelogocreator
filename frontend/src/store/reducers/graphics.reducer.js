import { createSlice } from "@reduxjs/toolkit";
import { getAllGraphics, searchGraphics } from "../actions/graphics.action";

const initialState = {
  loading: false,
  graphics: null,
  filteredGraphics: null,
};

export default createSlice({
  name: "graphics",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getAllGraphics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllGraphics.fulfilled, (state, { payload }) => {
      state.graphics = payload;
      state.loading = false;
    });
    builder.addCase(getAllGraphics.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(searchGraphics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(searchGraphics.fulfilled, (state, { payload }) => {
      state.graphics = payload;
      state.loading = false;
    });
    builder.addCase(searchGraphics.rejected, (state) => {
      state.loading = false;
    });
  },
}).reducer;
