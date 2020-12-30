import React from "react";
import useStyles from "./ContentContainer.styles";

const ContentContainer = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.contentContainer}>
      <div className={classes.background}></div>
      <div className={classes.overlay}>{props.children}</div>
    </div>
  );
};

export default ContentContainer;
