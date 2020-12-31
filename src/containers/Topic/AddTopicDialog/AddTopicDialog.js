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
  Stepper,
  Step,
  StepLabel,
  Grid,
} from "@material-ui/core";
import useStyles from "./AddTopicDialog.styles";
import { batch, useDispatch, useSelector } from "react-redux";
import { addTopic, addTopicRefreshed } from "../TopicSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import CustomizedSnackbar from "../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { useForm, Controller } from "react-hook-form";
import CircularProgress from "@material-ui/core/CircularProgress";
import { fetchLevel, fetchLevelRefreshed } from "../../Level/LevelSlice";
import CustomList from "./CustomList";
import { fetchPool, fetchPoolRefreshed } from "../../Pool/PoolSlice";
import _ from "lodash";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useAddTopic = () => {
  const dispatch = useDispatch();

  const addTopicStatus = useSelector((state) => state.topics.addTopicStatus);
  const addTopicError = useSelector((state) => state.topics.addTopicError);

  const handleAddTopic = async ({ topicInfo, selectedQuestions }) => {
    try {
      const res = await dispatch(addTopic({ topicInfo, selectedQuestions }));
      unwrapResult(res);
    } catch (err) {
      console.log(err);
    }
  };

  return [addTopicStatus, addTopicError, handleAddTopic];
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

const useFetchPool = () => {
  const dispatch = useDispatch();

  const fetchPoolStatus = useSelector((state) => state.pools.fetchPoolStatus);
  const fetchPoolError = useSelector((state) => state.pools.fetchPoolError);
  const [selectedPool, setSelectedPool] = useState(null);

  useEffect(() => {
    if (fetchPoolStatus === "idle") {
      (async () => {
        try {
          const fetchPoolResult = await dispatch(fetchPool());
          setSelectedPool(fetchPoolResult.payload.pools[0]._id);
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

  return [fetchPoolStatus, fetchPoolError, selectedPool, setSelectedPool];
};

const AddTopicDialog = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, control, setValue } = useForm();
  const [addTopicStatus, addTopicError, handleAddTopic] = useAddTopic();

  const levels = useSelector((state) => state.levels.levels);
  const pools = useSelector((state) => state.pools.pools);
  const [fetchLevelStatus, fetchLevelError] = useFetchLevel();
  const [
    fetchPoolStatus,
    fetchPoolError,
    selectedPool,
    setSelectedPool,
  ] = useFetchPool();
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  // Stepper
  const getSteps = () => {
    return [
      "Add topic information",
      "Add questions to lesson 1",
      "Add questions to lesson 2",
      "Add questions to lesson 3",
    ];
  };

  // Store topic info
  const [topicInfo, setTopicInfo] = useState(null);
  // Store selected questions
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const handleUploadImage = (e) => {
    setUploadedImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  // Topic form UI
  const renderTopicForm = () => (
    <Grid container style={{ justifyContent: "center" }}>
      <div style={{ width: "70%" }}>
        <TextField
          id="name"
          name="name"
          autoComplete="off"
          inputRef={register({ required: true })}
          label="Topic name"
          variant="outlined"
          defaultValue={""}
          className={classes.formElement}
          error={Boolean(errors.name)}
          helperText={errors.name ? "*This field is required" : null}
        />
        <Controller
          name="level"
          control={control}
          defaultValue={levels[0]._id}
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
          ref={register({ required: true })}
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
          <Typography color="secondary">* Topic image is required</Typography>
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
                width: "20%",
                height: "auto",
                border: "1px solid #000",
              }}
              src={uploadedImageUrl}
              alt="topic"
            />
          ) : null}
        </div>
      </div>
    </Grid>
  );

  const handleUpdateSelectedQuestions = useCallback(
    (question, lessonOrder) => {
      const currentIndex = selectedQuestions.findIndex(
        (e) => e.question === question && e.lessonOrder === lessonOrder
      );
      const newSelectedQuestions = _.cloneDeep(selectedQuestions);

      if (currentIndex === -1) {
        newSelectedQuestions.push({ question, lessonOrder });
      } else {
        newSelectedQuestions.splice(currentIndex, 1);
      }
      console.log(newSelectedQuestions);
      setSelectedQuestions(newSelectedQuestions);
    },
    [selectedQuestions]
  );

  // Add question UI
  const renderQuestionForm = (lessonOrder) => (
    <Grid container style={{ justifyContent: "center" }}>
      <FormControl
        style={{ width: "70%" }}
        variant="outlined"
        className={classes.formElement}
      >
        <InputLabel id="pool-label">Pool</InputLabel>
        <Select
          labelId="pool-label"
          value={selectedPool}
          onChange={(e) => setSelectedPool(e.target.value)}
          label="Pool"
        >
          {pools.map((e, i) => (
            <MenuItem key={e._id} value={e._id}>
              {e.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <CustomList
        poolId={selectedPool}
        selectedQuestions={selectedQuestions}
        lessonOrder={lessonOrder}
        onUpdateSelectedQuestions={handleUpdateSelectedQuestions}
      />
    </Grid>
  );

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return renderTopicForm();
      case 1:
        return renderQuestionForm(1);
      case 2:
        return renderQuestionForm(2);
      case 3:
        return renderQuestionForm(3);
      default:
        return "Unknown stepIndex";
    }
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    if (activeStep === 0 && topicInfo) {
      setValue("name", topicInfo.name);
      setValue("level", topicInfo.level);
      setValue("topicImage", topicInfo.topicImage);
    }
  }, [activeStep, topicInfo, setValue]);

  const onSubmit = async (data) => {
    console.log(data);
    console.log(activeStep);
    if (activeStep !== steps.length - 1) {
      if (activeStep === 0) {
        setTopicInfo(data);
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      await handleAddTopic({ topicInfo, selectedQuestions });
      props.onFinish();
    }
  };

  const handleClose = useCallback(() => {
    batch(() => {
      dispatch(addTopicRefreshed());
      dispatch(fetchLevelRefreshed());
    });
  }, [dispatch]);

  return (
    <React.Fragment>
      <CustomizedSnackbar
        open={
          addTopicStatus === "failed" ||
          fetchLevelStatus === "failed" ||
          fetchPoolStatus === "failed"
            ? true
            : false
        }
        onClose={() => handleClose()}
        message={
          addTopicError
            ? addTopicError
            : fetchLevelError
            ? fetchPoolError
            : null
        }
        severity="error"
      />
      <CustomizedSnackbar
        open={addTopicStatus === "succeeded" ? true : false}
        onClose={() => handleClose()}
        message={"Add new topic successfully"}
        severity="success"
      />
      <Dialog
        fullScreen
        classes={{ paper: classes.dialog }}
        open={props.isOpen}
        TransitionComponent={Transition}
        onClose={props.onCancel}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add new topic</DialogTitle>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>{getStepContent(activeStep)}</DialogContent>
          <DialogActions style={{ padding: "16px 24px" }}>
            <Button
              onClick={activeStep === 0 ? props.onCancel : handleBack}
              color="primary"
            >
              {activeStep === 0 ? "Cancel" : "Back"}
            </Button>
            <div style={{ position: "relative" }}>
              <Button
                variant="contained"
                disableElevation
                style={{ borderRadius: 8, fontWeight: 700 }}
                color="primary"
                type="submit"
                disabled={addTopicStatus === "loading"}
              >
                {activeStep === steps.length - 1 ? "Submit" : "Next"}
              </Button>
              {addTopicStatus === "loading" && (
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

export default AddTopicDialog;
