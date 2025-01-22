import { createSlice } from "@reduxjs/toolkit";
import { Category } from "../actions/index.js";

const initialState = {
  loading: false,
  categories: [],
};

export default createSlice({
  name: "categories",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(Category.getCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(Category.getCategories.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.categories = payload.data;
    });
    builder.addCase(Category.getCategories.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(Category.addCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(Category.addCategories.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.categories.push(payload.data);
    });
    builder.addCase(Category.addCategories.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(Category.editCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(Category.editCategories.fulfilled, (state, { payload }) => {
      state.loading = false;
      const obj = state.categories.find((x) => x.id === payload.data.id);
      obj.name = payload.data.name;
    });
    builder.addCase(Category.editCategories.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(Category.deleteCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      Category.deleteCategories.fulfilled,
      (state, { payload }) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (x) => x.id != payload.data.id
        );
      }
    );
    builder.addCase(Category.deleteCategories.rejected, (state) => {
      state.loading = false;
    });
  },
}).reducer;
