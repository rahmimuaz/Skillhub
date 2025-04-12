const API_BASE = "http://localhost:9006/api/learningProgress";

export const getAllProgress = () => fetch(API_BASE).then(res => res.json());
export const getByUserId = (userId) => fetch(`${API_BASE}/user/${userId}`).then(res => res.json());
export const getByPlanId = (planId) => fetch(`${API_BASE}/plan/${planId}`).then(res => res.json());
export const createProgress = (data) =>
  fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(res => res.json());

export const updateProgress = (id, data) =>
  fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(res => res.json());

export const deleteProgress = (id) =>
  fetch(`${API_BASE}/${id}`, { method: "DELETE" });
