import { useState } from "react";
import "./TaskDetail.css";

function TaskDetail({ task, teamId, onClose, onSave }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status || "TBD");
  const [type, setType] = useState(task.type || "TBD");
  const [priority, setPriority] = useState(task.priority || "TBD");

  const [cycle, setCycle] = useState(task.cycle || "Daily");
  const [dueDate, setDueDate] = useState(task.dueDate || "");

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
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
        onSave(); // Notify parent to refresh
      } else {
        alert("Failed to update task.");
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/teams/${teamId}/tasks/${task.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        alert("Task deleted!");
        onSave(); // Refresh parent
        onClose(); // Close modal
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
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;
