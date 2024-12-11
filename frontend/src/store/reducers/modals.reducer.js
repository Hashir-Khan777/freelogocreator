import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isGeneratePostModalOpen: false,
  generatePostModalData: {},
};

const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    toggleGeneratePostModal: (state, { payload }) => {
      state.isGeneratePostModalOpen = payload.open;
      state.generatePostModalData = payload.data;
    },
  },
});

export const { toggleGeneratePostModal } = modalsSlice.actions;

export default modalsSlice.reducer;
