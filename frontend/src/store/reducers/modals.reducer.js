import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isGeneratePostModalOpen: false,
  isShapesModalOpen: false,
  isReplaceModalOpen: false,
  isShieldModalOpen: false,
  generatePostModalData: {},
  shapesModalData: "",
  replaceModalData: "",
  shieldModalData: "",
};

const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    toggleGeneratePostModal: (state, { payload }) => {
      state.isGeneratePostModalOpen = payload.open;
      state.generatePostModalData = payload.data;
    },

    toggleShapeModal: (state, { payload }) => {
      state.isShapesModalOpen = payload.open;
      state.shapesModalData = payload.data;
    },

    toggleReplaceModal: (state, { payload }) => {
      state.isReplaceModalOpen = payload.open;
      state.replaceModalData = payload.data;
    },

    toggleShieldModal: (state, { payload }) => {
      state.isShieldModalOpen = payload.open;
      state.shieldModalData = payload.data;
    },
  },
});

export const {
  toggleGeneratePostModal,
  toggleShapeModal,
  toggleReplaceModal,
  toggleShieldModal,
} = modalsSlice.actions;

export default modalsSlice.reducer;
