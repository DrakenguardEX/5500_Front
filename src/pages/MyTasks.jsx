import { useEffect, useState } from "react";
import TaskDetail from "../components/TaskDetail";
import "./Dashboard.css";
import TopBar from "../components/TopBar";

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  const userId = localStorage.getItem("userId");

  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/tasks/user/${userId}`);
      const data = await res.json();
      console.log("Fetched tasks:", data);
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch personal tasks:", err);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      await fetch(`/api/tasks/user/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask }),
      });
      setNewTask("");
      fetchTasks();
    } catch (err) {
      console.error("Failed to add personal task:", err);
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask({ task }); // no teamId needed
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <TopBar />
      <div className="dashboard-wrapper">
        <div className="dashboard-container centered">
          <h2 className="dashboard-header">My Personal Tasks</h2>

          {tasks.map((task) => (
            <div
              key={task.id}
              className="task-item"
              onClick={() => handleEditTask(task)}
            >
              <div className="task-header">
                <strong>{task.title}</strong>
                <p className="due-date">
                  Due:{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "TBD"}
                </p>
                <p className="cycle">Cycle: {task.cycle || "TBD"}</p>
              </div>

              <p>{task.description || "No description"}</p>
              <p>Type: {task.type || "TBD"}</p>
              <p>Status: {task.status || "TBD"}</p>
              <p>Priority: {task.priority || "TBD"}</p>
            </div>
          ))}

          <div className="input-group">
            <input
              type="text"
              placeholder="New Personal Task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="input-field"
            />
            <button className="btn btn-primary" onClick={handleAddTask}>
              Add
            </button>
          </div>

          {selectedTask && (
            <TaskDetail
              task={selectedTask.task}
              teamId={null}
              onClose={() => setSelectedTask(null)}
              onSave={() => {
                setSelectedTask(null);
                fetchTasks(); // Refresh after editing
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MyTasks;
