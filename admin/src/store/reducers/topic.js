import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { Topic } from "../actions/index.js";

const initialState = {
  loading: false,
  topics: [],
  topic: {},
  video: "",
  videoLoading: false,
};

export default createSlice({
  name: "topic",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(Topic.getTopics.fulfilled, (state, action) => {
      state.loading = false;
      state.topics = action.payload;
    });
    builder.addCase(Topic.createTopic.fulfilled, (state, action) => {
      state.loading = false;
      state.topic = action.payload;
      state.topics = [...state.topics, action.payload];
    });
    builder.addCase(Topic.editTopic.fulfilled, (state, action) => {
      state.loading = false;
      let topic = state.topics.find((x) => x._id === action.payload._id);
      topic = { ...topic, ...action.payload };
    });
    builder.addCase(Topic.deleteTopic.fulfilled, (state, action) => {
      state.loading = false;
      state.topics = state.topics.filter((x) => x._id !== action.payload._id);
    });
    builder.addCase(Topic.addTopicVideo.fulfilled, (state, action) => {
      state.videoLoading = false;
      state.video = action.payload;
    });
    builder.addCase(Topic.addTopicVideo.pending, (state) => {
      state.videoLoading = true;
    });
    builder.addCase(Topic.addTopicVideo.rejected, (state) => {
      state.videoLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        Topic.getTopics.pending,
        Topic.editTopic.pending,
        Topic.deleteTopic.pending,
        Topic.createTopic.pending
      ),
      (state) => {
        state.loading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        Topic.getTopics.rejected,
        Topic.editTopic.rejected,
        Topic.deleteTopic.rejected,
        Topic.createTopic.rejected
      ),
      (state) => {
        state.loading = false;
      }
    );
  },
}).reducer;
