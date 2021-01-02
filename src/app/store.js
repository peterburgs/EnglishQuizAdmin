import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../containers/Auth/AuthSlice";
import levelReducer from "../containers/Level/LevelSlice";
import topicReducer from "../containers/Topic/TopicSlice";
import poolReducer from "../containers/Pool/PoolSlice";
import questionReducer from "../containers/Question/QuestionSlice";
import learnerReducer from "../containers/Learner/LearnerSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    levels: levelReducer,
    topics: topicReducer,
    pools: poolReducer,
    questions: questionReducer,
    learners: learnerReducer,
  },
  // eslint-disable-next-line no-undef
  devTools: process.env.NODE_ENV === "development",
});
