import React, { useState, useEffect } from 'react';
import '../style/main.css';

export default function BookingDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Sample booking data
    const sampleBookings = [
      {
        id: 1,
        type: 'Flight',
        destination: 'New York to Los Angeles',
        date: '2025-12-15',
        status: 'Confirmed',
        price: '$299.99'
      },
      {
        id: 2,
        type: 'Hotel',
        destination: 'Grand Hotel, Chicago',
        date: '2025-12-20',
        status: 'Pending',
        price: '$189.99'
      },
      {
        id: 3,
        type: 'Car',
        destination: 'Toyota Camry, Houston',
        date: '2025-12-18',
        status: 'Confirmed',
        price: '$75.00'
      },
      {
        id: 4,
        type: 'Flight',
        destination: 'Boston to Miami',
        date: '2025-12-25',
        status: 'Cancelled',
        price: '$199.99'
      }
    ];
    setBookings(sampleBookings);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return '#28a745';
      case 'Pending': return '#ffc107';
      case 'Cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="page">
      <h1>📋 Booking Dashboard</h1>
      <p>Manage your travel bookings and reservations</p>

      <div style={{ marginTop: '2rem' }}>
        <h2>Your Bookings</h2>
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          {bookings.map(booking => (
            <div key={booking.id} style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '1.5rem',
              borderRadius: '15px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                  {booking.type}: {booking.destination}
                </h3>
                <p style={{ margin: '0.25rem 0', color: '#666' }}>
                  Date: {booking.date}
                </p>
                <p style={{ margin: '0.25rem 0', color: '#666' }}>
                  Price: {booking.price}
                </p>
              </div>
              <div style={{
                textAlign: 'right',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '0.5rem'
              }}>
                <span style={{
                  background: getStatusColor(booking.status),
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  {booking.status}
                </span>
                <button style={{
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <h2>Quick Stats</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            padding: '2rem',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <h3>4</h3>
            <p>Total Bookings</p>
          </div>
          <div style={{
            background: 'linear-gradient(45deg, #28a745, #20c997)',
            color: 'white',
            padding: '2rem',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <h3>2</h3>
            <p>Confirmed</p>
          </div>
          <div style={{
            background: 'linear-gradient(45deg, #ffc107, #fd7e14)',
            color: 'white',
            padding: '2rem',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <h3>1</h3>
            <p>Pending</p>
          </div>
          <div style={{
            background: 'linear-gradient(45deg, #dc3545, #e83e8c)',
            color: 'white',
            padding: '2rem',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <h3>1</h3>
            <p>Cancelled</p>
          </div>
        </div>
      </div>
    </div>
  );
}