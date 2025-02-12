import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToast } from "../reducers/toast.reducer";
import axios from "axios";

export const sendQuery = createAsyncThunk(
  "queries/send",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/queries`,
        obj
      );
      dispatch(
        showToast({
          type: "success",
          message: "Message has been sent successfully",
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
