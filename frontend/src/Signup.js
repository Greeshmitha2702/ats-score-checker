import React, { useState } from "react";

function Signup({ onSignupSuccess, onBackToLogin }) {
  // State for form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Simple validation: check passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    // Send signup request to backend
    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();
      if (result.success) {
        setSuccess("Signup successful! Please log in.");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        if (onSignupSuccess) onSignupSuccess();
      } else {
        setError(result.message || "Signup failed");
      }
    } catch (err) {
      setError("Error connecting to server");
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
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
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
      <button onClick={onBackToLogin} style={{ marginTop: "10px" }}>
        Back to Login
      </button>
    </div>
  );
}

export default Signup;