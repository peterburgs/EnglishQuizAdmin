import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/index";
import _ from "lodash";

const initialState = {
  questions: [],
  addQuestionStatus: "idle",
  addQuestionError: null,
  deleteQuestionStatus: "idle",
  deleteQuestionError: null,
  updateQuestionStatus: "idle",
  updateQuestionError: null,
  fetchQuestionStatus: "idle",
  fetchQuestionError: null,
  questionIdToEdit: null,
  questionIdToDelete: null,
  searchResult: [],
  currentPool: null,
  currentTopic: null,
};

export const addQuestion = createAsyncThunk(
  "questions/addQuestion",
  async (question, { rejectWithValue }) => {
    try {
      const data = { ...question, isRemoved: false };
      const response = await api.post("/questions", data);
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

export const updateQuestion = createAsyncThunk(
  "questions/updateQuestion",
  async (question, { rejectWithValue, getState }) => {
    console.log(question);
    try {
      const res = await api.put(
        `/questions/${getState().questions.questionIdToEdit}`,
        question
      );
      return res.data;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.message);
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  "questions/deleteQuestion",
  async (questionId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/questions/${questionId}`);
      return res.data;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.message);
    }
  }
);

export const fetchQuestion = createAsyncThunk(
  "questions/fetchQuestion",
  async (_, { rejectWithValue, getState }) => {
    try {
      if (getState().questions.currentTopic) {
        const res = await api.get("/questions/", {
          params: { topicId: getState().questions.currentTopic._id },
        });
        return res.data;
      }
      const res = await api.get("/questions/", {
        params: { poolId: getState().questions.currentPool._id },
      });
      return res.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

export const getQuestionById = createAsyncThunk(
  "questions/getQuestionById",
  async (questionId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/questions/${questionId}`);
      return res.data;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err.message);
    }
  }
);

const QuestionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    addQuestionRefreshed(state) {
      state.addQuestionError = null;
      state.addQuestionStatus = "idle";
    },
    updateQuestionRefreshed(state) {
      state.updateQuestionError = null;
      state.updateQuestionStatus = "idle";
    },
    deleteQuestionRefreshed(state) {
      state.deleteQuestionError = null;
      state.deleteQuestionStatus = "idle";
    },
    fetchQuestionRefreshed(state) {
      state.fetchQuestionStatus = "idle";
      state.fetchQuestionError = null;
    },
    setQuestionIdToEdit(state, action) {
      state.questionIdToEdit = action.payload;
    },
    setQuestionIdToDelete(state, action) {
      state.questionIdToDelete = action.payload;
    },
    search(state, action) {
      console.log(action.payload);
      state.searchResult = state.questions.filter((c) =>
        c.name.toLowerCase().includes(String(action.payload).toLowerCase())
      );
    },
    setCurrentPool(state, action) {
      state.currentPool = action.payload;
    },
  },
  extraReducers: {
    // Add Question reducers
    [addQuestion.fulfilled]: (state, action) => {
      state.questions.push(action.payload.question);
      state.searchResult = _.cloneDeep(state.questions);
      state.addQuestionStatus = "succeeded";
    },
    [addQuestion.pending]: (state, action) => {
      state.addQuestionStatus = "loading";
    },
    [addQuestion.rejected]: (state, action) => {
      state.addQuestionStatus = "failed";
      state.addQuestionError = action.payload;
    },
    // Delete Question reducers
    [deleteQuestion.fulfilled]: (state, action) => {
      state.questions = state.questions.filter(
        (c) => c._id !== action.payload.question._id
      );
      state.searchResult = state.searchResult.filter(
        (c) => c._id !== action.payload.question._id
      );
      state.deleteQuestionStatus = "succeeded";
    },
    [deleteQuestion.pending]: (state, action) => {
      state.deleteQuestionStatus = "loading";
    },
    [deleteQuestion.rejected]: (state, action) => {
      state.deleteQuestionStatus = "failed";
      state.deleteQuestionError = action.payload;
    },
    // Update Question reducers
    [updateQuestion.fulfilled]: (state, action) => {
      state.updateQuestionStatus = "succeeded";
      console.log(action.payload);
      let index1 = state.questions.findIndex(
        (c) => c._id === action.payload.question._id
      );
      let index2 = state.searchResult.findIndex(
        (c) => c._id === action.payload.question._id
      );
      if (index1 !== -1 && index2 !== -1) {
        state.questions[index1] = _.cloneDeep(action.payload.question);
        state.searchResult[index2] = _.cloneDeep(action.payload.question);
      }
    },
    [updateQuestion.pending]: (state, action) => {
      state.updateQuestionStatus = "loading";
    },
    [updateQuestion.rejected]: (state, action) => {
      state.updateQuestionStatus = "failed";
      state.updateQuestionError = action.payload;
    },
    // fetch Question reducers
    [fetchQuestion.fulfilled]: (state, action) => {
      state.questions = action.payload.questions;
      state.searchResult = action.payload.questions;
      state.fetchQuestionStatus = "succeeded";
    },
    [fetchQuestion.pending]: (state, action) => {
      state.fetchQuestionStatus = "loading";
    },
    [fetchQuestion.rejected]: (state, action) => {
      state.fetchQuestionStatus = "failed";
      state.fetchQuestionError = action.payload;
    },
  },
});

export const {
  addQuestionRefreshed,
  updateQuestionRefreshed,
  setQuestionIdToEdit,
  setQuestionIdToDelete,
  fetchQuestionRefreshed,
  deleteQuestionRefreshed,
  search,
  setCurrentPool,
} = QuestionsSlice.actions;

export default QuestionsSlice.reducer;
