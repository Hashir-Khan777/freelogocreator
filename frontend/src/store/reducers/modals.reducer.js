import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isGeneratePostModalOpen: false,
  isShapesModalOpen: false,
  isReplaceModalOpen: false,
  isShieldModalOpen: false,
  isQRCodeModalOpen: false,
  isCraeteQRCodeModalOpen: false,
  generatePostModalData: {},
  shapesModalData: "",
  replaceModalData: "",
  shieldModalData: "",
  qrCodeModalData: "",
  createQRCodeModalData: "",
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

    toggleQRCodeModal: (state, { payload }) => {
      state.isQRCodeModalOpen = payload.open;
      state.qrCodeModalData = payload.data;
    },

    toggleCreateQRCodeModal: (state, { payload }) => {
      state.isCraeteQRCodeModalOpen = payload.open;
      state.createQRCodeModalData = payload.data;
    },
  },
});

export const {
  toggleGeneratePostModal,
  toggleShapeModal,
  toggleReplaceModal,
  toggleShieldModal,
  toggleQRCodeModal,
  toggleCreateQRCodeModal,
} = modalsSlice.actions;

export default modalsSlice.reducer;
