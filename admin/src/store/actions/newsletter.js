import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getNewsLetter = createAsyncThunk(
  "newsletters/get",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/newsletter/subscribers`
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

export { getNewsLetter };
