const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to students data file
const STUDENTS_FILE_PATH = path.join(__dirname, 'students.json');

// Read students data
const readStudentsData = () => {
  try {
    const data = fs.readFileSync(STUDENTS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading students file:', error);
    return [];
  }
};

// Write students data
const writeStudentsData = (students) => {
  try {
    fs.writeFileSync(STUDENTS_FILE_PATH, JSON.stringify(students, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing students file:', error);
  }
};

// Route to update student medical information
app.post('/api/students/update-medical-info', (req, res) => {
  const { studentId, medicalInfo } = req.body;

  // Validate input
  if (!studentId) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  // Read current students data
  let students = readStudentsData();

  // Find student index
  const studentIndex = students.findIndex(student => student.studentId === studentId);

  if (studentIndex === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }

  // Update medical information
  students[studentIndex] = {
    ...students[studentIndex],
    bloodType: medicalInfo.bloodType || students[studentIndex].bloodType,
    height: medicalInfo.height || students[studentIndex].height,
    weight: medicalInfo.weight || students[studentIndex].weight,
    allergies: medicalInfo.allergies || students[studentIndex].allergies,
    medications: medicalInfo.medications || students[studentIndex].medications,
    medicalConditions: medicalInfo.medicalConditions || students[studentIndex].medicalConditions,
    vaccinations: medicalInfo.vaccinations || students[studentIndex].vaccinations,
    lastVisits: medicalInfo.lastVisits || students[studentIndex].lastVisits,
  };

  // Write updated data
  writeStudentsData(students);

  // Respond with updated student information
  res.status(200).json({
    message: 'Medical information updated successfully',
    student: students[studentIndex]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
