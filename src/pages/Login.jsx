import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/auth.css';

export default function Login() {
  const [showRoleSelection, setShowRoleSelection] = useState(true);
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleSelection(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const { email, password } = formData;

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:9000/api/user/login', {
        email,
        password,
        role: selectedRole,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      alert('Login successful!');
      if (response.data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError(error.response?.data || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-page" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="auth-box" style={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '12px',
        padding: '2rem',
        width: '300px',
        boxShadow: '0 0 20px rgba(0,0,0,0.3)',
        color: '#fff',
      }}>
        {showRoleSelection ? (
          <>
            <h2 style={{ color: '#fff' }}>Select Role</h2>
            <button className="btn" onClick={() => handleRoleSelect('ADMIN')} style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: '#2196f3',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
            }}>
              Admin
            </button>
            <button className="btn" onClick={() => handleRoleSelect('USER')} style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#4caf50',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
            }}>
              User
            </button>
          </>
        ) : (
          <>
            <h2 style={{ color: '#fff' }}>Login as {selectedRole}</h2>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '6px',
                border: 'none',
              }}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '6px',
                border: 'none',
              }}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button className="btn" onClick={handleLogin} style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#2196f3',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
            }}>
              Login
            </button>
            <button className="btn" onClick={() => setShowRoleSelection(true)} style={{
              width: '100%',
              padding: '10px',
              marginTop: '10px',
              backgroundColor: '#666',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
            }}>
              Back to Role Selection
            </button>
            <p style={{ marginTop: '1rem', fontSize: '14px' }}>
              Don't have an account?{' '}
              <span onClick={() => navigate('/register')} style={{ color: '#ffd700', cursor: 'pointer' }}>
                Register
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}