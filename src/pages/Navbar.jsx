import { Link } from 'react-router-dom';
import '../style/main.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1>TravelSathi</h1>
      <ul>
        <li><Link to="/Home">Home</Link></li>
        <li><Link to="/stays">Stays</Link></li>
        <li><Link to="/flights">Flights</Link></li>
        <li><Link to="/cars">Cars</Link></li>
        <li><Link to="/payment">Payment</Link></li>
      </ul>
    </nav>
  );
}