import React, { useEffect, useCallback, useState } from "react";
import useStyles from "./TopicQuestion.styles";
import {
  Grid,
  IconButton,
  Snackbar,
  Breadcrumbs,
  Typography,
} from "@material-ui/core";
import QuestionTable from "../../Question/QuestionTable/QuestionTable";
import QuestionDialog from "../../Question/QuestionDialog/QuestionDialog";
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchQuestionByTopicId,
  setQuestionIdToEdit,
  setQuestionIdToDelete,
  fetchQuestionRefreshed,
  deleteQuestion,
  deleteQuestionRefreshed,
} from "../../Question/QuestionSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Spinner from "../../../components/Spinner/Spinner";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Link } from "react-router-dom";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import AddQuestionDialog from "./AddQuestionDialog/AddQuestionDialog";

const useFetchQuestion = (topicId) => {
  const dispatch = useDispatch();

  const fetchQuestionStatus = useSelector(
    (state) => state.questions.fetchQuestionStatus
  );
  const fetchQuestionError = useSelector(
    (state) => state.questions.fetchQuestionError
  );
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  const [memoOldSelectedQuestions, setMemoOldSelectedQuestions] = useState([]);

  useEffect(() => {
    if (fetchQuestionStatus === "idle" && isAddingQuestion === false) {
      (async () => {
        try {
          const fetchQuestionResult = await dispatch(
            fetchQuestionByTopicId(topicId)
          );
          if (fetchQuestionResult.payload.questions.length !== 0) {
            setMemoOldSelectedQuestions(fetchQuestionResult.payload.questions);
          }
          unwrapResult(fetchQuestionResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }
    return () => {
      if (
        fetchQuestionStatus === "failed" ||
        fetchQuestionStatus === "succeeded"
      ) {
        dispatch(fetchQuestionRefreshed());
      }
    };
  }, [dispatch, fetchQuestionStatus, topicId, isAddingQuestion]);

  return [
    fetchQuestionStatus,
    fetchQuestionError,
    setIsAddingQuestion,
    memoOldSelectedQuestions,
  ];
};

const useDeleteQuestion = () => {
  const dispatch = useDispatch();

  const deleteQuestionStatus = useSelector(
    (state) => state.questions.deleteQuestionStatus
  );
  const deleteQuestionError = useSelector(
    (state) => state.questions.deleteQuestionError
  );

  const handleDeleteQuestion = async (questionId) => {
    try {
      const deleteQuestionRes = await dispatch(deleteQuestion(questionId));
      unwrapResult(deleteQuestionRes);
    } catch (err) {
      console.log(err);
    }
  };

  return [deleteQuestionStatus, deleteQuestionError, handleDeleteQuestion];
};

const TopicQuestion = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // Application state
  const questionIdToDelete = useSelector(
    (state) => state.questions.questionIdToDelete
  );
  const questionIdToEdit = useSelector(
    (state) => state.questions.questionIdToEdit
  );

  const [
    openedAddQuestionToTopicDialog,
    setOpenedAddQuestionToTopicDialog,
  ] = useState(false);

  const [lessonOrder, setLessonOrder] = useState(null);

  const questions = useSelector((state) => state.questions.questions);

  const currentTopic = useSelector((state) => state.topics.currentTopic);

  // Fetch Question state
  const [
    fetchQuestionStatus,
    fetchQuestionError,
    setIsAddingQuestion,
    memoOldSelectedQuestions,
  ] = useFetchQuestion(currentTopic._id);

  // Delete Question state
  const [
    deleteQuestionStatus,
    deleteQuestionError,
    handleDeleteQuestion,
  ] = useDeleteQuestion();

  const handleDelete = useCallback(async () => {
    await handleDeleteQuestion(questionIdToDelete);
    dispatch(setQuestionIdToDelete(null));
  }, [handleDeleteQuestion, dispatch, questionIdToDelete]);

  return (
    <div className={classes.topicQuestion}>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={fetchQuestionStatus === "failed" ? true : false}
        autoHideDuration={6000}
        message={fetchQuestionError}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => dispatch(fetchQuestionRefreshed())}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <QuestionDialog
        isOpen={questionIdToEdit}
        onCancel={() => dispatch(setQuestionIdToEdit(null))}
        onFinish={() => dispatch(setQuestionIdToEdit(null))}
      />
      <AddQuestionDialog
        oldSelectedQuestions={memoOldSelectedQuestions.filter(
          (q) => q.lessonOrder === lessonOrder
        )}
        lessonOrder={lessonOrder}
        isOpen={openedAddQuestionToTopicDialog}
        onCancel={() => {
          setOpenedAddQuestionToTopicDialog(false);
          setIsAddingQuestion(false);
        }}
        onFinish={() => {
          setOpenedAddQuestionToTopicDialog(false);
          setIsAddingQuestion(false);
        }}
      />
      <ConfirmDialog
        isOpen={Boolean(questionIdToDelete)}
        onCancel={() => dispatch(setQuestionIdToDelete(null))}
        onSubmit={handleDelete}
        onLoading={deleteQuestionStatus === "loading"}
        onClose={() => dispatch(deleteQuestionRefreshed())}
        error={deleteQuestionError}
        success={
          deleteQuestionStatus === "succeeded"
            ? "Delete question successfully"
            : null
        }
        title="Do you want to delete the question?"
      />
      {fetchQuestionStatus === "loading" || fetchQuestionStatus === "failed" ? (
        <Spinner />
      ) : (
        <Grid container justify="center">
          <Grid item xs={11} style={{ marginBottom: "1rem" }}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="large" />}
              style={{ color: "white" }}
              aria-label="breadcrumb"
            >
              <Link style={{ color: "white" }} to="/topics">
                <Typography variant="h5">Topics</Typography>
              </Link>
              <Typography variant="h5" style={{ color: "white" }}>
                {currentTopic.name}
              </Typography>
            </Breadcrumbs>
          </Grid>
          <Grid style={{ marginTop: 24 }} item xs={11}>
            <Typography
              variant="h4"
              style={{ color: "white", marginBottom: "1rem" }}
            >
              Lesson 1
            </Typography>
            <QuestionTable
              onAddQuestion={() => {
                setOpenedAddQuestionToTopicDialog(true);
                setLessonOrder(1);
                setIsAddingQuestion(true);
                dispatch(fetchQuestionRefreshed());
              }}
              questions={questions.filter((q) => q.lessonOrder === 1)}
            />
            <Typography
              variant="h4"
              style={{ color: "black", marginBottom: "1rem" }}
            >
              Lesson 2
            </Typography>
            <QuestionTable
              onAddQuestion={() => {
                setOpenedAddQuestionToTopicDialog(true);
                setLessonOrder(2);
                setIsAddingQuestion(true);
                dispatch(fetchQuestionRefreshed());
              }}
              questions={questions.filter((q) => q.lessonOrder === 2)}
            />
            <Typography
              variant="h4"
              style={{ color: "black", marginBottom: "1rem" }}
            >
              Lesson 3
            </Typography>
            <QuestionTable
              onAddQuestion={() => {
                setOpenedAddQuestionToTopicDialog(true);
                setLessonOrder(3);
                setIsAddingQuestion(true);
                dispatch(fetchQuestionRefreshed());
              }}
              questions={questions.filter((q) => q.lessonOrder === 3)}
            />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default TopicQuestion;
