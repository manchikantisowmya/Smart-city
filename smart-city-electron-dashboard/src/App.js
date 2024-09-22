import React, { useState } from 'react';
import Login from './components/Login'; 
import Signup from './components/SignUp';
import Navigation from './components/Navbar'; 
import './css/app.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [userData, setUserData] = useState(null);

  // Function to handle successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setUserData(userData);
  };
  const handleSignupSuccess = (userData) => {
    setIsLoggedIn(true);
    setUserData(userData); // Set user data after successful signup
  };
  const handleLoginClick = () => {
    setIsSigningUp(false);
  };
  const handleSignupClick = () => {
    setIsSigningUp(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
  };

  // Determine the class to apply based on login/signup state
  const backgroundClass = !isLoggedIn ? 'auth-background' : 'app-background';

  return (
    <div className={`App ${backgroundClass}`}>
      {/* Conditionally render Login or Navigation based on isLoggedIn state */}
      {!isLoggedIn ? (
        isSigningUp ? (
          <Signup onSignupSuccess={handleSignupSuccess} onLoginClick={handleLoginClick} />
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} onSignupClick={handleSignupClick} />
        )
      ) : (
        <Navigation userData={userData} onLogout={handleLogout}/>
      )}
    </div>
  );
}

export default App;
