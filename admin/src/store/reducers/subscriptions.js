import { createSlice } from "@reduxjs/toolkit";
import { Subscription } from "../actions/index.js";

const initialState = {
  loading: false,
  subscriptions: [],
};

export default createSlice({
  name: "subscriptions",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(Subscription.getSubscriptions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      Subscription.getSubscriptions.fulfilled,
      (state, { payload }) => {
        state.loading = false;
        state.subscriptions = payload.data;
      }
    );
    builder.addCase(Subscription.getSubscriptions.rejected, (state) => {
      state.loading = false;
    });
  },
}).reducer;
