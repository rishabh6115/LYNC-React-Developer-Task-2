import React from "react";

import { Route, Routes } from "react-router-dom";
import Wrapper from "./layout/Wrapper";
import Homepage from "./pages/Homepage";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<Wrapper />}>
          <Route path="/*" element={<Homepage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
