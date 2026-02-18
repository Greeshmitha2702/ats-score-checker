import React, { useState } from 'react';
import './App.css';
import Login from './Login';
import UploadSections from "./UploadSection";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="App">
          
          {!isLoggedIn ? (
            <Login onLogin={handleLogin} />
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
