import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  FormControl,
  InputLabel,
  Select,
  Grid,
  MenuItem,
} from "@material-ui/core";
import useStyles from "./AddQuestionDialog.styles";
import { useDispatch, useSelector } from "react-redux";
import {
  addQuestionToTopic,
  addQuestionToTopicRefreshed,
} from "../../TopicSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { useForm } from "react-hook-form";
import CircularProgress from "@material-ui/core/CircularProgress";
import CustomList from "./CustomList";
import { fetchPool, fetchPoolRefreshed } from "../../../Pool/PoolSlice";
import _ from "lodash";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

const useAddQuestionToTopic = () => {
  const dispatch = useDispatch();

  const addQuestionToTopicStatus = useSelector(
    (state) => state.topics.addQuestionToTopicStatus
  );
  const addQuestionToTopicError = useSelector(
    (state) => state.topics.addQuestionToTopicError
  );

  const handleAddQuestionToTopic = async ({ selectedQuestions }) => {
    try {
      const res = await dispatch(addQuestionToTopic({ selectedQuestions }));
      unwrapResult(res);
    } catch (err) {
      console.log(err);
    }
  };

  return [
    addQuestionToTopicStatus,
    addQuestionToTopicError,
    handleAddQuestionToTopic,
  ];
};

const AddQuestionDialog = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { handleSubmit } = useForm();

  const pools = useSelector((state) => state.pools.pools);
  const [
    fetchPoolStatus,
    fetchPoolError,
    selectedPool,
    setSelectedPool,
  ] = useFetchPool();

  const [
    addQuestionToTopicStatus,
    addQuestionToTopicError,
    handleAddQuestionToTopic,
  ] = useAddQuestionToTopic();

  // Store selected questions
  const [selectedQuestions, setSelectedQuestions] = useState([]);

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

  const onSubmit = async (data) => {
    console.log(selectedQuestions);
    await handleAddQuestionToTopic({ selectedQuestions });
    props.onFinish();
  };

  const handleClose = useCallback(() => {
    dispatch(addQuestionToTopicRefreshed());
  }, [dispatch]);

  return (
    <React.Fragment>
      <CustomizedSnackbar
        open={
          fetchPoolStatus === "failed" || addQuestionToTopicStatus === "failed"
            ? true
            : false
        }
        onClose={() => handleClose()}
        message={fetchPoolError ? fetchPoolError : addQuestionToTopicError}
        severity="error"
      />
      <CustomizedSnackbar
        open={addQuestionToTopicStatus === "succeeded" ? true : false}
        onClose={() => handleClose()}
        message={"Add question to topic successfully"}
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
        <DialogTitle id="form-dialog-title">{`Add question to lesson ${props.lessonOrder}`}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
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
                oldSelectedQuestions={props.oldSelectedQuestions}
                poolId={selectedPool}
                selectedQuestions={selectedQuestions}
                lessonOrder={props.lessonOrder}
                onUpdateSelectedQuestions={handleUpdateSelectedQuestions}
              />
            </Grid>
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
                disabled={addQuestionToTopicStatus === "loading"}
              >
                Submit
              </Button>
              {addQuestionToTopicStatus === "loading" && (
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

export default AddQuestionDialog;
