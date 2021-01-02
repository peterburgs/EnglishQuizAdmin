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
import TopicQuestion from "./containers/Topic/TopicQuestion/TopicQuestion";
import Learner from "./containers/Learner/Learner";

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
  const currentPool = useSelector((state) => state.pools.currentPool);
  const currentTopic = useSelector((state) => state.topics.currentTopic);

  let routes = (
    <Switch>
      <Route path="/signin" exact>
        <Auth />
      </Route>
      <Route path="/">
        <ResolveAuth />
      </Route>
    </Switch>
  );

  if (isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Redirect to="/levels" />
        </Route>
        <Route path="/topics" exact>
          <Layout>
            <ContentContainer>
              <Topic />
            </ContentContainer>
          </Layout>
        </Route>
        <Route path="/topics/:topicId/questions">
          {currentTopic ? (
            <Layout>
              <ContentContainer>
                <TopicQuestion />
              </ContentContainer>
            </Layout>
          ) : (
            <Redirect to="/topics" />
          )}
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
          {currentPool ? (
            <Layout>
              <ContentContainer>
                <PoolQuestion />
              </ContentContainer>
            </Layout>
          ) : (
            <Redirect to="/pools" />
          )}
        </Route>
        <Route path="/learners" exact>
          <Layout>
            <ContentContainer>
              <Learner />
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
