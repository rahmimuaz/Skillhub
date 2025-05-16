import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, Button, Row, Col, Badge, Alert, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEye, FiShare2, FiBook, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { Home, BookOpen, Calendar, User, Settings, LogOut, BookMarked, List } from 'lucide-react';
import './LearningPlanList.css';

const API_URL = 'http://localhost:9006/api';

const LearningPlanList = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [plans, setPlans] = useState([]);
  const [sharedPlans, setSharedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Check URL parameters for active tab
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam === 'sharedPlans' ? 'sharedPlans' : 'myPlans');

  // Sample plan background images by topic/categories
  const planBackgrounds = {
    default: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    programming: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    design: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    business: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    marketing: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    languages: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    personal: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
  };

  // Function to determine which background image to use
  const getPlanBackground = (plan) => {
    if (!plan) return planBackgrounds.default;
    
    // Check if plan has its own image
    if (plan.image) return plan.image;
    
    // Determine image based on plan title/topics keywords
    const titleLower = plan.title.toLowerCase();
    
    if (titleLower.includes('programming') || titleLower.includes('coding') || titleLower.includes('development'))
      return planBackgrounds.programming;
    
    if (titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux'))
      return planBackgrounds.design;
    
    if (titleLower.includes('business') || titleLower.includes('management') || titleLower.includes('finance'))
      return planBackgrounds.business;
    
    if (titleLower.includes('marketing') || titleLower.includes('seo') || titleLower.includes('social media'))
      return planBackgrounds.marketing;
    
    if (titleLower.includes('language') || titleLower.includes('english') || titleLower.includes('spanish'))
      return planBackgrounds.languages;
    
    if (titleLower.includes('personal') || titleLower.includes('growth') || titleLower.includes('self'))
      return planBackgrounds.personal;
    
    return planBackgrounds.default;
  };

  useEffect(() => {
    const fetchPlans = async () => {
      if (!user) return;
      
      try {
        const [plansResponse, sharedPlansResponse] = await Promise.all([
          axios.get(`${API_URL}/plans/user/${user.id}`, {
            withCredentials: true
          }),
          axios.get(`${API_URL}/plans/shared/${user.id}`, {
            withCredentials: true
          })
        ]);
        setPlans(plansResponse.data);
        setSharedPlans(sharedPlansResponse.data);
      } catch (error) {
        setError('Failed to load learning plans');
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      try {
        await axios.delete(`${API_URL}/plans/${id}`, {
          withCredentials: true
        });
        setPlans(plans.filter(plan => plan.id !== id));
      } catch (error) {
        setError('Failed to delete learning plan');
        console.error('Error deleting plan:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed-layout course-detail-layout">
        <div className="fixed-sidebar left-sidebar">
          <SidebarContent user={user} logout={logout} />
        </div>
        <div className="scrollable-content">
          <div className="centered-content">
            <Spinner animation="border" variant="primary" />
            <div className="mt-3">Loading your learning plans...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed-layout course-detail-layout">
        <div className="fixed-sidebar left-sidebar">
          <SidebarContent user={user} logout={logout} />
        </div>
        <div className="scrollable-content">
          <div className="error-container">
            <div className="error-message">{error}</div>
            <div className="error-actions">
              <button onClick={() => fetchPlans()} className="retry-button">
                Retry Loading
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Custom render for the progress indicator
  const renderProgressIndicator = (plan) => {
    const totalTopics = plan.topics.length;
    const completedTopics = plan.topics.filter(t => t.completed).length;
    const progressPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
    
    // Determine status color
    let statusColor = '#4CAF50'; // Green
    if (progressPercentage < 25) statusColor = '#FF9800'; // Orange
    else if (progressPercentage < 50) statusColor = '#2196F3'; // Blue
    
    return (
      <div className="plan-progress-container">
        <div className="progress-text">
          <Badge bg="primary" className="me-2">{totalTopics} topics</Badge>
          <Badge 
            bg={completedTopics === 0 ? 'secondary' : 
               completedTopics === totalTopics && totalTopics > 0 ? 'success' : 'info'}
          >
            {completedTopics} completed
          </Badge>
        </div>
        {completedTopics === totalTopics && totalTopics > 0 && (
          <div className="completion-badge">
            <FiCheckCircle size={18} /> Completed
          </div>
        )}
      </div>
    );
  };

  const renderPlanCard = (plan, isShared = false) => (
    <Col xs={12} sm={6} md={4} key={plan.id}>
      <div
        className={`glass-card enhanced-card${hoveredCard === plan.id ? ' hover' : ''}`}
        onMouseEnter={() => setHoveredCard(plan.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="plan-card-image-container">
          <img 
            src={getPlanBackground(plan)} 
            alt={plan.title} 
            className="plan-card-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = planBackgrounds.default;
            }}
          />
          <div className="plan-card-badge">
            {isShared ? 
              <div className="shared-badge"><FiShare2 size={14} /> Shared with you</div> : 
              <div className="owner-badge">Your Plan</div>
            }
          </div>
        </div>
        <Card.Body>
          <div className="d-flex align-items-center mb-2">
            <Card.Title className="flex-grow-1">{plan.title}</Card.Title>
          </div>
          <Card.Text className="plan-desc">{plan.description}</Card.Text>
          
          {/* Enhanced progress indicator */}
          {renderProgressIndicator(plan)}
          
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Link to={`/plan/${plan.id}`} className="view-plan-btn">
              View Details <FiEye size={16} className="ms-1" />
            </Link>
            {!isShared && (
              <OverlayTrigger placement="top" overlay={<Tooltip>Delete Plan</Tooltip>}>
                <button
                  className="icon-btn delete"
                  aria-label="Delete"
                  onClick={() => handleDelete(plan.id)}
                >
                  <FiTrash2 size={18} />
                </button>
              </OverlayTrigger>
            )}
          </div>
        </Card.Body>
      </div>
    </Col>
  );

  const renderEmptyState = (isShared = false) => (
    <Col>
      <div className="empty-state-container">
        <div className="empty-state-image">
          <img 
            src={isShared ? 
              "https://cdn-icons-png.flaticon.com/512/6598/6598519.png" : 
              "https://cdn-icons-png.flaticon.com/512/4076/4076549.png"} 
            alt="No Plans" 
            width="120" 
            className="mb-3"
          />
        </div>
        <h3>{isShared ? "No Shared Plans" : "No Learning Plans Yet"}</h3>
        <p>
          {isShared ? 
            "No one has shared any learning plans with you yet." : 
            "Create your first learning plan to organize your learning journey."
          }
        </p>
        {!isShared && (
          <Link to="/plan/new">
            <Button variant="success" className="d-flex align-items-center mx-auto create-plan-btn">
              <FiPlus className="me-2" /> Create New Plan
            </Button>
          </Link>
        )}
      </div>
    </Col>
  );

  // Custom tab navigation rendering
  const renderTabs = () => (
    <div className="glass-tabs">
      <div className="tab-nav" style={{ display: "flex", borderBottom: "none" }}>
        <button
          className={`tab-nav-link${activeTab === "myPlans" ? " active" : ""}`}
          onClick={() => setActiveTab("myPlans")}
        >
          My Plans
        </button>
        <button
          className={`tab-nav-link${activeTab === "sharedPlans" ? " active" : ""}`}
          onClick={() => setActiveTab("sharedPlans")}
        >
          Shared With Me
        </button>
      </div>
      <div style={{ padding: "24px 0 0 0" }}>
        {activeTab === "myPlans" ? (
          <Row className="row-gap">
            {plans.length > 0 ? (
              plans.map(plan => renderPlanCard(plan))
            ) : (
              renderEmptyState(false)
            )}
          </Row>
        ) : (
          <Row className="row-gap">
            {sharedPlans.length > 0 ? (
              sharedPlans.map(plan => renderPlanCard(plan, true))
            ) : (
              renderEmptyState(true)
            )}
          </Row>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed-layout course-detail-layout">
      {/* Left Sidebar */}
      <div className="fixed-sidebar left-sidebar">
        <SidebarContent user={user} logout={logout} />
      </div>
      
      {/* Main Content */}
      <div className="scrollable-content">
        <div className="page-header">
          <div>
            <h2 className="fw-bold">📚 My Learning Plans</h2>
            <p className="text-muted">Organize your learning journey with custom plans</p>
          </div>
          <Link to="/plan/new">
            <Button variant="success" className="d-flex align-items-center">
              <FiPlus className="me-2" /> Create New Plan
            </Button>
          </Link>
        </div>
        {renderTabs()}
      </div>
      
      {/* Right Sidebar */}
      <div className="fixed-sidebar right-sidebar">
        <div className="sidebar-section">
          <h3><BookMarked size={18} /> Plan Statistics</h3>
          <div className="course-info-list">
            <div className="info-item">
              <strong>My Plans:</strong> {plans.length}
            </div>
            <div className="info-item">
              <strong>Shared Plans:</strong> {sharedPlans.length}
            </div>
            <div className="info-item">
              <strong>Completed Plans:</strong> {plans.filter(p => p.topics.length > 0 && p.topics.every(t => t.completed)).length}
            </div>
          </div>
        </div>
        
        <div className="sidebar-section">
          <h3>Quick Actions</h3>
          <div className="quick-link-list">
            <Link to="/plan/new" className="quick-link-item">
              <div className="quick-link-icon">📝</div>
              <div className="quick-link-text">Create New Plan</div>
            </Link>
            <Link to="/courses" className="quick-link-item">
              <div className="quick-link-icon">🎓</div>
              <div className="quick-link-text">Browse Courses</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Separate component for sidebar content to avoid duplication
const SidebarContent = ({ user, logout }) => {
  return (
    <>
      {user && (
        <div className="sidebar-user">
          <div className="user-avatar">
            <User size={40} />
          </div>
          <div className="user-info">
            <h3>{user?.name || 'User'}</h3>
            <p>{user?.email || 'user@example.com'}</p>
          </div>
        </div>
      )}
      
      <div className="sidebar-nav">
        <Link to="/" className="sidebar-item">
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/courses" className="sidebar-item">
          <BookOpen size={20} />
          <span>Courses</span>
        </Link>
        <Link to="/my-courses" className="sidebar-item">
          <List size={20} />
          <span>My Courses</span>
        </Link>
        <Link to="/posts" className="sidebar-item">
          <BookMarked size={20} />
          <span>Posts</span>
        </Link>
        <Link to="/plans" className="sidebar-item active">
          <Calendar size={20} />
          <span>Learning Plans</span>
        </Link>
        <Link to="/settings" className="sidebar-item">
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </div>
      
      {user && logout && (
        <button className="sidebar-logout" onClick={logout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      )}
    </>
  );
};

export default LearningPlanList;
