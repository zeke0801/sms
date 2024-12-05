import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddStudentPage.css';

const AddStudentPage = () => {
  const navigate = useNavigate();
  const [hasGuardian, setHasGuardian] = useState(false);
  const [studentData, setStudentData] = useState({
    studentId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    age: '',
    gender: '',
    nationality: '',
    grade: '',
    studentContactNumber: '',
    personalEmail: '',
    schoolProvidedEmail: '',
    mothersName: '',
    fathersName: '',
    guardianName: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      address: ''
    },
    clinicalInfo: {
      height: '',
      weight: '',
      allergies: '',
      vaccinations: '',
      medicalCondition: '',
      currentMedication: ''
    },
    permanentAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    boardingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setStudentData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setStudentData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Saving student data:', studentData);
      alert('Student added successfully!');
      navigate('/registrar');
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Failed to add student: ' + error.message);
    }
  };

  return (
    <div className="add-student-page">
      <header className="add-student-header">
        <h1>Add New Student</h1>
        <button onClick={() => navigate('/registrar')} className="back-button">
          Back to Registrar
        </button>
      </header>

      <form onSubmit={handleSubmit} className="add-student-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="studentId">Student ID*</label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={studentData.studentId}
                onChange={handleInputChange}
                placeholder="YYYY-NNNNN"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="firstName">First Name*</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={studentData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="middleName">Middle Name</label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                value={studentData.middleName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name*</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={studentData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="age">Age*</label>
              <input
                type="number"
                id="age"
                name="age"
                value={studentData.age}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender*</label>
              <select
                id="gender"
                name="gender"
                value={studentData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="nationality">Nationality*</label>
              <input
                type="text"
                id="nationality"
                name="nationality"
                value={studentData.nationality}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="grade">Grade Level*</label>
              <input
                type="text"
                id="grade"
                name="grade"
                value={studentData.grade}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Parent Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="mothersName">Mother's Maiden Name*</label>
              <input
                type="text"
                id="mothersName"
                name="mothersName"
                value={studentData.mothersName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="fathersName">Father's Name*</label>
              <input
                type="text"
                id="fathersName"
                name="fathersName"
                value={studentData.fathersName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={hasGuardian}
                  onChange={(e) => setHasGuardian(e.target.checked)}
                />
                Has Guardian
              </label>
            </div>
            {hasGuardian && (
              <div className="form-group">
                <label htmlFor="guardianName">Guardian's Name*</label>
                <input
                  type="text"
                  id="guardianName"
                  name="guardianName"
                  value={studentData.guardianName}
                  onChange={handleInputChange}
                  required={hasGuardian}
                />
              </div>
            )}
          </div>

          <div className="form-subsection">
            <h3>Emergency Contact</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="emergencyContact.name">Contact Name*</label>
                <input
                  type="text"
                  id="emergencyContact.name"
                  name="emergencyContact.name"
                  value={studentData.emergencyContact.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="emergencyContact.relationship">Relationship*</label>
                <input
                  type="text"
                  id="emergencyContact.relationship"
                  name="emergencyContact.relationship"
                  value={studentData.emergencyContact.relationship}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="emergencyContact.phone">Contact Number*</label>
                <input
                  type="tel"
                  id="emergencyContact.phone"
                  name="emergencyContact.phone"
                  value={studentData.emergencyContact.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="emergencyContact.address">Address*</label>
                <input
                  type="text"
                  id="emergencyContact.address"
                  name="emergencyContact.address"
                  value={studentData.emergencyContact.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Clinical Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="clinicalInfo.height">Current Height (cm)*</label>
              <input
                type="number"
                id="clinicalInfo.height"
                name="clinicalInfo.height"
                value={studentData.clinicalInfo.height}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="clinicalInfo.weight">Current Weight (kg)*</label>
              <input
                type="number"
                id="clinicalInfo.weight"
                name="clinicalInfo.weight"
                value={studentData.clinicalInfo.weight}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="clinicalInfo.allergies">Allergies</label>
              <textarea
                id="clinicalInfo.allergies"
                name="clinicalInfo.allergies"
                value={studentData.clinicalInfo.allergies}
                onChange={handleInputChange}
                placeholder="List any allergies, if none write 'None'"
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="clinicalInfo.vaccinations">Vaccinations*</label>
              <textarea
                id="clinicalInfo.vaccinations"
                name="clinicalInfo.vaccinations"
                value={studentData.clinicalInfo.vaccinations}
                onChange={handleInputChange}
                placeholder="List all vaccinations received"
                required
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="clinicalInfo.medicalCondition">Special Medical Conditions</label>
              <textarea
                id="clinicalInfo.medicalCondition"
                name="clinicalInfo.medicalCondition"
                value={studentData.clinicalInfo.medicalCondition}
                onChange={handleInputChange}
                placeholder="List any special medical conditions, if none write 'None'"
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="clinicalInfo.currentMedication">Present Medications</label>
              <textarea
                id="clinicalInfo.currentMedication"
                name="clinicalInfo.currentMedication"
                value={studentData.clinicalInfo.currentMedication}
                onChange={handleInputChange}
                placeholder="List any current medications, if none write 'None'"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Contact Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="studentContactNumber">Contact Number*</label>
              <input
                type="tel"
                id="studentContactNumber"
                name="studentContactNumber"
                value={studentData.studentContactNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="personalEmail">Personal Email*</label>
              <input
                type="email"
                id="personalEmail"
                name="personalEmail"
                value={studentData.personalEmail}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="schoolProvidedEmail">School Email</label>
              <input
                type="email"
                id="schoolProvidedEmail"
                name="schoolProvidedEmail"
                value={studentData.schoolProvidedEmail}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Permanent Address</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="permanentAddress.street">Street*</label>
              <input
                type="text"
                id="permanentAddress.street"
                name="permanentAddress.street"
                value={studentData.permanentAddress.street}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="permanentAddress.city">City*</label>
              <input
                type="text"
                id="permanentAddress.city"
                name="permanentAddress.city"
                value={studentData.permanentAddress.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="permanentAddress.state">State/Province*</label>
              <input
                type="text"
                id="permanentAddress.state"
                name="permanentAddress.state"
                value={studentData.permanentAddress.state}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="permanentAddress.zipCode">ZIP Code*</label>
              <input
                type="text"
                id="permanentAddress.zipCode"
                name="permanentAddress.zipCode"
                value={studentData.permanentAddress.zipCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Boarding Address (if different from permanent)</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="boardingAddress.street">Street</label>
              <input
                type="text"
                id="boardingAddress.street"
                name="boardingAddress.street"
                value={studentData.boardingAddress.street}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="boardingAddress.city">City</label>
              <input
                type="text"
                id="boardingAddress.city"
                name="boardingAddress.city"
                value={studentData.boardingAddress.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="boardingAddress.state">State/Province</label>
              <input
                type="text"
                id="boardingAddress.state"
                name="boardingAddress.state"
                value={studentData.boardingAddress.state}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="boardingAddress.zipCode">ZIP Code</label>
              <input
                type="text"
                id="boardingAddress.zipCode"
                name="boardingAddress.zipCode"
                value={studentData.boardingAddress.zipCode}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">Add Student</button>
          <button type="button" onClick={() => navigate('/registrar')} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudentPage;
