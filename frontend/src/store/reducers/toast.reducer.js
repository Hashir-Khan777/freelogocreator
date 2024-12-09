import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type: null,
  message: null,
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, { payload }) => {
      state.type = payload.type;
      state.message = payload.message;
    },
  },
});

export const { showToast } = toastSlice.actions;

export default toastSlice.reducer;
