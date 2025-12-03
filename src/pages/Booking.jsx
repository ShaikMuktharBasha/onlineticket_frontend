import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from '../config';
import '../style/main.css';

export default function Booking() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to fetch booking history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const filteredBookings = bookings.filter(booking =>
    filterType === 'all' || booking.type.toLowerCase() === filterType
  );

  const getBookingIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'flight': return '✈️';
      case 'car': return '🚗';
      case 'stay': return '🏨';
      default: return '📅';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'cancelled': return '#f44336';
      default: return '#2196F3';
    }
  };

  if (loading) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="loading"></div>
        <p style={{ marginTop: '1rem', color: '#666' }}>Loading your booking history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ color: '#f44336' }}>Oops!</h2>
        <p style={{ color: '#666' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1rem',
            padding: '10px 20px',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          🔄 Try Again
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📅</div>
        <h2>No Bookings Yet</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Start your journey by booking flights, cars, or stays!</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/flights')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ✈️ Book Flights
          </button>
          <button
            onClick={() => navigate('/cars')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(45deg, #28a745, #20c997)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            🚗 Rent Cars
          </button>
          <button
            onClick={() => navigate('/stays')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(45deg, #ffc107, #ff8f00)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            🏨 Book Stays
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        📋 Your Booking History
      </h1>

      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '1rem',
        borderRadius: '15px',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <span style={{ fontWeight: '600' }}>🔍 Filter by type:</span>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            background: 'white'
          }}
        >
          <option value="all">All Bookings</option>
          <option value="flight">✈️ Flights</option>
          <option value="car">🚗 Cars</option>
          <option value="stay">🏨 Stays</option>
        </select>
        <span style={{ color: '#666', fontSize: '0.9rem' }}>
          Showing {filteredBookings.length} of {bookings.length} bookings
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="card" style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: getStatusColor(booking.status || 'confirmed'),
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
              {booking.status || 'Confirmed'}
            </div>

            <div style={{
              height: '120px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '15px 15px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              margin: '-1.5rem -1.5rem 1rem -1.5rem'
            }}>
              {getBookingIcon(booking.type)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                {getBookingIcon(booking.type)} {booking.type} Booking
              </h3>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>
                ID: {booking.id}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span>📅</span>
              <span>Booked on: {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span>👥</span>
              <span>Persons: {booking.numPersons || 1}</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: '#4CAF50',
              marginTop: '1rem'
            }}>
              <span>💰</span>
              <span>Total: ${booking.totalAmount}</span>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                📄 View Details
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  background: 'transparent',
                  color: '#667eea',
                  border: '2px solid #667eea',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                🖨️ Print
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && bookings.length > 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '15px',
          marginTop: '2rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3>No {filterType} bookings found</h3>
          <p style={{ color: '#666' }}>Try selecting a different filter</p>
        </div>
      )}
    </div>
  );
}