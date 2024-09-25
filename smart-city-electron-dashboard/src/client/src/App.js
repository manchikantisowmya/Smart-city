import React, { useState } from 'react';
import Login from './components/Login'; 
import Signup from './components/SignUp';
import Navigation from './components/Navbar'; 
import './css/app.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [userData, setUserData] = useState(null);
  const [resetLoginForm, setResetLoginForm] = useState(false);

  // Function to handle successful login
  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUserData(userData);
    setResetLoginForm(false);
  };
  const handleSignupSuccess = (userData) => {
    setIsLoggedIn(true);
    setUserData(userData); // Set user data after successful signup
    setResetLoginForm(false);
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
    setResetLoginForm(true);
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
          <Login onLoginSuccess={handleLoginSuccess} onSignupClick={handleSignupClick} resetLoginForm={resetLoginForm}/>
        )
      ) : (
        <Navigation userData={userData} onLogout={handleLogout}/>
      )}
    </div>
  );
}

export default App;
