import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, ListGroup, Badge, Alert } from 'react-bootstrap';
import axios from 'axios';
import SharePlanModal from './SharePlanModal';

const API_URL = 'http://localhost:9006/api';

const LearningPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  const getUserId = () => {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId') || 'user123';
  };

  const SHARED_USER_ID = "sharedUser123";

  useEffect(() => {
    const fetchPlan = async () => {
      if (!id) {
        setError('Invalid plan ID');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/plans/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
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
  }, [id]);

  const handleEdit = () => {
    navigate(`/plan/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      try {
        await axios.delete(`${API_URL}/plans/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
        navigate('/');
      } catch (err) {
        setError(`Failed to delete learning plan: ${err.message || 'Unknown error'}`);
        console.error('Error deleting plan:', err);
      }
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleShareSubmit = async () => {
    try {
      await axios.post(`${API_URL}/plans/${id}/share/${SHARED_USER_ID}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      setShowShareModal(false);
      navigate('/');
    } catch (err) {
      setError(`Failed to share learning plan: ${err.message || 'Unknown error'}`);
      console.error('Error sharing plan:', err);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {error}
          <div className="mt-3">
            <Button variant="primary" onClick={() => navigate('/')}>
              Return to Plans
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!plan) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          Learning plan not found
          <div className="mt-3">
            <Button variant="primary" onClick={() => navigate('/')}>
              Return to Plans
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '30px',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          color: 'white'
        }}
      >
        <h2 style={{ color: 'white' }}>{plan.title || 'Untitled Plan'}</h2>
        <p>{plan.description || 'No description available'}</p>

        {plan.sharedWith && plan.sharedWith.length > 0 && (
          <Alert variant="info" className="mb-3">
            This plan is shared with {plan.sharedWith.length} user(s)
          </Alert>
        )}

        <h3 style={{ color: 'white' }}>Topics</h3>
        {Array.isArray(plan.topics) && plan.topics.length > 0 ? (
          plan.topics.map((topic) => (
            <Card key={topic.id || `topic-${Math.random()}`} className="mb-3">
              <Card.Body>
                <Card.Title>{topic.name || 'Untitled Topic'}</Card.Title>
                <Card.Text>{topic.description || 'No description available'}</Card.Text>
                <div className="mb-2">
                  <small>
                    Start: {topic.startDate || 'Not set'} | End: {topic.endDate || 'Not set'}
                  </small>
                </div>
                <Badge bg={topic.completed ? 'success' : 'warning'}>
                  {topic.completed ? 'Completed' : 'In Progress'}
                </Badge>

                <h5 className="mt-3">Resources</h5>
                {Array.isArray(topic.resources) && topic.resources.length > 0 ? (
                  <ListGroup>
                    {topic.resources.map((resource) => (
                      <ListGroup.Item key={resource.id || `resource-${Math.random()}`}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {resource.name || 'Unnamed Resource'}
                        </a>
                        <Badge bg="secondary" className="ms-2">
                          {resource.type || 'Unknown'}
                        </Badge>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p>No resources added yet</p>
                )}
              </Card.Body>
            </Card>
          ))
        ) : (
          <Alert variant="info">No topics added to this plan yet</Alert>
        )}

        {/* Buttons at Bottom */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Button variant="primary" onClick={handleEdit} className="me-2">
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete} className="me-2">
            Delete
          </Button>
          <Button variant="info" onClick={handleShare}>
            Share
          </Button>
        </div>

        <SharePlanModal
          show={showShareModal}
          onHide={() => setShowShareModal(false)}
          onSubmit={handleShareSubmit}
        />
      </div>
    </Container>
  );
};

export default LearningPlanDetail;
