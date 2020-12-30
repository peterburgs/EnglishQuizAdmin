import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const CustomizedSnackbars = (props) => {
  return (
    <Snackbar
      style={{ zIndex: 1301 }}
      open={props.open}
      autoHideDuration={3000}
      onClose={props.onClose}
    >
      <Alert onClose={props.onClose} severity={props.severity}>
        {props.message}
      </Alert>
    </Snackbar>
  );
};

export default CustomizedSnackbars;
