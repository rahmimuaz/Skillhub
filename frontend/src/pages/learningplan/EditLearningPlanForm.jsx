// src/components/EditLearningPlanForm.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import TopicForm from './TopicForm';

const API_URL = 'http://localhost:9006/api';

const EditLearningPlanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlan(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Alert variant="danger" className="glass-box p-4">{error}</Alert>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Alert variant="warning" className="glass-box p-4">Learning plan not found</Alert>
      </div>
    );
  }

  return (
    <div className="edit-plan-container" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '2rem 0'
    }}>
      <Container className="py-4">
        <div className="glass-box" style={{
          backdropFilter: 'blur(16px) saturate(180%)',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.125)',
          padding: '2rem',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          color: 'white'
        }}>
          <h2 className="text-center mb-4" style={{ fontWeight: '600' }}>Edit Learning Plan</h2>
          
          {error && <Alert variant="danger" className="fade-in">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: '500' }}>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={plan.title}
                onChange={handleChange}
                required
                className="glass-input"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white'
                }}
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: '500' }}>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={plan.description}
                onChange={handleChange}
                rows={3}
                className="glass-input"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white'
                }}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 style={{ fontWeight: '600' }}>Topics</h3>
              <Button 
                variant="outline-light" 
                onClick={handleAddTopic}
                style={{
                  borderRadius: '50px',
                  fontWeight: '500',
                  borderWidth: '2px'
                }}
              >
                <i className="bi bi-plus-circle me-2"></i>Add Topic
              </Button>
            </div>
            
            {plan.topics.map((topic, index) => (
              <Card key={topic.id} className="mb-3 glass-card" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                <Card.Body>
                  <TopicForm
                    topic={topic}
                    onChange={(updatedTopic) => handleTopicChange(updatedTopic, index)}
                    onRemove={() => handleRemoveTopic(index)}
                  />
                </Card.Body>
              </Card>
            ))}
            
            <div className="d-flex justify-content-between mt-4">
              <Button 
                variant="light" 
                type="submit"
                style={{
                  borderRadius: '50px',
                  fontWeight: '600',
                  padding: '0.5rem 2rem'
                }}
              >
                <i className="bi bi-save me-2"></i>Update Plan
              </Button>
              <Button 
                variant="outline-light" 
                onClick={() => navigate('/')}
                style={{
                  borderRadius: '50px',
                  fontWeight: '500',
                  padding: '0.5rem 2rem',
                  borderWidth: '2px'
                }}
              >
                <i className="bi bi-x-circle me-2"></i>Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Container>
      
      {/* Add some global styles */}
      <style jsx global>{`
        .glass-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        .glass-input:focus {
          background-color: rgba(255, 255, 255, 0.2) !important;
          color: white !important;
          border-color: rgba(255, 255, 255, 0.5) !important;
          box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
        }
        .fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default EditLearningPlanForm;