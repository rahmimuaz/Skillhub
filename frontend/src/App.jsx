import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import CourseList from './components/CourseList';
import CourseDetail from './components/CourseDetail';
import MyCourses from './components/MyCourses';
import Login from './pages/Login';
import './App.css';
import Home from './pages/Home/Home';
import { GoogleOAuthProvider } from '@react-oauth/google';

const Navigation = () => {
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

function App() {
    return (
        <GoogleOAuthProvider clientId="235074436580-fekrpapo667arbo0jkqa9nmprcpqul96.apps.googleusercontent.com">
            <Router>
                <AuthProvider>
                    <div className="app">
                        <Navigation />
                        <main className="main-content">
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/" element={<Home />} />
                                <Route path="/my-courses" element={<MyCourses />} />
                                <Route path="/courses/:courseId" element={<CourseDetail />} />
                                <Route path="/home" element={<Home />} />
                                <Route path="/courses" element={<CourseList />} />
                            </Routes>
                        </main>
                    </div>
                </AuthProvider>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
