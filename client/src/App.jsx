import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Loading from "@/components/Loading";
import Layout from "./layout/Layout";

import { PrivateComponent } from "./routes/PrivateRoute";
const Dashboard = lazy(() => import("./pages/dashboard"));
const FormWizard = lazy(() => import("./pages/forms/form-wizard"));
const ShowAllRecord = lazy(() =>
  import("./pages/table/react-tables/showAllRecord")
);
const selectInput = lazy(() => import("./pages/forms/select/index"));
const ComingSoonPage = lazy(() => import("./pages/utility/coming-soon"));
const ImportExcel = lazy(() => import("./pages/utility/importExcel"));
const Login = lazy(() => import("./pages/auth/login2"));
const Demo = lazy(() => import("./pages/table/react-tables/demo"));
const Profile = lazy(() => import("./pages/utility/profile"));
const ForgotPass = lazy(() => import("./pages/auth/forgot-password"));
const ResetPass = lazy(() => import("./pages/auth/reset-password"));
const AddFrom = lazy(() => import("./pages/forms/form-wizard/addForm"));
const FormRepeater = lazy(() => import("./pages/forms/form-repeater"));

// import AppRouter from "./pages/pageContainer/AppRouter";

function App() {
  return (
    <div className="App  relative">
      {/* <AppRouter /> */}
      <Routes>
        <Route
          path="login"
          element={
            <Suspense fallback={<Loading />}>
              <Login />{" "}
            </Suspense>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <Suspense fallback={<Loading />}>
              {" "}
              <ForgotPass />{" "}
            </Suspense>
          }
        />
        <Route
          path="/reset-password/:urlData"
          element={
            <Suspense fallback={<Loading />}>
              {" "}
              <ResetPass />{" "}
            </Suspense>
          }
        />
        <Route element={<PrivateComponent />}>
          <Route path="/*" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="form-wizard" element={<FormWizard />} />
            <Route path="table-advanced" element={<ShowAllRecord />} />
            <Route path="import-Excel" element={<ImportExcel />} />
            <Route path="Contect-us" element={<ComingSoonPage />} />
            <Route path="test" element={<Demo />} />
            <Route path="profile" element={<Profile />} />
            <Route path="AddFrom" element={<AddFrom />} />
            <Route path="FormRepeater" element={<FormRepeater />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
