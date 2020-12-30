import React, { useCallback, useState } from "react";
import SideBar from "../../components/Navigation/SideBar/SideBar";
import {
  AppBar,
  Toolbar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import useStyles from "./Layout.styles";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import ElevationScroll from "../../components/ElevationScroll/ElevationScroll";
import NotificationsIcon from "@material-ui/icons/Notifications";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

// Layout HOC includes AppBar and SideBar
const Layout = (props) => {
  const [maximizedSideBar, setMaximizedSideBar] = useState(true);
  const [openedMobileSideBar, setOpenedMobileSideBar] = useState(false);
  const [accountMenuAnchorEl, setAccountMenuAnchorEl] = useState(null);
  const openAccountMenu = Boolean(accountMenuAnchorEl);
  const history = useHistory();
  const classes = useStyles();

  // Handle maximize and minimize the side bar
  const handleToggleMaximizeSidebar = useCallback(() => {
    if (maximizedSideBar) {
      setMaximizedSideBar(false);
    } else {
      setMaximizedSideBar(true);
    }
  }, [maximizedSideBar]);

  // handle close side bar when mobile size
  const handleCloseMobileSidebar = useCallback(() => {
    setOpenedMobileSideBar(false);
  }, []);

  // handle open side bar when mobile size
  const handleOpenMobileSidebar = useCallback(() => {
    setOpenedMobileSideBar(true);
  }, []);

  // handle open menu context when clicking account icon
  const handleAccountMenu = (event) => {
    setAccountMenuAnchorEl(event.currentTarget);
  };

  // handle close menu context when clicking account icon
  const handleAccountMenuClose = () => {
    setAccountMenuAnchorEl(null);
  };

  const logout = () => {
    history.replace("/logout");
  };

  return (
    <React.Fragment>
      <SideBar
        onMobileClose={handleCloseMobileSidebar}
        mobileOpen={openedMobileSideBar}
        onToggleMaximize={handleToggleMaximizeSidebar}
        maximized={maximizedSideBar}
      />
      <ElevationScroll {...props}>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: maximizedSideBar,
          })}
        >
          <Toolbar>
            <IconButton
              aria-label="open drawer"
              onClick={handleOpenMobileSidebar}
              edge="start"
              className={classes.menuIcon}
            >
              <MenuIcon />
            </IconButton>
            <div className={classes.grow}></div>
            <div className={classes.userSection}>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                color="inherit"
                onClick={handleAccountMenu}
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={accountMenuAnchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={openAccountMenu}
                onClose={handleAccountMenuClose}
              >
                <MenuItem onClick={logout}>Log Out</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <main className={classes.content}>{props.children}</main>
    </React.Fragment>
  );
};

Layout.propTypes = {
  children: PropTypes.object.isRequired,
};

export default Layout;
