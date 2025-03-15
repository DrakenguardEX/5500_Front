import { useState } from "react";
import { useNavigate } from "react-router-dom";  // for page navigation

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();  // react-router-dom hook

  const handleRegister = async () => {
    if (!username || !password) {
      setMessage("Username and password are required.");
      return;
    }

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! You can now login.");
        setMessage("");
        setUsername("");
        setPassword("");
        navigate("/");  // After successful registration, go to Login
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setMessage("Network error, please try again later.");
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: "0 auto", padding: 20 }}>
      <h2>Register</h2>
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
      <button onClick={handleRegister} style={{ width: "100%", marginBottom: 10 }}>Register</button>
      {message && <p style={{ color: "red", marginTop: 10 }}>{message}</p>}
      
      {/* Back to Login button */}
      <button
        onClick={() => navigate("/")}
        style={{ width: "100%", marginTop: 10 }}
      >
        Back to Login
      </button>
    </div>
  );
}

export default Register;
