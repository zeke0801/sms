import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';
import './Dashboard.css';
import AteneoDeLogo from '../icons/Ateneo_de_Naga_University_logo.png';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    // Placeholder logout function
    alert('Logout functionality to be implemented');
  };

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const departments = [
    'Registrar',
    'Clinic',
    'Student Affairs',
    'Guidance',
    'Campus Ministry',

  ];

  const dashboardButtons = [
    {
      label: 'Registrar',
      icon: 'fa-user-graduate',
      onClick: () => handleDepartmentClick('Registrar')
    },
    {
      label: 'Clinic',
      icon: 'fa-heartbeat',
      onClick: () => handleDepartmentClick('Clinic')
    },
    {
      label: 'Student Affairs',
      icon: 'fa-hands-helping',
      onClick: () => handleDepartmentClick('Student Affairs')
    },
    {
      label: 'Guidance',
      icon: 'fa-user-shield',
      onClick: () => handleDepartmentClick('Guidance')
    },
    {
      label: 'Campus Ministry',
      icon: 'fa-church',
      onClick: () => handleDepartmentClick('Campus Ministry')
    }
  ];

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="header-logo">
          <img src={AteneoDeLogo} alt="Ateneo de Naga Logo" className="logo-image" />
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Return
        </button>
      </header>
      <div className="main-content">
        <aside className="sidebar">
          <section className="sidebar-section">
            <h2>Announcements</h2>
            <div className="section-content">
              <p>No new announcements</p>
            </div>
          </section>
          <section className="sidebar-section">
            <h2>Guide Book</h2>
            <div className="section-content">
              <ul>
                <li>Student Manual</li>
                <li>Department Directory</li>
                <li>Campus Map</li>
              </ul>
            </div>
          </section>
          <section className="sidebar-section">
            <h2>Calendar</h2>
            <div className="section-content">
              <p>No upcoming events</p>
            </div>
          </section>
        </aside>
        <div className="dashboard-content">
          <div className="dashboard-grid">
            {dashboardButtons.map((button, index) => (
              <div 
                key={index} 
                className="dashboard-button" 
                onClick={button.onClick}
              >
                <div className="button-icon">
                  <i className={`fas ${button.icon}`}></i>
                </div>
                <span className="button-label">{button.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <footer className="dashboard-footer">
        <div className="footer-content">Experimental JHS Student Management System</div>
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
