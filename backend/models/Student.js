const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  studentId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  firstName: String,
  lastName: String,
  
  // Medical Information
  bloodType: String,
  height: String,
  weight: String,
  
  // List-based Medical Information with Date Tracking
  allergies: [{
    text: String,
    date: String
  }],
  medications: [{
    text: String,
    date: String
  }],
  medicalConditions: [{
    text: String,
    date: String
  }],
  vaccinations: [{
    text: String,
    date: String
  }],
  lastVisits: [{
    text: String,
    date: String
  }],

  // Other existing fields can remain the same
  age: Number,
  gender: String,
  grade: String,
  
  // Emergency Contact Information
  mother: {
    firstName: String,
    lastName: String,
    phoneNumber: String
  },
  father: {
    firstName: String,
    lastName: String,
    phoneNumber: String
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Student', StudentSchema);
