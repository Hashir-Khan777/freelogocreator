import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { showToast } from "../reducers/toast.reducer";

export const subscribe = createAsyncThunk(
  "newsletter/subscribe",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/newsletter/subscribe`,
        obj
      );
      dispatch(
        showToast({
          type: "success",
          message: "Subscribed successfully",
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
