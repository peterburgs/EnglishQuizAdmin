import { Typography } from "@material-ui/core";
import React from "react";
import useStyles from "./Issue.styles";
import issueBg from "../../assets/images/issue-bg.gif";

const Issue = () => {
  const classes = useStyles();

  return (
    <div className={classes.issue}>
      <img className={classes.image} src={issueBg} alt="constructing" />
      <Typography className={classes.text}>
        This feature is being developed...
      </Typography>
    </div>
  );
};

export default Issue;
