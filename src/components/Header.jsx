import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/main.css';

export default function Header() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">TravelSathi</Link>
      </div>
      <nav className="nav">
       
        <Link to="/stays">Stays</Link>
        <Link to="/flights">Flights</Link>
        <Link to="/cars">Cars</Link>
        <Link to="/booking">Booking</Link>
        <Link to="/payment">Payment</Link>

        {role === 'ADMIN' && <Link to="/admin">Admin Dashboard</Link>}
        {token ? (
          <button onClick={handleLogout} className="btn">Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}