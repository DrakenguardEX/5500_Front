import { useState, useEffect } from "react";
import TaskDetail from "../components/TaskDetail";

function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedTask, setSelectedTask] = useState(null); // {teamId, task}

  // Fetch teams and tasks
  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams/");
      const data = await response.json();
      setTeams(data);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    }
  };

  useEffect(() => { fetchTeams(); }, []);

  // Add new team
  const handleAddTeam = async () => {
    if (!newTeamName.trim()) return alert("Team name is required.");
    try {
      const response = await fetch("/api/teams/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTeamName })
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

  // Add task to team
  const handleAddTask = async (teamId) => {
    if (!newTaskTitle.trim()) return alert("Task title is required.");
    try {
      const response = await fetch(`/api/teams/${teamId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTaskTitle,
          simple_description: "Simple default description"
        })
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

  // Set selected task for editing (pass task and teamId)
  const handleEditTask = (teamId, task) => {
    setSelectedTask({ teamId, task });
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h2>Teams and Tasks</h2>

      {/* Add Team */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="New Team Name"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <button onClick={handleAddTeam}>Add Team</button>
      </div>

      {/* Team List */}
      {teams.map((team) => (
        <div key={team._id} style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <h3 onClick={() => setExpandedTeamId(expandedTeamId === team._id ? null : team._id)} style={{ cursor: "pointer" }}>
            {team.name} {expandedTeamId === team._id ? "▲" : "▼"}
          </h3>

          {expandedTeamId === team._id && (
            <div>
              {/* Task List */}
              {team.tasks && team.tasks.length > 0 ? (
                team.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleEditTask(team._id, task)} // Set task for editing
                    style={{
                      padding: 10,
                      margin: "10px 0",
                      border: "1px solid gray",
                      borderRadius: 6,
                      backgroundColor: "#f9f9f9",
                      cursor: "pointer"
                    }}
                  >
                    <strong>{task.title}</strong>
                    <p>{task.simple_description || "No description"}</p>
                  </div>
                ))
              ) : (
                <p>No tasks available.</p>
              )}

              {/* Add Task Input */}
              <div style={{ marginTop: 10 }}>
                <input
                  type="text"
                  placeholder="New Task Title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  style={{ marginRight: 5 }}
                />
                <button onClick={() => handleAddTask(team._id)}>Add Task</button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetail
          task={selectedTask.task}
          teamId={selectedTask.teamId}
          onClose={() => setSelectedTask(null)} // Close modal
          onSave={() => {
            setSelectedTask(null); 
            fetchTeams();          
          }} // Refresh teams after saving
        />
      )}
    </div>
  );
}

export default Dashboard;
