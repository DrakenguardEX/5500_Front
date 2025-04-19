import { useState } from "react";
import "./TaskDetail.css";

function TaskDetail({ task, teamId, onClose, onSave }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status || "Pending");
  const [type, setType] = useState(task.type || "Uncategorized");
  const [priority, setPriority] = useState(task.priority || "Medium");
  const [cycle, setCycle] = useState(task.cycle || "Daily");
  const [dueDate, setDueDate] = useState(
    task.dueDate ? task.dueDate.substring(0, 10) : ""
  );

  const baseURL = import.meta.env.DEV ? "" : import.meta.env.VITE_BACKEND_URL;

  const handleSave = async () => {
    try {
      const response = await fetch(`${baseURL}/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          status,
          type,
          priority,
          cycle,
          dueDate,
        }),
      });

      if (response.ok) {
        alert("Task updated successfully!");
        onSave();
      } else {
        alert("Failed to update task.");
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this task?");
    if (!confirm) return;

    const url = teamId
      ? `/api/teams/${teamId}/tasks/${task.id}`
      : `/api/tasks/${task.id}`;

    try {
      const response = await fetch(`${baseURL}${url}`, { method: "DELETE" });
      const result = await response.json();

      if (response.ok) {
        alert("Task deleted!");
        onSave();
        onClose();
      } else {
        alert("Failed to delete task: " + result.message);
      }
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  return (
    <div className="task-detail-overlay">
      <div className="task-detail-container">
        <h3>Edit Task</h3>

        <label>Title</label>
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

        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Uncategorized">Uncategorized</option>
          <option value="Daily">Daily</option>
          <option value="Study">Study</option>
          <option value="Work">Work</option>
        </select>

        <label>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <label>Cycle</label>
        <select value={cycle} onChange={(e) => setCycle(e.target.value)}>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>

        <label>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div className="button-group">
          <button className="save-btn" onClick={handleSave}>Save</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;

