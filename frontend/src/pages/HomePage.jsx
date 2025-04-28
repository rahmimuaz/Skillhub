import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard";

function HomePage() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:9006/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

  const handleEnroll = (id) => {
    fetch(`http://localhost:9006/api/courses/enroll/${id}`, { method: "POST" })
      .then(() => navigate(`/course/${id}`));
  };

  return (
    <div>
      <h1>Learning Progress Tracker</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onEnroll={() => handleEnroll(course.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
