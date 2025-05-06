import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await axios.get('http://localhost:9006/api/auth/status', {
                withCredentials: true
            });
            if (response.data.authenticated) {
                setUser(response.data.user);
                if (window.location.pathname === '/login') {
                    navigate('/');
                }
            } else {
                setUser(null);
                if (window.location.pathname !== '/login') {
                    navigate('/login');
                }
            }
        } catch (error) {
            console.error('Auth status check failed:', error);
            setUser(null);
            if (window.location.pathname !== '/login') {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:9006/api/auth/logout', {}, {
                withCredentials: true
            });
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 