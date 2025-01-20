import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { Course } from "../actions/index.js";

const initialState = {
  loading: false,
  courses: [],
  course: {},
};

export default createSlice({
  name: "course",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(Course.getCourses.fulfilled, (state, action) => {
      state.loading = false;
      state.courses = action.payload;
    });
    builder.addCase(Course.createCourse.fulfilled, (state, action) => {
      state.loading = false;
      state.course = action.payload;
      state.courses = [...state.courses, action.payload];
    });
    builder.addCase(Course.editCourse.fulfilled, (state, action) => {
      state.loading = false;
      let course = state.courses.find((x) => x._id === action.payload._id);
      course = { ...course, ...action.payload };
    });
    builder.addCase(Course.deleteCourse.fulfilled, (state, action) => {
      state.loading = false;
      state.courses = state.courses.filter((x) => x._id !== action.payload._id);
    });
    builder.addMatcher(
      isAnyOf(
        Course.getCourses.pending,
        Course.editCourse.pending,
        Course.deleteCourse.pending,
        Course.createCourse.pending
      ),
      (state) => {
        state.loading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        Course.getCourses.rejected,
        Course.editCourse.rejected,
        Course.deleteCourse.rejected,
        Course.createCourse.rejected
      ),
      (state) => {
        state.loading = false;
      }
    );
  },
}).reducer;
