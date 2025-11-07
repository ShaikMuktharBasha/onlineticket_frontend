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

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:9000/api/car', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCars(response.data);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      }
    };
    fetchCars();
  }, []);

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
        totalAmount: Number(selectedCar.price) * Number(numPersons)
,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate('/payment', {
        state: {
          car: selectedCar,
          members: numPersons,
        },
      });
    } catch (error) {
      alert('Failed to create booking.');
    }
  };

  const filteredCars = cars.filter((car) => {
    return (
      (!filterAvailability || car.availability === 'Available') &&
      (!filterTransmission || car.transmission.toLowerCase().includes(filterTransmission.toLowerCase()))
    );
  });

  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortOrder === 'price') return a.price - b.price;
    if (sortOrder === 'seats') return b.seats - a.seats;
    return 0;
  });

  return (
    <div className="page">
      <div className="filters">
        <label>Sort by:</label>
        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="price">Price</option>
          <option value="seats">Seats</option>
        </select>
        <label>Transmission:</label>
        <input
          type="text"
          placeholder="e.g., Automatic"
          value={filterTransmission}
          onChange={(e) => setFilterTransmission(e.target.value)}
        />
        <label>
          Available Only
          <input
            type="checkbox"
            checked={filterAvailability}
            onChange={() => setFilterAvailability(!filterAvailability)}
          />
        </label>
      </div>

      <h2>Rent Your Car</h2>

      <div className="card-list">
        {sortedCars.length === 0 ? (
          <p>No cars match your criteria.</p>
        ) : (
          sortedCars.map((car) => (
            <div key={car.id} className="card">
              <img
                src={car.image}
                alt={car.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <p>{car.name}</p>
              <p>Price: ₹{car.price}/day</p>
              <p>Duration: {car.duration}</p>
              <p>Seats: {car.seats}</p>
              <p>Transmission: {car.transmission}</p>
              <p>Rating: ⭐{car.rating}</p>
              <p>{car.availability}</p>
              <button
                className="btn"
                onClick={() => handleBookClick(car)}
                disabled={car.availability !== 'Available'}
              >
                Book Car
              </button>
            </div>
          ))
        )}
      </div>

      {selectedCar && (
        <div className="modal">
          <div className="modal-content">
            <h3>Enter Number of Persons</h3>
            <input
              type="number"
              min="1"
              max="10"
              value={numPersons}
              onChange={(e) => setNumPersons(parseInt(e.target.value) || 1)}
              className="label-box"
            />
            <div style={{ marginTop: '10px' }}>
              <button className="btn" onClick={confirmBooking}>Confirm</button>
              <button className="btn btn-outline" onClick={() => setSelectedCar(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}