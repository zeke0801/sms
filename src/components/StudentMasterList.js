import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import softCoffeeIcon from '../icons/softcoffee.png';
import './StudentMasterList.css';

const API_BASE_URL = 'http://localhost:5000/api';

const StudentMasterList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/students`);
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
  }, []);

  // Filter students based on search term
  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.id.toLowerCase().includes(searchLower) ||
      `${student.last_name}, ${student.first_name} ${student.middle_name}`
        .toLowerCase()
        .includes(searchLower)
    );
  });

  // Sort students by last name
  const sortedStudents = [...filteredStudents].sort((a, b) =>
    a.last_name.localeCompare(b.last_name)
  );

  // Group students by grade level
  const studentsByGrade = sortedStudents.reduce((acc, student) => {
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
      const response = students.find(student => student.id === studentId);
      console.log('Student details:', response);
      // TODO: Navigate to student details page or show modal
    } catch (err) {
      console.error('Error fetching student details:', err);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <header className="app-header">
          <span className="header-title">JHSOS</span>
        </header>
        <div className="master-list-container">
          <div className="loading-message">Loading students...</div>
        </div>
        <footer className="footer">
          <div className="footer-content">
            <span>Made by SoftCoffee</span>
            <img src={softCoffeeIcon} alt="SoftCoffee" className="footer-icon" />
          </div>
        </footer>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <header className="app-header">
          <span className="header-title">JHSOS</span>
        </header>
        <div className="master-list-container">
          <div className="error-message">{error}</div>
        </div>
        <footer className="footer">
          <div className="footer-content">
            <span>Made by SoftCoffee</span>
            <img src={softCoffeeIcon} alt="SoftCoffee" className="footer-icon" />
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <header className="app-header">
        <span className="header-title">JHSOS</span>
      </header>

      <div className="master-list-container">
        <div className="master-list-header">
          <button className="back-button" onClick={handleBack}>
            <span>←</span> Back
          </button>
          <h1>Student Master List</h1>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Student ID or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
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

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{`${student.last_name}, ${student.first_name} ${student.middle_name}`}</td>
                  <td>{student.grade_level}</td>
                  <td>
                    <button
                      className="view-button"
                      onClick={() => handleViewStudent(student.id)}
                    >
                      👁️ View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="footer-masterlist">
        <div className="footer-content">
          <span>Made by SoftCoffee</span>
          <img src={softCoffeeIcon} alt="SoftCoffee" className="footer-icon" />
        </div>
      </footer>
    </div>
  );
};

export default StudentMasterList;
