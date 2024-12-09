import { createSlice } from "@reduxjs/toolkit";
import {
  forgetPassword,
  login,
  register,
  resetPassword,
} from "../actions/auth.action";

const initialState = {
  loading: false,
  data: null,
  user: null,
  forgetpasswordsuccess: false,
  resetpasswordsuccess: false,
};

export default createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    });
    builder.addCase(login.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(register.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(register.fulfilled, (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    });
    builder.addCase(register.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(forgetPassword.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(forgetPassword.fulfilled, (state) => {
      state.forgetpasswordsuccess = true;
      state.loading = false;
    });
    builder.addCase(forgetPassword.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(resetPassword.fulfilled, (state, { payload }) => {
      state.resetpasswordsuccess = payload;
      state.loading = false;
    });
    builder.addCase(resetPassword.rejected, (state) => {
      state.loading = false;
    });
  },
}).reducer;
