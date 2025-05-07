import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Row, Col, Badge, Alert, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEye, FiShare2 } from 'react-icons/fi';
import './LearningPlanList.css';

const API_URL = 'http://localhost:9006/api';

const LearningPlanList = () => {
  const [plans, setPlans] = useState([]);
  const [sharedPlans, setSharedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeTab, setActiveTab] = useState('myPlans');

  // Get user ID from storage or use default values
  const getUserId = () => {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId') || 'user123';
  };
  const SHARED_USER_ID = "sharedUser123";

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const [plansResponse, sharedPlansResponse] = await Promise.all([
          axios.get(`${API_URL}/plans/user/${getUserId()}`),
          axios.get(`${API_URL}/plans/shared/${SHARED_USER_ID}`)
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
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      try {
        await axios.delete(`${API_URL}/plans/${id}`);
        setPlans(plans.filter(plan => plan.id !== id));
      } catch (error) {
        setError('Failed to delete learning plan');
        console.error('Error deleting plan:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="body-bg">
        <div className="centered-content">
          <Spinner animation="border" variant="primary" />
          <div className="mt-3">Loading your learning plans...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="body-bg">
        <div className="lp-container">
          <Alert variant="danger" className="mt-5">{error}</Alert>
        </div>
      </div>
    );
  }

  const renderPlanCard = (plan, isShared = false) => (
    <Col xs={12} sm={6} md={4} key={plan.id}>
      <div
        className={`glass-card${hoveredCard === plan.id ? ' hover' : ''}`}
        onMouseEnter={() => setHoveredCard(plan.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <Card.Body>
          <div className="d-flex align-items-center mb-2">
            <Card.Title className="flex-grow-1">{plan.title}</Card.Title>
            {isShared && <FiShare2 size={20} color="#00b8d9" title="Shared Plan" />}
          </div>
          <Card.Text className="plan-desc">{plan.description}</Card.Text>
          <div className="mb-2">
            <Badge bg="primary" className="me-2">{plan.topics.length} topics</Badge>
            <Badge bg="success">{plan.topics.filter(t => t.completed).length} completed</Badge>
          </div>
          <div className="d-flex justify-content-end align-items-center mt-3">
            <OverlayTrigger placement="top" overlay={<Tooltip>View Details</Tooltip>}>
              <Link to={`/plan/${plan.id}`}>
                <button className="icon-btn" aria-label="View">
                  <FiEye size={18} />
                </button>
              </Link>
            </OverlayTrigger>
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
              <Col>
                <Alert variant="info" className="glass-alert">
                  <div className="text-center">
                    <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No Plans" width="80" className="mb-2" />
                    <div>You don't have any learning plans yet.<br />Click <b>Create New Plan</b> to get started!</div>
                  </div>
                </Alert>
              </Col>
            )}
          </Row>
        ) : (
          <Row className="row-gap">
            {sharedPlans.length > 0 ? (
              sharedPlans.map(plan => renderPlanCard(plan, true))
            ) : (
              <Col>
                <Alert variant="info" className="glass-alert">
                  <div className="text-center">
                    <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No Shared Plans" width="80" className="mb-2" />
                    <div>No shared plans available yet.</div>
                  </div>
                </Alert>
              </Col>
            )}
          </Row>
        )}
      </div>
    </div>
  );

  return (
    <div className="body-bg">
      <div className="lp-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">📚 My Learning Plans</h2>
          <Link to="/plan/new">
            <Button variant="success" className="d-flex align-items-center">
              <FiPlus className="me-2" /> Create New Plan
            </Button>
          </Link>
        </div>
        {renderTabs()}
      </div>
    </div>
  );
};

export default LearningPlanList;
