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
import { useForm } from "react-hook-form";
import CircularProgress from "@material-ui/core/CircularProgress";

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
  const { register, handleSubmit, errors, setValue } = useForm();
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

  useEffect(() => {
    if (questionIdToEdit) {
      (async () => {
        const result = await dispatch(getQuestionById(questionIdToEdit));
        unwrapResult(result);
        setValue("name", result.payload.question.name);
        setValue("order", result.payload.question.order);
      })();
    }
  }, [dispatch, questionIdToEdit, setValue]);

  const onSubmit = async (data) => {
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
        TransitionComponent={Transition}
        onClose={props.onCancel}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id="form-dialog-title">
            {questionIdToEdit ? "Edit question" : "Add new question"}
          </DialogTitle>
          <DialogContent>
            <TextField
              id="name"
              name="name"
              autoComplete="off"
              inputRef={register({ required: true })}
              label="Question name"
              variant="outlined"
              defaultValue={questionIdToEdit ? " " : ""}
              className={classes.formElement}
              error={Boolean(errors.name)}
              helperText={errors.name ? "*This field is required" : null}
            />
            <TextField
              id="order"
              name="order"
              type="number"
              autoComplete="off"
              inputRef={register({ required: true })}
              label="Order"
              variant="outlined"
              defaultValue={questionIdToEdit ? 0 : null}
              className={classes.formElement}
              error={Boolean(errors.order)}
              helperText={errors.order ? "*This field is required" : null}
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
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

export default QuestionDialog;
