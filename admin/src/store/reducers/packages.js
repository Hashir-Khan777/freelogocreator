import { createSlice } from "@reduxjs/toolkit";
import { Package } from "../actions/index.js";

const initialState = {
  loading: false,
  packages: [],
};

export default createSlice({
  name: "packages",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(Package.getPackages.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(Package.getPackages.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.packages = payload.data;
    });
    builder.addCase(Package.getPackages.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(Package.addPackages.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(Package.addPackages.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.packages.unshift(payload.data);
    });
    builder.addCase(Package.addPackages.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(Package.editPackages.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(Package.editPackages.fulfilled, (state, { payload }) => {
      state.loading = false;
      const obj = state.packages.find((x) => x.id === payload.data.id);
      obj.name = payload.data.name;
      obj.amount = payload.data.amount;
      obj.logolimit = payload.data.logolimit;
    });
    builder.addCase(Package.editPackages.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(Package.deletePackages.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(Package.deletePackages.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.packages = state.packages.filter((x) => x.id != payload.data.id);
    });
    builder.addCase(Package.deletePackages.rejected, (state) => {
      state.loading = false;
    });
  },
}).reducer;
