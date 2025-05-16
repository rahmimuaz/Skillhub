import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Button, ListGroup, Badge, Alert, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import axios from 'axios';
import { Home, BookOpen, Calendar, User, Settings, LogOut, BookMarked, List, CheckCircle, Clock } from 'lucide-react';
import SharePlanModal from './SharePlanModal';
import { useAuth } from '../../context/AuthContext';
import './LearningPlanDetail.css';

const API_URL = 'http://localhost:9006/api';

const LearningPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchPlan = async () => {
      if (!id || !user) {
        setError('Invalid plan ID or user not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/plans/${id}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response && response.data) {
          setPlan(response.data);
        } else {
          setError('No data received from server');
        }
      } catch (err) {
        console.error('Error fetching plan:', err);
        setError(`Failed to load learning plan: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id, user]);

  const handleEdit = () => {
    navigate(`/plan/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      try {
        await axios.delete(`${API_URL}/plans/${id}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        navigate('/plans');
      } catch (err) {
        setError(`Failed to delete learning plan: ${err.message || 'Unknown error'}`);
        console.error('Error deleting plan:', err);
      }
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleShareSubmit = async (shareWithUserId) => {
    try {
      await axios.post(`${API_URL}/plans/${id}/share/${shareWithUserId}`, {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setShowShareModal(false);
      
      // Show success toast and set the message
      setToastMessage('Plan shared successfully!');
      setShowSuccessToast(true);
      
      // Navigate to plans page with shared plans tab selected
      setTimeout(() => {
        navigate('/plans?tab=sharedPlans');
      }, 1500); // Delay navigation to show the toast
    } catch (err) {
      setError(`Failed to share learning plan: ${err.message || 'Unknown error'}`);
      console.error('Error sharing plan:', err);
    }
  };

  if (loading) {
    return (
      <div className="fixed-layout course-detail-layout">
        <div className="fixed-sidebar left-sidebar">
          <SidebarContent user={user} logout={logout} />
        </div>
        <div className="scrollable-content">
          <div className="loading-container">
            <Spinner animation="border" variant="primary" className="loading-spinner" />
            <div>Loading plan details...</div>
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
              <Button variant="primary" onClick={() => navigate('/plans')}>
                Return to Plans
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="fixed-layout course-detail-layout">
        <div className="fixed-sidebar left-sidebar">
          <SidebarContent user={user} logout={logout} />
        </div>
        <div className="scrollable-content">
          <Alert variant="warning">
            Learning plan not found
            <div className="mt-3">
              <Button variant="primary" onClick={() => navigate('/plans')}>
                Return to Plans
              </Button>
            </div>
          </Alert>
        </div>
      </div>
    );
  }

  // Calculate plan stats for the right sidebar
  const totalTopics = plan.topics ? plan.topics.length : 0;
  const completedTopics = plan.topics ? plan.topics.filter(t => t.completed).length : 0;
  const totalResources = plan.topics ? plan.topics.reduce((acc, topic) => 
    acc + (topic.resources ? topic.resources.length : 0), 0) : 0;
  const completionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="fixed-layout course-detail-layout">
      {/* Left Sidebar */}
      <div className="fixed-sidebar left-sidebar">
        <SidebarContent user={user} logout={logout} />
      </div>
      
      {/* Main Content */}
      <div className="scrollable-content">
        {/* Success Toast */}
        <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1000 }}>
          <Toast 
            onClose={() => setShowSuccessToast(false)} 
            show={showSuccessToast} 
            delay={3000} 
            autohide
            bg="success"
          >
            <Toast.Header>
              <strong className="me-auto">Success</strong>
            </Toast.Header>
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>

        <div className="plan-header">
          <div className="plan-title-section">
            <h2>{plan.title || 'Untitled Plan'}</h2>
            <p className="plan-description">{plan.description || 'No description available'}</p>
          </div>
        </div>
        
        <div className="action-buttons">
          <Button variant="primary" onClick={handleEdit}>Edit</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
          <Button variant="info" onClick={handleShare}>Share</Button>
        </div>

        {plan.sharedWith && plan.sharedWith.length > 0 && (
          <Alert variant="info" className="mb-3">
            This plan is shared with {plan.sharedWith.length} user(s)
          </Alert>
        )}

        <div className="topics-section">
          <h3>Topics</h3>
          {Array.isArray(plan.topics) && plan.topics.length > 0 ? (
            plan.topics.map((topic) => (
              <Card key={topic.id || `topic-${Math.random()}`} className="topic-card">
                <Card.Body>
                  <Card.Title>{topic.name || 'Untitled Topic'}</Card.Title>
                  <Card.Text>{topic.description || 'No description available'}</Card.Text>
                  <div className="topic-date-info">
                    <small>
                      Start: {topic.startDate || 'Not set'} | End: {topic.endDate || 'Not set'}
                    </small>
                  </div>
                  <Badge 
                    bg={topic.completed ? 'success' : 'warning'}
                    className="topic-badge"
                  >
                    {topic.completed ? 'Completed' : 'In Progress'}
                  </Badge>
                  
                  <div className="resources-section">
                    <h5>Resources</h5>
                    {Array.isArray(topic.resources) && topic.resources.length > 0 ? (
                      <ListGroup className="resource-list">
                        {topic.resources.map((resource) => (
                          <ListGroup.Item key={resource.id || `resource-${Math.random()}`}>
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              {resource.name || 'Unnamed Resource'}
                            </a>
                            <Badge 
                              bg="secondary" 
                              className="ms-2 resource-type-badge"
                            >
                              {resource.type || 'Unknown'}
                            </Badge>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <p>No resources added yet</p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <Alert variant="info">No topics added to this plan yet</Alert>
          )}
        </div>

        <SharePlanModal
          show={showShareModal}
          onHide={() => setShowShareModal(false)}
          onSubmit={handleShareSubmit}
        />
      </div>
      
      {/* Right Sidebar */}
      <div className="fixed-sidebar right-sidebar">
        <div className="sidebar-section">
          <h3><BookMarked size={18} /> Plan Statistics</h3>
          <div className="plan-stats-list">
            <div className="plan-stats-item">
              <span className="label">Completion</span>
              <span className="value">{completionPercentage}%</span>
            </div>
            <div className="plan-stats-item">
              <span className="label">Topics</span>
              <span className="value">{totalTopics}</span>
            </div>
            <div className="plan-stats-item">
              <span className="label">Completed</span>
              <span className="value">{completedTopics}</span>
            </div>
            <div className="plan-stats-item">
              <span className="label">Resources</span>
              <span className="value">{totalResources}</span>
            </div>
          </div>
        </div>
        
        <div className="sidebar-section">
          <h3><CheckCircle size={18} /> Quick Actions</h3>
          <div className="quick-link-list">
            <Link to={`/plan/edit/${id}`} className="quick-link-item">
              <div className="quick-link-icon">📝</div>
              <div className="quick-link-text">Edit Plan</div>
            </Link>
            <Link to="/plans" className="quick-link-item">
              <div className="quick-link-icon">📋</div>
              <div className="quick-link-text">All Plans</div>
            </Link>
            <Link to="/courses" className="quick-link-item">
              <div className="quick-link-icon">🎓</div>
              <div className="quick-link-text">Find Courses</div>
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

export default LearningPlanDetail;