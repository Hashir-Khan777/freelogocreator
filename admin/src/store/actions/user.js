import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const getUsers = createAsyncThunk(
  "users/get",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/users`
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

const getUserProfile = createAsyncThunk(
  "users/get/id",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/users/${obj.id}`
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

const editUser = createAsyncThunk(
  "users/edit",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/users`,
        obj
      );
      toast.success("User updated successfully");
      return { ...data, profile: obj.profile };
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

const deleteUser = createAsyncThunk(
  "users/delete",
  async (obj, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API_URL}/auth/users/${obj.id}`
      );
      toast.success("User deleted successfully");
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

export { getUsers, editUser, deleteUser, getUserProfile };
