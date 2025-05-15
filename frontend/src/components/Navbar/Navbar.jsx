// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css'; // Optional: for custom styles

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="nav-content">
                <Link to="/" className="nav-logo">
                    Learning Tracker
                </Link>
                <div className="nav-links">
                    {isAuthenticated ? (
                        <>
                            <Link to="/" className="nav-link">Courses</Link>
                            <Link to="/my-courses" className="nav-link">My Courses</Link>
                            <div className="user-menu">
                                <span className="user-name">{user?.name}</span>
                                <button onClick={logout} className="logout-btn">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link to="/login" className="nav-link">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
