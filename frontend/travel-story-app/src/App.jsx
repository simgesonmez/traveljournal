import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Home from "./pages/home/Home";
import 'react-day-picker/dist/style.css';
import './index.css'; // yukarıdaki CSS’in bulunduğu dosya

const App = () => {
  return (
    <div>
      <Router>
        <Routes> 
        <Route path="/" exact element={<Root />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signUp" exact element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  );
};
const Root =() => { 
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to = "/dashboard" />
  ) : ( 
    <Navigate to = "/login" />
  );
};
export default App;
