import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  formControl: {
    margin: `0 0.5rem`,
    minWidth: 120,
  },
  formElement: {
    marginBottom: "1rem",
    width: "100%",
  },
  dialog: {
    borderRadius: 8,
  },
  buttonProgress: {
    color: theme.palette.primary,
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));
