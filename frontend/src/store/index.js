import { combineReducers, configureStore } from "@reduxjs/toolkit";
import ToastReducer from "./reducers/toast.reducer";
import AuthReducer from "./reducers/auth.reducer";
import GraphicsReducer from "./reducers/graphics.reducer";
import ModalsReducer from "./reducers/modals.reducer";
import CategoriesReducer from "./reducers/categories.reducer";
import PackageReducer from "./reducers/package.reducer";
import QrcodeReducer from "./reducers/qrcode.reducer";

const reducers = combineReducers({
  ToastReducer,
  AuthReducer,
  GraphicsReducer,
  ModalsReducer,
  CategoriesReducer,
  PackageReducer,
  QrcodeReducer,
});

export default configureStore({
  reducer: reducers,
  devTools: false,
});
