import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  userRole: "lecturer",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authSuccess(state, action) {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
    },
    logout(state, action) {
      state.token = null;
      state.userId = null;
      localStorage.removeItem("token");
      localStorage.removeItem("expirationDate");
    },
  },
});

export const { logout, authSuccess } = authSlice.actions;

export default authSlice.reducer;
