import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Slide,
  DialogContentText,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  Hidden,
} from "@material-ui/core";
import useStyles from "./QuestionDialog.styles";
import { useDispatch, useSelector, batch } from "react-redux";
import {
  addQuestion,
  addQuestionRefreshed,
  updateQuestion,
  updateQuestionRefreshed,
  getQuestionById,
} from "../QuestionSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import CustomizedSnackbar from "../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import CircularProgress from "@material-ui/core/CircularProgress";
import api from "../../../api/index";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { v1 as uuidv1 } from "uuid";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useAddQuestion = () => {
  const dispatch = useDispatch();

  const addQuestionStatus = useSelector(
    (state) => state.questions.addQuestionStatus
  );
  const addQuestionError = useSelector(
    (state) => state.questions.addQuestionError
  );

  const handleAddQuestion = async (question) => {
    try {
      const res = await dispatch(addQuestion(question));
      unwrapResult(res);
    } catch (err) {
      console.log(err);
    }
  };

  return [addQuestionStatus, addQuestionError, handleAddQuestion];
};

const useUpdateQuestion = () => {
  const dispatch = useDispatch();

  const updateQuestionStatus = useSelector(
    (state) => state.questions.updateQuestionStatus
  );
  const updateQuestionError = useSelector(
    (state) => state.questions.updateQuestionError
  );

  const handleUpdateQuestion = async (question) => {
    try {
      const updateQuestionRes = await dispatch(updateQuestion(question));
      unwrapResult(updateQuestionRes);
    } catch (err) {
      console.log(err);
    }
  };

  return [updateQuestionStatus, updateQuestionError, handleUpdateQuestion];
};

