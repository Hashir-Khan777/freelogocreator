import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { showToast } from "../reducers/toast.reducer";
import {
  toggleCreateQRCodeModal,
  toggleQRCodeModal,
} from "../reducers/modals.reducer";

export const generateQRCode = createAsyncThunk(
  "qrcode/generate",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/qrcode/generate`,
        obj
      );
      dispatch(toggleCreateQRCodeModal({ open: false }));
      dispatch(toggleQRCodeModal({ open: true, data: data.data }));
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

export const getAllQRCodes = createAsyncThunk(
  "qrcode/all",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}/qrcode`
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

export const getQRCodeById = createAsyncThunk(
  "qrcode/byid",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}/qrcode/${obj.id}`
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

export const updateQRCode = createAsyncThunk(
  "qrcode/update",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_BASE_API_URL}/qrcode`,
        obj.data
      );
      if (obj.message) {
        dispatch(toggleCreateQRCodeModal({ open: false }));
        dispatch(
          showToast({
            type: "success",
            message: data?.message,
          })
        );
      }
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

export const deleteQRCode = createAsyncThunk(
  "qrcode/delete",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_BASE_API_URL}/qrcode/${obj.id}`
      );
      dispatch(
        showToast({
          type: "success",
          message: data?.message,
        })
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
