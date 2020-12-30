import { makeStyles } from "@material-ui/core/styles";

export default makeStyles(() => ({
  topicTable: {
    width: "100%",
  },
  paper: {
    width: "100%",
    borderRadius: 8,
    marginBottom: 24,
  },
  button: {
    borderRadius: 8,
    textTransform: "none",
    minWidth: 150,
    marginLeft: "0.5rem",
  },
  row: {
    "& td": {
      fontSize: 13,
    },
  },
}));
