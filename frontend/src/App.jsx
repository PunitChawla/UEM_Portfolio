import React from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import InputForm from "./pages/Loginform";
import ResumeUpload from "./pages/Resume";

import Portfolio from "./pages/ResumeBuilder";


const App = () => {
  return (
    <Routes>
      <Route path="/signin" element= {<Signin/>} ></Route>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/loginform" element={<InputForm/>} />
      <Route path="/resume" element={<ResumeUpload/>} />
      {/* <Route path="/resumebuilder" element={<Portfolio/>} /> */}
    </Routes>
  );
};

export default App;
