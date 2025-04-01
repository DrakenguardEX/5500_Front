import { useState } from "react";
import "./AIAssistant.css";
import TopBar from "../components/TopBar";

function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [taskId, setTaskId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userId = localStorage.getItem("userId");

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", type: "plan", text: data.plan },
      ]);
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
      const response = await fetch(`/api/ai/guidance/${taskId}`);
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
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
    <div>
      <TopBar />
      <div className="dashboard-wrapper">
        <div className="dashboard-container centered">
          <h2 className="dashboard-header">🤖 AI Assistant</h2>

          <div className="controls">
            <button className="btn btn-primary" onClick={handleGeneratePlan}>
              Generate Task Plan
            </button>

            <div className="guidance-section">
              <input
                className="task-id-input input-field"
                placeholder="Enter Task Name"
                value={taskId}
                onChange={(e) => setTaskId(e.target.value)}
              />
              <button className="btn btn-secondary" onClick={handleGetGuidance}>
                Get Task Guidance
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="loading-spinner-container">
              <div className="loading-spinner"></div>
            </div>
          )}

          <div className="chat-box">
            {messages.map((msg, idx) => (
              <div key={idx} className="assistant-bubble">
                <strong>
                  {msg.type === "plan" ? "🗓️ Task Plan" : "🛠️ Task Guidance"}:
                </strong>
                <div>{msg.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;
