import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";
import { showToast } from "../reducers/toast.reducer";

const date = new Date();
const cookies = new Cookies();

export const login = createAsyncThunk(
  "auth/login",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/auth/login`,
        obj
      );
      const expires = new Date(date.setDate(date.getDate() + 30));
      cookies.set("_user", data.token, {
        path: "/",
        secure: true,
        expires,
      });
      dispatch(
        showToast({
          type: "success",
          message: data.message,
        })
      );
      localStorage.setItem("user", JSON.stringify(data.data));
      return data.data;
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

export const register = createAsyncThunk(
  "auth/register",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/auth/signup`,
        obj
      );
      const expires = new Date(date.setDate(date.getDate() + 30));
      cookies.set("_user", data.token, {
        path: "/",
        secure: true,
        expires,
      });
      dispatch(
        showToast({
          type: "success",
          message: data.message,
        })
      );
      localStorage.setItem("user", JSON.stringify(data.data));
      return data.data;
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

export const forgetPassword = createAsyncThunk(
  "auth/forgetpassword",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/auth/forgetpassword`,
        obj
      );
      const expires = new Date(date.setHours(date.getHours() + 1));
      cookies.set("_email", data.data, {
        path: "/",
        secure: true,
        expires,
      });
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

export const resetPassword = createAsyncThunk(
  "auth/resetpassword",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/auth/resetpassword`,
        obj
      );
      dispatch(
        showToast({
          type: "success",
          message: data.message,
        })
      );
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

export const signOut = createAsyncThunk(
  "auth/signout",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      cookies.remove("_user");
      localStorage.removeItem("user");
      dispatch(
        showToast({
          type: "success",
          message: "Logout successfully",
        })
      );
      return null;
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
