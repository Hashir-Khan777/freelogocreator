import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getTopics = createAsyncThunk(
  "topic/get",
  async (topicForm, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/topic`
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

const createTopic = createAsyncThunk(
  "topic/create",
  async (topicForm, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/topic/add`,
        topicForm
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

const editTopic = createAsyncThunk(
  "topic/edit",
  async (topicForm, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/topic/edit/${topicForm._id}`,
        topicForm
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

const deleteTopic = createAsyncThunk(
  "topic/delete",
  async (topicForm, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API_URL}/topic/delete/${topicForm._id}`
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

const addTopicVideo = createAsyncThunk(
  "topic/video/add",
  async (topicForm, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/topic/video`,
        topicForm
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message ? err.response.data.message : err.message
      );
    }
  }
);

export { getTopics, createTopic, editTopic, deleteTopic, addTopicVideo };
