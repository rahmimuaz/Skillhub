import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; 
import Login from "./pages/LoginPage/Login"
import Register from "./pages/LoginPage/Register";
import Users from "./pages/LoginPage/Users";
import Home from "./pages/HomePage/Home"; 
import LearningProgressPage from "./pages/LearningProgressPage/LearningProgressPage.jsx";

import HomePage from "./pages/HomePage";
import CoursePage from "./pages/CoursePage";


const App = () => {
  return (
    <GoogleOAuthProvider clientId="235074436580-fekrpapo667arbo0jkqa9nmprcpqul96.apps.googleusercontent.com">
      <Router>
        <Routes>
          {/* Fix route for Home page */}
          <Route path="/" element={<Login />} />
          <Route path="/home" element={< Home/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<Users />} />
          <Route path="/learn" element={<LearningProgressPage />} />

          <Route path="/hh" element={<HomePage />} />
        <Route path="/course/:id" element={<CoursePage />} />

        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
