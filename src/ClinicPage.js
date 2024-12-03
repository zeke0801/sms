import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  mockStudentDatabase, 
  findStudentById 
} from './mockDatabase';
import './ClinicPage.css';

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
              placeholder="Enter Student ID (e.g., 2019-11000)"
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

const DynamicListInput = ({ 
  label, 
  items = [], 
  onAddItem, 
  onRemoveItem, 
  placeholder 
}) => {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    if (newItem.trim()) {
      onAddItem(newItem.trim());
      setNewItem('');
    }
  };

  // Ensure items is always an array of objects with text and date
  const safeItems = Array.isArray(items) 
    ? items.filter(item => 
        typeof item === 'object' && 
        item !== null && 
        'text' in item && 
        'date' in item
      )
    : [];

  return (
    <div className="dynamic-list-input">
      <label>{label}</label>
      <div className="input-container">
        <input 
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
        />
        <button 
          type="button" 
          onClick={handleAddItem}
          className="add-item-button"
        >
          +
        </button>
      </div>
      {safeItems.length > 0 && (
        <div className="item-list">
          {safeItems.map((item, index) => (
            <div key={index} className="item-tag">
              {item.text} - {item.date}
              <button 
                type="button" 
                onClick={() => onRemoveItem(item)}
                className="remove-item-button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ClinicPage = () => {
  const navigate = useNavigate();
  const [isStudentIDModalOpen, setIsStudentIDModalOpen] = useState(true);
  const [isStudentNotFoundModalOpen, setIsStudentNotFoundModalOpen] = useState(false);
  const [notFoundStudentId, setNotFoundStudentId] = useState('');
  const [studentData, setStudentData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    grade: '',
    bloodType: '',
    height: '',
    weight: '',
    allergies: [],
    medications: [],
    medicalConditions: [],
    vaccinations: [],
    lastVisits: [], // Changed from lastVisit to lastVisits array
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    lastPhysicalExam: '',
  });

  // Helper function to format date and time
  const formatDate = (date = new Date()) => {
    const formattedDate = date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });

    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    return `${formattedDate} ${formattedTime}`;
  };

  const handleStudentIDSubmit = (id) => {
    const student = findStudentById(id);
    
    if (student) {
      // Ensure medical information is properly formatted
      const sanitizeMedicalList = (list) => {
        if (!Array.isArray(list)) return [];
        return list.map(item => {
          // If item is already an object with text and date, return it
          if (typeof item === 'object' && item !== null && 'text' in item && 'date' in item) {
            return item;
          }
          // If item is a string, convert it to the new format
          if (typeof item === 'string') {
            return { 
              text: item, 
              date: formatDate() 
            };
          }
          // If item is neither an object nor a string, return null
          return null;
        }).filter(item => item !== null);
      };

      // Populate all fields with student data
      setStudentData({
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
        age: student.age,
        gender: student.gender,
        grade: student.grade,
        bloodType: student.bloodType || '',
        height: student.height || '',
        weight: student.weight || '',
        allergies: sanitizeMedicalList(student.allergies),
        medications: sanitizeMedicalList(student.medications),
        medicalConditions: sanitizeMedicalList(student.medicalConditions),
        vaccinations: sanitizeMedicalList(student.vaccinations),
        lastVisits: sanitizeMedicalList(student.lastVisits || []), // Add last visits
        emergencyContactName: `${student.mother.firstName} ${student.mother.lastName} / ${student.father.firstName} ${student.father.lastName}`,
        emergencyContactRelation: 'Parent',
        emergencyContactPhone: `${student.mother.phoneNumber} / ${student.father.phoneNumber}`,
        lastPhysicalExam: student.lastPhysicalExam || '',
      });
      
      setIsStudentIDModalOpen(false);
    } else {
      setNotFoundStudentId(id);
      setIsStudentNotFoundModalOpen(true);
    }
  };

  const handleAddAllergy = (allergy) => {
    setStudentData(prev => ({
      ...prev,
      allergies: [
        ...prev.allergies, 
        { 
          text: allergy, 
          date: formatDate() 
        }
      ]
    }));
  };

  const handleRemoveAllergy = (allergyToRemove) => {
    setStudentData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => 
        a.text !== allergyToRemove.text || a.date !== allergyToRemove.date
      )
    }));
  };

  const handleAddMedication = (medication) => {
    setStudentData(prev => ({
      ...prev,
      medications: [
        ...prev.medications, 
        { 
          text: medication, 
          date: formatDate() 
        }
      ]
    }));
  };

  const handleRemoveMedication = (medicationToRemove) => {
    setStudentData(prev => ({
      ...prev,
      medications: prev.medications.filter(m => 
        m.text !== medicationToRemove.text || m.date !== medicationToRemove.date
      )
    }));
  };

  const handleAddMedicalCondition = (condition) => {
    setStudentData(prev => ({
      ...prev,
      medicalConditions: [
        ...prev.medicalConditions, 
        { 
          text: condition, 
          date: formatDate() 
        }
      ]
    }));
  };

  const handleRemoveMedicalCondition = (conditionToRemove) => {
    setStudentData(prev => ({
      ...prev,
      medicalConditions: prev.medicalConditions.filter(c => 
        c.text !== conditionToRemove.text || c.date !== conditionToRemove.date
      )
    }));
  };

  const handleAddVaccination = (vaccination) => {
    setStudentData(prev => ({
      ...prev,
      vaccinations: [
        ...prev.vaccinations, 
        { 
          text: vaccination, 
          date: formatDate() 
        }
      ]
    }));
  };

  const handleRemoveVaccination = (vaccinationToRemove) => {
    setStudentData(prev => ({
      ...prev,
      vaccinations: prev.vaccinations.filter(v => 
        v.text !== vaccinationToRemove.text || v.date !== vaccinationToRemove.date
      )
    }));
  };

  // Add handler for last visits
  const handleAddLastVisit = (visitDescription) => {
    setStudentData(prev => ({
      ...prev,
      lastVisits: [
        ...prev.lastVisits, 
        { 
          text: visitDescription, 
          date: formatDate() 
        }
      ]
    }));
  };

  const handleRemoveLastVisit = (visitToRemove) => {
    setStudentData(prev => ({
      ...prev,
      lastVisits: prev.lastVisits.filter(visit => 
        visit.text !== visitToRemove.text || visit.date !== visitToRemove.date
      )
    }));
  };

  const handleCloseStudentNotFoundModal = () => {
    setIsStudentNotFoundModalOpen(false);
    setNotFoundStudentId('');
  };

  const handleSearchAnotherStudent = () => {
    setStudentData({
      studentId: '',
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      grade: '',
      bloodType: '',
      height: '',
      weight: '',
      allergies: [],
      medications: [],
      medicalConditions: [],
      vaccinations: [],
      lastVisits: [], // Reset last visits
      emergencyContactName: '',
      emergencyContactRelation: '',
      emergencyContactPhone: '',
      lastPhysicalExam: '',
    });
    setIsStudentIDModalOpen(true);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name !== 'studentId' && name !== 'firstName' && name !== 'lastName' && name !== 'age' && name !== 'gender' && name !== 'grade' && name !== 'emergencyContactName' && name !== 'emergencyContactRelation' && name !== 'emergencyContactPhone') {
      setStudentData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare the medical record for database submission
    const medicalRecord = {
      studentId: studentData.studentId,
      medicalInfo: {
        bloodType: studentData.bloodType,
        height: studentData.height,
        weight: studentData.weight,
        allergies: studentData.allergies,
        medications: studentData.medications,
        medicalConditions: studentData.medicalConditions,
        vaccinations: studentData.vaccinations,
        lastVisits: studentData.lastVisits,
      },
      // You can add a timestamp for when the record was created/updated
      recordTimestamp: new Date().toISOString()
    };

    try {
      // Log the data being sent
      console.log('Sending medical record:', JSON.stringify(medicalRecord, null, 2));

      // Update student record in the registrar's database
      const updateResponse = await fetch('/api/students/update-medical-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: studentData.studentId,
          medicalInfo: medicalRecord.medicalInfo
        })
      });

      // Log the full response for debugging
      console.log('Update Response:', {
        status: updateResponse.status,
        statusText: updateResponse.statusText
      });

      // Try to get response text for more details
      const responseText = await updateResponse.text();
      console.log('Response Text:', responseText);

      if (!updateResponse.ok) {
        throw new Error(`Failed to update student medical information. Status: ${updateResponse.status}, Message: ${responseText}`);
      }

      // Temporary alert for demonstration
      alert('Medical Record Saved Successfully!\n' + 
            JSON.stringify(medicalRecord, null, 2));

      // Optional: You might want to reset the form or perform additional actions
      // handleSearchAnotherStudent();
    } catch (error) {
      console.error('Error saving medical record:', error);
      alert('Failed to save medical record: ' + error.message);
    }
  };

  return (
    <div className="clinic-page">
      <header className="clinic-header">
        <h1>Clinic Department</h1>
        <div className="header-buttons">
          {studentData.studentId && (
            <button 
              onClick={handleSearchAnotherStudent} 
              className="search-another-button"
            >
              Search Another Student
            </button>
          )}
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>
      
      {studentData.studentId && (
        <main className="clinic-content">
          <form className="medical-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Student Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Student ID</label>
                  <input 
                    type="text" 
                    name="studentId" 
                    value={studentData.studentId}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    value={studentData.firstName}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    value={studentData.lastName}
                    readOnly
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Age</label>
                  <input 
                    type="number" 
                    name="age" 
                    value={studentData.age}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <input 
                    type="text" 
                    name="gender"
                    value={studentData.gender}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Grade</label>
                  <input 
                    type="text" 
                    name="grade"
                    value={studentData.grade}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Emergency Contact</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Emergency Contact Name</label>
                  <input 
                    type="text" 
                    name="emergencyContactName" 
                    value={studentData.emergencyContactName}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Relationship</label>
                  <input 
                    type="text" 
                    name="emergencyContactRelation" 
                    value={studentData.emergencyContactRelation}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    name="emergencyContactPhone" 
                    value={studentData.emergencyContactPhone}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Medical Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Blood Type</label>
                  <select 
                    name="bloodType"
                    value={studentData.bloodType}
                    onChange={(e) => setStudentData(prev => ({
                      ...prev,
                      bloodType: e.target.value
                    }))}
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Height (cm)</label>
                  <input 
                    type="number" 
                    name="height" 
                    value={studentData.height}
                    onChange={(e) => setStudentData(prev => ({
                      ...prev,
                      height: e.target.value
                    }))}
                    placeholder="Enter height in cm"
                    min="0"
                    step="0.1"
                  />
                </div>
                
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input 
                    type="number" 
                    name="weight" 
                    value={studentData.weight}
                    onChange={(e) => setStudentData(prev => ({
                      ...prev,
                      weight: e.target.value
                    }))}
                    placeholder="Enter weight in kg"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <DynamicListInput 
                    label="Allergies"
                    items={studentData.allergies}
                    onAddItem={handleAddAllergy}
                    onRemoveItem={handleRemoveAllergy}
                    placeholder="Enter an allergy"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <DynamicListInput 
                    label="Current Medications"
                    items={studentData.medications}
                    onAddItem={handleAddMedication}
                    onRemoveItem={handleRemoveMedication}
                    placeholder="Enter a medication"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <DynamicListInput 
                    label="Other Medical Conditions"
                    items={studentData.medicalConditions}
                    onAddItem={handleAddMedicalCondition}
                    onRemoveItem={handleRemoveMedicalCondition}
                    placeholder="Enter a medical condition"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <DynamicListInput 
                    label="Vaccinations"
                    items={studentData.vaccinations}
                    onAddItem={handleAddVaccination}
                    onRemoveItem={handleRemoveVaccination}
                    placeholder="Enter a vaccination"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <DynamicListInput 
                    label="Last Visits"
                    items={studentData.lastVisits}
                    onAddItem={handleAddLastVisit}
                    onRemoveItem={handleRemoveLastVisit}
                    placeholder="Describe the student's last visit (e.g., slept due to fever, received first aid for minor cut)"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-button">Save Medical Record</button>
            </div>
          </form>
        </main>
      )}

      <StudentIDModal 
        isOpen={isStudentIDModalOpen}
        onClose={() => setIsStudentIDModalOpen(false)}
        onSubmit={handleStudentIDSubmit}
      />

      <StudentNotFoundModal 
        isOpen={isStudentNotFoundModalOpen}
        onClose={handleCloseStudentNotFoundModal}
        studentId={notFoundStudentId}
      />
    </div>
  );
};

export default ClinicPage;
