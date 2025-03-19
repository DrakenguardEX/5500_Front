import { useState, useEffect } from "react";
import TaskDetail from "../components/TaskDetail";
import "./Dashboard.css";

function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams/");
      const data = await response.json();
      setTeams(data);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleAddTeam = async () => {
    if (!newTeamName.trim()) return alert("Team name is required.");
    try {
      const response = await fetch("/api/teams/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTeamName }),
      });
      if (response.ok) {
        alert("Team created!");
        setNewTeamName("");
        fetchTeams();
      } else {
        alert("Failed to create team.");
      }
    } catch (err) {
      console.error("Add team error:", err);
    }
  };

  const handleAddTask = async (teamId) => {
    if (!newTaskTitle.trim()) return alert("Task title is required.");
    try {
      const response = await fetch(`/api/teams/${teamId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTaskTitle,
          simple_description: "Simple default description",
        }),
      });
      if (response.ok) {
        alert("Task added!");
        setNewTaskTitle("");
        fetchTeams();
      } else {
        alert("Failed to add task.");
      }
    } catch (err) {
      console.error("Add task error:", err);
    }
  };

  const handleEditTask = (teamId, task) => {
    setSelectedTask({ teamId, task });
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container centered">
        <h2 className="dashboard-header">Task Management</h2>
        <div className="input-group">
          <input
            type="text"
            placeholder="New Team Name"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="input-field"
          />
          <button className="btn btn-primary" onClick={handleAddTeam}>
            Add Team
          </button>
        </div>

        <div className="team-grid aligned-grid">
          {teams.map((team) => (
            <div key={team._id} className="team-card">
              <h3
                className="team-title"
                onClick={() =>
                  setExpandedTeamId(
                    expandedTeamId === team._id ? null : team._id
                  )
                }
              >
                {team.name} {expandedTeamId === team._id ? "▲" : "▼"}
              </h3>

              {expandedTeamId === team._id && (
                <div className="task-list">
                  {team.tasks && team.tasks.length > 0 ? (
                    team.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="task-item"
                        onClick={() => handleEditTask(team._id, task)}
                      >
                        <strong>{task.title}</strong>
                        <p>{task.simple_description || "No description"}</p>
                      </div>
                    ))
                  ) : (
                    <p className="no-tasks">No tasks available.</p>
                  )}
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="New Task Title"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="input-field"
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddTask(team._id)}
                    >
                      Add Task
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedTask && (
          <TaskDetail
            task={selectedTask.task}
            teamId={selectedTask.teamId}
            onClose={() => setSelectedTask(null)}
            onSave={() => {
              setSelectedTask(null);
              fetchTeams();
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
