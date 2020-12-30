import React, { useState, useEffect, useCallback } from "react";
import useStyles from "./Topic.styles";
import {
  Grid,
  Paper,
  IconButton,
  InputBase,
  Snackbar,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import TopicTable from "./TopicTable/TopicTable";
import AddTopicDialog from "./AddTopicDialog/AddTopicDialog";
import EditTopicDialog from "./EditTopicDialog/EditTopicDialog";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTopic,
  setTopicIdToEdit,
  setTopicIdToDelete,
  search,
  fetchTopicRefreshed,
  deleteTopic,
  deleteTopicRefreshed,
} from "./TopicSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Spinner from "../../components/Spinner/Spinner";
import RefreshIcon from "@material-ui/icons/Refresh";

const useFetchTopic = () => {
  const dispatch = useDispatch();

  const fetchTopicStatus = useSelector(
    (state) => state.topics.fetchTopicStatus
  );
  const fetchTopicError = useSelector((state) => state.topics.fetchTopicError);

  useEffect(() => {
    if (fetchTopicStatus === "idle") {
      (async () => {
        try {
          const fetchTopicResult = await dispatch(fetchTopic());
          unwrapResult(fetchTopicResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }
    return () => {
      if (fetchTopicStatus === "failed" || fetchTopicStatus === "succeeded") {
        dispatch(fetchTopicRefreshed());
      }
    };
  }, [dispatch, fetchTopicStatus]);

  return [fetchTopicStatus, fetchTopicError];
};

const useDeleteTopic = () => {
  const dispatch = useDispatch();

  const deleteTopicStatus = useSelector(
    (state) => state.topics.deleteTopicStatus
  );
  const deleteTopicError = useSelector(
    (state) => state.topics.deleteTopicError
  );

  const handleDeleteTopic = async (topicId) => {
    try {
      const deleteTopicRes = await dispatch(deleteTopic(topicId));
      unwrapResult(deleteTopicRes);
    } catch (err) {
      console.log(err);
    }
  };

  return [deleteTopicStatus, deleteTopicError, handleDeleteTopic];
};

const Topic = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [openedAddTopicDialog, setOpenedAddTopicDialog] = useState(false);

  // Application state
  const searchResult = useSelector((state) => state.topics.searchResult);
  const topicIdToDelete = useSelector((state) => state.topics.topicIdToDelete);
  const topicIdToEdit = useSelector((state) => state.topics.topicIdToEdit);

  // Fetch Topic state
  const [fetchTopicStatus, fetchTopicError] = useFetchTopic();

  // Delete Topic state
  const [
    deleteTopicStatus,
    deleteTopicError,
    handleDeleteTopic,
  ] = useDeleteTopic();

  const handleSearch = (e) => {
    dispatch(search(e.target.value));
  };

  const handleDelete = useCallback(async () => {
    await handleDeleteTopic(topicIdToDelete);
    dispatch(setTopicIdToDelete(null));
  }, [handleDeleteTopic, dispatch, topicIdToDelete]);

  return (
    <div className={classes.topic}>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={fetchTopicStatus === "failed" ? true : false}
        autoHideDuration={6000}
        message={fetchTopicError}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => dispatch(fetchTopicRefreshed())}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <EditTopicDialog
        isOpen={Boolean(topicIdToEdit)}
        onCancel={() => {
          dispatch(setTopicIdToEdit(null));
        }}
        onFinish={() => {
          dispatch(setTopicIdToEdit(null));
        }}
      />
      <AddTopicDialog
        isOpen={openedAddTopicDialog}
        onCancel={() => {
          setOpenedAddTopicDialog(false);
        }}
        onFinish={() => {
          setOpenedAddTopicDialog(false);
        }}
      />
      <ConfirmDialog
        isOpen={Boolean(topicIdToDelete)}
        onCancel={() => dispatch(setTopicIdToDelete(null))}
        onSubmit={handleDelete}
        onLoading={deleteTopicStatus === "loading"}
        onClose={() => dispatch(deleteTopicRefreshed())}
        error={deleteTopicError}
        success={
          deleteTopicStatus === "succeeded" ? "Delete Topic successfully" : null
        }
        title="Do you want to delete the topic?"
      />
      <Grid container justify="center">
        {fetchTopicStatus === "loading" || fetchTopicStatus === "failed" ? (
          <Spinner />
        ) : (
          <React.Fragment>
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
                  placeholder="Enter topic name"
                  inputProps={{
                    "aria-label": "enter topic name",
                  }}
                />
              </Paper>
            </Grid>
            <Grid style={{ marginTop: 24 }} item xs={11}>
              <TopicTable
                onAddTopic={() => setOpenedAddTopicDialog(true)}
                topics={searchResult}
              />
            </Grid>
          </React.Fragment>
        )}
      </Grid>
    </div>
  );
};

export default Topic;
