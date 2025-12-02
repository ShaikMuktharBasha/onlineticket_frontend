import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const styles = {
    container: {
      margin: 0,
      padding: 0,
      width: '100vw',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      overflowX: 'hidden',
    },
    heading: {
      fontSize: '3rem',
      fontWeight: 'bold',
      marginTop: '20px',
      background: 'linear-gradient(to right, #FF512F, #DD2476)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      animation: 'fadeInUp 1s ease-out',
    },
    paragraph: {
      fontSize: '1.2rem',
      margin: '10px 0 20px',
      color: '#333',
      animation: 'fadeInUp 1.2s ease-out',
    },
    image: {
      width: '80%',
      maxWidth: '800px',
      height: 'auto',
      display: 'block',
      objectFit: 'cover',
      margin: '20px auto',
      border: '3px solid #667eea',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      animation: 'fadeInUp 1.5s ease-out',
    },
    buttonContainer: {
      display: 'flex',
      gap: '20px',
      margin: '20px 0',
      flexWrap: 'wrap',
      justifyContent: 'center',
      animation: 'fadeInUp 1.8s ease-out',
    },
    button: {
      background: 'linear-gradient(45deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      padding: '15px 30px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      borderRadius: '25px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
      textDecoration: 'none',
      display: 'inline-block',
      animation: 'bounceIn 1s ease-out',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to TravelSathi! ✈️</h1>
      <p style={styles.paragraph}>Plan your perfect trip – flights, stays, cars and more.</p>
      <div style={styles.buttonContainer}>
        <Link to="/stays" className="hero-button">🏨 Book Stays</Link>
        <Link to="/flights" className="hero-button">✈️ Book Flights</Link>
        <Link to="/cars" className="hero-button">🚗 Rent Cars</Link>
      </div>
      <img
        src="https://www.pixelstalk.net/wp-content/uploads/2016/08/Free-Desktop-Travel-Backgrounds.jpg"
        alt="Travel"
        style={styles.image}
      />
    </div>
  );
}
