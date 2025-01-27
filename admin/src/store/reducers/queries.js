import { createSlice } from "@reduxjs/toolkit";
import { Query } from "../actions/index.js";

const initialState = {
  loading: false,
  queries: [],
};

export default createSlice({
  name: "queries",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(Query.getQueries.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(Query.getQueries.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.queries = payload.data;
    });
    builder.addCase(Query.getQueries.rejected, (state) => {
      state.loading = false;
    });
  },
}).reducer;
