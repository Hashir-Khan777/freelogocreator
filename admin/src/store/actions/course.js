import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getCourses = createAsyncThunk(
  "course/get",
  async (courseForm, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/course`
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

const createCourse = createAsyncThunk(
  "course/create",
  async (courseForm, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/course/add`,
        courseForm
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

const editCourse = createAsyncThunk(
  "course/edit",
  async (courseForm, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/course/edit/${courseForm._id}`,
        courseForm
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

const deleteCourse = createAsyncThunk(
  "course/delete",
  async (courseForm, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API_URL}/course/delete/${courseForm._id}`
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

export { getCourses, createCourse, editCourse, deleteCourse };
