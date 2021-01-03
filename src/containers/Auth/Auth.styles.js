import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  auth: {
    height: "100vh",
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    backgroundColor: "#F0F2F5",
    justifyContent: "space-between",
    margin: "0 10rem",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
      margin: "0 1rem",
    },
  },
  image: {
    maxWidth: "50%",
  },
  button: {
    padding: "0.7rem 1.5rem",
    borderRadius: 8,
    textTransform: "none",
    fontSize: 16,
  },
  formElement: {
    marginBottom: "1rem",
    width: "100%",
  },
  form: {
    margin: "0.5rem",
    padding: "1.2rem",
    minWidth: "40%",
    height: "40%",
    borderRadius: 16,
    boxShadow: "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)",
  },
  buttonProgress: {
    color: theme.palette.primary,
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  credit: {
    marginTop: "1rem",
    borderTop: "1px solid rgba(0,0,0,0.1)",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    padding: "1rem",
    fontSize: 20,
    justifyContent: "center",
    display: "flex",
  },
}));
