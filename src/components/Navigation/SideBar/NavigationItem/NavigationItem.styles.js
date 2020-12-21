import { makeStyles } from "@material-ui/core/styles";
import "fontsource-montserrat";

export default makeStyles({
  navigationItem: {
    width: "100%",
    height: 70,
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    padding: "0px 20px",
    boxSizing: "border-box",
    fontWeight: 700,
    fontSize: "15px",
    fontFamily: "Montserrat",
    textDecoration: "none",
    color: "white",
    "& svg": {
      marginRight: "20px",
    },
    "&:hover": {
      background: "#476282",
    },
  },
  active: {
    color: "#669DF6",
    background: "#476282",
    "& svg": {
      fill: "#669DF6",
    },
  },
});
