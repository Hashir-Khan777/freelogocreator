import { createSlice } from "@reduxjs/toolkit";
import {
  getSubscription,
  updateSubcription,
} from "../actions/subscription.action";

const initialState = {
  loading: false,
  subscription: null,
  subscribed: false,
};

export default createSlice({
  name: "subscription",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getSubscription.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getSubscription.fulfilled, (state, { payload }) => {
      state.subscription = payload.data;
      state.loading = false;
    });
    builder.addCase(getSubscription.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(updateSubcription.fulfilled, (state) => {
      state.subscribed = true;
    });
  },
}).reducer;
