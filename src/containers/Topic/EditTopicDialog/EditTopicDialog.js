import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Slide,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogContentText,
  Typography,
} from "@material-ui/core";
import useStyles from "./EditTopicDialog.styles";
import { batch, useDispatch, useSelector } from "react-redux";
import { updateTopic, updateTopicRefreshed, getTopicById } from "../TopicSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import CustomizedSnackbar from "../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { useForm, Controller } from "react-hook-form";
import CircularProgress from "@material-ui/core/CircularProgress";
import { fetchLevel, fetchLevelRefreshed } from "../../Level/LevelSlice";
import { useLocation } from "react-router-dom";
import api from "../../../api/index";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useUpdateTopic = () => {
  const dispatch = useDispatch();

  const updateTopicStatus = useSelector(
    (state) => state.topics.updateTopicStatus
  );
  const updateTopicError = useSelector(
    (state) => state.topics.updateTopicError
  );

  const handleUpdateTopic = async (topic) => {
    try {
      const res = await dispatch(updateTopic(topic));
      unwrapResult(res);
    } catch (err) {
      console.log(err);
    }
  };

  return [updateTopicStatus, updateTopicError, handleUpdateTopic];
};

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

const EditTopicDialog = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, control, setValue } = useForm();
  const [
    updateTopicStatus,
    updateTopicError,
    handleUpdateTopic,
  ] = useUpdateTopic();

  const topicIdToEdit = useSelector((state) => state.topics.topicIdToEdit);

  const levels = useSelector((state) => state.levels.levels);
  const [fetchLevelStatus, fetchLevelError] = useFetchLevel();
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [oldLevel, setOldLevel] = useState(null);

  const location = useLocation();

  useEffect(() => {
    if (topicIdToEdit) {
      (async () => {
        const result = await dispatch(getTopicById(topicIdToEdit));
        console.log(result);
        unwrapResult(result);
        setValue("name", result.payload.topic.name);
        setValue("level", result.payload.topic.level._id);
        setUploadedImageUrl(
          api.defaults.baseURL +
            location.pathname +
            result.payload.topic.imageUrl
        );
        setOldLevel(result.payload.topic.level._id);
      })();
    }
  }, [dispatch, topicIdToEdit, setValue, location]);

  const onSubmit = async (data) => {
    data = { ...data, oldLevel: oldLevel };
    await handleUpdateTopic(data);
    props.onFinish();
  };

  const handleClose = useCallback(() => {
    batch(() => {
      dispatch(updateTopicRefreshed());
      dispatch(fetchLevelRefreshed());
    });
  }, [dispatch]);

  const handleUploadImage = (e) => {
    setUploadedImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <React.Fragment>
      <CustomizedSnackbar
        open={
          updateTopicStatus === "failed" || fetchLevelStatus === "failed"
            ? true
            : false
        }
        onClose={() => handleClose()}
        message={updateTopicError ? updateTopicError : fetchLevelError}
        severity="error"
      />
      <CustomizedSnackbar
        open={updateTopicStatus === "succeeded" ? true : false}
        onClose={() => handleClose()}
        message={"Update topic successfully"}
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
          <DialogTitle id="form-dialog-title">Edit topic</DialogTitle>
          <DialogContent>
            <TextField
              id="name"
              name="name"
              autoComplete="off"
              inputRef={register({ required: true })}
              label="Topic name"
              variant="outlined"
              defaultValue={" "}
              className={classes.formElement}
              error={Boolean(errors.name)}
              helperText={errors.name ? "*This field is required" : null}
            />
            <Controller
              name="level"
              control={control}
              defaultValue={levels.length !== 0 ? levels[0]._id : null}
              rules={{ required: true }}
              render={(props) => (
                <FormControl variant="outlined" className={classes.formElement}>
                  <InputLabel id="level-label">Level</InputLabel>
                  <Select
                    labelId="level-label"
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    label="Level"
                  >
                    {levels.map((e, i) => (
                      <MenuItem key={e._id} value={e._id}>
                        {e.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <DialogContentText>Topic image</DialogContentText>
            <input
              accept="image/*"
              className={classes.input}
              id="contained-button-file"
              ref={register}
              type="file"
              name="topicImage"
              onChange={handleUploadImage}
            />
            <label htmlFor="contained-button-file">
              <Button variant="contained" color="primary" component="span">
                Upload
              </Button>
            </label>
            {errors.topicImage && (
              <Typography color="secondary">
                * Topic image is required
              </Typography>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h6"
                style={{ color: "rgba(0,0,0,0.2)", marginBottom: "0.5rem" }}
              >
                Image preview
              </Typography>
              {uploadedImageUrl ? (
                <img
                  style={{
                    width: "50%",
                    height: "auto",
                    border: "1px solid #000",
                  }}
                  src={uploadedImageUrl}
                  alt="topic"
                />
              ) : null}
            </div>
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
                disabled={updateTopicStatus === "loading"}
              >
                Submit
              </Button>
              {updateTopicStatus === "loading" && (
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

export default EditTopicDialog;
