import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Analytics = () => {
  const [stats, setStats] = useState({ total: 0, averageAge: 0, courses: {} });
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/students', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const students = await response.json();
          const total = students.length;
          const averageAge = total > 0 ? students.reduce((sum, s) => sum + (s.age || 0), 0) / total : 0;
          const courses = students.reduce((acc, s) => {
            acc[s.course] = (acc[s.course] || 0) + 1;
            return acc;
          }, {});
          setStats({ total, averageAge: averageAge.toFixed(1), courses });
        }
      } catch (err) {
        console.error('Error fetching stats', err);
      }
    };
    fetchStats();
  }, [token]);

  return (
    <div className="App">
      <div className="container">
        <h2>Analytics</h2>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/dashboard" style={{ margin: '0 10px' }}>Dashboard</Link>
          <Link to="/analytics" style={{ margin: '0 10px' }}>Analytics</Link>
          <Link to="/settings" style={{ margin: '0 10px' }}>Settings</Link>
        </nav>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '30px' }}>
          <div style={{ textAlign: 'center' }}>
            <h3>Total Students</h3>
            <p style={{ fontSize: '2em', color: '#667eea' }}>{stats.total}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3>Average Age</h3>
            <p style={{ fontSize: '2em', color: '#764ba2' }}>{stats.averageAge}</p>
          </div>
        </div>
        <h3>Course Distribution</h3>
        <ul>
          {Object.entries(stats.courses).map(([course, count]) => (
            <li key={course}>{course}: {count}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Analytics;