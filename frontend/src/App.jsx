import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Importing routing components
import { GoogleOAuthProvider } from "@react-oauth/google"; // Importing Google OAuth provider

// Importing page components
import Login from "./pages/LoginPage/Login";
import Register from "./pages/LoginPage/Register";
import Users from "./pages/LoginPage/Users";
import Home from "./pages/HomePage/Home";
import LearningProgressPage from "./pages/LearningProgressPage/LearningProgressPage.jsx";

const App = () => {
  return (
    // Wrapping the application in GoogleOAuthProvider for Google login support
    <GoogleOAuthProvider clientId="235074436580-fekrpapo667arbo0jkqa9nmprcpqul96.apps.googleusercontent.com">
      
      {/* Setting up the React Router */}
      <Router>
        <Routes>
          {/* Route to render the Login component at root URL */}
          <Route path="/" element={<Login />} />
          
          {/* Route to render the Home component at "/home" */}
          <Route path="/home" element={<Home />} />
          
          {/* Route to render the Register component at "/register" */}
          <Route path="/register" element={<Register />} />
          
          {/* Route to render the Users component at "/users" */}
          <Route path="/users" element={<Users />} />
          
          {/* Route to render the LearningProgressPage component at "/learn" */}
          <Route path="/learn" element={<LearningProgressPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
