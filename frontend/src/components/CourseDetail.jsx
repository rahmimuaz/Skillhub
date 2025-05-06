import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import '../styles/CourseDetail.css';

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrolled, setEnrolled] = useState(false);
    const [progress, setProgress] = useState(null);
    const [enrollmentId, setEnrollmentId] = useState(null);
    const [updatingTask, setUpdatingTask] = useState(null);

    useEffect(() => {
        loadCourse();
    }, [courseId]);

    const loadCourse = async () => {
        try {
            setLoading(true);
            setError(null);
            const courseData = await courseService.getCourseById(courseId);
            
            if (!courseData) {
                setError('Course not found');
                return;
            }
            
            setCourse(courseData);
            
            if (user?.id) {
                try {
                    const enrollments = await courseService.getUserEnrollments(user.id);
                    const enrollment = enrollments.find(e => e.courseId === courseId);
                    if (enrollment) {
                        setEnrolled(true);
                        setProgress(enrollment.progress);
                        setEnrollmentId(enrollment.id);
                    }
                } catch (enrollError) {
                    console.error('Error fetching enrollment:', enrollError);
                }
            }
        } catch (err) {
            console.error('Error loading course:', err);
            if (err.response?.status === 404) {
                setError('Course not found. It may have been deleted or moved.');
            } else {
                setError('Failed to load course details. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const enrollment = await courseService.enrollInCourse(courseId, user.id);
            setEnrolled(true);
            setProgress(enrollment.progress);
            setEnrollmentId(enrollment.id);
        } catch (err) {
            console.error('Error enrolling in course:', err);
            setError('Failed to enroll in course. Please try again later.');
        }
    };

    const handleTaskCompletion = async (taskId, completed) => {
        if (!enrollmentId) {
            setError('You must be enrolled to track progress');
            return;
        }

        if (!taskId) {
            console.error('Task ID is missing');
            return;
        }

        try {
            setUpdatingTask(taskId);
            const updatedEnrollment = await courseService.updateTaskProgress(
                enrollmentId,
                taskId,
                completed
            );

            if (!updatedEnrollment) {
                throw new Error('Failed to update task progress');
            }

            setProgress(updatedEnrollment.progress);

            // Update the course state to reflect the task completion
            setCourse(prevCourse => ({
                ...prevCourse,
                levels: prevCourse.levels.map(level => ({
                    ...level,
                    tasks: level.tasks.map(task => 
                        task.taskId === taskId 
                            ? { ...task, isCompleted: completed }
                            : task
                    )
                }))
            }));
        } catch (err) {
            console.error('Error updating task progress:', err);
            setError('Failed to update task progress. Please try again.');
        } finally {
            setUpdatingTask(null);
        }
    };

    const isTaskCompleted = (taskId) => {
        if (!taskId || !progress?.completedTasks) return false;
        return progress.completedTasks.includes(taskId);
    };

    if (loading) return <div className="loading">Loading course details...</div>;
    
    if (error) return (
        <div className="error-container">
            <div className="error-message">{error}</div>
            <div className="error-actions">
                <button onClick={() => navigate('/')} className="back-button">
                    Back to Courses
                </button>
                <button onClick={loadCourse} className="retry-button">
                    Retry Loading
                </button>
            </div>
        </div>
    );

    if (!course) return null;

    return (
        <div className="course-detail">
            <h1>{course.name}</h1>
            <p className="course-description">{course.description}</p>
            
            {enrolled ? (
                <div className="enrollment-status">
                    <div className="progress-info">
                        <h3>Your Progress</h3>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill"
                                style={{ width: `${progress?.completionPercentage || 0}%` }}
                            />
                        </div>
                        <span className="progress-text">
                            {Math.round(progress?.completionPercentage || 0)}% Complete
                        </span>
                        <div className="level-info">
                            Current Level: {progress?.currentLevel || 1}
                        </div>
                    </div>
                </div>
            ) : (
                <button 
                    onClick={handleEnroll} 
                    className="enroll-button"
                    disabled={!user}
                >
                    {user ? 'Enroll Now' : 'Login to Enroll'}
                </button>
            )}

            <div className="course-content">
                <h2>Course Content</h2>
                {course.levels?.map((level, levelIndex) => (
                    <div 
                        key={`level-${level.levelNumber}-${levelIndex}`}
                        className={`level-section ${level.levelNumber <= (progress?.currentLevel || 1) ? 'unlocked' : 'locked'}`}
                    >
                        <h3>Level {level.levelNumber}: {level.levelName}</h3>
                        <div className="tasks-list">
                            {level.tasks?.map((task, taskIndex) => (
                                <div 
                                    key={`task-${task.taskId || taskIndex}`}
                                    className={`task-item ${isTaskCompleted(task.taskId) ? 'completed' : ''}`}
                                >
                                    <span className="task-name">{task.taskName}</span>
                                    <p className="task-description">{task.taskDescription}</p>
                                    {enrolled && task.taskId && (
                                        <button 
                                            className={`task-status ${isTaskCompleted(task.taskId) ? 'completed' : ''}`}
                                            onClick={() => handleTaskCompletion(task.taskId, !isTaskCompleted(task.taskId))}
                                            disabled={updatingTask === task.taskId || level.levelNumber > (progress?.currentLevel || 1)}
                                        >
                                            {updatingTask === task.taskId ? 'Updating...' : 
                                             isTaskCompleted(task.taskId) ? 'Completed' : 'Mark as Complete'}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseDetail; 