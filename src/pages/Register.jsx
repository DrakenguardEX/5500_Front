import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // Import CSS file

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) {
      setMessage("Username and password are required.");
      return;
    }

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! You can now login.");
        setMessage("");
        setUsername("");
        setPassword("");
        navigate("/"); // Navigate to Login page
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setMessage("Network error, please try again later.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        {message && <p className="error-message">{message}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <button onClick={handleRegister} className="register-btn">
          Register
        </button>
        <p className="login-text">
          Already have an account?{" "}
          <span className="login-link" onClick={() => navigate("/")}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
