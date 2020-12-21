import React, { useEffect } from "react";
import { logout } from "../AuthSlice";
import { Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";

const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
  });

  return <Redirect to="/" />;
};

export default Logout;
