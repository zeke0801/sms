import React from 'react';
import { useNavigate } from 'react-router-dom';
import softCoffeeIcon from '../icons/softcoffee.png';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="landing-page">
      <div className="ripple-background">
        <div className="circle xxlarge shade1"></div>
        <div className="circle xlarge shade2"></div>
        <div className="circle large shade3"></div>
        <div className="circle medium shade4"></div>
        <div className="circle small shade5"></div>
      </div>

      <div className="container">
        <div className="left-side">
          <div className="pillars-image"></div>
        </div>
        <div className="right-side">
          <div className="login-container">
            <h2>ARISE</h2>
            <h4>Ateneo Repository for <br/>Integrated Student Engagement</h4>
            <div className="form-group">
              <div className="button-group">
                <button className="dashboard-btn" onClick={handleDashboardClick}>
                  To Dashboard
                </button>
              </div>
              <div className="social-icons">
                <a href="#" className="social-icon">
                  <i className="fas fa-globe"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-tiktok"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <span>Made by SoftCoffee</span>
          <img src={softCoffeeIcon} alt="SoftCoffee" className="footer-icon" />
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
