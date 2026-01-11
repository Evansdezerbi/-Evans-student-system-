import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import StudentForm from './StudentForm';
import StudentList from './StudentList';

const Dashboard = ({ onLogout }) => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);

  const token = localStorage.getItem('token');

  const fetchStudents = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/students?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        console.error('Error fetching students');
      }
    } catch (err) {
      console.error('Error fetching students', err);
    }
  }, [search, token]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleAdd = async (student) => {
    try {
      const response = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(student)
      });
      if (response.ok) {
        fetchStudents();
      } else {
        console.error('Error adding student');
      }
    } catch (err) {
      console.error('Error adding student', err);
    }
  };

  const handleEdit = async (student) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${student.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(student)
      });
      if (response.ok) {
        setEditingStudent(null);
        fetchStudents();
      } else {
        console.error('Error editing student');
      }
    } catch (err) {
      console.error('Error editing student', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        fetchStudents();
      } else {
        console.error('Error deleting student');
      }
    } catch (err) {
      console.error('Error deleting student', err);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h2>Student Records Management</h2>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/dashboard" style={{ margin: '0 10px' }}>Dashboard</Link>
          <Link to="/analytics" style={{ margin: '0 10px' }}>Analytics</Link>
          <Link to="/settings" style={{ margin: '0 10px' }}>Settings</Link>
          <button className="logout-btn" onClick={() => { localStorage.removeItem('token'); onLogout(); }}>Logout</button>
        </nav>
        <input
          type="text"
          placeholder="Search students"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <StudentForm onSubmit={editingStudent ? handleEdit : handleAdd} student={editingStudent} />
        <StudentList students={students} onEdit={setEditingStudent} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default Dashboard;