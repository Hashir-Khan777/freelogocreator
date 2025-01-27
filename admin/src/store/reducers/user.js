import { createSlice } from "@reduxjs/toolkit";
import { Auth, User } from "../actions/index.js";

const initialState = {
  loading: false,
  users: [],
  user: {},
};

export default createSlice({
  name: "users",
  initialState,
  extraReducers: (builder) => {
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

    builder.addCase(User.getUserProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(User.getUserProfile.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload.data;
    });
    builder.addCase(User.getUserProfile.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(User.editUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(User.editUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (!payload.profile) {
        const obj = state.users.find((x) => x.id === payload.data.id);
        obj.name = payload.data.name;
        obj.email = payload.data.email;
        obj.role = payload.data.role;
      } else {
        state.user.name = payload.data.name;
        state.user.email = payload.data.email;
        state.user.password = payload.data.password;
        state.user.image = payload.data.image;
      }
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
