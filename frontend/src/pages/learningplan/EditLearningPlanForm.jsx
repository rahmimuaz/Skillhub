// src/components/EditLearningPlanForm.js
import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import TopicForm from './TopicForm';
import { FaPlus, FaSave, FaTimes, FaArrowUp } from 'react-icons/fa';
import './EditLearningPlanForm.css';

const API_URL = 'http://localhost:9006/api';

const EditLearningPlanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await axios.get(`${API_URL}/plans/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
        setPlan(response.data);
      } catch (err) {
        setError('Failed to load learning plan');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop } = containerRef.current;
        setShowScrollTop(scrollTop > 300);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlan(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API_URL}/plans/${plan.id}`, plan, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      navigate('/');
    } catch (err) {
      setError('Failed to update learning plan');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTopic = () => {
    setPlan(prev => ({
      ...prev,
      topics: [...prev.topics, {
        id: Date.now().toString(),
        name: '',
        description: '',
        startDate: null,
        endDate: null,
        completed: false,
        resources: []
      }]
    }));

    // Scroll to the bottom after adding a new topic
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleTopicChange = (updatedTopic, index) => {
    setPlan(prev => {
      const newTopics = [...prev.topics];
      newTopics[index] = updatedTopic;
      return { ...prev, topics: newTopics };
    });
  };

  const handleRemoveTopic = (index) => {
    setPlan(prev => {
      const newTopics = [...prev.topics];
      newTopics.splice(index, 1);
      return { ...prev, topics: newTopics };
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="error-alert">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!plan) {
    return (
      <Container className="mt-4">
        <Alert variant="warning" className="warning-alert">
          <Alert.Heading>Not Found</Alert.Heading>
          <p>Learning plan not found</p>
          <Button variant="outline-warning" onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="edit-plan-container" ref={containerRef}>
      <Card className="edit-plan-card">
        <Card.Header className="edit-plan-header">
          <h2>Edit Learning Plan</h2>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="form-label">Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={plan.title}
                onChange={handleChange}
                required
                className="form-control-lg"
                placeholder="Enter plan title"
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="form-label">Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={plan.description}
                onChange={handleChange}
                rows={4}
                className="form-control-lg"
                placeholder="Enter plan description"
              />
            </Form.Group>
            
            <div className="topics-section">
              <div className="topics-header">
                <h3>Topics</h3>
                <Button 
                  variant="success" 
                  onClick={handleAddTopic} 
                  className="add-topic-btn"
                >
                  <FaPlus className="me-2" /> Add Topic
                </Button>
              </div>
              
              {plan.topics.map((topic, index) => (
                <Card key={topic.id} className="topic-card mb-3">
                  <Card.Body>
                    <TopicForm
                      topic={topic}
                      onChange={(updatedTopic) => handleTopicChange(updatedTopic, index)}
                      onRemove={() => handleRemoveTopic(index)}
                    />
                  </Card.Body>
                </Card>
              ))}
            </div>
            
            <div className="form-actions">
              <Button 
                variant="primary" 
                type="submit" 
                className="save-btn"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" /> Save Changes
                  </>
                )}
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/')}
                className="cancel-btn"
              >
                <FaTimes className="me-2" /> Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      
      <button 
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>
    </Container>
  );
};

export default EditLearningPlanForm;