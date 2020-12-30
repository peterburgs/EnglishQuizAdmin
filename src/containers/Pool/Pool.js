import React, { useState, useEffect, useCallback } from "react";
import useStyles from "./Pool.styles";
import {
  Grid,
  Paper,
  IconButton,
  InputBase,
  Snackbar,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import PoolTable from "./PoolTable/PoolTable";
import PoolDialog from "./PoolDialog/PoolDialog";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPool,
  setPoolIdToEdit,
  setPoolIdToDelete,
  search,
  fetchPoolRefreshed,
  deletePool,
  deletePoolRefreshed,
} from "./PoolSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Spinner from "../../components/Spinner/Spinner";
import RefreshIcon from "@material-ui/icons/Refresh";

const useFetchPool = () => {
  const dispatch = useDispatch();

  const fetchPoolStatus = useSelector(
    (state) => state.pools.fetchPoolStatus
  );
  const fetchPoolError = useSelector((state) => state.pools.fetchPoolError);

  useEffect(() => {
    if (fetchPoolStatus === "idle") {
      (async () => {
        try {
          const fetchPoolResult = await dispatch(fetchPool());
          unwrapResult(fetchPoolResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }
    return () => {
      if (fetchPoolStatus === "failed" || fetchPoolStatus === "succeeded") {
        dispatch(fetchPoolRefreshed());
      }
    };
  }, [dispatch, fetchPoolStatus]);

  return [fetchPoolStatus, fetchPoolError];
};

const useDeletePool = () => {
  const dispatch = useDispatch();

  const deletePoolStatus = useSelector(
    (state) => state.pools.deletePoolStatus
  );
  const deletePoolError = useSelector(
    (state) => state.pools.deletePoolError
  );

  const handleDeletePool = async (poolId) => {
    try {
      const deletePoolRes = await dispatch(deletePool(poolId));
      unwrapResult(deletePoolRes);
    } catch (err) {
      console.log(err);
    }
  };

  return [deletePoolStatus, deletePoolError, handleDeletePool];
};

const Pool = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [openedPoolDialog, setOpenedPoolDialog] = useState(false);

  // Application state
  const searchResult = useSelector((state) => state.pools.searchResult);
  const poolIdToDelete = useSelector((state) => state.pools.poolIdToDelete);
  const poolIdToEdit = useSelector((state) => state.pools.poolIdToEdit);

  // Fetch Pool state
  const [fetchPoolStatus, fetchPoolError] = useFetchPool();

  // Delete Pool state
  const [
    deletePoolStatus,
    deletePoolError,
    handleDeletePool,
  ] = useDeletePool();

  const handleSearch = (e) => {
    dispatch(search(e.target.value));
  };

  const handleDelete = useCallback(async () => {
    await handleDeletePool(poolIdToDelete);
    dispatch(setPoolIdToDelete(null));
  }, [handleDeletePool, dispatch, poolIdToDelete]);

  return (
    <div className={classes.pool}>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={fetchPoolStatus === "failed" ? true : false}
        autoHideDuration={6000}
        message={fetchPoolError}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => dispatch(fetchPoolRefreshed())}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <PoolDialog
        isOpen={poolIdToEdit ? true : openedPoolDialog}
        onCancel={() => {
          poolIdToEdit
            ? dispatch(setPoolIdToEdit(null))
            : setOpenedPoolDialog(false);
        }}
        onFinish={() => {
          poolIdToEdit
            ? dispatch(setPoolIdToEdit(null))
            : setOpenedPoolDialog(false);
        }}
      />
      <ConfirmDialog
        isOpen={Boolean(poolIdToDelete)}
        onCancel={() => dispatch(setPoolIdToDelete(null))}
        onSubmit={handleDelete}
        onLoading={deletePoolStatus === "loading"}
        onClose={() => dispatch(deletePoolRefreshed())}
        error={deletePoolError}
        success={
          deletePoolStatus === "succeeded" ? "Delete Pool successfully" : null
        }
        title="Do you want to delete the Pool?"
      />
      {fetchPoolStatus === "loading" || fetchPoolStatus === "failed" ? (
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
                placeholder="Enter pool name"
                inputProps={{
                  "aria-label": "enter pool name",
                }}
              />
            </Paper>
          </Grid>
          <Grid style={{ marginTop: 24 }} item xs={11}>
            <PoolTable
              onAddPool={() => setOpenedPoolDialog(true)}
              pools={searchResult}
            />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Pool;
