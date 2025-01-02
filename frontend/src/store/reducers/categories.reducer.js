import { createSlice } from "@reduxjs/toolkit";
import {
  getAllCategories,
  getGraphicsByCategoryById,
} from "../actions/categories.action";

const initialState = {
  loading: false,
  categories: null,
  graphics: null,
};

export default createSlice({
  name: "categories",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getAllCategories.fulfilled, (state, { payload }) => {
      state.categories = payload;
    });

    builder.addCase(getGraphicsByCategoryById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getGraphicsByCategoryById.fulfilled,
      (state, { payload }) => {
        state.graphics = payload;
        state.loading = false;
      }
    );
    builder.addCase(getGraphicsByCategoryById.rejected, (state) => {
      state.loading = false;
    });
  },
}).reducer;
