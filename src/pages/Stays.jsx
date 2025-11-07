import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../style/main.css';

export default function Stays() {
  const [to, setTo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stays, setStays] = useState([]);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchStays = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found. Please log in.');
          return;
        }
        const response = await axios.get('http://localhost:9000/api/stay', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStays(response.data);
      } catch (error) {
        console.error('Failed to fetch stays:', error);
        if (error.response?.status === 403) {
          console.error('Access denied. You must be logged in to view stays.');
        }
      }
    };
    fetchStays();
  }, []);

  const filteredStays = stays.filter((stay) =>
    !to || stay.location.toLowerCase().includes(to.toLowerCase())
  );

  return (
    <div className="page">
      <div className="date-range-container">
        <input
          className="label-box"
          type="text"
          placeholder="Where are you going ?"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          className="date-box"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={today}
        />
        <input
          className="date-box"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={today}
        />
      </div>

      <h2>Featured Stays</h2>
      <div className="card-list">
        {filteredStays.length === 0 ? (
          <p>No stays found for the selected location.</p>
        ) : (
          filteredStays.map((stay) => (
            <div key={stay.id} className="card">
              <img src={stay.image} alt={stay.name} />
              <h3>{stay.name}</h3>
              <p>{stay.location}</p>
              <p>⭐ {stay.rating} | ${stay.price}/night</p>
              <Link
                to={`/hotel/${encodeURIComponent(stay.name)}`}
                state={{ stay, startDate, endDate }}
              >
                <button className="btn">Book Now</button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}