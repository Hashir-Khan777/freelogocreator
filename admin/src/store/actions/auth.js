import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const loginUser = createAsyncThunk(
  "auth/login",
  async (loginForm, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        loginForm
      );
      localStorage.setItem("_user", data.token);
      return data;
    } catch (err) {
      dispatch(
        showToast({
          type: "error",
          message: err.response.data.message
            ? err.response.data.message
            : err.message,
        })
      );
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

const registerUser = createAsyncThunk(
  "auth/register",
  async (registerForm, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        registerForm
      );
      localStorage.setItem("_token", data.token);
      // dispatch(
      //   showToast({
      //     type: "success",
      //     message: "Code has been sent to your email",
      //   })
      // );
      //   dispatch(toggleRegisterModal(false));
      //   dispatch(toggleVerifyEmailModal({ open: true }));
      return data;
    } catch (err) {
      //   dispatch(
      //     showToast({
      //       type: "error",
      //       message: err.response.data.message
      //         ? err.response.data.message
      //         : err.message,
      //     })
      //   );
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

const verifyEmail = createAsyncThunk(
  "verify-email",
  async (emailVerificationForm, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/verify/email`,
        emailVerificationForm,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("_token")}`,
          },
        }
      );
      if (emailVerificationForm?.resetPass) {
        localStorage.setItem("_token", data.token);
      } else {
        localStorage.removeItem("_token");
        localStorage.setItem("_user", data.token);
      }
      return { ...data, ...emailVerificationForm };
    } catch (err) {
      // dispatch(
      //   showToast({
      //     type: "error",
      //     message: err.response.data.message
      //       ? err.response.data.message
      //       : err.message,
      //   })
      // );
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

const forgotPassword = createAsyncThunk(
  "forgot-password",
  async (forgotPasswordForm, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/forgot/password`,
        forgotPasswordForm
      );
      localStorage.setItem("_token", data.token);

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (resetPasswordForm, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/reset/password`,
        resetPasswordForm,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("_token")}`,
          },
        }
      );
      localStorage.removeItem("_token");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

const verifyUser = createAsyncThunk(
  "auth/verifyUser",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/verify/user`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("_user")}`,
          },
        }
      );
      return data;
    } catch (err) {
      // dispatch(logout());
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

export {
  loginUser,
  registerUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  verifyUser,
};
