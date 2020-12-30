import React, { useState, useEffect, useCallback } from "react";
import useStyles from "./Level.styles";
import {
  Grid,
  Paper,
  IconButton,
  InputBase,
  Snackbar,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import LevelTable from "./LevelTable/LevelTable";
import LevelDialog from "./LevelDialog/LevelDialog";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchLevel,
  setLevelIdToEdit,
  setLevelIdToDelete,
  search,
  fetchLevelRefreshed,
  deleteLevel,
  deleteLevelRefreshed,
} from "./LevelSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Spinner from "../../components/Spinner/Spinner";
import RefreshIcon from "@material-ui/icons/Refresh";

const useFetchLevel = () => {
  const dispatch = useDispatch();

  const fetchLevelStatus = useSelector(
    (state) => state.levels.fetchLevelStatus
  );
  const fetchLevelError = useSelector((state) => state.levels.fetchLevelError);

  useEffect(() => {
    if (fetchLevelStatus === "idle") {
      (async () => {
        try {
          const fetchLevelResult = await dispatch(fetchLevel());
          unwrapResult(fetchLevelResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }
    return () => {
      if (fetchLevelStatus === "failed" || fetchLevelStatus === "succeeded") {
        dispatch(fetchLevelRefreshed());
      }
    };
  }, [dispatch, fetchLevelStatus]);

  return [fetchLevelStatus, fetchLevelError];
};

const useDeleteLevel = () => {
  const dispatch = useDispatch();

  const deleteLevelStatus = useSelector(
    (state) => state.levels.deleteLevelStatus
  );
  const deleteLevelError = useSelector(
    (state) => state.levels.deleteLevelError
  );

  const handleDeleteLevel = async (levelId) => {
    try {
      const deleteLevelRes = await dispatch(deleteLevel(levelId));
      unwrapResult(deleteLevelRes);
    } catch (err) {
      console.log(err);
    }
  };

  return [deleteLevelStatus, deleteLevelError, handleDeleteLevel];
};

const Level = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [openedLevelDialog, setOpenedLevelDialog] = useState(false);

  // Application state
  const searchResult = useSelector((state) => state.levels.searchResult);
  const levelIdToDelete = useSelector((state) => state.levels.levelIdToDelete);
  const levelIdToEdit = useSelector((state) => state.levels.levelIdToEdit);

  // Fetch Level state
  const [fetchLevelStatus, fetchLevelError] = useFetchLevel();

  // Delete Level state
  const [
    deleteLevelStatus,
    deleteLevelError,
    handleDeleteLevel,
  ] = useDeleteLevel();

  const handleSearch = (e) => {
    dispatch(search(e.target.value));
  };

  const handleDelete = useCallback(async () => {
    await handleDeleteLevel(levelIdToDelete);
    dispatch(setLevelIdToDelete(null));
  }, [handleDeleteLevel, dispatch, levelIdToDelete]);

  return (
    <div className={classes.level}>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={fetchLevelStatus === "failed" ? true : false}
        autoHideDuration={6000}
        message={fetchLevelError}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => dispatch(fetchLevelRefreshed())}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <LevelDialog
        isOpen={levelIdToEdit ? true : openedLevelDialog}
        onCancel={() => {
          levelIdToEdit
            ? dispatch(setLevelIdToEdit(null))
            : setOpenedLevelDialog(false);
        }}
        onFinish={() => {
          levelIdToEdit
            ? dispatch(setLevelIdToEdit(null))
            : setOpenedLevelDialog(false);
        }}
      />
      <ConfirmDialog
        isOpen={Boolean(levelIdToDelete)}
        onCancel={() => dispatch(setLevelIdToDelete(null))}
        onSubmit={handleDelete}
        onLoading={deleteLevelStatus === "loading"}
        onClose={() => dispatch(deleteLevelRefreshed())}
        error={deleteLevelError}
        success={
          deleteLevelStatus === "succeeded" ? "Delete Level successfully" : null
        }
        title="Do you want to delete the Level?"
      />
      {fetchLevelStatus === "loading" || fetchLevelStatus === "failed" ? (
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
                placeholder="Enter level name"
                inputProps={{
                  "aria-label": "enter level name",
                }}
              />
            </Paper>
          </Grid>
          <Grid style={{ marginTop: 24 }} item xs={11}>
            <LevelTable
              onAddLevel={() => setOpenedLevelDialog(true)}
              levels={searchResult}
            />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Level;
