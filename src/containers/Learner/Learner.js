import React, { useEffect, useCallback } from "react";
import useStyles from "./Learner.styles";
import {
  Grid,
  Paper,
  IconButton,
  InputBase,
  Snackbar,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import LearnerTable from "./LearnerTable/LearnerTable";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchLearner,
  search,
  fetchLearnerRefreshed,
  disableLearner,
  disableLearnerRefreshed,
  enableLearner,
  enableLearnerRefreshed,
  setLearnerIdToDisable,
  setLearnerIdToEnable,
} from "./LearnerSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Spinner from "../../components/Spinner/Spinner";
import RefreshIcon from "@material-ui/icons/Refresh";

const useFetchLearner = () => {
  const dispatch = useDispatch();

  const fetchLearnerStatus = useSelector(
    (state) => state.learners.fetchLearnerStatus
  );
  const fetchLearnerError = useSelector(
    (state) => state.learners.fetchLearnerError
  );

  useEffect(() => {
    if (fetchLearnerStatus === "idle") {
      (async () => {
        try {
          const fetchLearnerResult = await dispatch(fetchLearner());
          unwrapResult(fetchLearnerResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }
    return () => {
      if (
        fetchLearnerStatus === "failed" ||
        fetchLearnerStatus === "succeeded"
      ) {
        dispatch(fetchLearnerRefreshed());
      }
    };
  }, [dispatch, fetchLearnerStatus]);

  return [fetchLearnerStatus, fetchLearnerError];
};

const useDisableLearner = () => {
  const dispatch = useDispatch();

  const disableLearnerStatus = useSelector(
    (state) => state.learners.disableLearnerStatus
  );
  const disableLearnerError = useSelector(
    (state) => state.learners.disableLearnerError
  );

  const handleDisableLearner = async (learnerId) => {
    try {
      const disableLearnerRes = await dispatch(disableLearner(learnerId));
      unwrapResult(disableLearnerRes);
    } catch (err) {
      console.log(err);
    }
  };

  return [disableLearnerStatus, disableLearnerError, handleDisableLearner];
};

const useEnableLearner = () => {
  const dispatch = useDispatch();

  const enableLearnerStatus = useSelector(
    (state) => state.learners.enableLearnerStatus
  );
  const enableLearnerError = useSelector(
    (state) => state.learners.enableLearnerError
  );

  const handleEnableLearner = async (learnerId) => {
    try {
      const enableLearnerRes = await dispatch(enableLearner(learnerId));
      unwrapResult(enableLearnerRes);
    } catch (err) {
      console.log(err);
    }
  };

  return [enableLearnerStatus, enableLearnerError, handleEnableLearner];
};

const Learner = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // Application state
  const searchResult = useSelector((state) => state.learners.searchResult);
  const learnerIdToDisable = useSelector(
    (state) => state.learners.learnerIdToDisable
  );
  const learnerIdToEnable = useSelector(
    (state) => state.learners.learnerIdToEnable
  );

  // Fetch Learner state
  const [fetchLearnerStatus, fetchLearnerError] = useFetchLearner();

  // Disable Learner state
  const [
    disableLearnerStatus,
    disableLearnerError,
    handleDisableLearner,
  ] = useDisableLearner();

  // Disable Learner state
  const [
    enableLearnerStatus,
    enableLearnerError,
    handleEnableLearner,
  ] = useEnableLearner();

  const handleSearch = (e) => {
    dispatch(search(e.target.value));
  };

  const handleDisable = useCallback(async () => {
    await handleDisableLearner(learnerIdToDisable);
    dispatch(setLearnerIdToDisable(null));
  }, [handleDisableLearner, dispatch, learnerIdToDisable]);

  const handleEnable = useCallback(async () => {
    await handleEnableLearner(learnerIdToEnable);
    dispatch(setLearnerIdToEnable(null));
  }, [handleEnableLearner, dispatch, learnerIdToEnable]);

  return (
    <div className={classes.learner}>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={fetchLearnerStatus === "failed" ? true : false}
        autoHideDuration={6000}
        message={fetchLearnerError}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => dispatch(fetchLearnerRefreshed())}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <ConfirmDialog
        isOpen={Boolean(learnerIdToDisable)}
        onCancel={() => dispatch(setLearnerIdToDisable(null))}
        onSubmit={handleDisable}
        onLoading={disableLearnerStatus === "loading"}
        onClose={() => dispatch(disableLearnerRefreshed())}
        error={disableLearnerError}
        success={
          disableLearnerStatus === "succeeded"
            ? "Disable learner successfully"
            : null
        }
        title="Do you want to disable the Learner?"
      />
      <ConfirmDialog
        isOpen={Boolean(learnerIdToEnable)}
        onCancel={() => dispatch(setLearnerIdToEnable(null))}
        onSubmit={handleEnable}
        onLoading={enableLearnerStatus === "loading"}
        onClose={() => dispatch(enableLearnerRefreshed())}
        error={enableLearnerError}
        success={
          enableLearnerStatus === "succeeded"
            ? "Enable learner successfully"
            : null
        }
        title="Do you want to enable the Learner?"
      />
      {fetchLearnerStatus === "loading" || fetchLearnerStatus === "failed" ? (
        <Spinner />
      ) : (
        <Grid container justify="center">
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
                placeholder="Enter learner name"
                inputProps={{
                  "aria-label": "enter learner name",
                }}
              />
            </Paper>
          </Grid>
          <Grid style={{ marginTop: 24 }} item xs={11}>
            <LearnerTable learners={searchResult} />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Learner;
