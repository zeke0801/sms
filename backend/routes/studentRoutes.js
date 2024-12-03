const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Adjust the path to your Student model

// Route to update student medical information
router.post('/update-medical-info', async (req, res) => {
  try {
    const { studentId, medicalInfo } = req.body;

    // Validate input
    if (!studentId) {
      return res.status(400).json({ 
        error: 'Student ID is required' 
      });
    }

    console.log('Received update request:', { studentId, medicalInfo });

    // Find the student by ID with error handling
    const student = await Student.findOne({ studentId }).exec();

    if (!student) {
      console.error(`Student not found with ID: ${studentId}`);
      return res.status(404).json({ 
        error: 'Student not found' 
      });
    }

    // Update medical information
    student.bloodType = medicalInfo.bloodType || student.bloodType;
    student.height = medicalInfo.height || student.height;
    student.weight = medicalInfo.weight || student.weight;
    
    // Update list-based medical information
    student.allergies = medicalInfo.allergies || student.allergies;
    student.medications = medicalInfo.medications || student.medications;
    student.medicalConditions = medicalInfo.medicalConditions || student.medicalConditions;
    student.vaccinations = medicalInfo.vaccinations || student.vaccinations;
    student.lastVisits = medicalInfo.lastVisits || student.lastVisits;

    // Save the updated student record with error handling
    try {
      await student.save();
    } catch (saveError) {
      console.error('Error saving student record:', saveError);
      return res.status(500).json({
        error: 'Failed to save student record',
        details: saveError.message
      });
    }

    // Respond with the updated student information
    res.status(200).json({
      message: 'Medical information updated successfully',
      student: {
        studentId: student.studentId,
        medicalInfo: {
          bloodType: student.bloodType,
          height: student.height,
          weight: student.weight,
          allergies: student.allergies,
          medications: student.medications,
          medicalConditions: student.medicalConditions,
          vaccinations: student.vaccinations,
          lastVisits: student.lastVisits
        }
      }
    });
  } catch (error) {
    console.error('Unexpected error updating medical information:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
});

module.exports = router;
