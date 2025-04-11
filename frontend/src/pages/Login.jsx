import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleManualLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9006/auth/login", { email, password });
      if (response.data === "Login successful!") {
        navigate("/users");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError("An error occurred during login");
    }
  };

  const handleGoogleLogin = async (response) => {
    // Handle Google login logic here, usually you would send the token to your backend for validation.
    const token = response.credential;
    // Send token to backend to authenticate user
    try {
      const response = await axios.post("http://localhost:9006/oauth2/authorize", { token });
      navigate("/users");
    } catch (error) {
      setError("Google login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleManualLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>{error}</p>
      <GoogleLogin onSuccess={handleGoogleLogin} onError={() => console.log("Login Failed")} />
    </div>
  );
};

export default Login;
