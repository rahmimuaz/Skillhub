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
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlan(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

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
      padding: '2rem',
      position: 'relative'
    }}>
      {/* ✅ Centered Success Overlay */}
      {success && (
        <div className="success-overlay">
          <div className="success-message">
            <div className="checkmark">✔</div>
            <h4>Learning Plan Created Successfully!</h4>
          </div>
        </div>
      )}

      <Container style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '800px',
        border: '1px solid #e0e0e0',
        opacity: success ? 0.3 : 1,
        pointerEvents: success ? 'none' : 'auto',
        transition: 'opacity 0.3s ease'
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

      {/* ✅ Extra Styling */}
      <style jsx global>{`
        .fade-in {
          animation: fadeIn 0.4s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .success-overlay {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          background: rgba(240, 242, 245, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.4s ease-in;
        }

        .success-message {
          background-color: #ffffff;
          padding: 3rem 4rem;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 500px;
        }

        .success-message h4 {
          color: #28a745;
          margin-top: 1rem;
          font-weight: 600;
        }

        .checkmark {
          font-size: 3rem;
          color: #28a745;
          animation: pop 0.3s ease-out;
        }

        @keyframes pop {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LearningPlanForm;
