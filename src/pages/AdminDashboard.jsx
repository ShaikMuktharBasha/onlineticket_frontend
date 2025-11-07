import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/main.css';

export default function AdminDashboard() {
  const [stays, setStays] = useState([]);
  const [flights, setFlights] = useState([]);
  const [cars, setCars] = useState([]);
  const [newStay, setNewStay] = useState({ name: '', location: '', rating: 0, price: 0, image: '' });
  const [newFlight, setNewFlight] = useState({
    route: '', fromLocation: '', toLocation: '', airline: '', price: 0,
    duration: '', departure: '', arrival: '', availableSeats: 0, image: ''
  });
  const [newCar, setNewCar] = useState({
    name: '', price: 0, duration: '', availability: 'Available', seats: 0,
    transmission: '', rating: 0, image: ''
  });
  const [editStay, setEditStay] = useState(null);
  const [editFlight, setEditFlight] = useState(null);
  const [editCar, setEditCar] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staysRes, flightsRes, carsRes] = await Promise.all([
          axios.get('http://localhost:9000/api/admin/stay', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:9000/api/admin/flight', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:9000/api/admin/car', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setStays(staysRes.data);
        setFlights(flightsRes.data);
        setCars(carsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddStay = async () => {
    try {
      await axios.post('http://localhost:9000/api/admin/stay', newStay, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStays([...stays, { ...newStay, id: Date.now() }]);
      setNewStay({ name: '', location: '', rating: 0, price: 0, image: '' });
      alert('Stay added successfully!');
    } catch (error) {
      alert('Failed to add stay.');
    }
  };

  const handleAddFlight = async () => {
    try {
      await axios.post('http://localhost:9000/api/admin/flight', newFlight, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlights([...flights, { ...newFlight, id: Date.now() }]);
      setNewFlight({
        route: '', fromLocation: '', toLocation: '', airline: '', price: 0,
        duration: '', departure: '', arrival: '', availableSeats: 0, image: ''
      });
      alert('Flight added successfully!');
    } catch (error) {
      alert('Failed to add flight.');
    }
  };

  const handleAddCar = async () => {
    try {
      await axios.post('http://localhost:9000/api/admin/car', newCar, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars([...cars, { ...newCar, id: Date.now() }]);
      setNewCar({
        name: '', price: 0, duration: '', availability: 'Available', seats: 0,
        transmission: '', rating: 0, image: ''
      });
      alert('Car added successfully!');
    } catch (error) {
      alert('Failed to add car.');
    }
  };

  const handleUpdateStay = async () => {
    try {
      await axios.put(`http://localhost:9000/api/admin/stay/${editStay.id}`, editStay, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStays(stays.map((stay) => (stay.id === editStay.id ? editStay : stay)));
      setEditStay(null);
      alert('Stay updated successfully!');
    } catch (error) {
      alert('Failed to update stay.');
    }
  };

  const handleUpdateFlight = async () => {
    try {
      await axios.put(`http://localhost:9000/api/admin/flight/${editFlight.id}`, editFlight, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlights(flights.map((flight) => (flight.id === editFlight.id ? editFlight : flight)));
      setEditFlight(null);
      alert('Flight updated successfully!');
    } catch (error) {
      alert('Failed to update flight.');
    }
  };

  const handleUpdateCar = async () => {
    try {
      await axios.put(`http://localhost:9000/api/admin/car/${editCar.id}`, editCar, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(cars.map((car) => (car.id === editCar.id ? editCar : car)));
      setEditCar(null);
      alert('Car updated successfully!');
    } catch (error) {
      alert('Failed to update car.');
    }
  };

  const handleDeleteStay = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/api/admin/stay/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStays(stays.filter((stay) => stay.id !== id));
      alert('Stay deleted successfully!');
    } catch (error) {
      alert('Failed to delete stay.');
    }
  };

  const handleDeleteFlight = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/api/admin/flight/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlights(flights.filter((flight) => flight.id !== id));
      alert('Flight deleted successfully!');
    } catch (error) {
      alert('Failed to delete flight.');
    }
  };

  const handleDeleteCar = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/api/admin/car/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(cars.filter((car) => car.id !== id));
      alert('Car deleted successfully!');
    } catch (error) {
      alert('Failed to delete car.');
    }
  };

  return (
    <div className="page">
      <h2>Admin Dashboard</h2>

      {/* Manage Stays */}
      <h3>Manage Stays</h3>
      <div className="form">
        <input
          type="text"
          placeholder="Name"
          value={newStay.name}
          onChange={(e) => setNewStay({ ...newStay, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={newStay.location}
          onChange={(e) => setNewStay({ ...newStay, location: e.target.value })}
        />
        <input
          type="number"
          placeholder="Rating"
          value={newStay.rating}
          onChange={(e) => setNewStay({ ...newStay, rating: parseFloat(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newStay.price}
          onChange={(e) => setNewStay({ ...newStay, price: parseFloat(e.target.value) })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newStay.image}
          onChange={(e) => setNewStay({ ...newStay, image: e.target.value })}
        />
        <button className="btn" onClick={handleAddStay}>Add Stay</button>
      </div>
      <div className="card-list">
        {stays.map((stay) => (
          <div key={stay.id} className="card">
            {editStay && editStay.id === stay.id ? (
              <>
                <input
                  type="text"
                  value={editStay.name}
                  onChange={(e) => setEditStay({ ...editStay, name: e.target.value })}
                />
                <input
                  type="text"
                  value={editStay.location}
                  onChange={(e) => setEditStay({ ...editStay, location: e.target.value })}
                />
                <input
                  type="number"
                  value={editStay.rating}
                  onChange={(e) => setEditStay({ ...editStay, rating: parseFloat(e.target.value) })}
                />
                <input
                  type="number"
                  value={editStay.price}
                  onChange={(e) => setEditStay({ ...editStay, price: parseFloat(e.target.value) })}
                />
                <input
                  type="text"
                  value={editStay.image}
                  onChange={(e) => setEditStay({ ...editStay, image: e.target.value })}
                />
                <button className="btn" onClick={handleUpdateStay}>Save</button>
                <button className="btn btn-outline" onClick={() => setEditStay(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h3>{stay.name}</h3>
                <p>Location: {stay.location}</p>
                <p>Rating: {stay.rating}</p>
                <p>Price: ₹{stay.price}</p>
                <img src={stay.image} alt={stay.name} style={{ width: '100px' }} />
                <button className="btn" onClick={() => setEditStay(stay)}>Edit</button>
                <button className="btn btn-outline" onClick={() => handleDeleteStay(stay.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Manage Flights */}
      <h3>Manage Flights</h3>
      <div className="form">
        <input
          type="text"
          placeholder="Route"
          value={newFlight.route}
          onChange={(e) => setNewFlight({ ...newFlight, route: e.target.value })}
        />
        <input
          type="text"
          placeholder="From"
          value={newFlight.fromLocation}
          onChange={(e) => setNewFlight({ ...newFlight, fromLocation: e.target.value })}
        />
        <input
          type="text"
          placeholder="To"
          value={newFlight.toLocation}
          onChange={(e) => setNewFlight({ ...newFlight, toLocation: e.target.value })}
        />
        <input
          type="text"
          placeholder="Airline"
          value={newFlight.airline}
          onChange={(e) => setNewFlight({ ...newFlight, airline: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newFlight.price}
          onChange={(e) => setNewFlight({ ...newFlight, price: parseFloat(e.target.value) })}
        />
        <input
          type="text"
          placeholder="Duration"
          value={newFlight.duration}
          onChange={(e) => setNewFlight({ ...newFlight, duration: e.target.value })}
        />
        <input
          type="text"
          placeholder="Departure"
          value={newFlight.departure}
          onChange={(e) => setNewFlight({ ...newFlight, departure: e.target.value })}
        />
        <input
          type="text"
          placeholder="Arrival"
          value={newFlight.arrival}
          onChange={(e) => setNewFlight({ ...newFlight, arrival: e.target.value })}
        />
        <input
          type="number"
          placeholder="Available Seats"
          value={newFlight.availableSeats}
          onChange={(e) => setNewFlight({ ...newFlight, availableSeats: parseInt(e.target.value) })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newFlight.image}
          onChange={(e) => setNewFlight({ ...newFlight, image: e.target.value })}
        />
        <button className="btn" onClick={handleAddFlight}>Add Flight</button>
      </div>
      <div className="card-list">
        {flights.map((flight) => (
          <div key={flight.id} className="card">
            {editFlight && editFlight.id === flight.id ? (
              <>
                <input
                  type="text"
                  value={editFlight.route}
                  onChange={(e) => setEditFlight({ ...editFlight, route: e.target.value })}
                />
                <input
                  type="text"
                  value={editFlight.fromLocation}
                  onChange={(e) => setEditFlight({ ...editFlight, fromLocation: e.target.value })}
                />
                <input
                  type="text"
                  value={editFlight.toLocation}
                  onChange={(e) => setEditFlight({ ...editFlight, toLocation: e.target.value })}
                />
                <input
                  type="text"
                  value={editFlight.airline}
                  onChange={(e) => setEditFlight({ ...editFlight, airline: e.target.value })}
                />
                <input
                  type="number"
                  value={editFlight.price}
                  onChange={(e) => setEditFlight({ ...editFlight, price: parseFloat(e.target.value) })}
                />
                <input
                  type="text"
                  value={editFlight.duration}
                  onChange={(e) => setEditFlight({ ...editFlight, duration: e.target.value })}
                />
                <input
                  type="text"
                  value={editFlight.departure}
                  onChange={(e) => setEditFlight({ ...editFlight, departure: e.target.value })}
                />
                <input
                  type="text"
                  value={editFlight.arrival}
                  onChange={(e) => setEditFlight({ ...editFlight, arrival: e.target.value })}
                />
                <input
                  type="number"
                  value={editFlight.availableSeats}
                  onChange={(e) => setEditFlight({ ...editFlight, availableSeats: parseInt(e.target.value) })}
                />
                <input
                  type="text"
                  value={editFlight.image}
                  onChange={(e) => setEditFlight({ ...editFlight, image: e.target.value })}
                />
                <button className="btn" onClick={handleUpdateFlight}>Save</button>
                <button className="btn btn-outline" onClick={() => setEditFlight(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h3>{flight.route}</h3>
                <p>Airline: {flight.airline}</p>
                <p>Price: ₹{flight.price}</p>
                <p>Seats: {flight.availableSeats}</p>
                <img src={flight.image} alt={flight.route} style={{ width: '100px' }} />
                <button className="btn" onClick={() => setEditFlight(flight)}>Edit</button>
                <button className="btn btn-outline" onClick={() => handleDeleteFlight(flight.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Manage Cars */}
      <h3>Manage Cars</h3>
      <div className="form">
        <input
          type="text"
          placeholder="Name"
          value={newCar.name}
          onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newCar.price}
          onChange={(e) => setNewCar({ ...newCar, price: parseFloat(e.target.value) })}
        />
        <input
          type="text"
          placeholder="Duration"
          value={newCar.duration}
          onChange={(e) => setNewCar({ ...newCar, duration: e.target.value })}
        />
        <input
          type="text"
          placeholder="Availability"
          value={newCar.availability}
          onChange={(e) => setNewCar({ ...newCar, availability: e.target.value })}
        />
        <input
          type="number"
          placeholder="Seats"
          value={newCar.seats}
          onChange={(e) => setNewCar({ ...newCar, seats: parseInt(e.target.value) })}
        />
        <input
          type="text"
          placeholder="Transmission"
          value={newCar.transmission}
          onChange={(e) => setNewCar({ ...newCar, transmission: e.target.value })}
        />
        <input
          type="number"
          placeholder="Rating"
          value={newCar.rating}
          onChange={(e) => setNewCar({ ...newCar, rating: parseFloat(e.target.value) })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newCar.image}
          onChange={(e) => setNewCar({ ...newCar, image: e.target.value })}
        />
        <button className="btn" onClick={handleAddCar}>Add Car</button>
      </div>
      <div className="card-list">
        {cars.map((car) => (
          <div key={car.id} className="card">
            {editCar && editCar.id === car.id ? (
              <>
                <input
                  type="text"
                  value={editCar.name}
                  onChange={(e) => setEditCar({ ...editCar, name: e.target.value })}
                />
                <input
                  type="number"
                  value={editCar.price}
                  onChange={(e) => setEditCar({ ...editCar, price: parseFloat(e.target.value) })}
                />
                <input
                  type="text"
                  value={editCar.duration}
                  onChange={(e) => setEditCar({ ...editCar, duration: e.target.value })}
                />
                <input
                  type="text"
                  value={editCar.availability}
                  onChange={(e) => setEditCar({ ...editCar, availability: e.target.value })}
                />
                <input
                  type="number"
                  value={editCar.seats}
                  onChange={(e) => setEditCar({ ...editCar, seats: parseInt(e.target.value) })}
                />
                <input
                  type="text"
                  value={editCar.transmission}
                  onChange={(e) => setEditCar({ ...editCar, transmission: e.target.value })}
                />
                <input
                  type="number"
                  value={editCar.rating}
                  onChange={(e) => setEditCar({ ...editCar, rating: parseFloat(e.target.value) })}
                />
                <input
                  type="text"
                  value={editCar.image}
                  onChange={(e) => setEditCar({ ...editCar, image: e.target.value })}
                />
                <button className="btn" onClick={handleUpdateCar}>Save</button>
                <button className="btn btn-outline" onClick={() => setEditCar(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h3>{car.name}</h3>
                <p>Price: ₹{car.price}</p>
                <p>Seats: {car.seats}</p>
                <p>Availability: {car.availability}</p>
                <img src={car.image} alt={car.name} style={{ width: '100px' }} />
                <button className="btn" onClick={() => setEditCar(car)}>Edit</button>
                <button className="btn btn-outline" onClick={() => handleDeleteCar(car.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}