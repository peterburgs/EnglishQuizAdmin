import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      padding: "0.5rem",
      display: "flex",
      flexDirection: 'row',
      justifyContent: "center",
      "& button": {
        marginBottom: "0.5rem",
        width: "80%",
      },
    },
  },
  title: {
    flex: "1 1 100%",
  },
}));
