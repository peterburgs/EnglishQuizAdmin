import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Slide,
} from "@material-ui/core";
import useStyles from "./ConfirmDialog.styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import CustomizedSnackbar from "../CustomizedSnackbar/CustomizedSnackbar";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmDialog = (props) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CustomizedSnackbar
        open={Boolean(props.error)}
        onClose={props.onClose}
        message={props.error}
        severity="error"
      />
      <CustomizedSnackbar
        open={Boolean(props.success)}
        onClose={props.onClose}
        message={props.success}
        severity="success"
      />
      <Dialog
        classes={{ paper: classes.dialog }}
        open={props.isOpen}
        TransitionComponent={Transition}
        onClose={props.onCancel}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">{props.title}</DialogTitle>
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
              onClick={props.onSubmit}
              disabled={props.onLoading}
            >
              Submit
            </Button>
            {props.onLoading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ConfirmDialog;
