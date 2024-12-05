import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from './components/LoginModal';
import './Dashboard.css';
import AteneoDeLogo from './icons/Ateneo_de_Naga_University_logo.png';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    // Placeholder logout function
    alert('Logout functionality to be implemented');
  };

  const handleDepartmentClick = (department) => {
    if (department === 'Registrar') {
      navigate('/registrar');
    } else if (department === 'Clinic') {
      navigate('/clinic');
    } else if (department === 'Campus Ministry') {
      navigate('/campus-ministry');
    } else if (department === 'Prefect of Students') {
      navigate('/prefect-of-students');
    } else if (department === 'ANSGO') {
      navigate('/ansgo');
    } else if (department === 'Student Master List') {
      navigate('/registrar/master-list');
    } else {
      setSelectedDepartment(department);
      setIsModalOpen(true);
    }
  };

  const departments = [
    'Clinic',
    'Student Affairs',
    'OPS',
    'Registrar',
    'Campus Ministry',
    'Triumph',
    'Library',
    'ANSGO',
    'Prefect of Students',
    'ANSGO',
    'Student Master List'
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
      label: 'Campus Ministry',
      icon: 'fa-church',
      onClick: () => handleDepartmentClick('Campus Ministry')
    },
    {
      label: 'Prefect of Students',
      icon: 'fa-user-shield',
      onClick: () => handleDepartmentClick('Prefect of Students')
    },
    {
      label: 'Guidance',
      icon: 'fa-hands-helping',
      onClick: () => handleDepartmentClick('Guidance')
    },
    {
      label: 'Finance',
      icon: 'fa-money-bill-wave',
      onClick: () => handleDepartmentClick('Finance')
    },
    {
      label: 'ANSGO',
      icon: 'fa-globe',
      onClick: () => handleDepartmentClick('ANSGO')
    },
    {
      label: 'Student Master List',
      icon: 'fa-list-alt',
      onClick: () => handleDepartmentClick('Student Master List')
    }
  ];

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="header-logo">
          <img src={AteneoDeLogo} alt="Ateneo de Naga Logo" className="logo-image" />
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
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
