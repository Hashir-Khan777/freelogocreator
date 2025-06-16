import { createSlice } from "@reduxjs/toolkit";
import { Logo } from "../actions/index.js";

const initialState = {
  loading: false,
  graphics: [],
  qrcodes: [],
};

export default createSlice({
  name: "graphics",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(Logo.getGraphics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(Logo.getGraphics.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.graphics = payload.data;
    });
    builder.addCase(Logo.getGraphics.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(Logo.addGraphics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(Logo.addGraphics.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.graphics.unshift(payload.data);
    });
    builder.addCase(Logo.addGraphics.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(Logo.editGraphics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(Logo.editGraphics.fulfilled, (state, { payload }) => {
      state.loading = false;
      const obj = state.graphics.find((x) => x.id === payload.data.id);
      obj.title = payload.data.title;
      obj.description = payload.data.description;
      obj.category_id = payload.data.category_id;
      obj.graphic = payload.data.graphic;
    });
    builder.addCase(Logo.editGraphics.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(Logo.deleteGraphics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(Logo.deleteGraphics.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.graphics = state.graphics.filter((x) => x.id != payload.data.id);
    });
    builder.addCase(Logo.deleteGraphics.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(Logo.getQrCodes.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(Logo.getQrCodes.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.qrcodes = payload.data;
    });
    builder.addCase(Logo.getQrCodes.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(Logo.restoreQrCode.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(Logo.restoreQrCode.fulfilled, (state, { payload }) => {
      state.loading = false;
      const qr = state.qrcodes.find((x) => x.id == payload.data.id);
      qr.deleted = false;
    });
    builder.addCase(Logo.restoreQrCode.rejected, (state) => {
      state.loading = false;
    });
  },
}).reducer;
