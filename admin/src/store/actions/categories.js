import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const getCategories = createAsyncThunk(
  "categories/get",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/categories`
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

const addCategories = createAsyncThunk(
  "categories/add",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/categories`,
        obj
      );
      toast.success("Category added successfully");
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

const editCategories = createAsyncThunk(
  "categories/edit",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/categories`,
        obj
      );
      toast.success("Category updated successfully");
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

const deleteCategories = createAsyncThunk(
  "categories/delete",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API_URL}/categories/${obj.id}`
      );
      toast.success("Category deleted successfully");
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

export { getCategories, addCategories, editCategories, deleteCategories };
