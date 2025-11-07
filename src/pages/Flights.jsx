import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

  const today = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:9000/api/flight', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFlights(response.data);
      } catch (error) {
        console.error('Failed to fetch flights:', error);
      }
    };
    fetchFlights();
  }, []);

  const handleBookClick = (flight) => {
    setSelectedFlight(flight);
    setErrorMessage('');
  };

  const confirmBooking = async () => {
    if (passengerCount <= 0 || isNaN(passengerCount)) {
      setErrorMessage('Please enter a valid number of passengers.');
      return;
    }

    if (!selectedFlight) {
      setErrorMessage('You have not selected a flight.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:9000/api/booking', {
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
      setErrorMessage('Failed to create booking.');
    }
  };

  const filteredFlights = flights.filter((flight) => {
    return (
      (!to || flight.toLocation.toLowerCase().includes(to.toLowerCase().trim())) &&
      (!from || flight.fromLocation.toLowerCase().includes(from.toLowerCase().trim())) &&
      (!filterAirline || flight.airline.toLowerCase().includes(filterAirline.toLowerCase())) &&
      (!filterAvailability || flight.availableSeats > 0)
    );
  });

  const sortedFlights = [...filteredFlights].sort((a, b) => {
    if (sortOrder === 'price') {
      return a.price - b.price;
    } else if (sortOrder === 'time') {
      return a.departure.localeCompare(b.departure);
    }
    return 0;
  });

  return (
    <div className="page">
      <div className="date-range-container">
        <input
          className="label-box"
          type="text"
          placeholder="From?"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          className="label-box"
          type="text"
          placeholder="To?"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          className="date-box"
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          min={today}
        />
      </div>

      <div className="filters">
        <label>Sort by:</label>
        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="price">Price</option>
          <option value="time">Departure Time</option>
        </select>
        <label>Filter by Airline:</label>
        <input
          type="text"
          placeholder="Airline"
          value={filterAirline}
          onChange={(e) => setFilterAirline(e.target.value)}
        />
        <label>
          Available Flights Only
          <input
            type="checkbox"
            checked={filterAvailability}
            onChange={() => setFilterAvailability(!filterAvailability)}
          />
        </label>
      </div>

      <h2>Book Your Flights</h2>

      <div className="card-list">
        {sortedFlights.length === 0 ? (
          <p>No flights found for the selected route.</p>
        ) : (
          sortedFlights.map((flight) => (
            <div key={flight.id} className="card">
              <img
                src={flight.image}
                alt={flight.route}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <p>{flight.route}</p>
              <p>Airline: {flight.airline}</p>
              <p>Price: ₹{flight.price}</p>
              <p>Duration: {flight.duration}</p>
              <p>Departure: {flight.departure}</p>
              <p>Arrival: {flight.arrival}</p>
              <p>{flight.availableSeats > 0 ? `Seats Available: ${flight.availableSeats}` : 'Sold Out'}</p>
              <button
                className="btn"
                onClick={() => handleBookClick(flight)}
                disabled={flight.availableSeats <= 0}
              >
                Book Flight
              </button>
            </div>
          ))
        )}
      </div>

      {selectedFlight && (
        <div className="modal">
          <div className="modal-content">
            <h3>Enter Number of Passengers</h3>
            <input
              type="number"
              min="1"
              max="10"
              value={passengerCount}
              onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)}
              className="label-box"
            />
            <div style={{ marginTop: '10px' }}>
              <button className="btn" onClick={confirmBooking}>Confirm</button>
              <button className="btn btn-outline" onClick={() => setSelectedFlight(null)}>Cancel</button>
            </div>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
}