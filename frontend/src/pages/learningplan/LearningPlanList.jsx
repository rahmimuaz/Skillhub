import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Row, Col, Badge, Alert, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEye, FiShare2 } from 'react-icons/fi';

const API_URL = 'http://localhost:9006/api';

const styles = {
  bodyBg: {
    background: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', 'Roboto', Arial, sans-serif",
    padding: 0,
    margin: 0,
    width: '100vw',
    boxSizing: 'border-box',
  },
  container: {
    width: '100%',
    maxWidth: '1300px',
    margin: '0 auto',
    padding: '32px 16px 32px 16px',
    boxSizing: 'border-box',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  glassCard: {
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(16px) saturate(180%)",
    WebkitBackdropFilter: "blur(16px) saturate(180%)",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.3)",
    boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)",
    transition: "transform 0.15s, box-shadow 0.15s",
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  glassCardHover: {
    transform: "translateY(-4px) scale(1.03)",
    boxShadow: "0 16px 40px 0 rgba(31,38,135,0.22)",
  },
  planDesc: {
    minHeight: 44,
    color: "#444",
    fontSize: "1rem",
    marginBottom: "0.5rem",
  },
  glassTabs: {
    background: "rgba(255,255,255,0.6)",
    borderRadius: 12,
    marginBottom: 16,
    padding: "6px 8px",
  },
  glassAlert: {
    background: "rgba(255,255,255,0.7)",
    borderRadius: 16,
    border: "none",
  },
  centeredContent: {
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  tabNav: {
    border: "none",
    marginBottom: 0,
    background: "transparent"
  },
  tabNavLink: {
    color: "#235390",
    fontWeight: 500,
    borderRadius: "12px 12px 0 0",
    marginRight: 4,
    padding: "10px 24px",
    background: "transparent",
    border: "none",
    transition: "background 0.2s, color 0.2s",
    outline: "none",
    cursor: "pointer",
  },
  tabNavLinkActive: {
    background: "rgba(255,255,255,0.6)",
    borderBottom: "2px solid #4f8cff",
    color: "#235390",
    fontWeight: "bold",
  },
  rowGap: {
    rowGap: '32px'
  }
};

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
      <div style={styles.bodyBg}>
        <div style={styles.centeredContent}>
          <Spinner animation="border" variant="primary" />
          <div className="mt-3">Loading your learning plans...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.bodyBg}>
        <div style={styles.container}>
          <Alert variant="danger" className="mt-5">{error}</Alert>
        </div>
      </div>
    );
  }

  const renderPlanCard = (plan, isShared = false) => (
    <Col xs={12} sm={6} md={4} key={plan.id}>
      <div
        style={{
          ...styles.glassCard,
          ...(hoveredCard === plan.id ? styles.glassCardHover : {}),
        }}
        onMouseEnter={() => setHoveredCard(plan.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <Card.Body>
          <div className="d-flex align-items-center mb-2">
            <Card.Title className="flex-grow-1">{plan.title}</Card.Title>
            {isShared && <FiShare2 size={20} color="#00b8d9" title="Shared Plan" />}
          </div>
          <Card.Text style={styles.planDesc}>{plan.description}</Card.Text>
          <div className="mb-2">
            <Badge bg="primary" className="me-2">{plan.topics.length} topics</Badge>
            <Badge bg="success">{plan.topics.filter(t => t.completed).length} completed</Badge>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Link to={`/plan/${plan.id}`}>
              <OverlayTrigger placement="top" overlay={<Tooltip>View Details</Tooltip>}>
                <Button variant="outline-primary" size="sm">
                  <FiEye className="me-1" /> View
                </Button>
              </OverlayTrigger>
            </Link>
            {!isShared && (
              <OverlayTrigger placement="top" overlay={<Tooltip>Delete Plan</Tooltip>}>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(plan.id)}
                >
                  <FiTrash2 className="me-1" /> Delete
                </Button>
              </OverlayTrigger>
            )}
          </div>
        </Card.Body>
      </div>
    </Col>
  );

  // Custom tab navigation rendering
  const renderTabs = () => (
    <div style={styles.glassTabs}>
      <div style={{ display: "flex", borderBottom: "none" }}>
        <button
          style={{
            ...styles.tabNavLink,
            ...(activeTab === "myPlans" ? styles.tabNavLinkActive : {}),
          }}
          onClick={() => setActiveTab("myPlans")}
        >
          My Plans
        </button>
        <button
          style={{
            ...styles.tabNavLink,
            ...(activeTab === "sharedPlans" ? styles.tabNavLinkActive : {}),
          }}
          onClick={() => setActiveTab("sharedPlans")}
        >
          Shared With Me
        </button>
      </div>
      <div style={{ padding: "24px 0 0 0" }}>
        {activeTab === "myPlans" ? (
          <Row style={styles.rowGap}>
            {plans.length > 0 ? (
              plans.map(plan => renderPlanCard(plan))
            ) : (
              <Col>
                <Alert variant="info" style={styles.glassAlert}>
                  <div className="text-center">
                    <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No Plans" width="80" className="mb-2" />
                    <div>You don't have any learning plans yet.<br />Click <b>Create New Plan</b> to get started!</div>
                  </div>
                </Alert>
              </Col>
            )}
          </Row>
        ) : (
          <Row style={styles.rowGap}>
            {sharedPlans.length > 0 ? (
              sharedPlans.map(plan => renderPlanCard(plan, true))
            ) : (
              <Col>
                <Alert variant="info" style={styles.glassAlert}>
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
    <div style={styles.bodyBg}>
      <div style={styles.container}>
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