const QuestionDialog = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    control,
    reset,
  } = useForm();

  const {
    fields: arrangeFields,
    append: arrangeAppend,
    remove: arrangeRemove,
  } = useFieldArray({
    control,
    name: "arrange",
  });

  const {
    fields: translateFields,
    append: translateAppend,
    remove: translateRemove,
  } = useFieldArray({
    control,
    name: "translate",
  });

  const [
    addQuestionStatus,
    addQuestionError,
    handleAddQuestion,
  ] = useAddQuestion();

  const [
    updateQuestionStatus,
    updateQuestionError,
    handleUpdateQuestion,
  ] = useUpdateQuestion();

  const questionIdToEdit = useSelector(
    (state) => state.questions.questionIdToEdit
  );
  const questionIdToView = useSelector(
    (state) => state.questions.questionIdToView
  );

  const [type, setType] = useState("singleSelection");
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  useEffect(() => {
    if (questionIdToEdit || questionIdToView) {
      (async () => {
        const result = await dispatch(
          getQuestionById(
            questionIdToEdit ? questionIdToEdit : questionIdToView
          )
        );
        unwrapResult(result);
        setValue(
          "questionRequirement",
          result.payload.question.questionRequirement
        );
        setValue("questionText", result.payload.question.questionText);
        setValue("type", result.payload.question.type);
        setValue("difficulty", result.payload.question.difficulty);
        setType(result.payload.question.type);
        if (result.payload.question.type === "singleSelection") {
          result.payload.question.singleSelection.forEach((e) => {
            setValue(`selection${e.order}`, e.content);
            if (e.isCorrect) {
              setValue("correctOrder", String(e.order));
            }
          });
        }
        if (result.payload.question.type === "translate") {
          result.payload.question.translate.forEach((e) => {
            translateRemove(e);
          });
          result.payload.question.translate.forEach((e) => {
            translateAppend(e);
          });
        }
        if (result.payload.question.type === "arrange") {
          result.payload.question.arrange.forEach((e) => {
            arrangeRemove(e);
          });
          result.payload.question.arrange.forEach((e) => {
            arrangeAppend(e);
          });
        }
        if (result.payload.question.imageUrl) {
          setUploadedImageUrl(
            api.defaults.baseURL +
              "/questions/" +
              result.payload.question.imageUrl
          );
        } else {
          setUploadedImageUrl(null);
        }
      })();
    } else {
      setUploadedImageUrl(null);
    }
  }, [
    dispatch,
    questionIdToEdit,
    questionIdToView,
    setValue,
    translateAppend,
    translateRemove,
    arrangeAppend,
    arrangeRemove,
    reset,
  ]);

  const onSubmit = async (data) => {
    console.log(data);

    const singleSelection = [];
    if (type === "singleSelection") {
      singleSelection.push({
        content: data.selection1,
        order: 1,
        isCorrect: data.correctOrder === "1",
      });
      singleSelection.push({
        content: data.selection2,
        order: 2,
        isCorrect: data.correctOrder === "2",
      });
      singleSelection.push({
        content: data.selection3,
        order: 3,
        isCorrect: data.correctOrder === "3",
      });
      singleSelection.push({
        content: data.selection4,
        order: 4,
        isCorrect: data.correctOrder === "4",
      });
      data.singleSelection = singleSelection;
    }
    if (type === "translate") {
      if (translateFields.length === 0) return;
    }
    if (type === "arrange") {
      if (arrangeFields.length === 0) return;
    }
    console.log(data);
    if (questionIdToEdit) {
      await handleUpdateQuestion(data);
      props.onFinish();
    } else {
      await handleAddQuestion(data);
      props.onFinish();
    }
  };

  const handleClose = useCallback(() => {
    batch(() => {
      dispatch(updateQuestionRefreshed());
      dispatch(addQuestionRefreshed());
    });
  }, [dispatch]);

  const handleUploadImage = (e) => {
    setUploadedImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  const renderAnswers = (type) => {
    if (type === "singleSelection") {
      return (
        <React.Fragment>
          <DialogContentText>Selections</DialogContentText>
          <Controller
            name="correctOrder"
            control={control}
            defaultValue={"1"}
            rules={{ required: true }}
            render={(props) => (
              <FormControl className={classes.formElement} component="fieldset">
                <RadioGroup
                  value={props.value}
                  onChange={(e) => {
                    props.onChange(e.target.value);
                  }}
                >
                  <Grid
                    container
                    style={{ alignItems: "center", marginBottom: "1rem" }}
                  >
                    <Grid item xs={1}>
                      <FormControlLabel
                        disabled={Boolean(questionIdToView)}
                        value={"1"}
                        control={<Radio />}
                      />
                    </Grid>
                    <Grid item xs={11}>
                      <TextField
                        style={{ width: "100%" }}
                        id="selection1"
                        name="selection1"
                        autoComplete="off"
                        inputRef={register({
                          required: type === "singleSelection",
                        })}
                        label="Selection 1"
                        variant="outlined"
                        disabled={Boolean(questionIdToView)}
                        defaultValue={
                          questionIdToEdit || questionIdToView ? " " : ""
                        }
                        error={Boolean(errors.selection1)}
                        helperText={
                          errors.selection1 ? "*This field is required" : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    style={{ alignItems: "center", marginBottom: "1rem" }}
                  >
                    <Grid item xs={1}>
                      <FormControlLabel value={"2"} control={<Radio />} />
                    </Grid>
                    <Grid item xs={11}>
                      <TextField
                        style={{ width: "100%" }}
                        id="selection2"
                        name="selection2"
                        autoComplete="off"
                        inputRef={register({
                          required: type === "singleSelection",
                        })}
                        label="Selection 2"
                        variant="outlined"
                        disabled={Boolean(questionIdToView)}
                        defaultValue={
                          questionIdToEdit || questionIdToView ? " " : ""
                        }
                        error={Boolean(errors.selection2)}
                        helperText={
                          errors.selection2 ? "*This field is required" : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    style={{ alignItems: "center", marginBottom: "1rem" }}
                  >
                    <Grid item xs={1}>
                      <FormControlLabel value={"3"} control={<Radio />} />
                    </Grid>
                    <Grid item xs={11}>
                      <TextField
                        style={{ width: "100%" }}
                        id="selection3"
                        name="selection3"
                        autoComplete="off"
                        inputRef={register({
                          required: type === "singleSelection",
                        })}
                        label="Selection 3"
                        variant="outlined"
                        disabled={Boolean(questionIdToView)}
                        defaultValue={
                          questionIdToEdit || questionIdToView ? " " : ""
                        }
                        error={Boolean(errors.selection3)}
                        helperText={
                          errors.selection3 ? "*This field is required" : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    style={{ alignItems: "center", marginBottom: "1rem" }}
                  >
                    <Grid item xs={1}>
                      <FormControlLabel value={"4"} control={<Radio />} />
                    </Grid>
                    <Grid item xs={11}>
                      <TextField
                        style={{ width: "100%" }}
                        id="selection4"
                        name="selection4"
                        autoComplete="off"
                        inputRef={register({
                          required: type === "singleSelection",
                        })}
                        label="Selection 4"
                        variant="outlined"
                        disabled={Boolean(questionIdToView)}
                        defaultValue={
                          questionIdToEdit || questionIdToView ? " " : ""
                        }
                        error={Boolean(errors.selection4)}
                        helperText={
                          errors.selection4 ? "*This field is required" : null
                        }
                      />
                    </Grid>
                  </Grid>
                </RadioGroup>
              </FormControl>
            )}
          />
        </React.Fragment>
      );
    } else if (type === "translate") {
      return (
        <React.Fragment>
          <DialogContentText>Answers</DialogContentText>
          {translateFields.map((item, index) => (
            <Grid container spacing={1} key={item.id}>
              <Grid item xs={11}>
                <TextField
                  style={{ width: "100%", marginBottom: "1rem" }}
                  name={`translate[${index}].content`}
                  autoComplete="off"
                  inputRef={register({ required: type === "translate" })}
                  label="Answer"
                  variant="outlined"
                  disabled={Boolean(questionIdToView)}
                  defaultValue={
                    questionIdToEdit || questionIdToView ? item.content : ""
                  }
                  error={Boolean(errors[`translate[${index}].content`])}
                  helperText={
                    errors[`translate[${index}].content`]
                      ? "*This field is required"
                      : null
                  }
                />
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  disabled={Boolean(questionIdToView)}
                  onClick={() => translateRemove(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          {translateFields.length === 0 && (
            <Typography color="secondary">* Answer is required</Typography>
          )}
          <Button
            disabled={Boolean(questionIdToView)}
            className={classes.button}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => translateAppend({ content: "" })}
          >
            Add an answer
          </Button>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <DialogContentText>Answers</DialogContentText>
          {arrangeFields.map((item, index) => (
            <Grid container spacing={1} key={item.id}>
              <Grid item xs={8}>
                <TextField
                  style={{ width: "100%" }}
                  name={`arrange[${index}].word`}
                  autoComplete="off"
                  inputRef={register({ required: type === "arrange" })}
                  label="Word"
                  variant="outlined"
                  disabled={Boolean(questionIdToView)}
                  defaultValue={
                    questionIdToEdit || questionIdToView ? item.word : ""
                  }
                  error={Boolean(errors[`arrange[${index}].word`])}
                  helperText={
                    errors[`arrange[${index}].word`]
                      ? "*This field is required"
                      : null
                  }
                />
              </Grid>
              <Hidden xsUp implementation="css">
                <TextField
                  style={{ width: "100%" }}
                  name={`arrange[${index}]._id`}
                  autoComplete="off"
                  inputRef={register}
                  label="_id"
                  variant="outlined"
                  disabled={Boolean(questionIdToView)}
                  defaultValue={uuidv1()}
                  error={Boolean(errors[`arrange[${index}]._id`])}
                  helperText={
                    errors[`arrange[${index}]._id`]
                      ? "*This field is required"
                      : null
                  }
                />
              </Hidden>
              <Grid item xs={3}>
                <TextField
                  style={{ width: "100%", marginBottom: "1rem" }}
                  name={`arrange[${index}].order`}
                  autoComplete="off"
                  type="number"
                  inputRef={register({ required: type === "arrange" })}
                  label="Order"
                  variant="outlined"
                  disabled={Boolean(questionIdToView)}
                  defaultValue={
                    questionIdToEdit || questionIdToView ? item.order : -1
                  }
                  error={Boolean(errors[`arrange[${index}].order`])}
                  helperText={
                    errors[`arrange[${index}].order`]
                      ? "*This field is required"
                      : null
                  }
                />
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  disabled={Boolean(questionIdToView)}
                  onClick={() => arrangeRemove(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          {arrangeFields.length === 0 && (
            <Typography color="secondary">* Answer is required</Typography>
          )}
          <Button
            disabled={Boolean(questionIdToView)}
            className={classes.button}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() =>
              arrangeAppend({ word: "", order: null, _id: uuidv1() })
            }
          >
            New word
          </Button>
        </React.Fragment>
      );
    }
  };

  return (
    <React.Fragment>
      <CustomizedSnackbar
        open={
          addQuestionStatus === "failed" || updateQuestionStatus === "failed"
            ? true
            : false
        }
        onClose={() => handleClose()}
        message={
          addQuestionStatus === "failed"
            ? addQuestionError
            : updateQuestionError
        }
        severity="error"
      />
      <CustomizedSnackbar
        open={
          addQuestionStatus === "succeeded" ||
          updateQuestionStatus === "succeeded"
            ? true
            : false
        }
        onClose={() => handleClose()}
        message={
          addQuestionStatus === "succeeded"
            ? "Add new question successfully"
            : "Update question successfully"
        }
        severity="success"
      />
      <Dialog
        classes={{ paper: classes.dialog }}
        open={props.isOpen}
        scroll={"body"}
        TransitionComponent={Transition}
        onClose={props.onCancel}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id="form-dialog-title">
            {questionIdToEdit
              ? "Edit question"
              : questionIdToView
              ? "Question"
              : "New question"}
          </DialogTitle>
          <DialogContent>
            <Controller
              name="type"
              control={control}
              defaultValue={type}
              render={(props) => (
                <FormControl variant="outlined" className={classes.formElement}>
                  <InputLabel id="type-label">Type</InputLabel>
                  <Select
                    disabled={Boolean(questionIdToView)}
                    labelId="type-label"
                    value={props.value}
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      reset();
                      setType(e.target.value);
                    }}
                    label="Type"
                  >
                    <MenuItem value={"singleSelection"}>
                      Single Selection
                    </MenuItem>
                    <MenuItem value={"translate"}>Translate</MenuItem>
                    <MenuItem value={"arrange"}>Arrange</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
            <TextField
              id="questionRequirement"
              name="questionRequirement"
              autoComplete="off"
              inputRef={register({ required: true })}
              label="Question requirement"
              variant="outlined"
              disabled={Boolean(questionIdToView)}
              defaultValue={questionIdToEdit || questionIdToView ? " " : ""}
              className={classes.formElement}
              error={Boolean(errors.questionRequirement)}
              helperText={
                errors.questionRequirement ? "*This field is required" : null
              }
            />
            <TextField
              id="questionText"
              name="questionText"
              autoComplete="off"
              inputRef={register({ required: true })}
              label="Question text"
              variant="outlined"
              disabled={Boolean(questionIdToView)}
              defaultValue={questionIdToEdit || questionIdToView ? " " : ""}
              className={classes.formElement}
              error={Boolean(errors.questionText)}
              helperText={
                errors.questionText ? "*This field is required" : null
              }
            />
            <Controller
              name="difficulty"
              control={control}
              defaultValue={"EASY"}
              rules={{ required: true }}
              render={(props) => (
                <FormControl variant="outlined" className={classes.formElement}>
                  <InputLabel id="difficulty-label">Difficulty</InputLabel>
                  <Select
                    labelId="difficulty-label"
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    label="Difficulty"
                  >
                    <MenuItem value="EASY">Easy</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HARD">Hard</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
            <DialogContentText>Question image</DialogContentText>
            {!questionIdToView ? (
              <React.Fragment>
                <input
                  accept="image/*"
                  className={classes.input}
                  id="contained-button-file"
                  ref={register}
                  type="file"
                  name="questionImage"
                  onChange={handleUploadImage}
                />
                <label htmlFor="contained-button-file">
                  <Button variant="contained" color="primary" component="span">
                    Upload
                  </Button>
                </label>
                {errors.questionImage && (
                  <Typography color="secondary">
                    * Question image is required
                  </Typography>
                )}
              </React.Fragment>
            ) : null}

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
                    marginBottom: "1rem",
                  }}
                  src={uploadedImageUrl}
                  alt="topic"
                />
              ) : null}
            </div>
            {renderAnswers(type)}
          </DialogContent>
          <DialogActions style={{ padding: "16px 24px" }}>
            {!questionIdToView ? (
              <React.Fragment>
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
                      addQuestionStatus === "loading" ||
                      updateQuestionStatus === "loading"
                    }
                  >
                    Submit
                  </Button>
                  {(addQuestionStatus === "loading" ||
                    updateQuestionStatus === "loading") && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </div>
              </React.Fragment>
            ) : (
              <Button onClick={props.onOk} color="primary">
                ok
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

export default QuestionDialog;
