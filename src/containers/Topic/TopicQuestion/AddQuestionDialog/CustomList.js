import React, { useEffect, useCallback } from "react";
import {
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Checkbox,
  ListItemSecondaryAction,
  IconButton,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuestionByPoolId,
  fetchQuestionRefreshed,
  setQuestionIdToView,
} from "../../../Question/QuestionSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import QuestionDialog from "../../../Question/QuestionDialog/QuestionDialog";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "70%",
    backgroundColor: theme.palette.background.paper,
    justifySelf: "center",
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const useFetchQuestion = (poolId) => {
  const dispatch = useDispatch();

  const fetchQuestionStatus = useSelector(
    (state) => state.questions.fetchQuestionStatus
  );
  const fetchQuestionError = useSelector(
    (state) => state.questions.fetchQuestionError
  );

  useEffect(() => {
    if (fetchQuestionStatus === "idle") {
      (async () => {
        try {
          const fetchQuestionResult = await dispatch(
            fetchQuestionByPoolId(poolId)
          );
          unwrapResult(fetchQuestionResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }
    return () => {
      if (
        fetchQuestionStatus === "failed" ||
        fetchQuestionStatus === "succeeded"
      ) {
        dispatch(fetchQuestionRefreshed());
      }
    };
  }, [dispatch, fetchQuestionStatus, poolId]);

  return [fetchQuestionStatus, fetchQuestionError];
};

const CustomList = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [fetchQuestionStatus, fetchQuestionError] = useFetchQuestion(
    props.poolId
  );

  const questions = useSelector((state) => state.questions.questions);
  const questionIdToView = useSelector(
    (state) => state.questions.questionIdToView
  );

  const handleClose = useCallback(() => {
    dispatch(fetchQuestionRefreshed());
  }, [dispatch]);

  return (
    <React.Fragment>
      <QuestionDialog
        isOpen={questionIdToView}
        onOk={() => {
          dispatch(setQuestionIdToView(null));
        }}
      />
      <CustomizedSnackbar
        open={fetchQuestionStatus === "failed" ? true : false}
        onClose={() => handleClose()}
        message={fetchQuestionError}
        severity="error"
      />
      <Paper className={classes.root}>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Questions
            </ListSubheader>
          }
        >
          {questions.map((element, i) => {
            const labelId = `checkbox-list-label-${element._id}`;
            return (
              <div key={element._id}>
                <ListItem role={undefined} dense button>
                  <ListItemIcon>
                    <Checkbox
                      onChange={() =>
                        props.onUpdateSelectedQuestions(
                          element._id,
                          props.lessonOrder
                        )
                      }
                      disabled={
                        props.oldSelectedQuestions.findIndex(
                          (e) =>
                            e.code === element.code &&
                            e.lessonOrder === props.lessonOrder
                        ) !== -1
                      }
                      edge="start"
                      checked={
                        props.selectedQuestions.findIndex(
                          (e) =>
                            e.question === element._id &&
                            e.lessonOrder === props.lessonOrder
                        ) !== -1 ||
                        props.oldSelectedQuestions.findIndex(
                          (e) =>
                            e.code === element.code &&
                            e.lessonOrder === props.lessonOrder
                        ) !== -1
                      }
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={element.questionText}
                  />
                  <ListItemText
                    primary={
                      <Typography style={{ color: "white" }}>
                        {element.questionText}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        style={{
                          marginTop: -25,
                        }}
                      >
                        {element.type === "singleSelection"
                          ? " Single selection"
                          : element.type === "translate"
                          ? " Translate"
                          : " Arrange"}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() =>
                        dispatch(setQuestionIdToView(element._id))
                      }
                      edge="end"
                    >
                      <MoreHorizOutlinedIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </div>
            );
          })}
        </List>
      </Paper>
    </React.Fragment>
  );
};

export default CustomList;
