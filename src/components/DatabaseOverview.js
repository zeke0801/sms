import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DatabaseOverview.css';

const API_BASE_URL = 'http://localhost:5001/api';

const DatabaseOverview = () => {
  const navigate = useNavigate();
  const [dbData, setDbData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    fetchDatabaseOverview();
  }, []);

  const fetchDatabaseOverview = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/database-overview`);
      setDbData(response.data);
      if (Object.keys(response.data).length > 0) {
        setSelectedTable(Object.keys(response.data)[0]);
      }
    } catch (err) {
      console.error('Error fetching database overview:', err);
      setError('Failed to fetch database overview');
    } finally {
      setLoading(false);
    }
  };

  const renderTableData = (tableName, data) => {
    if (!data || data.length === 0) return null;

    const columns = Object.keys(data[0]);

    return (
      <div className="table-container">
        <h3>{tableName}</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {columns.map(column => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {columns.map(column => (
                    <td key={column}>
                      {typeof row[column] === 'object' 
                        ? JSON.stringify(row[column]) 
                        : String(row[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="database-overview loading">Loading database overview...</div>;
  }

  if (error) {
    return <div className="database-overview error">{error}</div>;
  }

  return (
    <div className="database-overview">
      <header className="overview-header">
        <h1>Database Overview</h1>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Dashboard
        </button>
      </header>

      <div className="overview-content">
        <div className="table-selector">
          <h2>Tables</h2>
          <ul>
            {Object.keys(dbData).map(tableName => (
              <li 
                key={tableName}
                className={selectedTable === tableName ? 'selected' : ''}
                onClick={() => setSelectedTable(tableName)}
              >
                {tableName} ({dbData[tableName].length} records)
              </li>
            ))}
          </ul>
        </div>

        <div className="table-view">
          {selectedTable && renderTableData(selectedTable, dbData[selectedTable])}
        </div>
      </div>
    </div>
  );
};

export default DatabaseOverview;
