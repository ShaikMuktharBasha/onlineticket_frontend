import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../style/main.css';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const { stay, flight, car, members = 1, date, days = 1 } = location.state || {};

  // Map stay object to expected fields
  const name = stay?.name || flight?.route || car?.name || 'Unknown Booking';
  const price = stay?.price || flight?.price || 0;
  const stayLocation = stay?.location || '';

  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    numPersons: members, // Initialize with members from state
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!location.state) {
      navigate('/');
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const persons = parseInt(formData.numPersons, 10) || 1;
    const totalFlightAmount = flight ? flight.price * members : 0;
    const totalCarAmount = car ? car.pricePerDay * days : 0;
    const totalStayAmount = stay ? price * persons : 0;
    const finalAmount = totalFlightAmount + totalCarAmount + totalStayAmount;
    setTotalAmount(finalAmount);
  }, [flight, car, members, days, price, stay, formData.numPersons]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber' && !/^\d*$/.test(value)) return;
    if (name === 'expiryDate' && !/^\d{0,2}\/?\d{0,2}$/.test(value)) return;
    if (name === 'cvv' && !/^\d*$/.test(value)) return;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { cardName, cardNumber, expiryDate, cvv } = formData;

    if (!cardName || !cardNumber || !expiryDate || !cvv) {
      setError('Please fill in all fields');
      return;
    }

    if (cardNumber.length !== 12) {
      setError('Card number must be exactly 12 digits');
      return;
    }

    const [month, year] = expiryDate.split('/');
    const currentYear = new Date().getFullYear() % 100; // e.g., 25 for 2025
    const currentMonth = new Date().getMonth() + 1; // 1-12

    if (!month || !year || month < 1 || month > 12) {
      setError('Month must be between 01 and 12');
      return;
    }

    if (parseInt(year, 10) < 25) {
      setError('Year must be 2025 or later');
      return;
    }

    if (parseInt(year, 10) === currentYear && parseInt(month, 10) < currentMonth) {
      setError('The expiry date cannot be in the past');
      return;
    }

    setError('');
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // ✅ Add: Save booking to localStorage (history)
      const newBooking = {
        name,
        date,
        members,
        days,
        totalAmount,
        timestamp: new Date().toLocaleString(),
      };
      const history = JSON.parse(localStorage.getItem('bookingHistory')) || [];
      history.push(newBooking);
      localStorage.setItem('bookingHistory', JSON.stringify(history));

      setIsProcessing(false);
      alert(`Payment successful for ${name} - Total: $${totalAmount}`);
      navigate('/booking');
    }, 2000);
  };

  return (
    <div className="page">
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        💳 Secure Payment
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '2rem',
        alignItems: 'start'
      }}>

        {/* Booking Summary */}
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            📋 Booking Summary
          </h2>

          {/* Display Stay Details */}
          {stay && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{
                height: '150px',
                background: 'linear-gradient(135deg, #ffc107 0%, #ff8f00 100%)',
                borderRadius: '15px 15px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                margin: '-1.5rem -1.5rem 1rem -1.5rem'
              }}>
                🏨
              </div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🏨 {stay.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span>📍</span>
                <span>Location: {stayLocation}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span>💰</span>
                <span>Price per person: ${price}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span>👥</span>
                <span>Persons: {formData.numPersons}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span>📅</span>
                <span>Booking Date: {date}</span>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4CAF50', marginTop: '1rem' }}>
                Subtotal: ${price * formData.numPersons}
              </div>
            </div>
          )}

          {/* Display Flight Details */}
          {flight && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{
                height: '150px',
                background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                borderRadius: '15px 15px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                margin: '-1.5rem -1.5rem 1rem -1.5rem'
              }}>
                ✈️
              </div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ✈️ Flight Booking
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span>🛫</span>
                <span>Route: {flight.route}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span>🏢</span>
                <span>Airline: {flight.airline}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span>📅</span>
                <span>Travel Date: {date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span>👥</span>
                <span>Passengers: {members}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span>💰</span>
                <span>Price per ticket: ${flight.price}</span>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4CAF50', marginTop: '1rem' }}>
                Subtotal: ${flight.price * members}
              </div>
            </div>
          )}

          {/* Display Car Details */}
          {car && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{
                height: '150px',
                background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
                borderRadius: '15px 15px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                margin: '-1.5rem -1.5rem 1rem -1.5rem'
              }}>
                🚗
              </div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🚗 Car Rental
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span>🚗</span>
                <span>Car: {car.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span>🏢</span>
                <span>Company: {car.company}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span>📅</span>
                <span>Days: {days}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span>💰</span>
                <span>Price per day: ${car.pricePerDay}</span>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4CAF50', marginTop: '1rem' }}>
                Subtotal: ${car.pricePerDay * days}
              </div>
            </div>
          )}
        </div>

        {/* Payment Form */}
        <div style={{ position: 'sticky', top: '20px' }}>
          <div className="card">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              💳 Payment Details
            </h2>

            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '1.5rem',
              borderRadius: '15px',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Total Amount</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>${totalAmount}</div>
            </div>

            {error && (
              <div style={{
                background: '#ffebee',
                color: '#c62828',
                padding: '1rem',
                borderRadius: '10px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  👤 Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  💳 Card Number (12 digits)
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  required
                  maxLength="12"
                  placeholder="123456789012"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    📅 Expiry Date (MM/YY)
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    required
                    maxLength="5"
                    placeholder="MM/YY"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    🔒 CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    required
                    maxLength="3"
                    placeholder="123"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: isProcessing ? '#ccc' : 'linear-gradient(45deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => !isProcessing && (e.target.style.transform = 'scale(1.02)')}
                onMouseLeave={(e) => !isProcessing && (e.target.style.transform = 'scale(1)')}
              >
                {isProcessing ? (
                  <>
                    <div className="loading" style={{ width: '20px', height: '20px' }}></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <span>🔒</span> Pay Securely
                  </>
                )}
              </button>
            </form>

            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '10px',
              fontSize: '0.9rem',
              color: '#666'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span>🔒</span>
                <strong>Secure Payment</strong>
              </div>
              <p>Your payment information is encrypted and secure. We accept all major credit cards.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}