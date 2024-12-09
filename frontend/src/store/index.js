import { combineReducers, configureStore } from "@reduxjs/toolkit";
import ToastReducer from "./reducers/toast.reducer";
import AuthReducer from "./reducers/auth.reducer";
import GraphicsReducer from "./reducers/graphics.reducer";

const reducers = combineReducers({
  ToastReducer,
  AuthReducer,
  GraphicsReducer,
});

export default configureStore({
  reducer: reducers,
  devTools: false,
});
