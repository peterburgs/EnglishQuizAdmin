import React from "react";
import NavLink from "../../NavLink/NavLink";
import useStyles from "./NavigationItem.styles";
import PropTypes from "prop-types";

const NavigationItem = (props) => {
  const classes = useStyles();

  return (
    <NavLink
      className={classes.navigationItem}
      exact
      activeClassName={classes.active}
      to={props.link}
      onClick={props.onSideBarClose}
    >
      {props.icon ? props.icon : null}
      {props.children}
    </NavLink>
  );
};

NavigationItem.propTypes = {
  link: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  children: PropTypes.string.isRequired,
  onSideBarClose: PropTypes.func.isRequired,
};

export default NavigationItem;
