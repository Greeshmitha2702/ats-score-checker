import React, { useState } from 'react';
import './App.css';
import Signup from './Signup';
import Login from './Login';
import UploadSections from "./UploadSection";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  const handleSignupSuccess = () => {
    setShowSignup(false);
  };

  const handleShowSignup = () => {
    setShowSignup(true);
  };

  const handleBackToLogin = () => {
    setShowSignup(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="App">
          {!isLoggedIn ? (
            showSignup ? (
              <Signup onSignupSuccess={handleSignupSuccess} onBackToLogin={handleBackToLogin} />
            ) : (
              <>
                <Login onLogin={handleLogin} />
                <button onClick={handleShowSignup} style={{ marginTop: "10px" }}>
                  Sign Up
                </button>
              </>
            )
          ) : (
            <div>
              <h2>Welcome, {username}!</h2>
              <UploadSections />
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
export default App;
