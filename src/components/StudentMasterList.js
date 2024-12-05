import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StudentMasterList.css';

const API_BASE_URL = 'http://localhost:5001/api';

const StudentMasterList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        let url = `${API_BASE_URL}/students`;
        if (selectedGrade !== 'all') {
          url = `${API_BASE_URL}/students/grade/${selectedGrade}`;
        }
        const response = await axios.get(url);
        setStudents(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load students. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedGrade]);

  // Group students by grade level
  const studentsByGrade = students.reduce((acc, student) => {
    const grade = student.grade_level || 'Unassigned';
    if (!acc[grade]) {
      acc[grade] = [];
    }
    acc[grade].push(student);
    return acc;
  }, {});

  const grades = Object.keys(studentsByGrade).sort((a, b) => {
    if (a === 'Unassigned') return 1;
    if (b === 'Unassigned') return -1;
    return a.localeCompare(b);
  });

  const handleBack = () => {
    navigate('/registrar');
  };

  const handleViewStudent = async (studentId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/students/${studentId}`);
      console.log('Student details:', response.data);
      // TODO: Navigate to student details page or show modal
    } catch (err) {
      console.error('Error fetching student details:', err);
    }
  };

  if (loading) {
    return (
      <div className="master-list-container">
        <div className="loading-message">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="master-list-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="master-list-container">
      <div className="master-list-header">
        <button className="back-button" onClick={handleBack}>
          <span>←</span> Back
        </button>
        <h1>Student Master List</h1>
      </div>

      <div className="filter-section">
        <label htmlFor="grade-filter">Filter by Grade:</label>
        <select
          id="grade-filter"
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
        >
          <option value="all">All Grades</option>
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
      </div>

      {grades.map((grade) => (
        selectedGrade === 'all' || selectedGrade === grade ? (
          <div key={grade} className="grade-section">
            <h2>{grade}</h2>
            <table className="students-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentsByGrade[grade].map((student) => (
                  <tr key={student.student_id}>
                    <td>{student.student_id}</td>
                    <td>{`${student.last_name}, ${student.first_name} ${student.middle_name || ''}`}</td>
                    <td>{student.gender}</td>
                    <td>{student.email}</td>
                    <td>{student.contact_number}</td>
                    <td>
                      <button
                        className="view-button"
                        onClick={() => handleViewStudent(student.student_id)}
                      >
                        👁️ View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null
      ))}
    </div>
  );
};

export default StudentMasterList;
