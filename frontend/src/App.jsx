import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Navbar from "./components/Navbar";
import Login from "./pages/LoginPage/Login";
import Register from "./pages/LoginPage/Register";
import Users from "./pages/LoginPage/Users";
import Home from "./pages/HomePage/Home";

const App = () => {
  return (
    <GoogleOAuthProvider clientId="235074436580-fekrpapo667arbo0jkqa9nmprcpqul96.apps.googleusercontent.com">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
