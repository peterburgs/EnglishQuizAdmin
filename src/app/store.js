import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../containers/Auth/AuthSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
  },
  // eslint-disable-next-line no-undef
  devTools: process.env.NODE_ENV === "development",
});
