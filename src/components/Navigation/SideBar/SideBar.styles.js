import { makeStyles } from "@material-ui/core/styles";
import backgroundImage from "../../../assets/images/sidebar-background.png";

const sideBarOpenWidth = 225;
const sideBarCloseWidth = 57;

export default makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: sideBarOpenWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
  },
  drawerMaximized: {
    [theme.breakpoints.up("md")]: {
      width: sideBarOpenWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflowX: "hidden",
    },
  },
  drawerMinimized: {
    [theme.breakpoints.up("md")]: {
      flexShrink: 0,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: sideBarCloseWidth,
    },
  },
  paperDrawer: {
    background: "#051E34",
    // eslint-disable-next-line no-undef
    backgroundImage: `url(${backgroundImage})`,
  },
  paperAnchorLeft: {
    border: "none",
  },
  toolbar: {
    [theme.breakpoints.down("sm")]: {
      "& button": {
        display: "none",
      },
    },
    minHeight: 64,
    width: 240,
    display: "flex",
    alignItems: "center",
    padding: "0px 20px",
    boxSizing: "border-box",
  },
  menuIcon: {
    padding: 0,
  },
  navItems: {
    margin: 0,
    padding: 0,
    display: "flex",
    width: 240,
    flexFlow: "column",
    height: "100%",
  },
}));
