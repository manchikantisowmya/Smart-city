// Signup.js
import React, { useState } from 'react';
import '../css/sign-up.css';
import { signupUser } from '../api/signup/signup.js';

function Signup({ onSignupSuccess, onLoginClick }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();      
    if (validateForm()) {
      try {
        const userData = await signupUser({ firstName, lastName, email, password });
        onSignupSuccess(userData);
      } catch (error) {
        console.log('Error signing up:', error);
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="input-group">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="input-group">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
      <p className="login-link" onClick={onLoginClick}>Already have an account? Login</p>
    </div>
  );
}

export default Signup;
