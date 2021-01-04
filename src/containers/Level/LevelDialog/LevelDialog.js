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
import useStyles from "./LevelDialog.styles";
import { useDispatch, useSelector, batch } from "react-redux";
import {
  addLevel,
  addLevelRefreshed,
  updateLevel,
  updateLevelRefreshed,
  getLevelById,
} from "../LevelSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import CustomizedSnackbar from "../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { useForm } from "react-hook-form";
import CircularProgress from "@material-ui/core/CircularProgress";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useAddLevel = () => {
  const dispatch = useDispatch();

  const addLevelStatus = useSelector((state) => state.levels.addLevelStatus);
  const addLevelError = useSelector((state) => state.levels.addLevelError);

  const handleAddLevel = async (level) => {
    try {
      const res = await dispatch(addLevel(level));
      unwrapResult(res);
    } catch (err) {
      console.log(err);
    }
  };

  return [addLevelStatus, addLevelError, handleAddLevel];
};

const useUpdateLevel = () => {
  const dispatch = useDispatch();

  const updateLevelStatus = useSelector(
    (state) => state.levels.updateLevelStatus
  );
  const updateLevelError = useSelector(
    (state) => state.levels.updateLevelError
  );

  const handleUpdateLevel = async (level) => {
    try {
      const updateLevelRes = await dispatch(updateLevel(level));
      unwrapResult(updateLevelRes);
    } catch (err) {
      console.log(err);
    }
  };

  return [updateLevelStatus, updateLevelError, handleUpdateLevel];
};

const LevelDialog = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, setValue } = useForm();
  const [addLevelStatus, addLevelError, handleAddLevel] = useAddLevel();

  const [
    updateLevelStatus,
    updateLevelError,
    handleUpdateLevel,
  ] = useUpdateLevel();

  const levelIdToEdit = useSelector((state) => state.levels.levelIdToEdit);

  const levels = useSelector((state) => state.levels.levels);

  useEffect(() => {
    if (levelIdToEdit) {
      (async () => {
        const result = await dispatch(getLevelById(levelIdToEdit));
        unwrapResult(result);
        setValue("name", result.payload.level.name);
        setValue("order", result.payload.level.order);
        setValue("requiredExp", result.payload.level.requiredExp);
      })();
    }
  }, [dispatch, levelIdToEdit, setValue]);

  const onSubmit = async (data) => {
    console.log(data);
    if (levelIdToEdit) {
      await handleUpdateLevel(data);
      props.onFinish();
    } else {
      await handleAddLevel(data);
      props.onFinish();
    }
  };

  const handleClose = useCallback(() => {
    batch(() => {
      dispatch(updateLevelRefreshed());
      dispatch(addLevelRefreshed());
    });
  }, [dispatch]);

  return (
    <React.Fragment>
      <CustomizedSnackbar
        open={
          addLevelStatus === "failed" || updateLevelStatus === "failed"
            ? true
            : false
        }
        onClose={() => handleClose()}
        message={addLevelStatus === "failed" ? addLevelError : updateLevelError}
        severity="error"
      />
      <CustomizedSnackbar
        open={
          addLevelStatus === "succeeded" || updateLevelStatus === "succeeded"
            ? true
            : false
        }
        onClose={() => handleClose()}
        message={
          addLevelStatus === "succeeded"
            ? "Add new Level successfully"
            : "Update Level successfully"
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
            {levelIdToEdit ? "Edit level" : "Add new level"}
          </DialogTitle>
          <DialogContent>
            <TextField
              id="name"
              name="name"
              autoComplete="off"
              inputRef={register({ required: true })}
              label="Level name"
              variant="outlined"
              defaultValue={levelIdToEdit ? " " : ""}
              className={classes.formElement}
              error={Boolean(errors.name)}
              helperText={errors.name ? "*This field is required" : null}
            />
            <TextField
              id="order"
              name="order"
              type="number"
              autoComplete="off"
              inputRef={register({
                required: true,
              })}
              label="Order"
              variant="outlined"
              defaultValue={levelIdToEdit ? 0 : levels.length + 1}
              className={classes.formElement}
              error={Boolean(errors.order)}
            />
            <TextField
              id="requiredExp"
              name="requiredExp"
              type="number"
              autoComplete="off"
              inputRef={register({ required: true })}
              label="Required Experience point"
              variant="outlined"
              defaultValue={levelIdToEdit ? 0 : 100}
              className={classes.formElement}
              error={Boolean(errors.requiredExp)}
              helperText={errors.requiredExp ? "*This field is required" : null}
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
                  addLevelStatus === "loading" ||
                  updateLevelStatus === "loading"
                }
              >
                Submit
              </Button>
              {(addLevelStatus === "loading" ||
                updateLevelStatus === "loading") && (
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

export default LevelDialog;
