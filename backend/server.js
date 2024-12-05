const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const studentService = require('./services/studentService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Student Routes
app.get('/api/students', async (req, res, next) => {
  try {
    const students = await studentService.getAllStudents();
    res.json(students);
  } catch (error) {
    next(error);
  }
});

app.get('/api/students/:id', async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    next(error);
  }
});

app.post('/api/students', async (req, res, next) => {
  try {
    const result = await studentService.createStudent(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

app.put('/api/students/:id', async (req, res, next) => {
  try {
    const result = await studentService.updateStudent(req.params.id, req.body);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    next(error);
  }
});

app.get('/api/students/grade/:gradeLevel', async (req, res, next) => {
  try {
    const students = await studentService.getStudentsByGrade(req.params.gradeLevel);
    res.json(students);
  } catch (error) {
    next(error);
  }
});

// Medical Routes
app.put('/api/students/:id/medical', async (req, res, next) => {
  try {
    const result = await studentService.updateMedicalInfo(req.params.id, req.body);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    next(error);
  }
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
