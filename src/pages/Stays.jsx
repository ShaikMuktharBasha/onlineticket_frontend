import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import '../style/main.css';

export default function Stays() {
  const [to, setTo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('price');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchStays = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found. Please log in.');
          return;
        }
        const response = await axios.get(`${API_BASE_URL}/api/hotels`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStays(response.data);
      } catch (error) {
        console.error('Failed to fetch stays:', error);
        if (error.response?.status === 403) {
          console.error('Access denied. You must be logged in to view stays.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStays();
  }, []);

  const filteredStays = stays
    .filter((stay) =>
      !to || stay.location.toLowerCase().includes(to.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="page">
      <h1>🏨 Find Your Perfect Stay</h1>

      <div className="date-range-container">
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#667eea',
            fontSize: '1.2rem'
          }}>📍</span>
          <input
            className="label-box"
            type="text"
            placeholder="Where are you going?"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={{ paddingLeft: '45px' }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#667eea',
            fontSize: '1.2rem'
          }}>📅</span>
          <input
            className="date-box"
            type="date"
            placeholder="Check-in"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={today}
            style={{ paddingLeft: '45px' }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#667eea',
            fontSize: '1.2rem'
          }}>📅</span>
          <input
            className="date-box"
            type="date"
            placeholder="Check-out"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || today}
            style={{ paddingLeft: '45px' }}
          />
        </div>
        <button className="search-btn">🔍 Search</button>
      </div>

      <div className="filters">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="price">Sort by Price</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      <h2>✨ Featured Stays</h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading"></div>
          <p style={{ marginTop: '1rem', color: '#666' }}>Finding amazing stays for you...</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          {filteredStays.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '3rem',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '15px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</div>
              <h3>No stays found</h3>
              <p style={{ color: '#666' }}>Try adjusting your search criteria</p>
            </div>
          ) : (
            filteredStays.map((stay) => (
              <div key={stay.id} className="card">
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '15px 15px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4rem',
                  margin: '-1.5rem -1.5rem 1rem -1.5rem'
                }}>
                  🏨
                </div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🏨</span> {stay.name}
                </h3>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📍</span> {stay.location}
                </p>
                <div className="rating" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>⭐</span> {stay.rating}/5
                </div>
                <div className="price" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>💰</span> ${stay.price}/night
                </div>
                <Link
                  to={`/hotel/${encodeURIComponent(stay.name)}`}
                  state={{ stay, startDate, endDate }}
                >
                  <button style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>📅</span> Book Now
                  </button>
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}