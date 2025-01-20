import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { Auth } from "../actions/index.js";

const initialState = {
  loading: false,
  data: {},
  verifyData: {},
  forgetPass: {},
  resetPass: {},
  user: {},
};

export default createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(Auth.registerUser.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(Auth.loginUser.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(Auth.verifyUser.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(Auth.verifyUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });

    builder.addCase(Auth.verifyUser.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addMatcher(
      isAnyOf(Auth.registerUser.fulfilled, Auth.registerUser.rejected),
      (state, action) => {
        state.loading = false;
        state.data = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(Auth.loginUser.fulfilled, Auth.loginUser.rejected),
      (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.user = action.payload;
      }
    );

    builder.addMatcher(isAnyOf(Auth.verifyEmail.pending), (state) => {
      state.loading = true;
    });

    builder.addMatcher(
      isAnyOf(Auth.verifyEmail.fulfilled, Auth.verifyEmail.rejected),
      (state, { payload }) => {
        state.verifyData = payload;
        state.loading = false;
      }
    );

    builder.addMatcher(isAnyOf(Auth.forgotPassword.pending), (state) => {
      state.loading = true;
    });

    builder.addMatcher(
      isAnyOf(Auth.forgotPassword.fulfilled, Auth.forgotPassword.rejected),
      (state, { payload }) => {
        state.forgetPass = payload;
        state.loading = false;
      }
    );

    builder.addMatcher(isAnyOf(Auth.resetPassword.pending), (state) => {
      state.loading = true;
    });

    builder.addMatcher(
      isAnyOf(Auth.resetPassword.fulfilled, Auth.resetPassword.rejected),
      (state, { payload }) => {
        state.resetPass = payload;
        state.loading = false;
      }
    );
  },
}).reducer;
