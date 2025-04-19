import "./TopBar.css";

function TopBar({ onMyTasks, onTeamTasks, onAssistant, onLogout }) {
  return (
    <div className="top-bar">
      <div className="toolbar-buttons">
        <button className="btn btn-secondary" onClick={onMyTasks}>
          Go to My Tasks
        </button>
        <button className="btn btn-success" onClick={onAssistant}>
          AI Assistant
        </button>
        <button className="btn btn-secondary" onClick={onTeamTasks}>
          Go to Team Tasks
        </button>
        <button className="btn btn-danger" onClick={onLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default TopBar;
