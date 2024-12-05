import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose, department }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder login logic
    console.log(`Attempting to login to ${department}`);
    
    // Navigate based on department
    switch(department) {
      case 'Clinic':
        navigate('/clinic');
        break;
      case 'Registrar':
        navigate('/registrar');
        break;
      default:
        alert('Login functionality for this department to be implemented');
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Login to {department}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <div className="modal-buttons">
            <button type="submit" className="login-button">Login</button>
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
