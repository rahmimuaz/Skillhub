import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, clearSession, getSession } from "../utils/SessionManager";

const Navbar = () => {
  const navigate = useNavigate();
  const session = getSession();

  const handleLogout = () => {
    clearSession();
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Skillhub</h2>
      <div style={styles.links}>
        {isLoggedIn() ? (
          <>
            <span style={{ color: "white" }}>
              Welcome, {session?.name || session?.email}
            </span>
            <Link to="/home" style={styles.link}>Home</Link>
            <Link to="/users" style={styles.link}>Users</Link>
            <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#007bff",
  },
  logo: { fontWeight: "bold", color: "white" },
  links: { display: "flex", gap: "15px", alignItems: "center" },
  link: { color: "white", textDecoration: "none", fontWeight: "bold" },
  logoutButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Navbar;
