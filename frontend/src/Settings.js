import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Settings = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await response.json();
      setMessage(data.message);
      if (response.ok) {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setMessage('Error changing password');
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h2>Settings</h2>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/dashboard" style={{ margin: '0 10px' }}>Dashboard</Link>
          <Link to="/analytics" style={{ margin: '0 10px' }}>Analytics</Link>
          <Link to="/settings" style={{ margin: '0 10px' }}>Settings</Link>
        </nav>
        <h3>Change Password</h3>
        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Change Password</button>
        </form>
        {message && <p className={message.includes('successfully') ? '' : 'error'}>{message}</p>}
      </div>
    </div>
  );
};

export default Settings;