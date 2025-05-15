import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home as HomeIcon, BookOpen, Calendar, Bell, User, Settings, Plus } from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import Feed from "../Post/Feed";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleNewPost = () => {
    navigate('/create');
  };

  return (
    <div className="fixed-layout home-layout">
      {/* Left Sidebar */}
      <div className="fixed-sidebar left-sidebar">
        <div className="sidebar-branding">
          <h2>Skillhub</h2>
        </div>
        <div className="sidebar-nav">
          <Link to="/" className="sidebar-item active">
            <HomeIcon size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/my-courses" className="sidebar-item">
            <BookOpen size={20} />
            <span>My Courses</span>
          </Link>
          <Link to="/posts" className="sidebar-item">
            <Plus size={20} />
            <span>My Posts</span>
          </Link>
          <Link to="/plans" className="sidebar-item">
            <Calendar size={20} />
            <span>Learning Plans</span>
          </Link>
          <Link to="/settings" className="sidebar-item">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="scrollable-content main-content-section">
        <h2>Welcome to Skillhub!</h2>
        <Feed onNewPost={handleNewPost} />
      </div>

      {/* Right Sidebar */}
      <div className="fixed-sidebar right-sidebar">
        <div className="user-profile">
          <div className="user-avatar">
            <User size={40} />
          </div>
          <div className="user-details">
            <h3>{user?.name || 'Guest User'}</h3>
            <p>{user?.email || 'No email'}</p>
          </div>
        </div>
        
        <div className="sidebar-section">
          <h3><Bell size={18} /> Notifications</h3>
          <ul className="notification-list">
            <li className="notification-item">
              <span className="notification-dot new"></span>
              <p>New course recommendations</p>
            </li>
            <li className="notification-item">
              <span className="notification-dot"></span>
              <p>Weekly learning digest</p>
            </li>
          </ul>
        </div>
        
        <div className="sidebar-section">
          <h3>Quick Links</h3>
          <Link to="/courses" className="quick-link">
            Browse Courses
          </Link>
          <Link to="/plans" className="quick-link">
            Learning Plans
          </Link>
          <Link to="/plan/new" className="quick-link">
            Create New Plan
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
