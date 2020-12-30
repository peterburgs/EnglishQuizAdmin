import React, { useCallback, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Slide,
} from "@material-ui/core";
import useStyles from "./PoolDialog.styles";
import { useDispatch, useSelector, batch } from "react-redux";
import {
  addPool,
  addPoolRefreshed,
  updatePool,
  updatePoolRefreshed,
  getPoolById,
} from "../PoolSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import CustomizedSnackbar from "../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { useForm } from "react-hook-form";
import CircularProgress from "@material-ui/core/CircularProgress";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useAddPool = () => {
  const dispatch = useDispatch();

  const addPoolStatus = useSelector((state) => state.pools.addPoolStatus);
  const addPoolError = useSelector((state) => state.pools.addPoolError);

  const handleAddPool = async (pool) => {
    try {
      const res = await dispatch(addPool(pool));
      unwrapResult(res);
    } catch (err) {
      console.log(err);
    }
  };

  return [addPoolStatus, addPoolError, handleAddPool];
};

const useUpdatePool = () => {
  const dispatch = useDispatch();

  const updatePoolStatus = useSelector((state) => state.pools.updatePoolStatus);
  const updatePoolError = useSelector((state) => state.pools.updatePoolError);

  const handleUpdatePool = async (pool) => {
    try {
      const updatePoolRes = await dispatch(updatePool(pool));
      unwrapResult(updatePoolRes);
    } catch (err) {
      console.log(err);
    }
  };

  return [updatePoolStatus, updatePoolError, handleUpdatePool];
};

const PoolDialog = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, setValue } = useForm();
  const [addPoolStatus, addPoolError, handleAddPool] = useAddPool();

  const [updatePoolStatus, updatePoolError, handleUpdatePool] = useUpdatePool();

  const poolIdToEdit = useSelector((state) => state.pools.poolIdToEdit);

  useEffect(() => {
    if (poolIdToEdit) {
      (async () => {
        const result = await dispatch(getPoolById(poolIdToEdit));
        console.log(result);
        unwrapResult(result);
        setValue("name", result.payload.pool.name);
      })();
    }
  }, [dispatch, poolIdToEdit, setValue]);

  const onSubmit = async (data) => {
    if (poolIdToEdit) {
      await handleUpdatePool(data);
      props.onFinish();
    } else {
      await handleAddPool(data);
      props.onFinish();
    }
  };

  const handleClose = useCallback(() => {
    batch(() => {
      dispatch(updatePoolRefreshed());
      dispatch(addPoolRefreshed());
    });
  }, [dispatch]);

  return (
    <React.Fragment>
      <CustomizedSnackbar
        open={
          addPoolStatus === "failed" || updatePoolStatus === "failed"
            ? true
            : false
        }
        onClose={() => handleClose()}
        message={addPoolStatus === "failed" ? addPoolError : updatePoolError}
        severity="error"
      />
      <CustomizedSnackbar
        open={
          addPoolStatus === "succeeded" || updatePoolStatus === "succeeded"
            ? true
            : false
        }
        onClose={() => handleClose()}
        message={
          addPoolStatus === "succeeded"
            ? "Add new Pool successfully"
            : "Update Pool successfully"
        }
        severity="success"
      />
      <Dialog
        classes={{ paper: classes.dialog }}
        open={props.isOpen}
        TransitionComponent={Transition}
        onClose={props.onCancel}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id="form-dialog-title">
            {poolIdToEdit ? "Edit pool" : "Add new pool"}
          </DialogTitle>
          <DialogContent>
            <TextField
              id="name"
              name="name"
              autoComplete="off"
              inputRef={register({ required: true })}
              label="Pool name"
              variant="outlined"
              defaultValue={poolIdToEdit ? " " : ""}
              className={classes.formElement}
              error={Boolean(errors.name)}
              helperText={errors.name ? "*This field is required" : null}
            />
          </DialogContent>
          <DialogActions style={{ padding: "16px 24px" }}>
            <Button onClick={props.onCancel} color="primary">
              Cancel
            </Button>
            <div style={{ position: "relative" }}>
              <Button
                variant="contained"
                disableElevation
                style={{ borderRadius: 8, fontWeight: 700 }}
                color="primary"
                type="submit"
                disabled={
                  addPoolStatus === "loading" || updatePoolStatus === "loading"
                }
              >
                Submit
              </Button>
              {(addPoolStatus === "loading" ||
                updatePoolStatus === "loading") && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

export default PoolDialog;
