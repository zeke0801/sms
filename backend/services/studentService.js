const fs = require('fs').promises;
const path = require('path');

const DATABASE_PATH = path.join(__dirname, '../data/student-database.json');

class StudentService {
  async readDatabase() {
    try {
      const data = await fs.readFile(DATABASE_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading database:', error);
      throw error;
    }
  }

  async writeDatabase(data) {
    try {
      await fs.writeFile(DATABASE_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error('Error writing to database:', error);
      throw error;
    }
  }

  async getAllStudents() {
    try {
      const db = await this.readDatabase();
      return db.students;
    } catch (error) {
      console.error('Error in getAllStudents:', error);
      throw error;
    }
  }

  async getStudentById(studentId) {
    try {
      const db = await this.readDatabase();
      // Convert both to strings for comparison
      const student = db.students.find(student => String(student.id) === String(studentId));
      if (!student) {
        console.log('No student found with ID:', studentId);
        console.log('Available IDs:', db.students.map(s => s.id));
        return null;
      }
      return student;
    } catch (error) {
      console.error('Error in getStudentById:', error);
      throw error;
    }
  }

  async searchStudents(searchTerm) {
    try {
      const db = await this.readDatabase();
      const searchTermLower = searchTerm.toLowerCase();
      
      return db.students.filter(student => {
        return (
          student.id.toLowerCase().includes(searchTermLower) ||
          student.first_name.toLowerCase().includes(searchTermLower) ||
          student.last_name.toLowerCase().includes(searchTermLower) ||
          `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTermLower) ||
          student.grade.toLowerCase().includes(searchTermLower)
        );
      });
    } catch (error) {
      console.error('Error in searchStudents:', error);
      throw error;
    }
  }

  async createStudent(studentData) {
    try {
      const db = await this.readDatabase();
      const newStudent = {
        id: `2024-${11000 + db.students.length + 1}`,
        ...studentData
      };
      db.students.push(newStudent);
      await this.writeDatabase(db);
      return { success: true, studentId: newStudent.id };
    } catch (error) {
      console.error('Error in createStudent:', error);
      throw error;
    }
  }

  async updateStudent(studentId, updateData) {
    try {
      const db = await this.readDatabase();
      const index = db.students.findIndex(student => String(student.id) === String(studentId));
      
      if (index === -1) {
        console.log('No student found for update with ID:', studentId);
        return null;
      }
      
      db.students[index] = {
        ...db.students[index],
        ...updateData,
        id: db.students[index].id // Preserve the original ID
      };
      
      await this.writeDatabase(db);
      return { success: true, message: 'Student updated successfully' };
    } catch (error) {
      console.error('Error in updateStudent:', error);
      throw error;
    }
  }

  async getStudentsByGrade(gradeLevel) {
    try {
      const db = await this.readDatabase();
      return db.students.filter(student => student.grade === gradeLevel);
    } catch (error) {
      console.error('Error in getStudentsByGrade:', error);
      throw error;
    }
  }

  async updateMedicalInfo(studentId, medicalInfo) {
    try {
      const db = await this.readDatabase();
      const index = db.students.findIndex(student => String(student.id) === String(studentId));
      
      if (index === -1) {
        console.log('No student found for medical update with ID:', studentId);
        return null;
      }
      
      const medicalFields = ['height', 'weight', 'allergies', 'vaccinations', 'special_medical_conditions', 'present_medications'];
      
      medicalFields.forEach(field => {
        if (medicalInfo[field] !== undefined) {
          db.students[index][field] = medicalInfo[field];
        }
      });
      
      await this.writeDatabase(db);
      return { success: true, message: 'Medical information updated successfully' };
    } catch (error) {
      console.error('Error in updateMedicalInfo:', error);
      throw error;
    }
  }
}

module.exports = new StudentService();
