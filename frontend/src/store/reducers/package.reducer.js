import { createSlice } from "@reduxjs/toolkit";
import { getPackages } from "../actions/package.action";

const initialState = {
  loading: false,
  packages: [],
};

export default createSlice({
  name: "packages",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getPackages.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getPackages.fulfilled, (state, { payload }) => {
      state.packages = payload;
      state.loading = false;
    });
    builder.addCase(getPackages.rejected, (state) => {
      state.loading = false;
    });
  },
}).reducer;
