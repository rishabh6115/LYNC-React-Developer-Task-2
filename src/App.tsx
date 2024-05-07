import React from "react";

import { Route, Routes } from "react-router-dom";
import PrivateRoutes from "./layout/PrivateRoutes";
import Homepage from "./pages/Homepage";
import { Toaster } from "react-hot-toast";
import PublicRoutes from "./layout/PublicRoutes";
import AuthPage from "./pages/AuthPage";

const App: React.FC = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard/*" element={<Homepage />} />
        </Route>
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<AuthPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
