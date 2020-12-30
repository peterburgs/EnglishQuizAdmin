import { makeStyles } from "@material-ui/core/styles";

const sideBarOpenWidth = 225;
const sideBarCloseWidth = 57;

export default makeStyles((theme) => ({
  userSectionRegistration: {
    "& p": {
      color: "#fff !important",
    },
    "& svg": {
      color: "#fff !important",
    },
  },
  appBar: {
    minHeight: 56,
    background: "linear-gradient(to right, #00BDA0 , #007DDD) !important",
    borderBottom: "none !important",
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${sideBarCloseWidth}px)`,
      marginLeft: sideBarCloseWidth,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  },
  appBarShift: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${sideBarOpenWidth}px)`,
      marginLeft: sideBarOpenWidth,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
  hide: {
    display: "none",
  },
  menuIcon: {
    color: "white",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  content: {
    flexGrow: 1,
    minWidth: 369,
    padding: "0 24px",
    marginTop: 64,
    [theme.breakpoints.up("md")]: {
      marginTop: 64,
    },
  },
  grow: {
    flexGrow: 1,
  },
  userSection: {
    "& p": {
      margin: "0 0.5rem",
      display: "inline",
      color: "#fff",
      [theme.breakpoints.down("sm")]: {
        color: "#fff",
        display: "none",
      },
    },
    "& svg": {
      color: "#fff",
    },
  },
}));
