import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  learner: {
    paddingTop: 32,
  },
  paper: {
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    borderRadius: 16,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
}));
