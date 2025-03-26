import { useState, useEffect } from "react";
import TaskDetail from "../components/TaskDetail";
import "./Dashboard.css";

function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [memberToAdd, setMemberToAdd] = useState({});


  const userId = localStorage.getItem("userId");


  const fetchTeams = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("User not logged in");
  
    try {
      const response = await fetch("/api/teams/", {
        headers: {
          "X-User-Id": userId
        }
      });
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
  
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("User not logged in");
  
    try {
      const response = await fetch("/api/teams/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId  // ✅ 添加这个
        },
        body: JSON.stringify({ name: newTeamName }),
      });
  
      if (response.ok) {
        alert("Team created!");
        setNewTeamName("");
        fetchTeams();
      } else {
        const errorData = await response.json();
        alert("Failed to create team: " + errorData.message);
      }
    } catch (err) {
      console.error("Add team error:", err);
    }
  };
  
  const handleAddMember = async (teamId) => {
    const usernameToAdd = memberToAdd[teamId];  // ✅ 正确取值！
  
    if (!usernameToAdd) {
      return alert("Enter a username to add.");
    }
  
    try {
      const response = await fetch(`/api/teams/${teamId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameToAdd })  // ✅ 使用正确变量名
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Member added!");
        setMemberToAdd({ ...memberToAdd, [teamId]: "" });
        fetchTeams();
      } else {
        alert("Failed to add member: " + data.message);
      }
    } catch (err) {
      console.error("Add member error:", err);
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
    <div>
      <div className="top-bar">
        <button
          className="btn btn-secondary"
          onClick={() => window.location.href = "/my-tasks"}
        >
          Go to My Tasks
        </button>
      </div>
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

                    {/* Add Member to Team */}
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="User ID to add"
                        value={memberToAdd[team._id] || ""}
                        onChange={(e) =>
                          setMemberToAdd({ ...memberToAdd, [team._id]: e.target.value })
                        }
                        className="input-field"
                      />
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleAddMember(team._id)}
                      >
                        Add Member
                      </button>
                    </div>

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
    </div>
  );
}

export default Dashboard;
