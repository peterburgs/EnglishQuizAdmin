import React, { useState, useEffect, useCallback } from "react";
import useStyles from "./PoolQuestion.styles";
import {
  Grid,
  Paper,
  IconButton,
  InputBase,
  Snackbar,
  Breadcrumbs,
  Typography,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import QuestionTable from "../../Question/QuestionTable/QuestionTable";
import QuestionDialog from "../../Question/QuestionDialog/QuestionDialog";
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchQuestionByPoolId,
  setQuestionIdToEdit,
  setQuestionIdToDelete,
  search,
  fetchQuestionRefreshed,
  deleteQuestion,
  deleteQuestionRefreshed,
} from "../../Question/QuestionSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Spinner from "../../../components/Spinner/Spinner";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Link, useHistory } from "react-router-dom";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

const useFetchQuestion = (poolId) => {
  const dispatch = useDispatch();

  const fetchQuestionStatus = useSelector(
    (state) => state.questions.fetchQuestionStatus
  );
  const fetchQuestionError = useSelector(
    (state) => state.questions.fetchQuestionError
  );

  useEffect(() => {
    if (fetchQuestionStatus === "idle") {
      (async () => {
        try {
          const fetchQuestionResult = await dispatch(
            fetchQuestionByPoolId(poolId)
          );
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
  }, [dispatch, fetchQuestionStatus, poolId]);

  return [fetchQuestionStatus, fetchQuestionError];
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

const PoolQuestion = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [openedQuestionDialog, setOpenedQuestionDialog] = useState(false);

  // Application state
  const searchResult = useSelector((state) => state.questions.searchResult);
  const questionIdToDelete = useSelector(
    (state) => state.questions.questionIdToDelete
  );
  const questionIdToEdit = useSelector(
    (state) => state.questions.questionIdToEdit
  );

  const currentPool = useSelector((state) => state.pools.currentPool);

  // Fetch Question state
  const [fetchQuestionStatus, fetchQuestionError] = useFetchQuestion(
    currentPool ? currentPool._id : null
  );

  // Delete Question state
  const [
    deleteQuestionStatus,
    deleteQuestionError,
    handleDeleteQuestion,
  ] = useDeleteQuestion();

  const handleSearch = (e) => {
    dispatch(search(e.target.value));
  };

  const handleDelete = useCallback(async () => {
    await handleDeleteQuestion(questionIdToDelete);
    dispatch(setQuestionIdToDelete(null));
  }, [handleDeleteQuestion, dispatch, questionIdToDelete]);

  return (
    <div className={classes.poolQuestion}>
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
        isOpen={questionIdToEdit ? true : openedQuestionDialog}
        onCancel={() => {
          questionIdToEdit
            ? dispatch(setQuestionIdToEdit(null))
            : setOpenedQuestionDialog(false);
        }}
        onFinish={() => {
          questionIdToEdit
            ? dispatch(setQuestionIdToEdit(null))
            : setOpenedQuestionDialog(false);
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
              <Link style={{ color: "white" }} to="/pools">
                <Typography variant="h5">Pools</Typography>
              </Link>
              <Typography variant="h5" style={{ color: "white" }}>
                {currentPool.name}
              </Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item xs={11}>
            <Paper component="form" className={classes.paper}>
              <IconButton
                type="submit"
                className={classes.iconButton}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
              <InputBase
                onChange={handleSearch}
                className={classes.input}
                placeholder="Enter question code"
                inputProps={{
                  "aria-label": "enter question code",
                }}
              />
            </Paper>
          </Grid>
          <Grid style={{ marginTop: 24 }} item xs={11}>
            <QuestionTable
              onAddQuestion={() => setOpenedQuestionDialog(true)}
              questions={searchResult}
            />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default PoolQuestion;
