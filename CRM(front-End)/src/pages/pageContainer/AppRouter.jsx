import React from "react";
import { Router, Route } from "react-router-dom";
import { history } from "../../_helpers/history";
import AppContainer from "../pageContainer/index";

const AppRouter = () => {
  return (
    <Router history={history}>
      <Route path="/" component={AppContainer} />      
    </Router>

  );
};

export default AppRouter;
