import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import RegistrarPage from './components/RegistrarPage';
import StudentMasterList from './components/StudentMasterList';
import ClinicPage from './components/ClinicPage';
import CampusMinistry from './components/CampusMinistry';
import Guidance from './components/Guidance';
import StudentAffairs from './components/StudentAffairs';
import LandingPage from './components/LandingPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/registrar" element={<RegistrarPage />} />
          <Route path="/registrar/add-student" element={<RegistrarPage initialMode="add" />} />
          <Route path="/registrar/master-list" element={<StudentMasterList />} />
          <Route path="/student-master-list" element={<StudentMasterList />} />
          <Route path="/clinic" element={<ClinicPage />} />
          <Route path="/campus-ministry" element={<CampusMinistry />} />
          <Route path="/guidance" element={<Guidance />} />
          <Route path="/student-affairs" element={<StudentAffairs />} />
          <Route path="/ansgo" element={<div>ANSGO Page (Under Construction)</div>} />
          {/* Redirect old paths to new ones */}
          <Route path="/master-list" element={<Navigate to="/registrar/master-list" replace />} />
          <Route path="/add-student" element={<Navigate to="/registrar/add-student" replace />} />
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
