// Utility function to save students to localStorage
const saveStudentsToLocalStorage = (students) => {
  localStorage.setItem('studentDatabase', JSON.stringify(students));
};

// Utility function to load students from localStorage
const loadStudentsFromLocalStorage = () => {
  const storedStudents = localStorage.getItem('studentDatabase');
  return storedStudents ? JSON.parse(storedStudents) : generateStudents();
};

// Mock Database for 10th Grade Students
const generateRandomBloodType = () => {
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  return bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
};

const generateRandomAllergies = () => {
  const possibleAllergies = [
    'None', 
    'Peanuts', 
    'Dairy', 
    'Latex', 
    'Penicillin', 
    'Shellfish', 
    'Bee Stings', 
    'Gluten'
  ];
  // 30% chance of having an allergy
  return Math.random() < 0.3 ? possibleAllergies[Math.floor(Math.random() * possibleAllergies.length)] : 'None';
};

const generateRandomMedications = () => {
  const possibleMedications = [
    'None',
    'Asthma Inhaler',
    'ADHD Medication',
    'Allergy Medication',
    'Insulin',
    'Thyroid Medication'
  ];
  // 20% chance of being on medication
  return Math.random() < 0.2 ? possibleMedications[Math.floor(Math.random() * possibleMedications.length)] : 'None';
};

const generateRandomMedicalConditions = () => {
  const possibleConditions = [
    'None',
    'Asthma',
    'Diabetes',
    'Epilepsy',
    'Allergic Rhinitis',
    'Mild Scoliosis'
  ];
  // 25% chance of having a medical condition
  return Math.random() < 0.25 ? possibleConditions[Math.floor(Math.random() * possibleConditions.length)] : 'None';
};

const generateRandomVaccinations = () => {
  const vaccinations = [
    'MMR (Measles, Mumps, Rubella)',
    'Hepatitis B',
    'HPV',
    'Tetanus, Diphtheria, Pertussis (Tdap)',
    'Meningococcal'
  ];
  // Randomly select 2-4 vaccinations
  const numVaccinations = Math.floor(Math.random() * 3) + 2;
  return vaccinations.sort(() => 0.5 - Math.random()).slice(0, numVaccinations);
};

