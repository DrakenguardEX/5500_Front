import { useState } from "react";
import "./AIAssistant.css";

function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [taskId, setTaskId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userId = localStorage.getItem("userId");

  const baseURL = import.meta.env.DEV ? "" : import.meta.env.VITE_BACKEND_URL;

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    try {
      
      const response = await fetch(`${baseURL}/api/ai/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await response.json();
      setMessages([{ sender: "assistant", type: "plan", text: data.plan }]);
    } catch (err) {
      alert("Error fetching task plan");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetGuidance = async () => {
    if (!taskId.trim()) return alert("Please enter a task name.");
    setIsLoading(true);
    try {
      const response = await fetch(`${baseURL}/api/ai/guidance/${taskId}`);
      const data = await response.json();
      setMessages([
        { sender: "assistant", type: "guidance", text: data.guidance },
      ]);
    } catch (err) {
      alert("Error fetching guidance");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-page">
      <div className="ai-content">
        <h2 className="ai-header">
          AI Assistant{" "}
          <span className="ai-sub">powered by ChatGPT 3.5Turbo</span>
        </h2>

        <div className="ai-btn-row">
          <button
            className="ai-primary-btn"
            onClick={handleGeneratePlan}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Task Plan"}
          </button>
          <button
            className="ai-clear-btn"
            onClick={() => setMessages([])}
            disabled={isLoading}
          >
            Clear
          </button>
        </div>

        <div className="ai-input-row">
          <input
            className="ai-input"
            placeholder="Enter Task Name"
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
          />
          <button
            className="ai-secondary-btn"
            onClick={handleGetGuidance}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Get Task Guidance"}
          </button>
        </div>

        <div className="ai-chat-box">
          {isLoading && <div className="ai-loading">⏳ Thinking...</div>}
          {!isLoading && messages.length > 0 && (
            <div className="ai-message">
              <strong className="ai-message-title">
                {messages[0].type === "plan"
                  ? "📝 Task Plan"
                  : "💡 Task Guidance"}
                :
              </strong>
              <pre className="ai-message-content">{messages[0].text}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;
