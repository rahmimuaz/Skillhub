import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import '../styles/CourseList.css';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchCourses();
        // Clear any cached course IDs
        localStorage.removeItem('lastViewedCourseIds');
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await courseService.getAllCourses();
            if (!data || data.length === 0) {
                setError('No courses available at the moment');
                setCourses([]);
            } else {
                setCourses(data);
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError('Failed to load courses. Please try again later.');
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (courseId) => {
        if (!user) {
            // Redirect to login if not authenticated
            window.location.href = '/login';
            return;
        }

        try {
            await courseService.enrollInCourse(courseId, user.id);
            // Refresh the course list to show updated enrollment status
            fetchCourses();
        } catch (err) {
            console.error('Error enrolling in course:', err);
            setError('Failed to enroll in course. Please try again later.');
        }
    };

    if (loading) return <div className="loading">Loading courses...</div>;
    if (error) return (
        <div className="error-container">
            <div className="error-message">{error}</div>
            <button onClick={fetchCourses} className="retry-button">
                Retry Loading Courses
            </button>
        </div>
    );

    return (
        <div className="course-list">
            <h1>Available Courses</h1>
            {courses.length === 0 ? (
                <div className="no-courses-message">
                    No courses are currently available. Please check back later.
                </div>
            ) : (
                <div className="course-grid">
                    {courses.map((course) => (
                        <div key={course.id} className="course-card">
                            <h2>{course.name}</h2>
                            <p>{course.description}</p>
                            <div className="course-stats">
                                <div className="stat">
                                    <span className="stat-label">Levels</span>
                                    <span className="stat-value">{course.levels?.length || 0}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">Tasks</span>
                                    <span className="stat-value">
                                        {course.levels?.reduce(
                                            (total, level) => total + (level.tasks?.length || 0),
                                            0
                                        ) || 0}
                                    </span>
                                </div>
                            </div>
                            <div className="course-actions">
                                <Link to={`/courses/${course.id}`} className="view-btn">
                                    View Details
                                </Link>
                                <button 
                                    onClick={() => handleEnroll(course.id)}
                                    className="enroll-btn"
                                >
                                    {course.enrolled ? 'Enrolled' : 'Enroll Now'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CourseList; 