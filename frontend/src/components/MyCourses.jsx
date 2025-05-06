import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import '../styles/MyCourses.css';

const MyCourses = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user?.id) {
            fetchEnrolledCourses();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchEnrolledCourses = async () => {
        try {
            const enrollmentsData = await courseService.getUserEnrollments(user.id);
            setEnrollments(enrollmentsData);

            // Fetch course details for each enrollment
            const coursesData = await Promise.all(
                enrollmentsData.map(enrollment =>
                    courseService.getCourseById(enrollment.courseId)
                )
            );
            setCourses(coursesData);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch enrolled courses');
            setLoading(false);
        }
    };

    const getCourseProgress = (courseId) => {
        const enrollment = enrollments.find(e => e.courseId === courseId);
        return enrollment?.progress?.completionPercentage || 0;
    };

    const getCompletedTasks = (courseId) => {
        const enrollment = enrollments.find(e => e.courseId === courseId);
        return enrollment?.progress?.completedTasks?.length || 0;
    };

    const getTotalTasks = (course) => {
        return course.levels?.reduce(
            (total, level) => total + (level.tasks?.length || 0),
            0
        ) || 0;
    };

    if (loading) return <div className="loading">Loading your courses...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!user) return <div className="error">Please log in to view your courses</div>;

    return (
        <div className="my-courses">
            <h1>My Courses</h1>
            {courses.length > 0 ? (
                <div className="course-grid">
                    {courses.map((course) => (
                        <div key={course.id} className="course-card">
                            <h2>{course.name}</h2>
                            <p>{course.description}</p>
                            <div className="progress-info">
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill"
                                        style={{ width: `${getCourseProgress(course.id)}%` }}
                                    />
                                </div>
                                <span>{getCourseProgress(course.id)}% Complete</span>
                            </div>
                            <div className="task-info">
                                <span>{getCompletedTasks(course.id)} of {getTotalTasks(course)} tasks completed</span>
                            </div>
                            <Link to={`/courses/${course.id}`} className="view-course-btn">
                                Continue Learning
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-courses">
                    <p>You haven't enrolled in any courses yet.</p>
                    <Link to="/" className="browse-courses-btn">
                        Browse Courses
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyCourses; 