const generateStudents = () => {
  const storedStudents = localStorage.getItem('studentDatabase');
  
  if (storedStudents) {
    return JSON.parse(storedStudents);
  }

  // If no stored students, generate new ones
  const students = [];
  const firstNames = [
    'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 
    'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 
    'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander'
  ];
  const middleNames = [
    'Rose', 'James', 'Marie', 'Alexander', 'Elizabeth', 'Michael', 'Ann', 
    'William', 'Grace', 'Thomas', 'Jane', 'Robert', 'Louise', 'David', 'Kate'
  ];
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 
    'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 
    'Wilson', 'Anderson', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee'
  ];

  const streetNames = [
    'Oak', 'Maple', 'Cedar', 'Pine', 'Elm', 'Willow', 'Birch', 'Chestnut', 
    'Ash', 'Sycamore', 'Spruce', 'Magnolia', 'Hickory', 'Poplar', 'Juniper'
  ];

  const cities = [
    'Springfield', 'Riverside', 'Greenville', 'Fairview', 'Sunset', 'Lakeside', 
    'Meadowbrook', 'Oakridge', 'Pinecrest', 'Willow Creek'
  ];

  const states = [
    'CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'
  ];

  for (let i = 0; i < 40; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const middleName = middleNames[Math.floor(Math.random() * middleNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const gender = Math.random() < 0.5 ? 'Male' : 'Female';
    
    const motherFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const motherMiddleName = middleNames[Math.floor(Math.random() * middleNames.length)];
    const motherLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    const fatherFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const fatherMiddleName = middleNames[Math.floor(Math.random() * middleNames.length)];
    const fatherLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    const student = {
      studentId: `2019-${String(11000 + i).padStart(5, '0')}`,
      
      // Name Details
      firstName,
      middleName,
      lastName,
      
      // Basic Info
      age: 15 + Math.floor(Math.random() * 2), // 15 or 16
      gender,
      grade: '10',
      
      // Contact Information
      studentContactNumber: `(${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}) ${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
      personalEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@gmail.com`,
      schoolProvidedEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@school.edu`,
      
      // Address Information
      permanentAddress: {
        street: `${Math.floor(Math.random() * 9000) + 1000} ${streetNames[Math.floor(Math.random() * streetNames.length)]} Street`,
        city: cities[Math.floor(Math.random() * cities.length)],
        state: states[Math.floor(Math.random() * states.length)],
        zipCode: String(Math.floor(Math.random() * 90000) + 10000)
      },
      boardingAddress: Math.random() < 0.3 ? {
        street: `${Math.floor(Math.random() * 9000) + 1000} Campus Drive`,
        city: cities[Math.floor(Math.random() * cities.length)],
        state: states[Math.floor(Math.random() * states.length)],
        zipCode: String(Math.floor(Math.random() * 90000) + 10000)
      } : null,
      
      // Parent Information
      mother: {
        firstName: motherFirstName,
        middleName: motherMiddleName,
        lastName: motherLastName,
        maidenName: lastNames[Math.floor(Math.random() * lastNames.length)],
        phoneNumber: `(${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}) ${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
        email: `${motherFirstName.toLowerCase()}.${motherLastName.toLowerCase()}${Math.floor(Math.random() * 100)}@gmail.com`
      },
      father: {
        firstName: fatherFirstName,
        middleName: fatherMiddleName,
        lastName: fatherLastName,
        phoneNumber: `(${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}) ${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
        email: `${fatherFirstName.toLowerCase()}.${fatherLastName.toLowerCase()}${Math.floor(Math.random() * 100)}@gmail.com`
      },
      
      // Profile Image (Placeholder)
      profileImage: null,  // Will store base64 encoded image
      profileImageFileName: null,
      profileImageUploadDate: null,
      
      // Birth Certificate (Placeholder)
      birthCertificate: null,  // Will store base64 encoded PDF
      birthCertificateFileName: null,
      birthCertificateUploadDate: null,
      
      // Medical Information (Kept from previous implementation)
      bloodType: generateRandomBloodType(),
      allergies: generateRandomAllergies(),
      medications: generateRandomMedications(),
      medicalConditions: generateRandomMedicalConditions(),
      vaccinations: generateRandomVaccinations(),
      lastPhysicalExam: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      
      // Emergency Contact (Kept from previous implementation)
      emergencyContactName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      emergencyContactRelation: Math.random() < 0.5 ? 'Parent' : 'Guardian',
      emergencyContactPhone: `(${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}) ${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`
    };
    
    students.push(student);
  }

  // Save to localStorage
  saveStudentsToLocalStorage(students);
  return students;
};

const studentDatabase = generateStudents();

// Function to update student documents
const updateStudentDocument = (studentId, documentType, file, fileName) => {
  const students = loadStudentsFromLocalStorage();
  const studentIndex = students.findIndex(s => s.studentId === studentId);
  
  if (studentIndex === -1) {
    console.error('Student not found');
    return null;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (documentType === 'profileImage') {
        students[studentIndex].profileImage = reader.result;
        students[studentIndex].profileImageFileName = fileName;
        students[studentIndex].profileImageUploadDate = new Date().toISOString();
      } else if (documentType === 'birthCertificate') {
        students[studentIndex].birthCertificate = reader.result;
        students[studentIndex].birthCertificateFileName = fileName;
        students[studentIndex].birthCertificateUploadDate = new Date().toISOString();
      }
      
      // Save updated students to localStorage
      saveStudentsToLocalStorage(students);
      resolve(students[studentIndex]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Function to remove student documents
const removeStudentDocument = (studentId, documentType) => {
  const students = loadStudentsFromLocalStorage();
  const studentIndex = students.findIndex(s => s.studentId === studentId);
  
  if (studentIndex !== -1) {
    const updatedStudent = { ...students[studentIndex] };
    
    switch(documentType) {
      case 'birthCertificate':
        delete updatedStudent.birthCertificate;
        delete updatedStudent.birthCertificateFileName;
        delete updatedStudent.birthCertificateUploadDate;
        break;
      case 'profileImage':
        delete updatedStudent.profileImage;
        delete updatedStudent.profileImageFileName;
        delete updatedStudent.profileImageUploadDate;
        break;
      default:
        return null;
    }
    
    students[studentIndex] = updatedStudent;
    saveStudentsToLocalStorage(students);
    return updatedStudent;
  }
  
  return null;
};

// Function to find a student by ID
const findStudentById = (studentId) => {
  const students = loadStudentsFromLocalStorage();
  return students.find(student => student.studentId === studentId);
};

export { 
  studentDatabase, 
  findStudentById, 
  updateStudentDocument, 
  removeStudentDocument 
};
