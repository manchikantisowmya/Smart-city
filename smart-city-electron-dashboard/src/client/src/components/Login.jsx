// Login.js
import React, { useState, useEffect } from 'react';
import '../css/login.css';
import { loginUser } from '../api/login/login.js';

function Login({ onLoginSuccess, onSignupClick, resetLoginForm }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(()=>{
    if(resetLoginForm){
      setUsername('');
      setPassword('');
      setError('');
    }
  }, [resetLoginForm]);

  const validateForm = () => {
    if (!username || !password) {
      setError('Username and password are required');
      return false;
    }
    return true;
  };

  // Function to handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
        try {
            const response = await loginUser(username, password);
            localStorage.setItem('userData', JSON.stringify(response));
            onLoginSuccess(response);
          } catch (error) {
            setError('Invalid credentials');
          }
      }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="input-group">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className='login-signup'>
            <button type="submit" className="login-button">Login</button>
            <p className="signup-link" onClick={onSignupClick}>Sign Up</p>
         </div>
      </form>
    </div>
  );
}

export default Login;
