import React from "react";
import useStyles from "./Spinner.styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const Spinner = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <CircularProgress size={62} className={classes.spinner} />
    </div>
  );
};

export default Spinner;
