import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Stays from './pages/Stays';
import Flights from './pages/Flights';
import Cars from './pages/Cars';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import Login from './pages/Login';
import Register from './pages/Register';
import HotelDetail from './pages/HotelDetail';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stays" element={<Stays />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/hotel/:name" element={<HotelDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;