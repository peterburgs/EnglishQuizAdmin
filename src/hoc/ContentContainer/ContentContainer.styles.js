import { makeStyles } from "@material-ui/core/styles";

export default makeStyles({
  contentContainer: {
    position: "relative",
    margin: "0px -24px",
  },
  background: {
    background: "linear-gradient(to right, #00BDA0 , #007DDD)",
    height: 300,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
  },
  overlay: {
    "& *": {
      zIndex: 1099,
    },
  },
});
