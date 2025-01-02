import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { showToast } from "../reducers/toast.reducer";

export const getAllCategories = createAsyncThunk(
  "categories/get",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}/categories`
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

export const getGraphicsByCategoryById = createAsyncThunk(
  "categories/get/graphics/id",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}/categories/graphics/${obj.id}`
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
