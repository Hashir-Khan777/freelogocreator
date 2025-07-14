import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToast } from "../reducers/toast.reducer";
import axios from "axios";

export const getSubscription = createAsyncThunk(
  "subscription/get",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}/subscriptions/user/${
          JSON.parse(localStorage.getItem("user"))?.id
        }`
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

export const subscribePackage = createAsyncThunk(
  "subscription/subscribe",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/subscriptions/subscribe`,
        obj
      );
      window.location.href = data.url;
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

export const subscribeFreePackage = createAsyncThunk(
  "subscription/subscribe/free",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/subscriptions/subscribe/free`,
        obj
      );
      window.location.href = data.url;
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

export const updateSubcription = createAsyncThunk(
  "subscription/update",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_BASE_API_URL}/subscriptions`,
        obj
      );
      dispatch(
        showToast({
          type: "success",
          message: "subscribed successfully",
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
