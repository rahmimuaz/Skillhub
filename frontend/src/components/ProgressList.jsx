const ProgressList = ({ data, onEdit, onDelete }) => {
    return (
      <div className="grid gap-4 mt-4">
        {data.map((item) => (
          <div key={item.id} className="p-4 border rounded shadow bg-gray-100">
            <p><strong>User ID:</strong> {item.userId}</p>
            <p><strong>Plan ID:</strong> {item.planId}</p>
            <p><strong>Lesson ID:</strong> {item.lessonId}</p>
            <p><strong>Progress:</strong> {item.completionProgress}%</p>
            <p><strong>Status:</strong> {item.status}</p>
            <div className="mt-2 flex gap-2">
              <button onClick={() => onEdit(item)} className="text-blue-600">Edit</button>
              <button onClick={() => onDelete(item.id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default ProgressList;
  