import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Dashboard from './Dashboard';
import ClinicPage from './components/ClinicPage';
import RegistrarPage from './components/RegistrarPage';
import AddStudentPage from './components/AddStudentPage';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clinic" element={<ClinicPage />} />
        <Route path="/registrar" element={<RegistrarPage />} />
        <Route path="/registrar/add-student" element={<AddStudentPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
