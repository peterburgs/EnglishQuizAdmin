import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout, authSuccess } from "../AuthSlice";
import { useHistory } from "react-router-dom";

const ResolveAuth = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
      history.replace("/signin");
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate > new Date()) {
        dispatch(authSuccess({ token: token }));
        setTimeout(() => {
          dispatch(logout());
        }, expirationDate.getTime() - new Date().getTime());
      } else {
        dispatch(logout());
        history.replace("/signin");
      }
    }
  }, [dispatch, history]);

  return null;
};

export default ResolveAuth;
