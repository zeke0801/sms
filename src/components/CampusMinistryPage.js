import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CampusMinistryPage.css';

const CampusMinistryPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('activities');

  const renderContent = () => {
    switch(activeSection) {
      case 'activities':
        return (
          <div className="ministry-section">
            <h2>Upcoming Activities</h2>
            <div className="activities-grid">
              <div className="activity-card">
                <i className="fas fa-cross"></i>
                <h3>Weekly Mass</h3>
                <p>Every Friday, 2:00 PM</p>
              </div>
              <div className="activity-card">
                <i className="fas fa-praying-hands"></i>
                <h3>Prayer Meeting</h3>
                <p>Every Wednesday, 3:30 PM</p>
              </div>
              <div className="activity-card">
                <i className="fas fa-heart"></i>
                <h3>Community Service</h3>
                <p>Monthly Outreach Program</p>
              </div>
            </div>
          </div>
        );
      case 'retreats':
        return (
          <div className="ministry-section">
            <h2>Spiritual Retreats</h2>
            <div className="retreats-list">
              <div className="retreat-card">
                <h3>Annual Recollection</h3>
                <p>Date: January 15-16, 2024</p>
                <p>Location: School Retreat Center</p>
              </div>
              <div className="retreat-card">
                <h3>Grade Level Retreats</h3>
                <p>Scheduled per grade level</p>
              </div>
            </div>
          </div>
        );
      case 'resources':
        return (
          <div className="ministry-section">
            <h2>Spiritual Resources</h2>
            <div className="resources-grid">
              <div className="resource-card">
                <i className="fas fa-book"></i>
                <h3>Devotional Guides</h3>
              </div>
              <div className="resource-card">
                <i className="fas fa-video"></i>
                <h3>Online Reflections</h3>
              </div>
              <div className="resource-card">
                <i className="fas fa-podcast"></i>
                <h3>Spiritual Podcasts</h3>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="campus-ministry-page">
      <div className="ministry-header">
        <button onClick={() => navigate('/')} className="back-button">
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </button>
        <h1>Campus Ministry</h1>
      </div>
      
      <div className="ministry-navigation">
        <button 
          className={activeSection === 'activities' ? 'active' : ''}
          onClick={() => setActiveSection('activities')}
        >
          <i className="fas fa-calendar-alt"></i> Activities
        </button>
        <button 
          className={activeSection === 'retreats' ? 'active' : ''}
          onClick={() => setActiveSection('retreats')}
        >
          <i className="fas fa-mountain"></i> Retreats
        </button>
        <button 
          className={activeSection === 'resources' ? 'active' : ''}
          onClick={() => setActiveSection('resources')}
        >
          <i className="fas fa-book-open"></i> Resources
        </button>
      </div>

      <div className="ministry-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default CampusMinistryPage;
