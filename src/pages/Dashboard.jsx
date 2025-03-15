import { useState, useEffect } from "react";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks/");
      const data = await response.json();
      setTasks(data);  // Set fetched tasks
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle delete task
  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (response.ok) {
        alert("Task deleted!");
        fetchTasks();  // Refresh task list
      } else {
        alert("Failed to delete task.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Handle start editing task
  const handleEditStart = (task) => {
    setEditTaskId(task.id);
    setEditTaskTitle(task.title);
  };

  // Handle save edited task
  const handleEditSave = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTaskTitle })
      });
      if (response.ok) {
        alert("Task updated!");
        setEditTaskId(null);  // Exit edit mode
        setEditTaskTitle("");
        fetchTasks();  // Refresh task list
      } else {
        alert("Failed to update task.");
      }
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>Dashboard (Task List)</h2>

      {tasks.length === 0 && <p>No tasks available.</p>}

      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: 10 }}>
            {editTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editTaskTitle}
                  onChange={(e) => setEditTaskTitle(e.target.value)}
                  style={{ marginRight: 10 }}
                />
                <button onClick={() => handleEditSave(task.id)}>Save</button>
                <button onClick={() => setEditTaskId(null)} style={{ marginLeft: 5 }}>Cancel</button>
              </>
            ) : (
              <>
                {task.title}{" "}
                <button onClick={() => handleEditStart(task)} style={{ marginLeft: 10 }}>Edit</button>
                <button onClick={() => handleDelete(task.id)} style={{ marginLeft: 5 }}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
