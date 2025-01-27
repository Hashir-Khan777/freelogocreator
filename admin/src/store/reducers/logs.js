import { createSlice } from "@reduxjs/toolkit";
import { Log } from "../actions/index.js";

const initialState = {
  loading: false,
  logs: [],
};

export default createSlice({
  name: "logs",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(Log.getLogs.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(Log.getLogs.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.logs = payload.data;
    });
    builder.addCase(Log.getLogs.rejected, (state) => {
      state.loading = false;
    });
  },
}).reducer;
