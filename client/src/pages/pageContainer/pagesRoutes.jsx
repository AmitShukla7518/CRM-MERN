import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import PrivateRoute from "../routes/PrivateRoute";
// import PublicRoute from "../routes/PublicRoute";
import { history } from "../../_helpers/history";
// import { Routes, Route, Navigate } from "react-router-dom";
const Dashboard = lazy(() => import("../dashboard"));
const FormWizard = lazy(() => import("../forms/form-wizard"));
const TanstackTable = lazy(() => import("../table/react-tables/ExampleTwo"));
const selectInput = lazy(() => import("../forms/select/index"));
const ComingSoonPage = lazy(() => import("../utility/coming-soon"));
const UnderConstructionPage = lazy(() => import("../utility/under-construction"));
const Login = lazy(() => import("../auth/login2"));
const currentPath = "/";
const PagesRouter = () => {
  return (
    // <Route history={history}>
    //   <Switch>

    //     <PrivateRoute component={HomeReturnBtn} path={`/return-home`} />
    //     <PublicRoute restricted={false} component={UserSignUp} path="/signup" exact />

    //     <PublicRoute restricted={false} component={PageNotFound} path="/*" exact />
    //   </Switch>
    // </Route>
    <Routes>
    <Route history={history}>
      

      <Route path="login" element={<Suspense fallback={<Loading />}><Login />  </Suspense>} />
      <Route path="/*" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="form-wizard" element={<FormWizard />} />
        <Route path="table-advanced" element={<TanstackTable />} />
        <Route path="import-Excel" element={<UnderConstructionPage />} />
        <Route path="Contect-us" element={<ComingSoonPage />} />
      </Route>
      </Route>
      </Routes>
     
  );
};

export default PagesRouter;



