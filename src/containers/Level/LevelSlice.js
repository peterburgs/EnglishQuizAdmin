import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/index";
import _ from "lodash";

const initialState = {
  levels: [],
  addLevelStatus: "idle",
  addLevelError: null,
  deleteLevelStatus: "idle",
  deleteLevelError: null,
  updateLevelStatus: "idle",
  updateLevelError: null,
  fetchLevelStatus: "idle",
  fetchLevelError: null,
  levelIdToEdit: null,
  levelIdToDelete: null,
  searchResult: [],
};

export const addLevel = createAsyncThunk(
  "levels/addLevel",
  async (level, { rejectWithValue }) => {
    try {
      const data = { ...level, isRemoved: false };
      const response = await api.post("/levels", data);
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

export const updateLevel = createAsyncThunk(
  "levels/updateLevel",
  async (level, { rejectWithValue, getState }) => {
    console.log(level);
    try {
      const res = await api.put(
        `/Levels/${getState().levels.levelIdToEdit}`,
        level
      );
      return res.data;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.message);
    }
  }
);

export const deleteLevel = createAsyncThunk(
  "levels/deleteLevel",
  async (levelId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/levels/${levelId}`);
      return res.data;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.message);
    }
  }
);

export const fetchLevel = createAsyncThunk(
  "levels/fetchLevel",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/levels");
      return res.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

export const getLevelById = createAsyncThunk(
  "levels/getLevelById",
  async (levelId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/levels/${levelId}`);
      return res.data;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.message);
    }
  }
);

const levelsSlice = createSlice({
  name: "levels",
  initialState,
  reducers: {
    addLevelRefreshed(state) {
      state.addLevelError = null;
      state.addLevelStatus = "idle";
    },
    updateLevelRefreshed(state) {
      state.updateLevelError = null;
      state.updateLevelStatus = "idle";
    },
    deleteLevelRefreshed(state) {
      state.deleteLevelError = null;
      state.deleteLevelStatus = "idle";
    },
    fetchLevelRefreshed(state) {
      state.fetchLevelStatus = "idle";
      state.fetchLevelError = null;
    },
    setLevelIdToEdit(state, action) {
      state.levelIdToEdit = action.payload;
    },
    setLevelIdToDelete(state, action) {
      state.levelIdToDelete = action.payload;
    },
    search(state, action) {
      console.log(action.payload);
      state.searchResult = state.levels.filter((c) =>
        c.name.toLowerCase().includes(String(action.payload).toLowerCase())
      );
    },
  },
  extraReducers: {
    // Add Level reducers
    [addLevel.fulfilled]: (state, action) => {
      state.levels.push(action.payload.level);
      state.searchResult = _.cloneDeep(state.levels);
      state.addLevelStatus = "succeeded";
    },
    [addLevel.pending]: (state, action) => {
      state.addLevelStatus = "loading";
    },
    [addLevel.rejected]: (state, action) => {
      state.addLevelStatus = "failed";
      state.addLevelError = action.payload;
    },
    // Delete Level reducers
    [deleteLevel.fulfilled]: (state, action) => {
      state.levels = state.levels.filter(
        (c) => c._id !== action.payload.level._id
      );
      state.searchResult = state.searchResult.filter(
        (c) => c._id !== action.payload.level._id
      );
      state.deleteLevelStatus = "succeeded";
    },
    [deleteLevel.pending]: (state, action) => {
      state.deleteLevelStatus = "loading";
    },
    [deleteLevel.rejected]: (state, action) => {
      state.deleteLevelStatus = "failed";
      state.deleteLevelError = action.payload;
    },
    // Update Level reducers
    [updateLevel.fulfilled]: (state, action) => {
      state.updateLevelStatus = "succeeded";
      console.log(action.payload);
      let index1 = state.levels.findIndex(
        (c) => c._id === action.payload.level._id
      );
      let index2 = state.searchResult.findIndex(
        (c) => c._id === action.payload.level._id
      );
      if (index1 !== -1 && index2 !== -1) {
        state.levels[index1] = _.cloneDeep(action.payload.level);
        state.searchResult[index2] = _.cloneDeep(action.payload.level);
      }
    },
    [updateLevel.pending]: (state, action) => {
      state.updateLevelStatus = "loading";
    },
    [updateLevel.rejected]: (state, action) => {
      state.updateLevelStatus = "failed";
      state.updateLevelError = action.payload;
    },
    // fetch Level reducers
    [fetchLevel.fulfilled]: (state, action) => {
      state.levels = action.payload.levels;
      state.searchResult = action.payload.levels;
      state.fetchLevelStatus = "succeeded";
    },
    [fetchLevel.pending]: (state, action) => {
      state.fetchLevelStatus = "loading";
    },
    [fetchLevel.rejected]: (state, action) => {
      state.fetchLevelStatus = "failed";
      state.fetchLevelError = action.payload;
    },
  },
});

export const {
  addLevelRefreshed,
  updateLevelRefreshed,
  setLevelIdToEdit,
  setLevelIdToDelete,
  fetchLevelRefreshed,
  deleteLevelRefreshed,
  search,
} = levelsSlice.actions;

export default levelsSlice.reducer;
