import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import GoogleOAuthProvider
import Login from "./Login";
import Register from "./Register";
import Users from "./Users";
import Home from "./Home"; // Import Home page

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
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
