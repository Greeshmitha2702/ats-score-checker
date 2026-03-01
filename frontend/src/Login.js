import React, { useState } from "react";

function Login({ onLogin }) {
  // State for username and password fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
  e.preventDefault();
  const response = await fetch("http://localhost:8000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const result = await response.json();
  if (result.success) {
    onLogin(username);
  } else {
    alert(result.message);
  }
};

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;