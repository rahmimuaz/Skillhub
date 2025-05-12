import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Row, Col } from 'react-bootstrap';
import LearningPlanForm from './pages/learningplan/LearningPlanForm';
import LearningPlanDetail from './pages/learningplan/LearningPlanDetail';
import LearningPlanList from './pages/learningplan/LearningPlanList';
import EditLearningPlanForm from './pages/learningplan/EditLearningPlanForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Optional: For custom styles like background or footer fixing

// --- Dashboard Component (Initial View) ---
function Dashboard() {
  const navigate = useNavigate();
  return (
   <Container
  className="d-flex flex-column align-items-center justify-content-center text-center"
  style={{ minHeight: '70vh', paddingTop: '5rem', paddingBottom: '5rem', color: 'white' }}
>
  <h1 style={{ fontSize: '3.5rem' }} className="mb-3">
    Welcome to Your Learning Planner
  </h1>
  <p
    className="lead mb-5"
    style={{ maxWidth: '700px', color: 'white', fontSize: '1.8rem', fontWeight: '500' }}
  >
    Organize, track, and achieve your learning goals effectively.
  </p>
      <Row className="g-3 justify-content-center">
        <Col xs="auto">
  <Button
    variant="primary"
    size="lg"
    onClick={() => navigate('/plans')}
    style={{
      minWidth: '220px',
      padding: '1rem 2rem',
      borderRadius: '50px',
      fontSize: '1.2rem',
      fontWeight: '500',
    }}
  >
    View My Plans
  </Button>
</Col>

<Col xs="auto">
  <Button
    variant="success"
    size="lg"
    onClick={() => navigate('/plan/new')}
    style={{
      minWidth: '220px',
      padding: '1rem 2rem',
      borderRadius: '50px',
      fontSize: '1.2rem',
      fontWeight: '500',
    }}
  >
    Create New Plan
  </Button>
</Col>

      </Row>
    </Container>
  );
}

// --- Main App Component ---
function App() {
  return (
    <Router>

      {/* --- Main Content Area --- */}
      <Container fluid="md" className="mt-4 mb-5 flex-grow-1"> {/* Use fluid="md" for better spacing on larger screens */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          <Route path="/plan/new" element={<LearningPlanForm />} />
          <Route path="/plans" element={<LearningPlanList />} />
          <Route path="/plan/edit/:id" element={<EditLearningPlanForm />} />
          <Route path="/plan/:id" element={<LearningPlanDetail/>} />
      
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
