import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { showToast } from "../reducers/toast.reducer";

export const getPackages = createAsyncThunk(
  "packages/get",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}/packages`
      );
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
