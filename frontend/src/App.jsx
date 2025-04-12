import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import GoogleOAuthProvider
import Login from "./pages/Login"
import Register from "./pages/Register";
import Users from "./pages/Users";
import Home from "./pages/Home"; // Import Home page
import LearningProgressPage from "./pages/LearningProgressPage";

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

        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
