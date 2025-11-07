import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../style/payment.css';

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

  const handleSubmit = (e) => {
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

    alert(`Payment successful for ${name} - Total: ₹${totalAmount}`);
navigate('/booking');

  };

  return (
    <div className="payment-page">
      <h1>Complete Your Payment</h1>

      {/* Display Stay Details */}
      {stay && (
        <div className="card">
          <img
            src={stay.image}
            alt={stay.name}
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />
          <h2>{stay.name}</h2>
          <p><strong>Location:</strong> {stayLocation}</p>
          <p><strong>Price per person:</strong> ₹{price}</p>
          <p><strong>Number of Persons:</strong> {formData.numPersons}</p>
          <p><strong>Booking Date:</strong> {date}</p>
          <p><strong>Total Stay Cost:</strong> ₹{price * formData.numPersons}</p>
        </div>
      )}

      {/* Display Flight Details */}
      {flight && (
        <div className="card">
          <img
            src={flight.image}
            alt={flight.route}
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />
          <h3>Flight Booking</h3>
          <p><strong>Route:</strong> {flight.route}</p>
          <p><strong>Airline:</strong> {flight.airline}</p>
          <p><strong>Date of Travel:</strong> {date}</p>
          <p><strong>Passengers:</strong> {members}</p>
          <p><strong>Price per Ticket:</strong> ₹{flight.price}</p>
          <p><strong>Total Flight Cost:</strong> ₹{flight.price * members}</p>
        </div>
      )}

      {/* Display Car Details */}
      {car && (
        <div className="card">
          <img
            src={car.image || "https://via.placeholder.com/400x200?text=Car+Image+Not+Found"}
            alt={car.name}
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />
          <h3>Car Booking</h3>
          <p><strong>Car:</strong> {car.name}</p>
          <p><strong>Company:</strong> {car.company}</p>
          <p><strong>Days:</strong> {days}</p>
          <p><strong>Price per Day:</strong> ₹{car.pricePerDay}</p>
          <p><strong>Total Car Cost:</strong> ₹{car.pricePerDay * days}</p>
        </div>
      )}

      {/* Number of Persons - Only for Stay Bookings */}
      {stay && (
        <div className="form-group">
          <label htmlFor="numPersons">Number of Persons</label>
          <input
            type="number"
            id="numPersons"
            name="numPersons"
            value={formData.numPersons}
            readOnly // Make it read-only since it was set in HotelDetail.jsx
          />
        </div>
      )}

      <p><strong>Total Price: ₹{totalAmount}</strong></p>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cardName">Cardholder Name</label>
          <input
            type="text"
            id="cardName"
            name="cardName"
            value={formData.cardName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cardNumber">Card Number (12 digits)</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            required
            maxLength="12"
            placeholder="Enter 12-digit card number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="expiryDate">Expiration Date (MM/YY)</label>
          <input
            type="text"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            required
            maxLength="5"
            placeholder="MM/YY"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cvv">CVV</label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={formData.cvv}
            onChange={handleInputChange}
            required
            maxLength="3"
            placeholder="CVV"
          />
        </div>

        <button type="submit" className="btn">Pay Now</button>
      </form>

      <div className="card">
        <h3>Payment Summary</h3>
        <p><strong>Total Amount to Pay:</strong> ₹{totalAmount}</p>
      </div>
    </div>
  );
}