import { createSlice } from "@reduxjs/toolkit";
import {
  deleteQRCode,
  generateQRCode,
  getAllQRCodes,
  getQRCodeById,
  updateQRCode,
} from "../actions/qrcode.action";

const initialState = {
  loading: false,
  qrcodes: [],
  qrcode: null,
};

export default createSlice({
  name: "qrcode",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(generateQRCode.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(generateQRCode.fulfilled, (state, { payload }) => {
      state.qrcodes.push(payload);
      state.loading = false;
    });
    builder.addCase(generateQRCode.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(getAllQRCodes.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllQRCodes.fulfilled, (state, { payload }) => {
      state.qrcodes = payload;
      state.loading = false;
    });
    builder.addCase(getAllQRCodes.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(getQRCodeById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getQRCodeById.fulfilled, (state, { payload }) => {
      state.qrcode = payload;
      state.loading = false;
    });
    builder.addCase(getQRCodeById.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(updateQRCode.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateQRCode.fulfilled, (state, { payload }) => {
      let code = state.qrcodes.find((x) => x.id === payload.id);
      if (code) {
        code.text = payload.text;
      }
      state.loading = false;
    });
    builder.addCase(updateQRCode.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(deleteQRCode.fulfilled, (state, { payload }) => {
      state.qrcodes = state.qrcodes.filter((x) => x.id != payload.id);
      state.loading = false;
    });
  },
}).reducer;
