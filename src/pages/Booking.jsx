import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// Do not import main.css as all styles are now inline

export default function Booking() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:9000/api/booking", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to fetch booking history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  // --- Inline Styles as a JavaScript object ---
  const styles = {
    page: {
      padding: "20px",
      maxWidth: "900px",
      margin: "0 auto",
    },
    title: {
      textAlign: "center",
      color: "#333",
      marginBottom: "20px",
    },
    bookingList: {
      listStyle: "none",
      padding: "0",
      display: "grid",
      gap: "20px",
    },
    bookingCard: {
      backgroundColor: "#ffffff",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    },
    cardHeader: {
      display: "flex",
      alignItems: "center",
      padding: "15px",
      borderBottom: "1px solid #e0e0e0",
      backgroundColor: "#f7f7f7",
    },
    cardHeaderTitle: {
      margin: "0",
      fontSize: "1.2rem",
      color: "#555",
    },
    bookingTypeTag: {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: "50px",
      fontSize: "0.8rem",
      fontWeight: "bold",
      color: "#fff",
      marginRight: "15px",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    cardBody: {
      padding: "15px",
      lineHeight: "1.6",
    },
    cardBodyText: {
      margin: "0 0 8px",
      color: "#666",
    },
    cardBodyStrong: {
      color: "#333",
    },
    // Specific colors for booking types
    typeColors: {
      flight: { backgroundColor: "#007bff" },
      car: { backgroundColor: "#28a745" },
      stay: { backgroundColor: "#ffc107" },
    },
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <p>Loading your booking history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div style={styles.page}>
        <p>You have no booking data available.</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Your Booking History</h2>
      <ul style={styles.bookingList}>
        {bookings.map((b) => (
          <li key={b.id} style={styles.bookingCard}>
            <div style={styles.cardHeader}>
              <span style={{ ...styles.bookingTypeTag, ...styles.typeColors[b.type.toLowerCase()] }}>
                {b.type}
              </span>
              <h3 style={styles.cardHeaderTitle}>Booking ID: {b.id}</h3>
            </div>
            <div style={styles.cardBody}>
              <p style={styles.cardBodyText}>
                <strong style={styles.cardBodyStrong}>Date:</strong> {new Date(b.bookingDate).toLocaleDateString()}
              </p>
              <p style={styles.cardBodyText}>
                <strong style={styles.cardBodyStrong}>Persons:</strong> {b.numPersons || 1}
              </p>
              <p style={styles.cardBodyText}>
                <strong style={styles.cardBodyStrong}>Total:</strong> ₹{b.totalAmount}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}