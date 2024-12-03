import React, { useState } from 'react';
import LoginModal from './LoginModal';
import './Dashboard.css';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const handleLogout = () => {
    // Placeholder logout function
    alert('Logout functionality to be implemented');
  };

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const departments = [
    'Clinic',
    'Student Affairs',
    'OPS',
    'Registrar',
    'Campus Ministry',
    'Triumph',
    'Library',
    'ANSGO'
  ];

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="header-logo">
          <div className="placeholder-logo">SMS</div>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <div className="dashboard-container">
        {departments.map((dept, index) => (
          <div 
            key={index} 
            className="dashboard-box"
            onClick={() => handleDepartmentClick(dept)}
          >
            {dept}
          </div>
        ))}
      </div>
      <footer className="dashboard-footer">
        <div className="footer-content">SMS</div>
      </footer>

      <LoginModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        department={selectedDepartment}
      />
    </div>
  );
};

export default Dashboard;
