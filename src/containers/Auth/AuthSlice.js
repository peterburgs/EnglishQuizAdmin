import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/index";

const initialState = {
  token: null,
  signinStatus: "idle",
  signinError: null,
};

export const signin = createAsyncThunk(
  "auth/signin",
  async (signinData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/signin/admin", signinData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.userCredential.email);
      const expirationDate = new Date(
        new Date().getTime() + response.data.expiresIn * 3600000
      );
      localStorage.setItem("expirationDate", expirationDate);
      setTimeout(() => {
        alert("Session timeout!");
        dispatch(logout());
      }, expirationDate.getTime() - new Date().getTime());
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authSuccess(state, action) {
      state.token = action.payload.token;
    },
    logout(state, action) {
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("expirationDate");
    },
    signinRefreshed(state, action) {
      state.signinStatus = "idle";
      state.signinError = null;
    },
  },
  extraReducers: {
    [signin.pending]: (state, action) => {
      state.signinStatus = "loading";
    },
    [signin.fulfilled]: (state, action) => {
      state.signinStatus = "succeeded";
      state.token = action.payload.token;
    },
    [signin.rejected]: (state, action) => {
      state.signinStatus = "failed";
      state.signinError = "Invalid email or password";
    },
  },
});

export const { logout, authSuccess, signinRefreshed } = authSlice.actions;

export default authSlice.reducer;
