import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import '../style/main.css';

export default function Flights() {
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [sortOrder, setSortOrder] = useState('price');
  const [errorMessage, setErrorMessage] = useState('');
  const [filterAirline, setFilterAirline] = useState('');
  const [filterAvailability, setFilterAvailability] = useState(false);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/flights`);
        setFlights(response.data);
      } catch (error) {
        console.error('Failed to fetch flights:', error);
        setError('Failed to load flights. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  const handleBookClick = (flight) => {
    setSelectedFlight(flight);
    setErrorMessage('');
  };

  const confirmBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/bookings`, {
        type: 'FLIGHT',
        itemId: selectedFlight.id,
        numPersons: passengerCount,
        totalAmount: selectedFlight.price * passengerCount,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate('/payment', {
        state: {
          flight: selectedFlight,
          members: passengerCount,
          date: departureDate || today,
        },
      });
    } catch (error) {
      console.error('Failed to create booking:', error);
      if (error.response?.status === 401) {
        setErrorMessage('Please login to book flights.');
        navigate('/login');
      } else {
        setErrorMessage('Failed to create booking. Please try again.');
      }
    }
  };

  const filteredFlights = flights.filter((flight) => {
    const flightDate = new Date(flight.departureTime).toISOString().split('T')[0];
    return (
      (!to || flight.destination.toLowerCase().includes(to.toLowerCase().trim())) &&
      (!from || flight.origin.toLowerCase().includes(from.toLowerCase().trim())) &&
      (!departureDate || flightDate === departureDate) &&
      (!filterAirline || flight.airline.toLowerCase().includes(filterAirline.toLowerCase())) &&
      (!filterAvailability || flight.availableSeats > 0)
    );
  });

  const sortedFlights = [...filteredFlights].sort((a, b) => {
    if (sortOrder === 'price') {
      return a.price - b.price;
    } else if (sortOrder === 'time') {
      return new Date(a.departureTime) - new Date(b.departureTime);
    }
    return 0;
  });

  return (
    <div className="page">
      <h1>✈️ Discover Amazing Flights</h1>

      <div className="date-range-container">
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#667eea',
            fontSize: '1.2rem'
          }}>🛫</span>
          <input
            className="label-box"
            type="text"
            placeholder="From?"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
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
          }}>🛬</span>
          <input
            className="label-box"
            type="text"
            placeholder="To?"
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
            placeholder="Departure Date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            min={today}
            style={{ paddingLeft: '45px' }}
          />
        </div>
        <button className="search-btn">🔍 Search Flights</button>
      </div>

      <div className="filters" style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '1rem', borderRadius: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🔄</span>
          <label style={{ fontWeight: '600' }}>Sort by:</label>
          <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
            <option value="price">💰 Price</option>
            <option value="time">⏰ Departure Time</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>✈️</span>
          <label style={{ fontWeight: '600' }}>Airline:</label>
          <input
            type="text"
            placeholder="Filter by airline"
            value={filterAirline}
            onChange={(e) => setFilterAirline(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={filterAvailability}
            onChange={() => setFilterAvailability(!filterAvailability)}
          />
          <span>✅</span> Available flights only
        </label>
      </div>

      <h2>🚀 Available Flights</h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading"></div>
          <p style={{ marginTop: '1rem', color: '#666' }}>Searching for the best flights...</p>
        </div>
      ) : error ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '15px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <h3>Error Loading Flights</h3>
          <p style={{ color: '#666' }}>{error}</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          {sortedFlights.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '3rem',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '15px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✈️</div>
              <h3>No flights found</h3>
              <p style={{ color: '#666' }}>Try adjusting your search criteria</p>
            </div>
          ) : (
            sortedFlights.map((flight) => (
              <div key={flight.id} className="card">
                <div style={{
                  height: '150px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '15px 15px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  margin: '-1.5rem -1.5rem 1rem -1.5rem'
                }}>
                  ✈️
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>✈️</span> {flight.airline}
                  </h3>
                  <span style={{
                    background: flight.availableSeats > 0 ? '#4CAF50' : '#f44336',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {flight.availableSeats > 0 ? 'Available' : 'Sold Out'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span>🛫</span>
                  <strong>{flight.origin}</strong>
                  <span style={{ color: '#667eea', fontSize: '1.2rem' }}>→</span>
                  <strong>{flight.destination}</strong>
                  <span>🛬</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span>🕐</span>
                  <span>Departure: {new Date(flight.departureTime).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span>🕐</span>
                  <span>Arrival: {new Date(flight.arrivalTime).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span>🎫</span>
                  <span>Seats Available: {flight.availableSeats}</span>
                </div>
                <div className="price" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
                  <span>💰</span> ${flight.price}
                </div>
                <button
                  onClick={() => handleBookClick(flight)}
                  disabled={flight.availableSeats <= 0}
                  style={{
                    width: '100%',
                    opacity: flight.availableSeats <= 0 ? 0.5 : 1,
                    cursor: flight.availableSeats <= 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>🎫</span> {flight.availableSeats > 0 ? 'Book Flight' : 'Sold Out'}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {selectedFlight && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '20px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: '#333' }}>
              ✈️ Confirm Flight Booking
            </h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Number of Passengers:
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={passengerCount}
                onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #667eea',
                  borderRadius: '10px',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
              <strong>Total: ${selectedFlight.price * passengerCount}</strong>
            </div>
            {errorMessage && (
              <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
                ⚠️ {errorMessage}
              </p>
            )}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={confirmBooking}
                style={{
                  flex: 1,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✅ Confirm
              </button>
              <button
                onClick={() => setSelectedFlight(null)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  color: '#667eea',
                  border: '2px solid #667eea',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
