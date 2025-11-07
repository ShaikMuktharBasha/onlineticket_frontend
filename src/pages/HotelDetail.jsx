import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/main.css';

export default function HotelDetail() {
  const { name } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { stay, startDate, endDate } = location.state || {};
  const [numPersons, setNumPersons] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  // Mock gallery since the backend Stay entity doesn't have a gallery field
  const gallery = [
    stay?.image, // Use the main image as the first gallery image
     'https://cdn1.matadornetwork.com/blogs/1/2021/05/Baros-Maldives-resort-water-villas.jpeg',
      'https://www.travelplusstyle.com/wp-content/gallery/st-regis-vommuli/str4315gr-195103-overwater-villa-with-pool-deck-high.jpg',
      'https://www.theadventurousflashpacker.com/wp-content/uploads/2018/08/70E4F074-F932-4D78-9B8F-55E384E6984F.jpeg',
      'https://www.theluxevoyager.com/wp-content/uploads/2020/09/The-Nautilus-Maldives-Beach-Residence.jpg',
      'https://static.theceomagazine.net/wp-content/uploads/2019/01/22150808/Westin-Maldives-Overwater-Suite-Pool-Bathroom-01.jpg',
      'https://cdn.architecturendesign.net/wp-content/uploads/2014/08/Conrad-Rangai-34-2.jpg',
      'https://www.journeyera.com/wp-content/uploads/2022/01/BEST-OVERWATER-BUNGALOWS-MALDIVES-36-1200x800.jpg',
      'https://media.houseandgarden.co.uk/photos/63b40af32580e79a92857054/master/w_1600%2Cc_limit/luxury-water-villa-with-pool-outdoor_2000.jpeg',
      'https://media.cnn.com/api/v1/images/stellar/prod/171108222423-water-retreat-livingroom-with-view-by-stevie-mann.jpg?q=w_2000,h_824,x_0,y_0,c_fill/h_778',
      'https://tse3.mm.bing.net/th/id/OIP.mfLVH9yq4BlKYu1OyN5OMgHaHa?w=800&h=800&rs=1&pid=ImgDetMain',
      'https://www.gsmagazine.co.uk/wp-content/uploads/2019/09/Baglioni_Resort-_Maldives_Pool_Bar_vertical-754x1024.jpg',
      'https://tse3.mm.bing.net/th/id/OIP.oo3Q4IIPywAZ9oTVxQAYXgHaLH?w=1820&h=2730&rs=1&pid=ImgDetMain',
      'https://i.pinimg.com/736x/bb/23/9c/bb239c118e4c7a54c7b1f4e1c50230c5.jpg',
      'https://static.vecteezy.com/system/resources/previews/044/020/778/large_2x/modern-kitchen-island-with-panoramic-ocean-view-in-ultra-maldives-villa-photo.jpeg'
      

  ];

  const [showGallery, setShowGallery] = useState(false);

  const handleBook = async () => {
    if (numPersons <= 0 || isNaN(numPersons)) {
      setErrorMessage('Please enter a valid number of persons.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('Please log in to book a stay.');
        return;
      }

      await axios.post('http://localhost:9000/api/booking', {
        type: 'STAY',
        itemId: stay.id,
        numPersons,
        totalAmount: stay.price * numPersons,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate('/payment', {
        state: {
          stay,
          members: numPersons,
          date: startDate || new Date().toISOString().split('T')[0],
        },
      });
    } catch (error) {
      setErrorMessage('Failed to create booking.');
      console.error('Booking error:', error);
    }
  };

  if (!stay) {
    return <div className="page"><p>Hotel not found. Please go back and select a hotel.</p></div>;
  }

  const toggleGallery = () => {
    setShowGallery(!showGallery);
  };

  return (
    <div className="page">
      <h2>{stay.name}</h2>
      <div className="card">
        <img src={stay.image} alt={stay.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
        <p>Location: {stay.location}</p>
        <p>Rating: ⭐ {stay.rating}</p>
        <p>Price per night: ${stay.price}</p>
        {startDate && endDate && (
          <p>Booking Dates: {startDate} to {endDate}</p>
        )}
        <div>
          <label>Number of Persons:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={numPersons}
            onChange={(e) => setNumPersons(parseInt(e.target.value) || 1)}
            className="label-box"
          />
        </div>
        <p>Total Amount: ${stay.price * numPersons}</p>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button className="btn" onClick={handleBook}>Confirm Booking</button>

        {/* Gallery toggle button */}
        {gallery.length > 0 && (
          <button className="btn" onClick={toggleGallery}>
            {showGallery ? 'Hide Photos' : 'Show Photos'}
          </button>
        )}
      </div>

      {/* Simple Gallery View */}
      {showGallery && gallery.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Photo Gallery</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {gallery.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`gallery-${index}`}
                style={{ width: '100%', borderRadius: '10px', objectFit: 'cover' }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}