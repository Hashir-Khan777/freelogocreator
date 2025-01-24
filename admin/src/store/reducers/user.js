import { createSlice } from "@reduxjs/toolkit";
import { Auth, User } from "../actions/index.js";

const initialState = {
  loading: false,
  users: [],
};

export default createSlice({
  name: "users",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(Auth.registerUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(Auth.registerUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.users.push(payload.data);
    });
    builder.addCase(Auth.registerUser.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(User.getUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(User.getUsers.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.users = payload.data;
    });
    builder.addCase(User.getUsers.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(User.editUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(User.editUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      const obj = state.users.find((x) => x.id === payload.data.id);
      obj.name = payload.data.name;
    });
    builder.addCase(User.editUser.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(User.deleteUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(User.deleteUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.graphics = state.users.filter((x) => x.id != payload.data.id);
    });
    builder.addCase(User.deleteUser.rejected, (state) => {
      state.loading = false;
    });
  },
}).reducer;
