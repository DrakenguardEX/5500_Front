import { useEffect, useState } from "react";
import TaskDetail from "../components/TaskDetail";
import "./Dashboard.css";

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

  // useEffect(() => {
  //   // fetchTasks(); // Temporarily comment this out

  //   setTasks([
  //     {
  //       id: "1",
  //       title: "Test Task",
  //       description: "This is just a test to see if it renders",
  //       type: "Personal",
  //       status: "Pending",
  //       priority: "Medium",
  //     },
  //   ]);
  // }, []);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container centered">
        <h2 className="dashboard-header">My Personal Tasks</h2>

        {tasks.map((task) => (
          <div
            key={task.id}
            className="task-item"
            onClick={() => handleEditTask(task)}
          >
            <strong>{task.title}</strong>
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
  );
}

export default MyTasks;
