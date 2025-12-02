import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/main.css';

export default function Cars() {
  const navigate = useNavigate();
  const [selectedCar, setSelectedCar] = useState(null);
  const [numPersons, setNumPersons] = useState(1);
  const [sortOrder, setSortOrder] = useState('price');
  const [filterAvailability, setFilterAvailability] = useState(false);
  const [filterTransmission, setFilterTransmission] = useState('');
  const [cars, setCars] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        // Fetch cars
        const carsResponse = await axios.get('http://localhost:9000/api/cars', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCars(carsResponse.data);

        // Fetch locations
        const locationsResponse = await axios.get('http://localhost:9000/api/locations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLocations(locationsResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCars = cars
    .filter((car) =>
      (!selectedLocation || car.location === selectedLocation) &&
      (!filterTransmission || car.carType.toLowerCase().includes(filterTransmission.toLowerCase())) &&
      (!filterAvailability || car.available)
    )
    .sort((a, b) => {
      if (sortOrder === 'price') return a.pricePerDay - b.pricePerDay;
      if (sortOrder === 'capacity') return b.seatingCapacity - a.seatingCapacity;
      return 0;
    });

  const handleBookClick = (car) => {
    setSelectedCar(car);
  };

  const confirmBooking = async () => {
    if (!selectedCar) return;
    if (numPersons <= 0 || isNaN(numPersons)) {
      alert('Enter valid number of passengers');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:9000/api/booking', {
        type: 'CAR',
        itemId: selectedCar.id,
        numPersons,
        totalAmount: Number(selectedCar.pricePerDay) * Number(numPersons)
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Car booked successfully!');
      setSelectedCar(null);
      navigate('/booking');
    } catch (error) {
      alert('Failed to book car. Please try again.');
    }
  };

  return (
    <div className="page">
      <h1>🚗 Find Your Perfect Ride</h1>

      <div className="filters" style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '1rem', borderRadius: '15px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🔄</span>
          <label style={{ fontWeight: '600' }}>Sort by:</label>
          <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
            <option value="price">💰 Price per day</option>
            <option value="capacity">👥 Seating capacity</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📍</span>
          <label style={{ fontWeight: '600' }}>Location:</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd' }}
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🚗</span>
          <label style={{ fontWeight: '600' }}>Car type:</label>
          <input
            type="text"
            placeholder="Filter by car type"
            value={filterTransmission}
            onChange={(e) => setFilterTransmission(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={filterAvailability}
            onChange={() => setFilterAvailability(!filterAvailability)}
          />
          <span>✅</span> Available cars only
        </label>
      </div>

      <h2>🏎️ Available Cars</h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading"></div>
          <p style={{ marginTop: '1rem', color: '#666' }}>Finding the perfect cars for you...</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          {filteredCars.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '3rem',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '15px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚗</div>
              <h3>No cars found</h3>
              <p style={{ color: '#666' }}>Try adjusting your filters</p>
            </div>
          ) : (
            filteredCars.map((car) => (
              <div key={car.id} className="card">
                <div style={{
                  height: '180px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '15px 15px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  margin: '-1.5rem -1.5rem 1rem -1.5rem'
                }}>
                  🚗
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🚗</span> {car.brand} {car.model}
                  </h3>
                  <span style={{
                    background: car.availableCars > 0 ? '#4CAF50' : '#f44336',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {car.availableCars > 0 ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span>🏷️</span>
                  <span>Type: {car.carType}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span>📍</span>
                  <span>Location: {car.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span>👥</span>
                  <span>Seats: {car.seatingCapacity}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span>🚗</span>
                  <span>Available: {car.availableCars} cars</span>
                </div>
                {car.description && (
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                    {car.description}
                  </p>
                )}
                <div className="price" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
                  <span>💰</span> ${car.pricePerDay}/day
                </div>
                <button
                  onClick={() => handleBookClick(car)}
                  disabled={car.availableCars <= 0}
                  style={{
                    width: '100%',
                    opacity: car.availableCars <= 0 ? 0.5 : 1,
                    cursor: car.availableCars <= 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>📅</span> {car.availableCars > 0 ? 'Book Car' : 'Unavailable'}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {selectedCar && (
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
              🚗 Confirm Car Booking
            </h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Number of Persons:
              </label>
              <input
                type="number"
                min="1"
                max={selectedCar.seatingCapacity}
                value={numPersons}
                onChange={(e) => setNumPersons(parseInt(e.target.value) || 1)}
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
              <strong>Total: ${selectedCar.pricePerDay * numPersons}</strong>
            </div>
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
                onClick={() => setSelectedCar(null)}
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