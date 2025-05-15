import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopicForm from './TopicForm';
import { FiPlus, FiSave, FiX } from 'react-icons/fi';

const API_URL = 'http://localhost:9006/api';

const LearningPlanForm = ({ onCancel }) => {
  const navigate = useNavigate();

  const getUserId = () => {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId') || 'user123';
  };

  const [plan, setPlan] = useState({
    title: '',
    description: '',
    topics: [],
    userId: getUserId(),
    sharedWith: []
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlan(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/plans`, plan, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/', { state: { successMessage: 'Learning plan created successfully!' } });
      }, 2000);
    } catch (err) {
      setError('Failed to save learning plan. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
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

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{
      backgroundColor: '#f0f2f5',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <Container style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '800px',
        border: '1px solid #e0e0e0'
      }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{
            color: '#4a4a4a',
            fontWeight: '600',
            margin: 0
          }}>
            Create New Learning Plan
          </h2>
          <Button
            variant="link"
            onClick={handleCancel}
            style={{ color: '#6c757d' }}
          >
            <FiX size={24} />
          </Button>
        </div>

        {error && (
          <Alert variant="danger" className="fade-in mb-4">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: '500', color: '#4a4a4a' }}>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={plan.title}
              onChange={handleChange}
              required
              style={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '12px 16px'
              }}
              placeholder="Enter your learning plan title"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: '500', color: '#4a4a4a' }}>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={plan.description}
              onChange={handleChange}
              rows={4}
              style={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '12px 16px'
              }}
              placeholder="Describe your learning goals and objectives"
            />
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 style={{ fontWeight: '600', color: '#4a4a4a' }}>Topics</h3>
            <Button
              variant="outline-primary"
              onClick={handleAddTopic}
              style={{
                borderRadius: '8px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FiPlus /> Add Topic
            </Button>
          </div>

          {plan.topics.length === 0 ? (
            <div style={{
              backgroundColor: '#fafafa',
              borderRadius: '8px',
              padding: '2rem',
              textAlign: 'center',
              border: '2px dashed #ccc',
              marginBottom: '1.5rem'
            }}>
              <p style={{ color: '#6c757d', margin: 0 }}>
                No topics added yet. Click "Add Topic" to get started.
              </p>
            </div>
          ) : (
            plan.topics.map((topic, index) => (
              <Card key={topic.id} className="mb-3" style={{
                backgroundColor: '#ffffff',
                border: '1px solid #ccc',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <Card.Body>
                  <TopicForm
                    topic={topic}
                    onChange={(updatedTopic) => handleTopicChange(updatedTopic, index)}
                    onRemove={() => handleRemoveTopic(index)}
                  />
                </Card.Body>
              </Card>
            ))
          )}

          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button
              variant="outline-secondary"
              onClick={handleCancel}
              style={{
                borderRadius: '8px',
                padding: '10px 24px'
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              style={{
                borderRadius: '8px',
                padding: '10px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Creating...
                </>
              ) : (
                <>
                  <FiSave /> Create Plan
                </>
              )}
            </Button>
          </div>
        </Form>
      </Container>

      {/* Success Modal */}
      {success && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="check-icon">✅</div>
            <h2>Plan Created Successfully</h2>
            <p>Your learning plan has been saved. Redirecting...</p>
          </div>
        </div>
      )}

      {/* ✅ FIXED: Removed invalid jsx/global props */}
      <style>{`
        .fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          backdrop-filter: blur(6px);
          background-color: rgba(0, 0, 0, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.4s ease-out;
        }

        .modal-card {
          background: #fff;
          border-radius: 16px;
          padding: 3rem 2.5rem;
          max-width: 420px;
          width: 100%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          text-align: center;
          animation: scaleIn 0.3s ease-out;
        }

        .check-icon {
          font-size: 3.5rem;
          color: #28a745;
          margin-bottom: 1rem;
        }

        .modal-card h2 {
          margin-bottom: 0.5rem;
          font-size: 1.6rem;
          font-weight: 600;
          color: #333;
        }

        .modal-card p {
          font-size: 1rem;
          color: #666;
        }

        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        body {
          background-color: #f0f2f5;
        }
      `}</style>
    </div>
  );
};

export default LearningPlanForm;
