import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ClinicPage.css';

const API_BASE_URL = 'http://localhost:5000/api';

const StudentIDModal = ({ isOpen, onClose, onSubmit }) => {
  const [studentId, setStudentId] = useState('');

  const handleStudentIdChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    
    // Automatically add hyphen after first 4 digits
    if (value.length > 4) {
      value = `${value.slice(0, 4)}-${value.slice(4)}`;
    }
    
    // Limit total length to 10 characters (4 digits + hyphen + 5 digits)
    setStudentId(value.slice(0, 10));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (studentId.trim() && studentId.length === 10) {
      onSubmit(studentId);
    } else {
      alert('Please enter a valid Student ID (YYYY-NNNNN format)');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="clinic-modal-overlay">
      <div className="clinic-modal-content">
        <h2>Enter Student ID</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="studentId">Student ID</label>
            <input
              type="text"
              id="studentId"
              value={studentId}
              onChange={handleStudentIdChange}
              placeholder="Enter Student ID (e.g., 2024-11005)"
              maxLength="10"
              required
            />
            <small className="input-hint">Format: YYYY-NNNNN</small>
          </div>
          <div className="modal-buttons">
            <button type="submit" className="submit-button">Submit</button>
            <button type="button" onClick={onClose} className="close-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StudentNotFoundModal = ({ isOpen, onClose, studentId }) => {
  if (!isOpen) return null;

  return (
    <div className="clinic-modal-overlay">
      <div className="clinic-modal-content student-not-found-modal">
        <div className="modal-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <h2>Student Not Found</h2>
        <p>No student record found for ID: <strong>{studentId}</strong></p>
        <p>Please check the Student ID and try again.</p>
        <div className="modal-buttons">
          <button onClick={onClose} className="close-button">Close</button>
        </div>
      </div>
    </div>
  );
};

const ClinicPage = () => {
  const navigate = useNavigate();
  const [showStudentIdModal, setShowStudentIdModal] = useState(true);
  const [showStudentNotFoundModal, setShowStudentNotFoundModal] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStudentIdSubmit = async (studentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/students/${studentId}`);
      if (response.data) {
        setStudentData(response.data);
        setShowStudentIdModal(false);
        setCurrentStudentId(studentId);
      } else {
        setShowStudentNotFoundModal(true);
        setShowStudentIdModal(false);
        setCurrentStudentId(studentId);
      }
    } catch (err) {
      console.error('Error fetching student:', err);
      setError(err.message);
      setShowStudentNotFoundModal(true);
      setShowStudentIdModal(false);
      setCurrentStudentId(studentId);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseStudentNotFound = () => {
    setShowStudentNotFoundModal(false);
    setShowStudentIdModal(true);
  };

  const handleNewSearch = () => {
    setStudentData(null);
    setShowStudentIdModal(true);
    setCurrentStudentId('');
    setError(null);
  };

  const StudentMedicalInfo = () => {
    if (!studentData) return null;

    return (
      <div className="medical-info-container">
        <div className="header-section">
          <h2>Student Medical Information</h2>
          <div className="header-buttons">
            <button onClick={handleNewSearch} className="new-search-btn">
              <i className="fas fa-search"></i> New Search
            </button>
            <button onClick={() => navigate('/')} className="back-btn">
              <i className="fas fa-arrow-left"></i> Back
            </button>
          </div>
        </div>

        <div className="medical-content">
          <div className="patient-banner">
            <div className="patient-info">
              <h3>{`${studentData.first_name} ${studentData.middle_name || ''} ${studentData.last_name}`}</h3>
              <div className="patient-details">
                <span><i className="fas fa-id-card"></i> {studentData.id}</span>
                <span><i className="fas fa-graduation-cap"></i> Grade {studentData.grade}</span>
                <span><i className="fas fa-birthday-cake"></i> {studentData.age} years old</span>
              </div>
            </div>
          </div>

          <div className="vital-signs-grid">
            <div className="vital-card height">
              <div className="vital-icon">
                <i className="fas fa-ruler-vertical"></i>
              </div>
              <div className="vital-data">
                <span className="vital-value">{studentData.height || 'N/A'}</span>
                <span className="vital-label">Height</span>
              </div>
            </div>

            <div className="vital-card weight">
              <div className="vital-icon">
                <i className="fas fa-weight"></i>
              </div>
              <div className="vital-data">
                <span className="vital-value">{studentData.weight || 'N/A'}</span>
                <span className="vital-label">Weight</span>
              </div>
            </div>

            <div className="vital-card bmi">
              <div className="vital-icon">
                <i className="fas fa-calculator"></i>
              </div>
              <div className="vital-data">
                <span className="vital-value">
                  {studentData.height && studentData.weight 
                    ? (studentData.weight / ((studentData.height / 100) ** 2)).toFixed(1)
                    : 'N/A'}
                </span>
                <span className="vital-label">BMI</span>
              </div>
            </div>
          </div>

          <div className="medical-sections">
            <div className="medical-section">
              <div className="section-header">
                <i className="fas fa-exclamation-circle"></i>
                <h4>Allergies</h4>
              </div>
              <div className="section-content">
                {studentData.allergies ? (
                  <ul className="condition-list">
                    {studentData.allergies.split(',').map((allergy, index) => (
                      <li key={index}>{allergy.trim()}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-data">No known allergies</p>
                )}
              </div>
            </div>

            <div className="medical-section">
              <div className="section-header">
                <i className="fas fa-notes-medical"></i>
                <h4>Medical Conditions</h4>
              </div>
              <div className="section-content">
                {studentData.special_medical_conditions ? (
                  <ul className="condition-list">
                    {studentData.special_medical_conditions.split(',').map((condition, index) => (
                      <li key={index}>{condition.trim()}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-data">No medical conditions recorded</p>
                )}
              </div>
            </div>

            <div className="medical-section">
              <div className="section-header">
                <i className="fas fa-pills"></i>
                <h4>Current Medications</h4>
              </div>
              <div className="section-content">
                {studentData.present_medications ? (
                  <ul className="medication-list">
                    {studentData.present_medications.split(',').map((medication, index) => (
                      <li key={index}>{medication.trim()}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-data">No current medications</p>
                )}
              </div>
            </div>
          </div>

          <div className="emergency-section">
            <div className="section-header">
              <i className="fas fa-phone-alt"></i>
              <h4>Emergency Contact Information</h4>
            </div>
            <div className="emergency-grid">
              <div className="emergency-item">
                <label>Contact Person</label>
                <span>{studentData.emergency_contact_name || 'Not specified'}</span>
              </div>
              <div className="emergency-item">
                <label>Relationship</label>
                <span>{studentData.emergency_contact_relationship || 'Not specified'}</span>
              </div>
              <div className="emergency-item">
                <label>Phone Number</label>
                <span>{studentData.emergency_contact_phone || 'Not specified'}</span>
              </div>
              <div className="emergency-item">
                <label>Address</label>
                <span>{studentData.emergency_contact_address || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="clinic-page">
      <StudentIDModal 
        isOpen={showStudentIdModal}
        onClose={() => navigate('/')}
        onSubmit={handleStudentIdSubmit}
      />
      <StudentNotFoundModal 
        isOpen={showStudentNotFoundModal}
        onClose={handleCloseStudentNotFound}
        studentId={currentStudentId}
      />
      {!showStudentIdModal && !showStudentNotFoundModal && <StudentMedicalInfo />}
    </div>
  );
};

export default ClinicPage;
