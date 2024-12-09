import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StudentAffairs.css';

const API_BASE_URL = 'http://localhost:5000/api';

const formatDate = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${month}-${day}-${year} ${hours}:${minutes}`;
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${mm}${dd}${yyyy} ${hours}:${minutes}`;
};

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
    <div className="student-affairs-modal-overlay">
      <div className="student-affairs-modal-content">
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
    <div className="student-affairs-modal-overlay">
      <div className="student-affairs-modal-content student-not-found-modal">
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

const InitialChoiceModal = ({ isOpen, onSearchStudent, onReturnToDashboard }) => {
  if (!isOpen) return null;

  return (
    <div className="student-affairs-modal-overlay">
      <div className="student-affairs-modal-content initial-choice-modal">
        <div className="modal-buttons-container">
          <button onClick={onSearchStudent} className="choice-button search-button">
            <i className="fas fa-search"></i>
            Search Student
            <span className="button-description">Look up an existing student record</span>
          </button>
          <button onClick={onReturnToDashboard} className="choice-button dashboard-button">
            <i className="fas fa-home"></i>
            Return to Dashboard
            <span className="button-description">Go back to main dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const EditableField = ({ field, title, icon, items = [], onAdd, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newItem, setNewItem] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      onAdd(field, { text: newItem.trim(), timestamp: new Date().toISOString() });
      setNewItem('');
      setIsEditing(false);
    }
  };

  return (
    <div className="student-affairs-section">
      <div className="section-header">
        <i className={`fas ${icon}`}></i>
        <h4>{title}</h4>
        <button 
          className="edit-button"
          onClick={() => setIsEditing(!isEditing)}
        >
          <i className={`fas ${isEditing ? 'fa-check' : 'fa-edit'}`}></i>
        </button>
      </div>
      <div className="section-content">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder={`Add new ${title.toLowerCase()}`}
              />
              <button type="submit">
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </form>
        ) : (
          <ul className="items-list">
            {items.length > 0 ? (
              items.map((item, index) => (
                <li key={index}>
                  <span className="item-text">{item.text}</span>
                  <span className="item-timestamp">{formatDate(item.timestamp)}</span>
                  <button 
                    className="delete-button"
                    onClick={() => onRemove(field, index)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </li>
              ))
            ) : (
              <p className="no-data">No {title.toLowerCase()} recorded</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

const NotesSection = ({ notes, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentNotes, setCurrentNotes] = useState(notes || []);
  const [newNote, setNewNote] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newNoteItem = {
      text: e.target.notes.value.trim(),
      timestamp: new Date().toISOString()
    };
    if (newNoteItem.text) {
      const updatedNotes = [...currentNotes, newNoteItem];
      onSave(updatedNotes);
      setIsEditing(false);
    }
  };

  const handleDelete = (index) => {
    const updatedNotes = currentNotes.filter((_, i) => i !== index);
    setCurrentNotes(updatedNotes);
    onSave(updatedNotes);
  };
};

const VisitHistorySection = ({ visits = [], onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentVisits, setCurrentVisits] = useState([]);
  const [newVisit, setNewVisit] = useState({
    timeIn: new Date().toISOString().slice(0, 16),
    timeOut: '',
    problem: '',
    medicineIssued: '',
    certificate: null,
    certificateName: ''
  });

  useEffect(() => {
    setCurrentVisits(Array.isArray(visits) ? visits : []);
  }, [visits]);

  const handleInputChange = (field, value) => {
    setNewVisit(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should not exceed 5MB');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setNewVisit(prev => ({
          ...prev,
          certificate: event.target.result,
          certificateName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = (certificateData) => {
    const link = document.createElement('a');
    link.href = certificateData;
    link.download = 'medical_certificate';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newVisit.timeIn && newVisit.problem) {
      const updatedVisits = [...currentVisits, {
        ...newVisit,
        timeIn: new Date(newVisit.timeIn).toISOString(),
        timeOut: newVisit.timeOut ? new Date(newVisit.timeOut).toISOString() : ''
      }];
      onSave(updatedVisits);
      setNewVisit({
        timeIn: new Date().toISOString().slice(0, 16),
        timeOut: '',
        problem: '',
        medicineIssued: '',
        certificate: null,
        certificateName: ''
      });
      setIsEditing(false);
    }
  };

  const handleDelete = (index) => {
    const updatedVisits = currentVisits.filter((_, i) => i !== index);
    setCurrentVisits(updatedVisits);
    onSave(updatedVisits);
  };
};

const VaccinationSection = ({ vaccinations = [], onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentVaccinations, setCurrentVaccinations] = useState([]);

  useEffect(() => {
    setCurrentVaccinations(Array.isArray(vaccinations) ? vaccinations : []);
  }, [vaccinations]);

  const [newVaccination, setNewVaccination] = useState({
    name: '',
    dateAcquired: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newVaccination.name && newVaccination.dateAcquired) {
      const updatedVaccinations = [...currentVaccinations, newVaccination];
      onSave(updatedVaccinations);
      setNewVaccination({
        name: '',
        dateAcquired: ''
      });
      setIsEditing(false);
    }
  };

  const handleInputChange = (field, value) => {
    setNewVaccination(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDelete = (index) => {
    const updatedVaccinations = currentVaccinations.filter((_, i) => i !== index);
    setCurrentVaccinations(updatedVaccinations);
    onSave(updatedVaccinations);
  };

  return (
    <div className="student-affairs-section vaccination-section">
      <div className="section-header">
        <i className="fas fa-syringe"></i>
        <h4>Vaccination History</h4>
        <button 
          className="edit-button"
          onClick={() => setIsEditing(!isEditing)}
        >
          <i className={`fas ${isEditing ? 'fa-check' : 'fa-edit'}`}></i>
        </button>
      </div>
      <div className="section-content">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="vaccination-form">
            <div className="vaccination-form-grid">
              <div className="form-group">
                <label>Vaccination Name</label>
                <input
                  type="text"
                  value={newVaccination.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter vaccination name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Date Acquired</label>
                <input
                  type="date"
                  value={newVaccination.dateAcquired}
                  onChange={(e) => handleInputChange('dateAcquired', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-button">
                <i className="fas fa-save"></i> Save Vaccination
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setIsEditing(false)}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="vaccination-history">
            {currentVaccinations.length > 0 ? (
              <div className="vaccination-table-container">
                <table className="vaccination-table">
                  <thead>
                    <tr>
                      <th>Vaccination Name</th>
                      <th>Date Acquired</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentVaccinations.map((vaccination, index) => (
                      <tr key={index}>
                        <td>{vaccination.name}</td>
                        <td>{formatDate(vaccination.dateAcquired)}</td>
                        <td className="action-column">
                          <button 
                            className="delete-button"
                            onClick={() => handleDelete(index)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No vaccination history recorded</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const DentalHistorySection = ({ dentalHistory = [], onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentDentalHistory, setCurrentDentalHistory] = useState([]);
  const [newDentalRecord, setNewDentalRecord] = useState({
    visitDateTime: new Date().toISOString().slice(0, 16),
    dentalDoctor: '',
    previousIssues: '',
    orthodonticTreatment: '',
    existingConditions: ''
  });

  useEffect(() => {
    setCurrentDentalHistory(Array.isArray(dentalHistory) ? dentalHistory : []);
  }, [dentalHistory]);

  const handleInputChange = (field, value) => {
    setNewDentalRecord(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newDentalRecord.visitDateTime && newDentalRecord.dentalDoctor) {
      const updatedHistory = [...currentDentalHistory, {
        ...newDentalRecord,
        visitDateTime: new Date(newDentalRecord.visitDateTime).toISOString()
      }];
      onSave(updatedHistory);
      setNewDentalRecord({
        visitDateTime: new Date().toISOString().slice(0, 16),
        dentalDoctor: '',
        previousIssues: '',
        orthodonticTreatment: '',
        existingConditions: ''
      });
      setIsEditing(false);
    }
  };

  const handleDelete = (index) => {
    const updatedHistory = currentDentalHistory.filter((_, i) => i !== index);
    setCurrentDentalHistory(updatedHistory);
    onSave(updatedHistory);
  };
};

const StudentAffairs = () => {
  const navigate = useNavigate();
  const [showInitialModal, setShowInitialModal] = useState(true);
  const [showStudentIdModal, setShowStudentIdModal] = useState(false);
  const [showStudentNotFoundModal, setShowStudentNotFoundModal] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState('');
  const [studentData, setStudentData] = useState({
    id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    grade: '',
    age: '',
    allergies: [],
    special_medical_conditions: [],
    present_medications: [],
    vaccinations: [],
    visits: [],
    dentalHistory: [],
    notes: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingHeight, setEditingHeight] = useState(false);
  const [editingWeight, setEditingWeight] = useState(false);
  const [editedHeight, setEditedHeight] = useState('');
  const [editedWeight, setEditedWeight] = useState('');

  const loadMedicalData = (studentId) => {
    const storedData = localStorage.getItem(`medical_data_${studentId}`);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setStudentData(prevData => ({
          ...prevData,
          allergies: Array.isArray(parsedData.allergies) ? parsedData.allergies : [],
          special_medical_conditions: Array.isArray(parsedData.special_medical_conditions) ? parsedData.special_medical_conditions : [],
          present_medications: Array.isArray(parsedData.present_medications) ? parsedData.present_medications : [],
          vaccinations: Array.isArray(parsedData.vaccinations) ? parsedData.vaccinations : [],
          notes: Array.isArray(parsedData.notes) ? parsedData.notes : [],
          visits: Array.isArray(parsedData.visits) ? parsedData.visits : []
        }));
      } catch (error) {
        console.error('Error parsing medical data:', error);
        setStudentData(prevData => ({
          ...prevData,
          allergies: [],
          special_medical_conditions: [],
          present_medications: [],
          vaccinations: [],
          notes: [],
          visits: []
        }));
      }
    }
  };

  useEffect(() => {
    if (studentData.id) {
      loadMedicalData(studentData.id);
    }
  }, [studentData.id]);

  const saveMedicalData = (updatedData) => {
    const dataToSave = {
      allergies: updatedData.allergies,
      special_medical_conditions: updatedData.special_medical_conditions,
      present_medications: updatedData.present_medications,
      vaccinations: updatedData.vaccinations,
      notes: updatedData.notes,
      visits: updatedData.visits
    };
    localStorage.setItem(`medical_data_${updatedData.id}`, JSON.stringify(dataToSave));
  };

  const handleAddItem = (field, value) => {
    const updatedData = { ...studentData };
    const currentItems = updatedData[field] ? updatedData[field] : [];
    const newItem = {
      text: value,
      timestamp: new Date().toISOString()
    };
    
    if (Array.isArray(currentItems)) {
      currentItems.push(newItem);
    } else {
      updatedData[field] = [newItem];
    }
    
    setStudentData(updatedData);
    saveMedicalData(updatedData);
  };

  const handleRemoveItem = (field, indexToRemove) => {
    const updatedData = { ...studentData };
    const currentItems = updatedData[field] || [];
    updatedData[field] = currentItems.filter((_, index) => index !== indexToRemove);
    
    setStudentData(updatedData);
    saveMedicalData(updatedData);
  };

  const handleSaveNotes = (notes) => {
    const updatedData = { ...studentData, notes };
    setStudentData(updatedData);
    saveMedicalData(updatedData);
  };

  const handleSaveVisits = (visits) => {
    const updatedData = { ...studentData, visits };
    setStudentData(updatedData);
    saveMedicalData(updatedData);
  };

  const handleSaveVaccinations = (vaccinations) => {
    const updatedData = { ...studentData, vaccinations };
    setStudentData(updatedData);
    saveMedicalData(updatedData);
  };

  const handleSaveDentalHistory = (dentalHistory) => {
    const updatedData = { ...studentData, dentalHistory };
    setStudentData(updatedData);
    saveMedicalData(updatedData);
  };

  const handleSearchStudent = () => {
    setShowInitialModal(false);
    setShowStudentIdModal(true);
  };

  const handleReturnToDashboard = () => {
    navigate('/');
  };

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
    setStudentData({
      id: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      grade: '',
      age: '',
      allergies: [],
      special_medical_conditions: [],
      present_medications: [],
      vaccinations: [],
      visits: [],
      dentalHistory: [],
      notes: []
    });
    setShowStudentIdModal(true);
    setCurrentStudentId('');
    setError(null);
  };

  const StudentMedicalInfo = () => {
    if (!studentData) return null;

    const getItems = (field) => {
      return studentData[field] && Array.isArray(studentData[field]) ? studentData[field] : [];
    };

    return (
      <div className="student-affairs-info-container">
        <div className="header-section">
          <h2>Student Awards and Involvement</h2>
          <div className="header-buttons">
            <button onClick={handleNewSearch} className="new-search-btn">
              <i className="fas fa-search"></i> New Search
            </button>
            <button onClick={() => navigate('/')} className="back-btn">
              <i className="fas fa-arrow-left"></i> Logout
            </button>
          </div>
        </div>

        <div className="student-affairs-content">
          <div className="patient-banner">
            <div className="profile-section">
              <div className="profile-picture">
                <div className="placeholder-image">Image Here</div>
              </div>
              <div className="patient-info">
                <h3>{`${studentData.first_name} ${studentData.middle_name || ''} ${studentData.last_name}`}</h3>
                <div className="patient-details">
                  <span><i className="fas fa-id-card"></i> {studentData.id}</span>
                  <span><i className="fas fa-graduation-cap"></i> Grade {studentData.grade}</span>
                  <span><i className="fas fa-birthday-cake"></i> {studentData.age} years old</span>
                </div>
              </div>
            </div>
          </div>

          <div className="student-affairs-sections">

            <VaccinationSection
              vaccinations={studentData.vaccinations || []}
              onSave={handleSaveVaccinations}
            />
            <VisitHistorySection
              visits={studentData.visits || []}
              onSave={handleSaveVisits}
            />
            <DentalHistorySection
              dentalHistory={studentData.dentalHistory || []}
              onSave={handleSaveDentalHistory}
            />
            <NotesSection
              notes={studentData.notes}
              onSave={handleSaveNotes}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="student-affairs-page">
      <InitialChoiceModal
        isOpen={showInitialModal}
        onSearchStudent={handleSearchStudent}
        onReturnToDashboard={handleReturnToDashboard}
      />
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
      {!showInitialModal && !showStudentIdModal && !showStudentNotFoundModal && <StudentMedicalInfo />}
    </div>
  );
};

export default StudentAffairs;
