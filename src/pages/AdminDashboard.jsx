import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import '../style/admin.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stays, setStays] = useState([]);
  const [flights, setFlights] = useState([]);
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);

  // Form states
  const [newStay, setNewStay] = useState({
    name: '', location: '', rating: 0, price_per_night: 0, description: '', image: ''
  });
  const [newFlight, setNewFlight] = useState({
    airline: '', flight_number: '', origin: '', destination: '',
    departure_time: '', arrival_time: '', price: 0, available_seats: 0
  });
  const [newCar, setNewCar] = useState({
    model: '', brand: '', location: '', price_per_day: 0, car_type: '',
    description: '', seating_capacity: 0, available_cars: 0
  });

  const [editStay, setEditStay] = useState(null);
  const [editFlight, setEditFlight] = useState(null);
  const [editCar, setEditCar] = useState(null);
  const [showForm, setShowForm] = useState({ stay: false, flight: false, car: false });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [staysRes, flightsRes, carsRes, bookingsRes, usersRes, paymentsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/hotels`, { headers }),
        axios.get(`${API_BASE_URL}/api/flights`, { headers }),
        axios.get(`${API_BASE_URL}/api/cars`, { headers }),
        axios.get(`${API_BASE_URL}/api/bookings`, { headers }),
        axios.get(`${API_BASE_URL}/api/users`, { headers }),
        axios.get(`${API_BASE_URL}/api/payments`, { headers }),
      ]);
      setStays(staysRes.data);
      setFlights(flightsRes.data);
      setCars(carsRes.data);
      setBookings(bookingsRes.data);
      setUsers(usersRes.data);
      setPayments(paymentsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleAddStay = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/hotels`, newStay, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStays([...stays, { ...newStay, id: Date.now() }]);
      setNewStay({ name: '', location: '', rating: 0, price_per_night: 0, description: '', image: '' });
      setShowForm({ ...showForm, stay: false });
      fetchAllData();
    } catch (error) {
      console.error('Failed to add stay:', error);
    }
  };

  const handleAddFlight = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/flights`, newFlight, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlights([...flights, { ...newFlight, id: Date.now() }]);
      setNewFlight({
        airline: '', flight_number: '', origin: '', destination: '',
        departure_time: '', arrival_time: '', price: 0, available_seats: 0
      });
      setShowForm({ ...showForm, flight: false });
      fetchAllData();
    } catch (error) {
      console.error('Failed to add flight:', error);
    }
  };

  const handleAddCar = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/cars`, newCar, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars([...cars, { ...newCar, id: Date.now() }]);
      setNewCar({
        model: '', brand: '', location: '', price_per_day: 0, car_type: '',
        description: '', seating_capacity: 0, available_cars: 0
      });
      setShowForm({ ...showForm, car: false });
      fetchAllData();
    } catch (error) {
      console.error('Failed to add car:', error);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/${type}s/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAllData();
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
    }
  };

  const renderOverview = () => (
    <div className="overview-grid">
      <div className="stat-card">
        <div className="stat-icon">🏨</div>
        <div className="stat-content">
          <h3>{stays.length}</h3>
          <p>Total Hotels</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">✈️</div>
        <div className="stat-content">
          <h3>{flights.length}</h3>
          <p>Total Flights</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">🚗</div>
        <div className="stat-content">
          <h3>{cars.length}</h3>
          <p>Total Cars</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">📋</div>
        <div className="stat-content">
          <h3>{bookings.length}</h3>
          <p>Total Bookings</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">👥</div>
        <div className="stat-content">
          <h3>{users.length}</h3>
          <p>Total Users</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">💰</div>
        <div className="stat-content">
          <h3>${payments.reduce((sum, p) => sum + p.amount, 0)}</h3>
          <p>Total Revenue</p>
        </div>
      </div>
    </div>
  );

  const renderStays = () => (
    <div className="management-section">
      <div className="section-header">
        <h2>Hotel Management</h2>
        <button
          className="btn-primary"
          onClick={() => setShowForm({ ...showForm, stay: !showForm.stay })}
        >
          {showForm.stay ? 'Cancel' : '+ Add Hotel'}
        </button>
      </div>

      {showForm.stay && (
        <div className="form-card">
          <h3>Add New Hotel</h3>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Hotel Name"
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
              placeholder="Rating (1-5)"
              value={newStay.rating}
              onChange={(e) => setNewStay({ ...newStay, rating: parseFloat(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Price per night"
              value={newStay.price_per_night}
              onChange={(e) => setNewStay({ ...newStay, price_per_night: parseFloat(e.target.value) })}
            />
            <textarea
              placeholder="Description"
              value={newStay.description}
              onChange={(e) => setNewStay({ ...newStay, description: e.target.value })}
            />
            <input
              type="url"
              placeholder="Image URL"
              value={newStay.image}
              onChange={(e) => setNewStay({ ...newStay, image: e.target.value })}
            />
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleAddStay}>Add Hotel</button>
            <button className="btn-secondary" onClick={() => setShowForm({ ...showForm, stay: false })}>Cancel</button>
          </div>
        </div>
      )}

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Rating</th>
              <th>Price/Night</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stays.map((stay) => (
              <tr key={stay.id}>
                <td>{stay.name}</td>
                <td>{stay.location}</td>
                <td>{stay.rating} ⭐</td>
                <td>${stay.price_per_night}</td>
                <td>
                  <button className="btn-edit">Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete('hotel', stay.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFlights = () => (
    <div className="management-section">
      <div className="section-header">
        <h2>Flight Management</h2>
        <button
          className="btn-primary"
          onClick={() => setShowForm({ ...showForm, flight: !showForm.flight })}
        >
          {showForm.flight ? 'Cancel' : '+ Add Flight'}
        </button>
      </div>

      {showForm.flight && (
        <div className="form-card">
          <h3>Add New Flight</h3>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Airline"
              value={newFlight.airline}
              onChange={(e) => setNewFlight({ ...newFlight, airline: e.target.value })}
            />
            <input
              type="text"
              placeholder="Flight Number"
              value={newFlight.flight_number}
              onChange={(e) => setNewFlight({ ...newFlight, flight_number: e.target.value })}
            />
            <input
              type="text"
              placeholder="Origin"
              value={newFlight.origin}
              onChange={(e) => setNewFlight({ ...newFlight, origin: e.target.value })}
            />
            <input
              type="text"
              placeholder="Destination"
              value={newFlight.destination}
              onChange={(e) => setNewFlight({ ...newFlight, destination: e.target.value })}
            />
            <input
              type="datetime-local"
              placeholder="Departure Time"
              value={newFlight.departure_time}
              onChange={(e) => setNewFlight({ ...newFlight, departure_time: e.target.value })}
            />
            <input
              type="datetime-local"
              placeholder="Arrival Time"
              value={newFlight.arrival_time}
              onChange={(e) => setNewFlight({ ...newFlight, arrival_time: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              value={newFlight.price}
              onChange={(e) => setNewFlight({ ...newFlight, price: parseFloat(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Available Seats"
              value={newFlight.available_seats}
              onChange={(e) => setNewFlight({ ...newFlight, available_seats: parseInt(e.target.value) })}
            />
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleAddFlight}>Add Flight</button>
            <button className="btn-secondary" onClick={() => setShowForm({ ...showForm, flight: false })}>Cancel</button>
          </div>
        </div>
      )}

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Flight</th>
              <th>Route</th>
              <th>Departure</th>
              <th>Price</th>
              <th>Seats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight.id}>
                <td>{flight.airline} {flight.flight_number}</td>
                <td>{flight.origin} → {flight.destination}</td>
                <td>{new Date(flight.departure_time).toLocaleString()}</td>
                <td>${flight.price}</td>
                <td>{flight.available_seats}</td>
                <td>
                  <button className="btn-edit">Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete('flight', flight.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCars = () => (
    <div className="management-section">
      <div className="section-header">
        <h2>Car Management</h2>
        <button
          className="btn-primary"
          onClick={() => setShowForm({ ...showForm, car: !showForm.car })}
        >
          {showForm.car ? 'Cancel' : '+ Add Car'}
        </button>
      </div>

      {showForm.car && (
        <div className="form-card">
          <h3>Add New Car</h3>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Model"
              value={newCar.model}
              onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
            />
            <input
              type="text"
              placeholder="Brand"
              value={newCar.brand}
              onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
            />
            <input
              type="text"
              placeholder="Location"
              value={newCar.location}
              onChange={(e) => setNewCar({ ...newCar, location: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price per day"
              value={newCar.price_per_day}
              onChange={(e) => setNewCar({ ...newCar, price_per_day: parseFloat(e.target.value) })}
            />
            <select
              value={newCar.car_type}
              onChange={(e) => setNewCar({ ...newCar, car_type: e.target.value })}
            >
              <option value="">Select Type</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Sports">Sports</option>
              <option value="Electric">Electric</option>
            </select>
            <input
              type="number"
              placeholder="Seating Capacity"
              value={newCar.seating_capacity}
              onChange={(e) => setNewCar({ ...newCar, seating_capacity: parseInt(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Available Cars"
              value={newCar.available_cars}
              onChange={(e) => setNewCar({ ...newCar, available_cars: parseInt(e.target.value) })}
            />
            <textarea
              placeholder="Description"
              value={newCar.description}
              onChange={(e) => setNewCar({ ...newCar, description: e.target.value })}
            />
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleAddCar}>Add Car</button>
            <button className="btn-secondary" onClick={() => setShowForm({ ...showForm, car: false })}>Cancel</button>
          </div>
        </div>
      )}

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Car</th>
              <th>Location</th>
              <th>Type</th>
              <th>Price/Day</th>
              <th>Capacity</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                <td>{car.brand} {car.model}</td>
                <td>{car.location}</td>
                <td>{car.car_type}</td>
                <td>${car.price_per_day}</td>
                <td>{car.seating_capacity} seats</td>
                <td>{car.available_cars}</td>
                <td>
                  <button className="btn-edit">Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete('car', car.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🛠️ Admin Dashboard</h1>
        <p>Manage your travel platform efficiently</p>
      </div>

      <div className="admin-nav">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={activeTab === 'stays' ? 'active' : ''}
          onClick={() => setActiveTab('stays')}
        >
          🏨 Hotels
        </button>
        <button
          className={activeTab === 'flights' ? 'active' : ''}
          onClick={() => setActiveTab('flights')}
        >
          ✈️ Flights
        </button>
        <button
          className={activeTab === 'cars' ? 'active' : ''}
          onClick={() => setActiveTab('cars')}
        >
          🚗 Cars
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'stays' && renderStays()}
        {activeTab === 'flights' && renderFlights()}
        {activeTab === 'cars' && renderCars()}
      </div>
    </div>
  );
}
