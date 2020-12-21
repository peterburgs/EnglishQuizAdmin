import { Drawer, Hidden, IconButton } from "@material-ui/core";
import React from "react";
import useStyles from "./SideBar.styles";
import hamburgerIcon from "../../../assets/images/hamburger-icon.svg";
import NavigationItem from "./NavigationItem/NavigationItem";
import clsx from "clsx";
import PropTypes from "prop-types";

const SideBar = (props) => {
  const classes = useStyles();

  let navItems = (
    <React.Fragment>
      <NavigationItem
        icon={
          <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="#C0BDBD"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8.82812 14.2089H0.78125C0.349766 14.2089 0 14.5542 0 14.9802V19.6084C0 20.0344 0.349766 20.3797 0.78125 20.3797H8.82812C9.25961 20.3797 9.60938 20.0344 9.60938 19.6084V14.9802C9.60938 14.5542 9.25961 14.2089 8.82812 14.2089ZM8.04688 18.837H1.5625V15.7516H8.04688V18.837Z" />
            <path d="M8.82812 0.632912H0.78125C0.349766 0.632912 0 0.97825 0 1.40427V12.6661C0 13.0922 0.349766 13.4375 0.78125 13.4375H8.82812C9.25961 13.4375 9.60938 13.0922 9.60938 12.6661V1.40427C9.60938 0.97825 9.25961 0.632912 8.82812 0.632912ZM8.04688 11.8948H1.5625V2.17563H8.04688V11.8948Z" />
            <path d="M19.2188 0.632912H11.1719C10.7404 0.632912 10.3906 0.97825 10.3906 1.40427V6.03244C10.3906 6.45846 10.7404 6.8038 11.1719 6.8038H19.2188C19.6502 6.8038 20 6.45846 20 6.03244V1.40427C20 0.97825 19.6502 0.632912 19.2188 0.632912ZM18.4375 5.26108H11.9531V2.17563H18.4375V5.26108Z" />
            <path d="M19.2188 7.57516H11.1719C10.7404 7.57516 10.3906 7.9205 10.3906 8.34652V19.6084C10.3906 20.0344 10.7404 20.3797 11.1719 20.3797H19.2188C19.6502 20.3797 20 20.0344 20 19.6084V8.34652C20 7.9205 19.6502 7.57516 19.2188 7.57516ZM18.4375 18.837H11.9531V9.11788H18.4375V18.837Z" />
          </svg>
        }
        link="/topics"
        onSideBarClose={props.onMobileClose}
      >
        Topics
      </NavigationItem>
      <NavigationItem
        icon={
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="#C0BDBD"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11.2837 14.7348C10.9277 15.0023 10.4718 15.1496 10 15.1496C9.52821 15.1496 9.07233 15.0023 8.71637 14.7348L2.9048 10.3684C2.9048 10.3684 2.38025 9.97449 2.38025 10.8668C2.38025 11.8801 2.38025 14.9199 2.38025 14.9199C2.38025 14.9604 2.38025 15.1639 2.38025 15.227C2.38025 17.5239 5.79168 20 9.99987 20C14.2081 20 17.6195 17.5239 17.6195 15.227C17.6195 15.1639 17.6195 14.9604 17.6195 14.9199C17.6195 14.9199 17.6195 11.6957 17.6195 10.621C17.6195 9.90473 17.2466 10.2547 17.2466 10.2547L11.2837 14.7348Z" />
            <path d="M19.6651 6.89516C20.1116 6.55968 20.1116 6.01066 19.6651 5.67511L10.8119 0.251616C10.3653 -0.0838719 9.63461 -0.0838719 9.18806 0.251616L0.334912 5.67511C-0.111637 6.0106 -0.111637 6.55962 0.334912 6.89516L9.18806 13.5469C9.63461 13.8824 10.3653 13.8824 10.8119 13.5469" />
            <path d="M19.299 16.7546C19.299 14.918 19.299 9.40828 19.299 9.40828C19.299 9.40828 19.3031 9.06033 19.1346 9.17523C18.9994 9.2674 18.668 9.4937 18.5513 9.61812C18.4165 9.76164 18.4468 10.0838 18.4468 10.0838C18.4468 10.0838 18.4468 15.0869 18.4468 16.7546C18.4468 16.8493 18.3804 16.8945 18.3487 16.9173C18.0427 17.1377 17.8369 17.5445 17.8369 18.011C17.8369 18.7119 18.3007 19.2801 18.8729 19.2801C19.4451 19.2801 19.9089 18.7119 19.9089 18.011C19.9089 17.5428 19.7016 17.1346 19.3936 16.9148C19.363 16.8929 19.299 16.8492 19.299 16.7546Z" />
          </svg>
        }
        link="/pools"
        onSideBarClose={props.onMobileClose}
      >
        Question pools
      </NavigationItem>
    
    </React.Fragment>
  );

  const drawerContent = (
    <React.Fragment>
      <div className={classes.toolbar}>
        <IconButton
          aria-label="open drawer"
          onClick={props.onToggleMaximize}
          className={classes.menuIcon}
        >
          <img alt="hamburger-icon" src={hamburgerIcon} />
        </IconButton>
      </div>
      <div className={classes.navItems}>{navItems}</div>
    </React.Fragment>
  );

  const { window } = props;

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <nav
      className={clsx(classes.drawer, {
        [classes.drawerMaximized]: props.maximized,
        [classes.drawerMinimized]: !props.maximized,
      })}
      aria-label="mailbox folders"
    >
      <Hidden mdUp implementation="js">
        <Drawer
          container={container}
          variant="temporary"
          anchor="left"
          open={props.mobileOpen}
          onClose={props.onMobileClose}
          classes={{
            paper: classes.paperDrawer,
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawerContent}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.paperDrawer, {
              [classes.drawerMaximized]: props.maximized,
              [classes.drawerMinimized]: !props.maximized,
            }),
            paperAnchorLeft: classes.paperAnchorLeft,
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Hidden>
    </nav>
  );
};

SideBar.propTypes = {
  maximized: PropTypes.bool.isRequired,
  mobileOpen: PropTypes.bool.isRequired,
  onMobileClose: PropTypes.func.isRequired,
  window: PropTypes.object,
  onToggleMaximize: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default SideBar;
