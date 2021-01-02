import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/index";
import _ from "lodash";

const initialState = {
  learners: [],
  fetchLearnerError: null,
  fetchLearnerStatus: "idle",
  disableLearnerError: null,
  disableLearnerStatus: "idle",
  enableLearnerError: null,
  enableLearnerStatus: "idle",
  learnerIdToDisable: null,
  learnerIdToEnable: null,
  searchResult: [],
};

export const fetchLearner = createAsyncThunk(
  "learners/fetchLearner",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/users/all");
      return res.data;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.message);
    }
  }
);

export const disableLearner = createAsyncThunk(
  "learners/disableLearner",
  async (learnerId, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.put(`/users/${learnerId}/disable`);
      dispatch(fetchLearner());
      return res.data;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.message);
    }
  }
);

export const enableLearner = createAsyncThunk(
  "learners/enableLearner",
  async (learnerId, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.put(`/users/${learnerId}/enable`);
      dispatch(fetchLearner());
      return res.data;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.message);
    }
  }
);

const learnersSlice = createSlice({
  name: "learnersSlice",
  initialState,
  reducers: {
    fetchLearnerRefreshed(state, action) {
      state.fetchLearnerError = null;
      state.fetchLearnerStatus = "idle";
    },
    disableLearnerRefreshed(state, action) {
      state.disableLearnerError = null;
      state.disableLearnerStatus = "idle";
    },
    enableLearnerRefreshed(state, action) {
      state.enableLearnerError = null;
      state.enableLearnerStatus = "idle";
    },
    setLearnerIdToDisable(state, action) {
      state.learnerIdToDisable = action.payload;
    },
    setLearnerIdToEnable(state, action) {
      state.learnerIdToEnable = action.payload;
    },
    search(state, action) {
      console.log(action.payload);
      state.searchResult = state.learners.filter((c) =>
        c.fullName.toLowerCase().includes(String(action.payload).toLowerCase())
      );
    },
  },
  extraReducers: {
    [fetchLearner.pending]: (state, action) => {
      state.fetchLearnerStatus = "loading";
    },
    [fetchLearner.fulfilled]: (state, action) => {
      state.searchResult = action.payload.users;
      state.fetchLearnerStatus = "succeeded";
      state.learners = action.payload.users;
    },
    [fetchLearner.rejected]: (state, action) => {
      state.fetchLearnerStatus = "failed";
      state.fetchLearnerError = action.payload;
    },
    [disableLearner.pending]: (state, action) => {
      state.disableLearnerStatus = "loading";
    },
    [disableLearner.fulfilled]: (state, action) => {
      state.disableLearnerStatus = "succeeded";
    },
    [disableLearner.rejected]: (state, action) => {
      state.disableLearnerStatus = "failed";
      state.disableLearnerError = action.payload;
    },
    [enableLearner.pending]: (state, action) => {
      state.enableLearnerStatus = "loading";
    },
    [enableLearner.fulfilled]: (state, action) => {
      state.enableLearnerStatus = "succeeded";
    },
    [enableLearner.rejected]: (state, action) => {
      state.enableLearnerStatus = "failed";
      state.enableLearnerError = action.payload;
    },
  },
});

export const {
  fetchLearnerRefreshed,
  disableLearnerRefreshed,
  enableLearnerRefreshed,
  search,
  setLearnerIdToEnable,
  setLearnerIdToDisable,
} = learnersSlice.actions;

export default learnersSlice.reducer;
