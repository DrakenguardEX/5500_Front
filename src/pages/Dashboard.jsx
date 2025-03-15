import { useState, useEffect } from "react";
import TaskDetail from "../components/TaskDetail"; // 引入弹窗组件
import TaskFilter from "../components/TaskFilter";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({ searchTerm: "", priority: "all" });
  const [sortBy, setSortBy] = useState("date");
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

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    applyFiltersAndSort(tasks, filters, sortBy);
  }, [tasks]);

  // Handle delete task
  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
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
        body: JSON.stringify({ title: editTaskTitle }),
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
        body: JSON.stringify(updatedTask),
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

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    applyFiltersAndSort(tasks, newFilters, sortBy);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    applyFiltersAndSort(tasks, filters, newSortBy);
  };

  const applyFiltersAndSort = (taskList, currentFilters, currentSortBy) => {
    let result = [...taskList];

    // Apply filters
    if (currentFilters.searchTerm) {
      result = result.filter(
        (task) =>
          task.title
            .toLowerCase()
            .includes(currentFilters.searchTerm.toLowerCase()) ||
          task.description
            .toLowerCase()
            .includes(currentFilters.searchTerm.toLowerCase())
      );
    }

    if (currentFilters.priority !== "all") {
      result = result.filter(
        (task) => task.priority === currentFilters.priority
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (currentSortBy) {
        case "date":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredTasks(result);
  };

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "40px 20px",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // marginBottom: 30,
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#2c3e50",
            fontSize: "28px",
          }}
        >
          My Tasks
        </h2>

        <button
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "6px",
            fontWeight: "600",
          }}
        >
          + Add New Task
        </button>
      </div>

      {tasks.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "white",
            borderRadius: "8px",
            color: "#666",
          }}
        >
          <h3>No Tasks Yet</h3>
          <p>Create your first task to get started!</p>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: editTaskId === task.id ? "default" : "pointer",
              ":hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            {editTaskId === task.id ? (
              <div style={{ padding: "10px 0" }}>
                <input
                  type="text"
                  value={editTaskTitle}
                  onChange={(e) => setEditTaskTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    marginBottom: "15px",
                    fontSize: "16px",
                  }}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleEditSave(task.id)}
                    style={{
                      backgroundColor: "#4CAF50",
                      color: "white",
                      flex: 1,
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditTaskId(null)}
                    style={{
                      backgroundColor: "#f5f5f5",
                      color: "#333",
                      flex: 1,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  onClick={() => setSelectedTask(task)}
                  style={{ padding: "10px 0" }}
                >
                  <h3
                    style={{
                      margin: "0 0 10px 0",
                      color: "#2c3e50",
                      fontSize: "18px",
                    }}
                  >
                    {task.title}
                  </h3>
                  <p
                    style={{
                      margin: "0",
                      color: "#666",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                  >
                    {task.description || "No description"}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "15px",
                    borderTop: "1px solid #eee",
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStart(task);
                    }}
                    style={{
                      backgroundColor: "#2196F3",
                      color: "white",
                      flex: 1,
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(task.id);
                    }}
                    style={{
                      backgroundColor: "#FF5252",
                      color: "white",
                      flex: 1,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

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
