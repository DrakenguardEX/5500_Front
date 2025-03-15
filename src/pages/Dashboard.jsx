import { useState, useEffect } from "react";
import TaskDetail from "../components/TaskDetail";  // 引入弹窗组件

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState(null); // 控制弹窗

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks/");
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  // Handle delete task
  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (response.ok) {
        alert("Task deleted!");
        fetchTasks();
      } else {
        alert("Failed to delete task.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Handle inline edit
  const handleEditStart = (task) => {
    setEditTaskId(task.id);
    setEditTaskTitle(task.title);
  };

  const handleEditSave = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTaskTitle })
      });
      if (response.ok) {
        alert("Task updated!");
        setEditTaskId(null);
        setEditTaskTitle("");
        fetchTasks();
      } else {
        alert("Failed to update task.");
      }
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  // Handle modal save
  const handleModalSave = async (updatedTask) => {
    try {
      const response = await fetch(`/api/tasks/${updatedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask)
      });
      if (response.ok) {
        alert("Task detail updated!");
        setSelectedTask(null);
        fetchTasks();
      } else {
        alert("Failed to update task.");
      }
    } catch (err) {
      console.error("Modal update error:", err);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h2>Dashboard (Task List)</h2>

      {tasks.length === 0 && <p>No tasks available.</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              width: "calc(50% - 20px)",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              position: "relative",
              backgroundColor: "#fff"
            }}
          >
            {editTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editTaskTitle}
                  onChange={(e) => setEditTaskTitle(e.target.value)}
                  style={{ width: "100%", marginBottom: 10 }}
                />
                <button onClick={() => handleEditSave(task.id)}>Save</button>
                <button onClick={() => setEditTaskId(null)} style={{ marginLeft: 5 }}>Cancel</button>
              </>
            ) : (
              <>
                {/* Clickable area for opening modal */}
                <div
                  onClick={() => {
                    console.log("Clicked Task:", task); // ✅ 应该打印任务数据
                    setSelectedTask(task);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <h3>{task.title}</h3>
                  <p>{task.description || "No description"}</p>
                </div>


                {/* Edit & Delete buttons */}
                <div style={{ marginTop: 10 }}>
                  <button onClick={() => handleEditStart(task)} style={{ marginRight: 5 }}>Edit</button>
                  <button onClick={() => handleDelete(task.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Modal (Task Detail) */}
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}

export default Dashboard;
