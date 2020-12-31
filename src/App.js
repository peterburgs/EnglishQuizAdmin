/* eslint-disable react/prop-types */
import React from "react";
import Layout from "./hoc/Layout/Layout";
import useStyles from "./App.styles";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import { Switch, Route, Redirect } from "react-router-dom";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { useSelector } from "react-redux";

import "fontsource-roboto";

import ContentContainer from "./hoc/ContentContainer/ContentContainer";
import Auth from "./containers/Auth/Auth";
import ResolveAuth from "./containers/Auth/ResolveAuth/ResolveAuth";
import Logout from "./containers/Auth/Logout/Logout";
import Topic from "./containers/Topic/Topic";
import Level from "./containers/Level/Level";
import Pool from "./containers/Pool/Pool";
import PoolQuestion from "./containers/Pool/PoolQuestion/PoolQuestion";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1A73E8",
    },
    secondary: {
      main: "#e7305b",
    },
  },
  typography: {
    fontFamily: "Roboto",
    fontSize: 12,
  },
});

function App() {
  const classes = useStyles();
  const isAuthenticated = useSelector((state) => state.auth.token !== null);

  let routes = (
    <Switch>
      <Route path="/" exact>
        <ResolveAuth />
      </Route>
      <Route path="/signin">
        <Auth />
      </Route>
      <Redirect to="/" />
    </Switch>
  );

  if (isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Redirect to="/levels" />
        </Route>
        <Route path="/topics">
          <Layout>
            <ContentContainer>
              <Topic />
            </ContentContainer>
          </Layout>
        </Route>
        <Route path="/levels">
          <Layout>
            <ContentContainer>
              <Level />
            </ContentContainer>
          </Layout>
        </Route>
        <Route path="/pools" exact>
          <Layout>
            <ContentContainer>
              <Pool />
            </ContentContainer>
          </Layout>
        </Route>
        <Route path="/pools/:poolId/questions">
          <Layout>
            <ContentContainer>
              <PoolQuestion />
            </ContentContainer>
          </Layout>
        </Route>
        <Route path="/logout">
          <Logout />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <div className={classes.app}>{routes}</div>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}

export default App;
