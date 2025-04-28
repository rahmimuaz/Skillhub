function CourseCard({ course, onEnroll }) {
    return (
      <div style={{ border: "1px solid #ccc", padding: "20px", width: "250px" }}>
        <h2>{course.name}</h2>
        <p>Completion: {course.completionPercentage}%</p>
        <button onClick={onEnroll}>Enroll</button>
      </div>
    );
  }
  
  export default CourseCard;
  