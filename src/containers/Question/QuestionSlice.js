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
  questionIdToView: null,
  questionIdToDelete: null,
  searchResult: [],
};

export const addQuestion = createAsyncThunk(
  "questions/addQuestion",
  async (question, { rejectWithValue, getState }) => {
    try {
      console.log(question);
      const data = new FormData();
      data.append("questionRequirement", question.questionRequirement);
      data.append("questionText", question.questionText);
      data.append("type", question.type);
      data.append("difficulty", question.difficulty);
      if (question.type === "singleSelection") {
        data.append(
          "singleSelection",
          JSON.stringify(question.singleSelection)
        );
      } else if (question.type === "translate") {
        data.append("translate", JSON.stringify(question.translate));
      } else {
        data.append("arrange", JSON.stringify(question.arrange));
      }
      data.append("isRemoved", false);
      if (getState().pools.currentPool) {
        data.append("pool", getState().pools.currentPool._id);
      }
      if (question.questionImage.length !== 0) {
        data.append("questionImage", question.questionImage[0]);
      }

      const response = await api.post("/questions", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
      const data = new FormData();
      data.append("questionRequirement", question.questionRequirement);
      data.append("questionText", question.questionText);
      data.append("type", question.type);
      data.append("difficulty", question.difficulty);
      if (question.type === "singleSelection") {
        data.append(
          "singleSelection",
          JSON.stringify(question.singleSelection)
        );
      } else if (question.type === "translate") {
        data.append("translate", JSON.stringify(question.translate));
      } else {
        data.append("arrange", JSON.stringify(question.arrange));
      }
      data.append("isRemoved", false);
      if (getState().pools.currentPool) {
        data.append("pool", getState().pools.currentPool._id);
      }
      if (question.questionImage.length !== 0) {
        data.append("questionImage", question.questionImage[0]);
      }

      const res = await api.put(
        `/questions/${getState().questions.questionIdToEdit}`,
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

export const fetchQuestionByTopicId = createAsyncThunk(
  "questions/fetchQuestionByTopicId",
  async (topicId, { rejectWithValue, getState }) => {
    try {
      const res = await api.get("/questions/", {
        params: { topicId },
      });
      return res.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

export const fetchQuestionByPoolId = createAsyncThunk(
  "questions/fetchQuestionByPoolId",
  async (poolId, { rejectWithValue, getState }) => {
    try {
      const res = await api.get("/questions/", {
        params: { poolId },
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
    setQuestionIdToView(state, action) {
      state.questionIdToView = action.payload;
    },
    setQuestionIdToDelete(state, action) {
      state.questionIdToDelete = action.payload;
    },
    search(state, action) {
      console.log(action.payload);
      state.searchResult = state.questions.filter((c) =>
        c.code.toLowerCase().includes(String(action.payload).toLowerCase())
      );
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
    [fetchQuestionByTopicId.fulfilled]: (state, action) => {
      state.questions = action.payload.questions;
      state.searchResult = action.payload.questions;
      state.fetchQuestionStatus = "succeeded";
    },
    [fetchQuestionByTopicId.pending]: (state, action) => {
      state.fetchQuestionStatus = "loading";
    },
    [fetchQuestionByTopicId.rejected]: (state, action) => {
      state.fetchQuestionStatus = "failed";
      state.fetchQuestionError = action.payload;
    },
    [fetchQuestionByPoolId.fulfilled]: (state, action) => {
      state.questions = action.payload.questions;
      state.searchResult = action.payload.questions;
      state.fetchQuestionStatus = "succeeded";
    },
    [fetchQuestionByPoolId.pending]: (state, action) => {
      state.fetchQuestionStatus = "loading";
    },
    [fetchQuestionByPoolId.rejected]: (state, action) => {
      state.fetchQuestionStatus = "failed";
      state.fetchQuestionError = action.payload;
    },
  },
});

export const {
  addQuestionRefreshed,
  updateQuestionRefreshed,
  setQuestionIdToEdit,
  setQuestionIdToView,
  setQuestionIdToDelete,
  fetchQuestionRefreshed,
  deleteQuestionRefreshed,
  search,
  setCurrentPool,
} = QuestionsSlice.actions;

export default QuestionsSlice.reducer;
