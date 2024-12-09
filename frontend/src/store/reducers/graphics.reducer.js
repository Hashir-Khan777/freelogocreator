import { createSlice } from "@reduxjs/toolkit";
import { getAllGraphics } from "../actions/graphics.action";

const initialState = {
  loading: false,
  graphics: null,
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
  },
}).reducer;
