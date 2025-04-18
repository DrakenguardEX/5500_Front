import { useState } from "react";
import "./AIAssistant.css";


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
    <div className="ai-page">
      <div className="ai-content">
        <h2 className="ai-header">
          AI Assistant <span className="ai-sub">powered by ChatGPT 3.5Turbo</span>
        </h2>

        <button className="ai-primary-btn" onClick={handleGeneratePlan}>
          Generate Task Plan
        </button>

        <div className="ai-input-row">
          <input
            className="ai-input"
            placeholder="Enter Task Name"
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
          />
          <button className="ai-secondary-btn" onClick={handleGetGuidance}>
            Get Task Guidance
          </button>
        </div>

        <div className="ai-chat-box">
          {messages.map((msg, idx) => (
            <div key={idx} className="ai-message">
              <strong>
                {msg.type === "plan" ? "Task Plan" : "Task Guidance"}:
              </strong>
              <div>{msg.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;





