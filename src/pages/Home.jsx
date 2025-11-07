import React from 'react';

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
    },
    paragraph: {
      fontSize: '1.2rem',
      margin: '10px 0 20px',
      color: '#333',
    },
    image: {
      width: '100vw',
      height: 'auto',
      display: 'block',
      objectFit: 'cover',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to TravelSathi!</h1>
      <p style={styles.paragraph}>Plan your perfect trip – flights, stays, cars and more.</p>
      <img
        src="https://www.pixelstalk.net/wp-content/uploads/2016/08/Free-Desktop-Travel-Backgrounds.jpg"
        alt="Travel"
        style={styles.image}
      />
    </div>
  );
}
