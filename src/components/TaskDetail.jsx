import { useState } from "react";
import "./TaskDetail.css";

function TaskDetail({ task, teamId, onClose, onSave }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status || "Pending");

  // Call backend to update task
  const handleSave = async () => {
    try {
      const response = await fetch(`/api/teams/${teamId}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, status }),
      });

      if (response.ok) {
        alert("Task updated successfully!");
        onSave(); // Notify parent to refresh
      } else {
        alert("Failed to update task.");
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  return (
    <div className="task-detail-overlay">
      <div className="task-detail-container">
        <h3>Edit Task</h3>
        <label>Task Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <div className="button-group">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;
