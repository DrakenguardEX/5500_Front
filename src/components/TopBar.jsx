import { useNavigate } from "react-router-dom";
import "./TopBar.css";

function TopBar() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    console.log("Signing out...");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/login"); // this will trigger React Router
  };

  return (
    <div className="top-bar">
      <div className="toolbar-buttons">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/my-tasks")}
        >
          Go to My Tasks
        </button>
        <button
          className="btn btn-success"
          onClick={() => navigate("/ai-assistant")}
        >
          AI Assistant
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/dashboard")}
        >
          Go to Team Tasks
        </button>
        <button className="btn btn-danger" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default TopBar;
