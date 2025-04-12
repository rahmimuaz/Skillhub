import { useState, useEffect } from "react";

const ProgressForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [formData, setFormData] = useState({
    userId: "",
    planId: "",
    lessonId: "",
    completionProgress: 0,
    status: "In Progress",
    ...initialData,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 border rounded-xl shadow bg-white">
      {["userId", "planId", "lessonId"].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field}
          value={formData[field]}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      ))}
      <input
        type="number"
        name="completionProgress"
        min="0"
        max="100"
        value={formData.completionProgress}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        {onCancel && (
          <button onClick={onCancel} type="button" className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
        )}
      </div>
    </form>
  );
};

export default ProgressForm;
