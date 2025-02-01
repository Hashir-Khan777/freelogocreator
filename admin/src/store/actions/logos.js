import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const getGraphics = createAsyncThunk(
  "graphics/get",
  async (obj, { rejectWithValue, dispatch }) => {
    console.log(obj, "obj");
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/graphics/all/${obj.page}`
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

const addGraphics = createAsyncThunk(
  "graphics/add",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/graphics`,
        obj
      );
      toast.success("Logo added successfully");
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

const editGraphics = createAsyncThunk(
  "graphics/edit",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/graphics`,
        obj
      );
      toast.success("Logo updated successfully");
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

const deleteGraphics = createAsyncThunk(
  "graphics/delete",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API_URL}/graphics/${obj.id}`
      );
      toast.success("Logo deleted successfully");
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

export { getGraphics, addGraphics, editGraphics, deleteGraphics };
