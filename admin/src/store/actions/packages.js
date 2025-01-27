import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const getPackages = createAsyncThunk(
  "packages/get",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/packages`
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

const addPackages = createAsyncThunk(
  "packages/add",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/packages`,
        obj
      );
      toast.success("Package added successfully");
      return data;
    } catch (err) {
      toast.error(
        err.response.data.message ? err.response.data.message : err.message
      );
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

const editPackages = createAsyncThunk(
  "packages/edit",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/packages`,
        obj
      );
      toast.success("Package updated successfully");
      return data;
    } catch (err) {
      toast.error(
        err.response.data.message ? err.response.data.message : err.message
      );
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

const deletePackages = createAsyncThunk(
  "packages/delete",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API_URL}/packages/${obj.id}`
      );
      toast.success("Package deleted successfully");
      return data;
    } catch (err) {
      toast.error(
        err.response.data.message ? err.response.data.message : err.message
      );
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

export { getPackages, addPackages, editPackages, deletePackages };
