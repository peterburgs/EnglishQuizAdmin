import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/index";
import _ from "lodash";

const initialState = {
  pools: [],
  addPoolStatus: "idle",
  addPoolError: null,
  deletePoolStatus: "idle",
  deletePoolError: null,
  updatePoolStatus: "idle",
  updatePoolError: null,
  fetchPoolStatus: "idle",
  fetchPoolError: null,
  poolIdToEdit: null,
  poolIdToDelete: null,
  searchResult: [],
  currentPool: null,
};

export const addPool = createAsyncThunk(
  "pools/addPool",
  async (pool, { rejectWithValue }) => {
    try {
      const data = { ...pool, isRemoved: false };
      const response = await api.post("/Pools", data);
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

export const updatePool = createAsyncThunk(
  "pools/updatePool",
  async (pool, { rejectWithValue, getState }) => {
    console.log(pool);
    try {
      const res = await api.put(
        `/Pools/${getState().pools.poolIdToEdit}`,
        pool
      );
      return res.data;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.message);
    }
  }
);

export const deletePool = createAsyncThunk(
  "pools/deletePool",
  async (poolId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/Pools/${poolId}`);
      return res.data;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.message);
    }
  }
);

export const fetchPool = createAsyncThunk(
  "pools/fetchPool",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/pools");
      return res.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

export const getPoolById = createAsyncThunk(
  "pools/getPoolById",
  async (poolId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/Pools/${poolId}`);
      return res.data;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.message);
    }
  }
);

const PoolsSlice = createSlice({
  name: "pools",
  initialState,
  reducers: {
    addPoolRefreshed(state) {
      state.addPoolError = null;
      state.addPoolStatus = "idle";
    },
    updatePoolRefreshed(state) {
      state.updatePoolError = null;
      state.updatePoolStatus = "idle";
    },
    deletePoolRefreshed(state) {
      state.deletePoolError = null;
      state.deletePoolStatus = "idle";
    },
    fetchPoolRefreshed(state) {
      state.fetchPoolStatus = "idle";
      state.fetchPoolError = null;
    },
    setPoolIdToEdit(state, action) {
      state.poolIdToEdit = action.payload;
    },
    setPoolIdToDelete(state, action) {
      state.poolIdToDelete = action.payload;
    },
    search(state, action) {
      console.log(action.payload);
      state.searchResult = state.pools.filter((c) =>
        c.name.toLowerCase().includes(String(action.payload).toLowerCase())
      );
    },
    setCurrentPool(state, action) {
      state.currentPool = action.payload;
    },
  },
  extraReducers: {
    // Add Pool reducers
    [addPool.fulfilled]: (state, action) => {
      state.pools.push(action.payload.pool);
      state.searchResult = _.cloneDeep(state.pools);
      state.addPoolStatus = "succeeded";
    },
    [addPool.pending]: (state, action) => {
      state.addPoolStatus = "loading";
    },
    [addPool.rejected]: (state, action) => {
      state.addPoolStatus = "failed";
      state.addPoolError = action.payload;
    },
    // Delete Pool reducers
    [deletePool.fulfilled]: (state, action) => {
      state.pools = state.pools.filter(
        (c) => c._id !== action.payload.pool._id
      );
      state.searchResult = state.searchResult.filter(
        (c) => c._id !== action.payload.pool._id
      );
      state.deletePoolStatus = "succeeded";
    },
    [deletePool.pending]: (state, action) => {
      state.deletePoolStatus = "loading";
    },
    [deletePool.rejected]: (state, action) => {
      state.deletePoolStatus = "failed";
      state.deletePoolError = action.payload;
    },
    // Update Pool reducers
    [updatePool.fulfilled]: (state, action) => {
      state.updatePoolStatus = "succeeded";
      console.log(action.payload);
      let index1 = state.pools.findIndex(
        (c) => c._id === action.payload.pool._id
      );
      let index2 = state.searchResult.findIndex(
        (c) => c._id === action.payload.pool._id
      );
      if (index1 !== -1 && index2 !== -1) {
        state.pools[index1] = _.cloneDeep(action.payload.pool);
        state.searchResult[index2] = _.cloneDeep(action.payload.pool);
      }
    },
    [updatePool.pending]: (state, action) => {
      state.updatePoolStatus = "loading";
    },
    [updatePool.rejected]: (state, action) => {
      state.updatePoolStatus = "failed";
      state.updatePoolError = action.payload;
    },
    // fetch Pool reducers
    [fetchPool.fulfilled]: (state, action) => {
      state.pools = action.payload.pools;
      state.searchResult = action.payload.pools;
      state.fetchPoolStatus = "succeeded";
    },
    [fetchPool.pending]: (state, action) => {
      state.fetchPoolStatus = "loading";
    },
    [fetchPool.rejected]: (state, action) => {
      state.fetchPoolStatus = "failed";
      state.fetchPoolError = action.payload;
    },
  },
});

export const {
  addPoolRefreshed,
  updatePoolRefreshed,
  setPoolIdToEdit,
  setPoolIdToDelete,
  fetchPoolRefreshed,
  deletePoolRefreshed,
  search,
  setCurrentPool,
} = PoolsSlice.actions;

export default PoolsSlice.reducer;
