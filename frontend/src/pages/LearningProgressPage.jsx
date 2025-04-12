import { useEffect, useState } from "react";
import {
  getAllProgress,
  getByUserId,
  getByPlanId,
  createProgress,
  updateProgress,
  deleteProgress,
} from "../api/progressApi";
import ProgressForm from "../components/ProgressForm";
import ProgressList from "../components/ProgressList";

const LearningProgressPage = () => {
  const [progressList, setProgressList] = useState([]);
  const [editingData, setEditingData] = useState(null);
  const [filter, setFilter] = useState({ userId: "", planId: "" });

  const loadData = async () => {
    if (filter.userId) setProgressList(await getByUserId(filter.userId));
    else if (filter.planId) setProgressList(await getByPlanId(filter.planId));
    else setProgressList(await getAllProgress());
  };

  useEffect(() => { loadData(); }, [filter]);

  const handleSubmit = async (data) => {
    editingData
      ? await updateProgress(editingData.id, data)
      : await createProgress(data);
    setEditingData(null);
    await loadData();
  };

  const handleDelete = async (id) => {
    await deleteProgress(id);
    await loadData();
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-4">
      <h1 className="text-2xl font-bold">Learning Progress Tracker</h1>
      <div className="flex gap-2">
        <input
          placeholder="Filter by userId"
          value={filter.userId}
          onChange={(e) => setFilter({ ...filter, userId: e.target.value, planId: "" })}
          className="p-2 border rounded"
        />
        <input
          placeholder="Filter by planId"
          value={filter.planId}
          onChange={(e) => setFilter({ ...filter, planId: e.target.value, userId: "" })}
          className="p-2 border rounded"
        />
        <button onClick={() => setFilter({ userId: "", planId: "" })} className="px-3 bg-gray-300 rounded">Reset</button>
      </div>

      <ProgressForm onSubmit={handleSubmit} initialData={editingData} onCancel={() => setEditingData(null)} />
      <ProgressList data={progressList} onEdit={setEditingData} onDelete={handleDelete} />
    </div>
  );
};

export default LearningProgressPage;
