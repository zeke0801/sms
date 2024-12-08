import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Guidance.css';

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
    <div className="guidance-modal-overlay">
      <div className="guidance-modal-content">
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
    <div className="guidance-modal-overlay">
      <div className="guidance-modal-content student-not-found-modal">
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
    <div className="guidance-modal-overlay">
      <div className="guidance-modal-content initial-choice-modal">
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
    <div className="guidance-section">
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

  return (
    <div className="guidance-section notes-section">
      <div className="section-header">
        <i className="fas fa-clipboard-list"></i>
        <h4>Doctor's Notes</h4>
        <button 
          className="edit-button"
          onClick={() => setIsEditing(!isEditing)}
        >
          <i className={`fas ${isEditing ? 'fa-check' : 'fa-edit'}`}></i>
        </button>
      </div>
      <div className="section-content">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="notes-form">
            <textarea
              name="notes"
              placeholder="Enter medical observations, recommendations, or any other relevant notes..."
              className="notes-textarea"
              rows={6}
            />
            <div className="notes-actions">
              <button type="submit" className="save-clinibutton">
                <i className="fas fa-save"></i> Save Notes
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
          <div className="notes-display">
            {currentNotes.length > 0 ? (
              <div className="notes-list">
                {currentNotes.map((note, index) => (
                  <div key={index} className="note-item">
                    <div className="note-content">
                      <p>{note.text}</p>
                      <span className="timestamp">{formatTimestamp(note.timestamp)}</span>
                    </div>
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(index)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No notes recorded</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
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

  return (
    <div className="guidance-section visit-history-section">
      <div className="section-header">
        <i className="fas fa-history"></i>
        <h4>Visit History</h4>
        <button 
          className="edit-button"
          onClick={() => setIsEditing(!isEditing)}
        >
          <i className={`fas ${isEditing ? 'fa-check' : 'fa-edit'}`}></i>
        </button>
      </div>
      <div className="section-content">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="visit-form">
            <div className="visit-form-grid">
              <div className="form-group">
                <label>Time In</label>
                <input
                  type="datetime-local"
                  value={newVisit.timeIn}
                  onChange={(e) => handleInputChange('timeIn', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time Out</label>
                <input
                  type="datetime-local"
                  value={newVisit.timeOut}
                  onChange={(e) => handleInputChange('timeOut', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Problem/Complaint</label>
                <input
                  type="text"
                  value={newVisit.problem}
                  onChange={(e) => handleInputChange('problem', e.target.value)}
                  placeholder="Enter problem or complaint"
                  required
                />
              </div>
              <div className="form-group">
                <label>Medicine Issued</label>
                <input
                  type="text"
                  value={newVisit.medicineIssued}
                  onChange={(e) => handleInputChange('medicineIssued', e.target.value)}
                  placeholder="Enter medicine issued"
                />
              </div>
              <div className="form-group certificate-upload">
                <label>Medical Certificate</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="file-input"
                />
                {newVisit.certificateName && (
                  <span className="file-name">{newVisit.certificateName}</span>
                )}
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-button">
                <i className="fas fa-save"></i> Save Visit
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
          <div className="visit-history">
            {currentVisits.length > 0 ? (
              <div className="visit-table-container">
                <table className="visit-table">
                  <thead>
                    <tr>
                      <th>Time In</th>
                      <th>Time Out</th>
                      <th>Problem/Complaint</th>
                      <th>Medicine Issued</th>
                      <th>Certificate</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentVisits.map((visit, index) => (
                      <tr key={index}>
                        <td>{formatDate(visit.timeIn)}</td>
                        <td>{visit.timeOut ? formatDate(visit.timeOut) : 'Not recorded'}</td>
                        <td>{visit.problem}</td>
                        <td>{visit.medicineIssued || 'None'}</td>
                        <td>
                          {visit.certificate ? (
                            <button
                              className="download-button"
                              onClick={() => handleDownload(visit.certificate)}
                            >
                              <i className="fas fa-download"></i> Download
                            </button>
                          ) : (
                            <span className="no-file">No file</span>
                          )}
                        </td>
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
              <p className="no-data">No visits recorded</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
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
    <div className="guidance-section vaccination-section">
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

  return (
    <div className="guidance-section dental-history-section">
      <div className="section-header">
        <i className="fas fa-tooth"></i>
        <h4>Dental History</h4>
        <button 
          className="edit-button"
          onClick={() => setIsEditing(!isEditing)}
        >
          <i className={`fas ${isEditing ? 'fa-check' : 'fa-edit'}`}></i>
        </button>
      </div>
      <div className="section-content">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="dental-form">
            <div className="dental-form-grid">
              <div className="form-group">
                <label>Last Dental Visit</label>
                <input
                  type="datetime-local"
                  value={newDentalRecord.visitDateTime}
                  onChange={(e) => handleInputChange('visitDateTime', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Dental Doctor</label>
                <input
                  type="text"
                  value={newDentalRecord.dentalDoctor}
                  onChange={(e) => handleInputChange('dentalDoctor', e.target.value)}
                  placeholder="Enter doctor's name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Previous Dental Issues</label>
                <textarea
                  value={newDentalRecord.previousIssues}
                  onChange={(e) => handleInputChange('previousIssues', e.target.value)}
                  placeholder="Enter previous dental issues"
                />
              </div>
              <div className="form-group">
                <label>Orthodontic Treatment</label>
                <input
                  type="text"
                  value={newDentalRecord.orthodonticTreatment}
                  onChange={(e) => handleInputChange('orthodonticTreatment', e.target.value)}
                  placeholder="Enter orthodontic treatment details"
                />
              </div>
              <div className="form-group">
                <label>Existing Dental Conditions</label>
                <textarea
                  value={newDentalRecord.existingConditions}
                  onChange={(e) => handleInputChange('existingConditions', e.target.value)}
                  placeholder="Enter existing dental conditions"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-button">
                <i className="fas fa-save"></i> Save Record
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
          <div className="dental-history">
            {currentDentalHistory.length > 0 ? (
              <div className="dental-table-container">
                <table className="dental-table">
                  <thead>
                    <tr>
                      <th>Last Dental Visit</th>
                      <th>Dental Doctor</th>
                      <th>Previous Issues</th>
                      <th>Orthodontic Treatment</th>
                      <th>Existing Conditions</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentDentalHistory.map((record, index) => (
                      <tr key={index}>
                        <td>{formatDate(record.visitDateTime)}</td>
                        <td>{record.dentalDoctor}</td>
                        <td>{record.previousIssues || 'None'}</td>
                        <td>{record.orthodonticTreatment || 'None'}</td>
                        <td>{record.existingConditions || 'None'}</td>
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
              <p className="no-data">No dental history recorded</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Guidance = () => {
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
      <div className="guidance-info-container">
        <div className="header-section">
          <h2>Student Medical Information</h2>
          <div className="header-buttons">
            <button onClick={handleNewSearch} className="new-search-btn">
              <i className="fas fa-search"></i> New Search
            </button>
            <button onClick={() => navigate('/')} className="back-btn">
              <i className="fas fa-arrow-left"></i> Logout
            </button>
          </div>
        </div>

        <div className="guidance-content">
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

          <div className="vital-signs-grid">
            <div className="vital-card height">
              <div className="vital-icon">
                <i className="fas fa-ruler-vertical"></i>
              </div>
              
              <div className="vital-data">
                {editingHeight ? (
                  <div className="vital-input-container">
                    <input
                      type="text"
                      value={editedHeight}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          setEditedHeight(value);
                        }
                      }}
                      placeholder="Enter height"
                      className="vital-input"
                      autoFocus
                    />
                    <span className="vital-unit">cm</span>
                  </div>
                ) : (
                  <span className="vital-value">
                    {studentData.height ? `${studentData.height}cm` : 'N/A'}
                  </span>
                )}
                <span className="vital-label">Height</span>
                
              </div>
              {editingHeight ? (
                <div className="edit-actions">
                  <button onClick={() => {
                    if (editedHeight) {
                      const updatedData = {
                        ...studentData,
                        height: editedHeight
                      };
                      setStudentData(updatedData);
                      saveMedicalData(updatedData);
                    }
                    setEditingHeight(false);
                  }} className="save-clinibutton">
                    <i className="fas fa-check"></i>
                  </button>
                  <button onClick={() => {
                    setEditingHeight(false);
                    setEditedHeight(studentData.height || '');
                  }} className="cancel-button">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ) : (
                <button 
                  className="edit-button"
                  onClick={() => {
                    setEditingHeight(true);
                    setEditedHeight(studentData.height || '');
                  }}
                >
                  <i className="fas fa-edit"></i>
                </button>
              )}
            </div>

            <div className="vital-card weight">
              <div className="vital-icon">
                <i className="fas fa-weight"></i>
              </div>
              <div className="vital-data">
                {editingWeight ? (
                  <div className="vital-input-container">
                    <input
                      type="text"
                      value={editedWeight}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          setEditedWeight(value);
                        }
                      }}
                      placeholder="Enter weight"
                      className="vital-input"
                      autoFocus
                    />
                    <span className="vital-unit">kg</span>
                  </div>
                ) : (
                  <span className="vital-value">
                    {studentData.weight ? `${studentData.weight} ` : 'N/A'}
                  </span>
                )}
                <span className="vital-label">Weight</span>
              </div>
              {editingWeight ? (
                <div className="edit-actions">
                  <button onClick={() => {
                    if (editedWeight) {
                      const updatedData = {
                        ...studentData,
                        weight: editedWeight
                      };
                      setStudentData(updatedData);
                      saveMedicalData(updatedData);
                    }
                    setEditingWeight(false);
                  }} className="save-clinibutton">
                    <i className="fas fa-check"></i>
                  </button>
                  <button onClick={() => {
                    setEditingWeight(false);
                    setEditedWeight(studentData.weight || '');
                  }} className="cancel-button">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ) : (
                <button 
                  className="edit-button"
                  onClick={() => {
                    setEditingWeight(true);
                    setEditedWeight(studentData.weight || '');
                  }}
                >
                  <i className="fas fa-edit"></i>
                </button>
              )}
            </div>

            <div className="vital-card bmi">
              <div className="vital-icon">
                <i className="fas fa-calculator"></i>
              </div>
              <div className="vital-data">
                {studentData.height && studentData.weight ? (() => {
                  const weight = parseFloat(studentData.weight);
                  const height = parseFloat(studentData.height) / 100;
                  const bmi = weight / (height ** 2);
                  const roundedBMI = bmi.toFixed(1);
                  
                  let bmiStatus = '';
                  let bmiColor = '';
                  
                  if (bmi < 18.5) {
                    bmiStatus = 'Underweight';
                    bmiColor = 'text-warning';
                  } else if (bmi >= 18.5 && bmi < 25) {
                    bmiStatus = 'Normal Weight';
                    bmiColor = 'text-success';
                  } else if (bmi >= 25 && bmi < 30) {
                    bmiStatus = 'Overweight';
                    bmiColor = 'text-danger';
                  } else {
                    bmiStatus = 'Obese';
                    bmiColor = 'text-danger';
                  }
                  
                  return (
                    <div className="bmi-container">
                      <span className="vital-value">
                        {roundedBMI}
                      </span>
                      <span className={`bmi-status ${bmiColor}`}>
                        {bmiStatus}
                      </span>
                    </div>
                  );
                })() : (
                  <span className="vital-value">N/A</span>
                )}
                <span className="vital-label">BMI</span>
              </div>
            </div>
          </div>

          <div className="guidance-sections">
            <EditableField
              field="allergies"
              title="Allergies"
              icon="fa-exclamation-circle"
              items={getItems('allergies')}
              onAdd={handleAddItem}
              onRemove={handleRemoveItem}
            />
            <EditableField
              field="special_medical_conditions"
              title="Medical Conditions"
              icon="fa-notes-medical"
              items={getItems('special_medical_conditions')}
              onAdd={handleAddItem}
              onRemove={handleRemoveItem}
            />
            <EditableField
              field="present_medications"
              title="Current Medications"
              icon="fa-pills"
              items={getItems('present_medications')}
              onAdd={handleAddItem}
              onRemove={handleRemoveItem}
            />
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
    <div className="guidance-page">
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

export default Guidance;
