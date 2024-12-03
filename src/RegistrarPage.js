import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  mockStudentDatabase, 
  updateStudentDocument, 
  removeStudentDocument, 
  findStudentById 
} from './mockDatabase';
import './RegistrarPage.css';

const departments = [
  'Clinic',
  'Student Affairs',
  'Academic Records',
  'Counseling',
  'Extracurricular',
  'Financial'
];

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
    <div className="registrar-modal-overlay">
      <div className="registrar-modal-content">
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
          </div>
        </form>
      </div>
    </div>
  );
};

const StudentNotFoundModal = ({ isOpen, onClose, studentId }) => {
  if (!isOpen) return null;

  return (
    <div className="registrar-modal-overlay">
      <div className="registrar-modal-content student-not-found-modal">
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

const ClinicView = ({ studentDetails }) => {
  // Helper function to normalize medical information
  const normalizeMedicalInfo = (info) => {
    // If info is already an array of objects with text and date, return it
    if (Array.isArray(info) && info.length > 0 && 
        typeof info[0] === 'object' && 
        'text' in info[0] && 
        'date' in info[0]) {
      return info;
    }
    
    // If info is a string or array of strings, convert to object array
    const normalizedInfo = Array.isArray(info) 
      ? info 
      : (info ? [info] : []);
    
    return normalizedInfo.map(item => ({
      text: typeof item === 'string' ? item : '',
      date: new Date().toLocaleDateString('en-US')
    }));
  };

  const [studentData, setStudentData] = useState({
    clinicInfo: {
      bloodType: studentDetails.bloodType || '',
      height: studentDetails.height || '',
      weight: studentDetails.weight || '',
      allergies: normalizeMedicalInfo(studentDetails.allergies),
      medications: normalizeMedicalInfo(studentDetails.medications),
      medicalConditions: normalizeMedicalInfo(studentDetails.medicalConditions),
      vaccinations: normalizeMedicalInfo(studentDetails.vaccinations),
      lastVisits: normalizeMedicalInfo(studentDetails.lastVisits || studentDetails.lastVisit),
    }
  });

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

  const renderClinicInformation = () => {
    const { clinicInfo } = studentData;
    
    return (
      <div className="form-section">
        <h2>Clinic Information</h2>
        
        <div className="form-row">
          <div className="form-group">
            <label>Blood Type</label>
            <input 
              type="text" 
              value={clinicInfo.bloodType} 
              readOnly 
            />
          </div>
          
          <div className="form-group">
            <label>Height (cm)</label>
            <input 
              type="text" 
              value={clinicInfo.height} 
              readOnly 
            />
          </div>
          
          <div className="form-group">
            <label>Weight (kg)</label>
            <input 
              type="text" 
              value={clinicInfo.weight} 
              readOnly 
            />
          </div>
        </div>

        {[
          { key: 'allergies', label: 'Allergies' },
          { key: 'medications', label: 'Current Medications' },
          { key: 'medicalConditions', label: 'Other Medical Conditions' },
          { key: 'vaccinations', label: 'Vaccinations' },
          { key: 'lastVisits', label: 'Last Visits' }
        ].map(({ key, label }) => (
          <div key={key} className="form-row">
            <div className="form-group full-width">
              <h3>{label}</h3>
              {clinicInfo[key].length > 0 ? (
                <ul className="medical-list">
                  {clinicInfo[key].map((item, index) => (
                    <li key={index}>
                      {item.text} {item.date && `- ${item.date}`}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No {label.toLowerCase()} recorded</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="department-view clinic-view">
      {renderClinicInformation()}
    </div>
  );
};

const PlaceholderView = ({ department }) => {
  return (
    <div className="department-view placeholder-view">
      <h2>{department} Department</h2>
      <p>Information for this department is not yet implemented.</p>
    </div>
  );
};

const FullScreenPreview = ({ src, type, onClose }) => {
  const handleOverlayClick = (e) => {
    // Close only if clicking on the overlay itself
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fullscreen-preview-overlay" 
      onClick={handleOverlayClick}
    >
      <div className="fullscreen-preview-container">
        <button 
          className="fullscreen-preview-close" 
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </button>
        {type === 'image' ? (
          <img 
            src={src} 
            alt="Full screen preview" 
            className="fullscreen-preview-image"
          />
        ) : (
          <iframe 
            src={src} 
            title="Full screen PDF preview"
            className="fullscreen-preview-pdf"
          />
        )}
      </div>
    </div>
  );
};

const ProfileImageUpload = ({ studentDetails, onUpload, onRemove }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [fullScreenPreview, setFullScreenPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Set initial preview if image exists
    if (studentDetails.profileImage) {
      setPreviewImage(studentDetails.profileImage);
    }
  }, [studentDetails.profileImage]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid image (JPEG or PNG only)');
        return;
      }

      if (file.size > maxSize) {
        alert('File size should not exceed 5MB');
        return;
      }

      try {
        // Update student document in mock database
        const updatedStudent = await updateStudentDocument(
          studentDetails.studentId, 
          'profileImage', 
          file, 
          file.name
        );

        if (updatedStudent) {
          // Create preview
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage(reader.result);
            onUpload(updatedStudent);
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        console.error('Error uploading profile image:', error);
        alert('Failed to upload profile image');
      }
    }
  };

  const handleRemoveImage = async () => {
    try {
      // Remove from mock database
      const updatedStudent = removeStudentDocument(
        studentDetails.studentId, 
        'profileImage'
      );

      if (updatedStudent) {
        setPreviewImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onRemove(updatedStudent);
      }
    } catch (error) {
      console.error('Error removing profile image:', error);
      alert('Failed to remove profile image');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const openFullScreenPreview = () => {
    if (previewImage) {
      setFullScreenPreview(previewImage);
    }
  };

  const closeFullScreenPreview = () => {
    setFullScreenPreview(null);
  };

  return (
    <>
      {fullScreenPreview && (
        <FullScreenPreview 
          src={fullScreenPreview} 
          type="image" 
          onClose={closeFullScreenPreview} 
        />
      )}
      <div className="profile-image-upload">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png"
          style={{ display: 'none' }}
        />
        <div className="student-profile-image-upload">
          {previewImage ? (
            <div className="profile-image-preview">
              <img 
                src={previewImage} 
                alt={`${studentDetails.firstName} ${studentDetails.lastName}`} 
                onClick={openFullScreenPreview}
                style={{ cursor: 'pointer' }}
              />
              <div className="profile-image-actions">
                <button 
                  className="remove-image-button" 
                  onClick={handleRemoveImage}
                >
                  <i className="fas fa-trash"></i> Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-image-placeholder" onClick={triggerFileInput}>
              <i className="fas fa-user-circle"></i>
              <span>Upload Profile Photo</span>
            </div>
          )}
          
          {!previewImage && (
            <button 
              className="upload-profile-image-button" 
              onClick={triggerFileInput}
            >
              <i className="fas fa-upload"></i> Upload Photo
            </button>
          )}
          <div className="file-type-note">
            <small>Accepted formats: JPEG, PNG (max 5MB)</small>
            {studentDetails.profileImageFileName && (
              <div className="uploaded-file-info">
                <small>Last uploaded: {studentDetails.profileImageFileName}</small>
                <small>{new Date(studentDetails.profileImageUploadDate).toLocaleString()}</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const BirthCertificateUpload = ({ studentDetails, onUpload, onRemove }) => {
  const [previewPDF, setPreviewPDF] = useState(null);
  const [fullScreenPreview, setFullScreenPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Set initial preview if birth certificate exists
    if (studentDetails.birthCertificate) {
      setPreviewPDF(studentDetails.birthCertificate);
    }
  }, [studentDetails.birthCertificate]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid PDF file');
        return;
      }

      if (file.size > maxSize) {
        alert('File size should not exceed 5MB');
        return;
      }

      try {
        // Update student document in mock database
        const updatedStudent = await updateStudentDocument(
          studentDetails.studentId, 
          'birthCertificate', 
          file, 
          file.name
        );

        if (updatedStudent) {
          // Create preview
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewPDF(reader.result);
            onUpload(updatedStudent);
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        console.error('Error uploading birth certificate:', error);
        alert('Failed to upload birth certificate');
      }
    }
  };

  const handleRemovePDF = async () => {
    try {
      // Remove from mock database
      const updatedStudent = removeStudentDocument(
        studentDetails.studentId, 
        'birthCertificate'
      );

      if (updatedStudent) {
        setPreviewPDF(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onRemove(updatedStudent);
      }
    } catch (error) {
      console.error('Error removing birth certificate:', error);
      alert('Failed to remove birth certificate');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const openFullScreenPreview = () => {
    if (previewPDF) {
      setFullScreenPreview(previewPDF);
    }
  };

  const closeFullScreenPreview = () => {
    setFullScreenPreview(null);
  };

  return (
    <>
      {fullScreenPreview && (
        <FullScreenPreview 
          src={fullScreenPreview} 
          type="pdf" 
          onClose={closeFullScreenPreview} 
        />
      )}
      <div className="birth-certificate-upload">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          style={{ display: 'none' }}
        />
        <div className="student-birth-certificate-upload">
          {previewPDF ? (
            <div className="birth-certificate-preview">
              <div 
                className="birth-certificate-placeholder" 
                onClick={openFullScreenPreview}
                style={{ cursor: 'pointer' }}
              >
                <i className="fas fa-file-pdf"></i>
                <span>Birth Certificate Uploaded</span>
              </div>
              <div className="birth-certificate-actions">
                <button 
                  className="remove-image-button" 
                  onClick={handleRemovePDF}
                >
                  <i className="fas fa-trash"></i> Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="birth-certificate-placeholder" onClick={triggerFileInput}>
              <i className="fas fa-file-pdf"></i>
              <span>Upload Birth Certificate</span>
            </div>
          )}
          
          {!previewPDF && (
            <button 
              className="upload-birth-certificate-button" 
              onClick={triggerFileInput}
            >
              <i className="fas fa-upload"></i> Upload PDF
            </button>
          )}
          <div className="file-type-note">
            <small>Accepted format: PDF (max 5MB)</small>
            {studentDetails.birthCertificateFileName && (
              <div className="uploaded-file-info">
                <small>Last uploaded: {studentDetails.birthCertificateFileName}</small>
                <small>{new Date(studentDetails.birthCertificateUploadDate).toLocaleString()}</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const RegistrarPage = () => {
  const navigate = useNavigate();
  const [isStudentIDModalOpen, setIsStudentIDModalOpen] = useState(true);
  const [isStudentNotFoundModalOpen, setIsStudentNotFoundModalOpen] = useState(false);
  const [notFoundStudentId, setNotFoundStudentId] = useState('');
  const [studentDetails, setStudentDetails] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('Clinic');

  const handleLogout = () => {
    navigate('/');
  };

  const handleStudentIDSubmit = (id) => {
    const student = findStudentById(id);
    if (student) {
      setStudentDetails(student);
      setIsStudentIDModalOpen(false);
    } else {
      setNotFoundStudentId(id);
      setIsStudentNotFoundModalOpen(true);
    }
  };

  const handleProfileImageUpload = async (updatedStudent) => {
    setStudentDetails(updatedStudent);
  };

  const handleBirthCertificateUpload = async (updatedStudent) => {
    setStudentDetails(updatedStudent);
  };

  const handleRemoveProfileImage = async (updatedStudent) => {
    setStudentDetails(updatedStudent);
  };

  const handleRemoveBirthCertificate = async (updatedStudent) => {
    setStudentDetails(updatedStudent);
  };

  const handleCloseStudentNotFoundModal = () => {
    setIsStudentNotFoundModalOpen(false);
    setNotFoundStudentId('');
  };

  const handleSearchAnotherStudent = () => {
    setStudentDetails(null);
    setIsStudentIDModalOpen(true);
    setSelectedDepartment('Clinic');
  };

  const renderDepartmentView = () => {
    if (!studentDetails) return null;

    switch (selectedDepartment) {
      case 'Clinic':
        return <ClinicView studentDetails={studentDetails} />;
      default:
        return <PlaceholderView department={selectedDepartment} />;
    }
  };

  return (
    <div className="registrar-page">
      <header className="registrar-header">
        <h1>Registrar Department</h1>
        <div className="header-buttons">
          {studentDetails && (
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
      
      {studentDetails && (
        <div className="student-details-container">
          <div className="student-basic-info">
            <div className="student-profile-section">
              <ProfileImageUpload 
                studentDetails={studentDetails}
                onUpload={handleProfileImageUpload}
                onRemove={handleRemoveProfileImage}
              />
            </div>
            
            <div className="student-info-columns">
              <div className="info-column">
                <div className="info-item">
                  <strong>Student ID</strong>
                  <span>{studentDetails.studentId}</span>
                </div>
                <div className="info-item">
                  <strong>Full Name</strong>
                  <span>{`${studentDetails.firstName} ${studentDetails.middleName || ''} ${studentDetails.lastName}`}</span>
                </div>
                <div className="info-item">
                  <strong>Year Level</strong>
                  <span>{studentDetails.grade}</span>
                </div>
                <div className="info-item">
                  <strong>Age</strong>
                  <span>{studentDetails.age}</span>
                </div>
                <div className="info-item">
                  <strong>Gender</strong>
                  <span>{studentDetails.gender}</span>
                </div>
              </div>
              
              <div className="info-column">
                <div className="info-item">
                  <strong>Student Contact</strong>
                  <span>{studentDetails.studentContactNumber}</span>
                </div>
                
                <div className="info-item">
                  <strong>Personal Email</strong>
                  <span>{studentDetails.personalEmail}</span>
                </div>
                <div className="info-item">
                  <strong>School Email</strong>
                  <span>{studentDetails.schoolProvidedEmail}</span>
                </div>
                <div className="info-item">
                  <strong>Permanent Address</strong>
                  <span>{`${studentDetails.permanentAddress.street}, ${studentDetails.permanentAddress.city}, ${studentDetails.permanentAddress.state} ${studentDetails.permanentAddress.zipCode}`}</span>
                </div>
                <div className="info-item">
                  <strong>Boarding Address</strong>
                  <span>{studentDetails.boardingAddress ? 
                    `${studentDetails.boardingAddress.street}, ${studentDetails.boardingAddress.city}, ${studentDetails.boardingAddress.state} ${studentDetails.boardingAddress.zipCode}` 
                    : 'N/A'}</span>
                </div>
                <div className="info-item emergency-contact">
                  <strong>Emergency Contact</strong>
                  <span>{`${studentDetails.mother.firstName} ${studentDetails.mother.lastName} / ${studentDetails.father.firstName} ${studentDetails.father.lastName}`}</span>
                </div>
                <div className="info-item emergency-contact">
                  <strong>Emergency Phone</strong>
                  <span>{`${studentDetails.mother.phoneNumber} / ${studentDetails.father.phoneNumber}`}</span>
                </div>
              </div>
              
              <div className="info-column">
                <div className="info-item">
                  <strong>Mother's Name</strong>
                  <span>{`${studentDetails.mother.firstName} ${studentDetails.mother.middleName || ''} ${studentDetails.mother.lastName}`}</span>
                </div>
                <div className="info-item">
                  <strong>Mother's Maiden Name</strong>
                  <span>{studentDetails.mother.maidenName}</span>
                </div>
                <div className="info-item">
                  <strong>Mother's Phone</strong>
                  <span>{studentDetails.mother.phoneNumber}</span>
                </div>
                <div className="info-item">
                  <strong>Mother's Email</strong>
                  <span>{studentDetails.mother.email}</span>
                </div>
                <div className="info-item">
                  <strong>Father's Name</strong>
                  <span>{`${studentDetails.father.firstName} ${studentDetails.father.middleName || ''} ${studentDetails.father.lastName}`}</span>
                </div>
                <div className="info-item">
                  <strong>Father's Phone</strong>
                  <span>{studentDetails.father.phoneNumber}</span>
                </div>
                <div className="info-item">
                  <strong>Father's Email</strong>
                  <span>{studentDetails.father.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="birth-certificate-container">
            <h3>Birth Certificate</h3>
            <BirthCertificateUpload 
              studentDetails={studentDetails}
              onUpload={handleBirthCertificateUpload}
              onRemove={handleRemoveBirthCertificate}
            />
          </div>

          <div className="department-section">
            <div className="department-selector">
              <select 
                value={selectedDepartment} 
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <main className="registrar-content">
              {renderDepartmentView()}
            </main>
          </div>
        </div>
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

export default RegistrarPage;
