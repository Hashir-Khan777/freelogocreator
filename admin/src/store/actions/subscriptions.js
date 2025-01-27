import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getSubscriptions = createAsyncThunk(
  "subscriptions/get",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/subscriptions`
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

export { getSubscriptions };
