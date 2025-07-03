import { createSlice } from "@reduxjs/toolkit";
import {
  emailverification,
  forgetPassword,
  login,
  register,
  resetPassword,
  signOut,
} from "../actions/auth.action";

const initialState = {
  loading: false,
  data: JSON.parse(localStorage.getItem("user")) ?? {},
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
      state.token = payload.token;
      state.loading = false;
    });
    builder.addCase(register.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(emailverification.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(emailverification.fulfilled, (state, { payload }) => {
      state.data = payload.data;
      state.loading = false;
    });
    builder.addCase(emailverification.rejected, (state) => {
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

    builder.addCase(signOut.fulfilled, (state, { payload }) => {
      state.data = payload;
    });
  },
}).reducer;
