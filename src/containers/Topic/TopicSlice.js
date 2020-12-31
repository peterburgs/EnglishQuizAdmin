import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/index";
import _ from "lodash";

const initialState = {
  topics: [],
  addTopicStatus: "idle",
  addTopicError: null,
  deleteTopicStatus: "idle",
  deleteTopicError: null,
  updateTopicStatus: "idle",
  updateTopicError: null,
  fetchTopicStatus: "idle",
  fetchTopicError: null,
  topicIdToEdit: null,
  topicIdToDelete: null,
  searchResult: [],
  count: 0,
};

export const addTopic = createAsyncThunk(
  "topics/addTopic",
  async ({ topicInfo, selectedQuestions }, { rejectWithValue, getState }) => {
    try {
      const data = new FormData();
      data.append("name", topicInfo.name);
      data.append("level", topicInfo.level);
      data.append("isRemoved", false);
      data.append("topicImage", topicInfo.topicImage[0]);
      data.append("order", getState().topics.count + 1);
      const addTopicResult = await api.post("/topics", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const questionsToAdd = {
        topic: addTopicResult.data.topic._id,
        questions: selectedQuestions,
      };
      await api.post("/topics/edit", questionsToAdd);
      return addTopicResult.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

export const updateTopic = createAsyncThunk(
  "topics/updateTopic",
  async (topic, { rejectWithValue, getState }) => {
    try {
      const data = new FormData();
      data.append("name", topic.name);
      data.append("level", topic.level);
      data.append("oldLevel", topic.oldLevel);
      data.append("isRemoved", false);
      if (topic.topicImage.length !== 0) {
        data.append("topicImage", topic.topicImage[0]);
      }
      const res = await api.put(
        `/topics/edit/${getState().topics.topicIdToEdit}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return res.data;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.message);
    }
  }
);

export const deleteTopic = createAsyncThunk(
  "topics/deleteTopic",
  async (topicId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/topics/${topicId}`);
      return res.data;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.message);
    }
  }
);

export const fetchTopic = createAsyncThunk(
  "topics/fetchTopic",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/topics");
      return res.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

export const getTopicById = createAsyncThunk(
  "topics/getTopicById",
  async (topicId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/topics/${topicId}`);
      return res.data;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.message);
    }
  }
);

const topicsSlice = createSlice({
  name: "topics",
  initialState,
  reducers: {
    addTopicRefreshed(state) {
      state.addTopicError = null;
      state.addTopicStatus = "idle";
    },
    updateTopicRefreshed(state) {
      state.updateTopicError = null;
      state.updateTopicStatus = "idle";
    },
    deleteTopicRefreshed(state) {
      state.deleteTopicError = null;
      state.deleteTopicStatus = "idle";
    },
    fetchTopicRefreshed(state) {
      state.fetchTopicStatus = "idle";
      state.fetchTopicError = null;
    },
    setTopicIdToEdit(state, action) {
      state.topicIdToEdit = action.payload;
    },
    setTopicIdToDelete(state, action) {
      state.topicIdToDelete = action.payload;
    },
    search(state, action) {
      console.log(action.payload);
      state.searchResult = state.topics.filter((c) =>
        c.name.toLowerCase().includes(String(action.payload).toLowerCase())
      );
    },
  },
  extraReducers: {
    // Add Topic reducers
    [addTopic.fulfilled]: (state, action) => {
      const topic = action.payload.topic;
      topic.level = action.payload.level;
      state.topics.push(topic);
      state.searchResult = _.cloneDeep(state.topics);
      state.addTopicStatus = "succeeded";
    },
    [addTopic.pending]: (state, action) => {
      state.addTopicStatus = "loading";
    },
    [addTopic.rejected]: (state, action) => {
      state.addTopicStatus = "failed";
      state.addTopicError = action.payload;
    },
    // Delete Topic reducers
    [deleteTopic.fulfilled]: (state, action) => {
      state.topics = state.topics.filter(
        (c) => c._id !== action.payload.topic._id
      );
      state.searchResult = state.searchResult.filter(
        (c) => c._id !== action.payload.topic._id
      );
      state.deleteTopicStatus = "succeeded";
    },
    [deleteTopic.pending]: (state, action) => {
      state.deleteTopicStatus = "loading";
    },
    [deleteTopic.rejected]: (state, action) => {
      state.deleteTopicStatus = "failed";
      state.deleteTopicError = action.payload;
    },
    // Update Topic reducers
    [updateTopic.fulfilled]: (state, action) => {
      state.updateTopicStatus = "succeeded";
      console.log(action.payload);
      let index1 = state.topics.findIndex(
        (c) => c._id === action.payload.topic._id
      );
      let index2 = state.searchResult.findIndex(
        (c) => c._id === action.payload.topic._id
      );
      if (index1 !== -1 && index2 !== -1) {
        state.topics[index1] = _.cloneDeep(action.payload.topic);
        state.searchResult[index2] = _.cloneDeep(action.payload.topic);
      }
    },
    [updateTopic.pending]: (state, action) => {
      state.updateTopicStatus = "loading";
    },
    [updateTopic.rejected]: (state, action) => {
      state.updateTopicStatus = "failed";
      state.updateTopicError = action.payload;
    },
    // fetch Topic reducers
    [fetchTopic.fulfilled]: (state, action) => {
      state.topics = action.payload.topics;
      state.count = action.payload.count;
      state.searchResult = action.payload.topics;
      state.fetchTopicStatus = "succeeded";
    },
    [fetchTopic.pending]: (state, action) => {
      state.fetchTopicStatus = "loading";
    },
    [fetchTopic.rejected]: (state, action) => {
      state.fetchTopicStatus = "failed";
      state.fetchTopicError = action.payload;
    },
  },
});

export const {
  addTopicRefreshed,
  updateTopicRefreshed,
  setTopicIdToEdit,
  setTopicIdToDelete,
  fetchTopicRefreshed,
  deleteTopicRefreshed,
  search,
} = topicsSlice.actions;

export default topicsSlice.reducer;
