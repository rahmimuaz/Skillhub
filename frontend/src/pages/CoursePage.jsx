import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function CoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:9006/api/courses/${id}`)
      .then((res) => res.json())
      .then((data) => setCourse(data));
  }, [id]);

  const handleTaskComplete = (taskName) => {
    fetch(`http://localhost:9006/api/courses/updateProgress/${id}?taskName=${taskName}`, {
      method: "POST"
    })
    .then(() => {
      // Reload course
      fetch(`http://localhost:9006/api/courses/${id}`)
        .then((res) => res.json())
        .then((data) => setCourse(data));
    });
  };

  if (!course) return <div>Loading...</div>;

  return (
    <div>
      <h1>{course.name}</h1>
      <p>Completion: {course.completionPercentage}%</p>

      <ul>
        {course.tasks.map((task) => (
          <li key={task.name}>
            {task.name} - {task.completed ? "✅" : "❌"}
            {!task.completed && (
              <button onClick={() => handleTaskComplete(task.name)} style={{ marginLeft: "10px" }}>
                Mark Complete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CoursePage;
