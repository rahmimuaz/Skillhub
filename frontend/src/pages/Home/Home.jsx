import React from "react";
import { Link } from "react-router-dom"; // import Link

import "./Home.css";

const Home = () => {
  return (
    <div className="home-layout">
      <div className="left-sidebar">
        <h3>Sidebar</h3>
        <ul>
          <li>Dashboard</li>
          <li>Courses</li>
          <li>Progress</li>
        </ul>
      </div>

      <div className="main-content">
        <h2>Welcome to Skillhub!</h2>
        <p>This is your learning dashboard. Explore your learning plans and track your progress.</p>
      </div>

      <div className="right-sidebar">
        <h3>Notifications</h3>
        <ul>
          <li>No new alerts</li>
          <li>Check new updates</li>
        </ul>
        <Link to="/courses" className="course-link">Go to Courses</Link>
        <Link to="/plans" className="course-link">Planning and Sharing</Link>
        <Link to="/plan/new" className="course-link">Planning and Sharing</Link>
      </div>
    </div>
  );
};

export default Home;
