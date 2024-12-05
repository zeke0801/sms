import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PrefectOfStudentsPage.css';

const PrefectOfStudentsPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('discipline');

  const disciplineData = [
    { 
      type: 'Minor Offense', 
      description: 'Uniform Violation', 
      count: 12,
      icon: 'fa-tshirt'
    },
    { 
      type: 'Moderate Offense', 
      description: 'Tardiness', 
      count: 8,
      icon: 'fa-clock'
    },
    { 
      type: 'Serious Offense', 
      description: 'Misconduct', 
      count: 3,
      icon: 'fa-exclamation-triangle'
    }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'discipline':
        return (
          <div className="prefect-section">
            <h2>Discipline Overview</h2>
            <div className="discipline-grid">
              {disciplineData.map((offense, index) => (
                <div key={index} className="offense-card">
                  <div className="offense-icon">
                    <i className={`fas ${offense.icon}`}></i>
                  </div>
                  <div className="offense-details">
                    <h3>{offense.type}</h3>
                    <p>{offense.description}</p>
                    <span className="offense-count">{offense.count} Cases</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'conduct':
        return (
          <div className="prefect-section">
            <h2>Student Conduct Tracking</h2>
            <div className="conduct-grid">
              <div className="conduct-card positive">
                <i className="fas fa-award"></i>
                <h3>Positive Conduct</h3>
                <p>Students with Exemplary Behavior</p>
                <span className="conduct-count">25</span>
              </div>
              <div className="conduct-card warning">
                <i className="fas fa-bell"></i>
                <h3>Warning Issued</h3>
                <p>Students Requiring Intervention</p>
                <span className="conduct-count">12</span>
              </div>
              <div className="conduct-card critical">
                <i className="fas fa-exclamation-circle"></i>
                <h3>Critical Cases</h3>
                <p>Serious Behavioral Concerns</p>
                <span className="conduct-count">3</span>
              </div>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="prefect-section">
            <h2>Disciplinary Reports</h2>
            <div className="reports-list">
              <div className="report-card">
                <div className="report-header">
                  <h3>Uniform Violation Report</h3>
                  <span className="report-date">2024-01-15</span>
                </div>
                <p>Multiple students found in non-compliant school uniforms</p>
                <div className="report-actions">
                  <button>View Details</button>
                  <button className="action-btn">Take Action</button>
                </div>
              </div>
              <div className="report-card">
                <div className="report-header">
                  <h3>Tardiness Tracking</h3>
                  <span className="report-date">2024-01-10</span>
                </div>
                <p>Increased instances of late arrivals in 10th Grade</p>
                <div className="report-actions">
                  <button>View Details</button>
                  <button className="action-btn">Take Action</button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="prefect-of-students-page">
      <div className="prefect-header">
        <button onClick={() => navigate('/')} className="back-button">
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </button>
        <h1>Office of Prefect of Students</h1>
      </div>
      
      <div className="prefect-navigation">
        <button 
          className={activeSection === 'discipline' ? 'active' : ''}
          onClick={() => setActiveSection('discipline')}
        >
          <i className="fas fa-balance-scale"></i> Discipline
        </button>
        <button 
          className={activeSection === 'conduct' ? 'active' : ''}
          onClick={() => setActiveSection('conduct')}
        >
          <i className="fas fa-user-check"></i> Conduct
        </button>
        <button 
          className={activeSection === 'reports' ? 'active' : ''}
          onClick={() => setActiveSection('reports')}
        >
          <i className="fas fa-file-alt"></i> Reports
        </button>
      </div>

      <div className="prefect-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default PrefectOfStudentsPage;
