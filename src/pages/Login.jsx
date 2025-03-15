import { useState } from "react";
import { useNavigate } from "react-router-dom";  // for navigation

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();  // router hook for navigation

  // Handle login button click
  const handleLogin = async () => {
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login success:", data);
        localStorage.setItem("token", data.token);  // Save token
        alert("Login successful!");
        setError("");
        // Navigate to dashboard or home
        navigate("/dashboard");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error, please try again later.");
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: "0 auto", padding: 20 }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <button onClick={handleLogin} style={{ width: "100%", marginBottom: 10 }}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        onClick={() => navigate("/register")}  // ➡️ Go to Register page
        style={{ width: "100%", marginTop: 10 }}
      >
        Register
      </button>
    </div>
  );
}

export default Login;
