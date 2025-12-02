import React, { useState, useEffect } from 'react';
import '../style/main.css';

export default function PaymentDashboard() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Sample payment data
    const samplePayments = [
      {
        id: 1,
        bookingType: 'Flight',
        description: 'New York to Los Angeles',
        amount: '$299.99',
        date: '2025-12-10',
        status: 'Completed',
        method: 'Credit Card'
      },
      {
        id: 2,
        bookingType: 'Hotel',
        description: 'Grand Hotel, Chicago - 3 nights',
        amount: '$189.99',
        date: '2025-12-08',
        status: 'Completed',
        method: 'PayPal'
      },
      {
        id: 3,
        bookingType: 'Car',
        description: 'Toyota Camry, Houston - 2 days',
        amount: '$150.00',
        date: '2025-12-05',
        status: 'Completed',
        method: 'Credit Card'
      },
      {
        id: 4,
        bookingType: 'Flight',
        description: 'Boston to Miami',
        amount: '$199.99',
        date: '2025-12-01',
        status: 'Refunded',
        method: 'Credit Card'
      },
      {
        id: 5,
        bookingType: 'Hotel',
        description: 'Beach Resort, Miami - 5 nights',
        amount: '$450.00',
        date: '2025-11-28',
        status: 'Completed',
        method: 'Bank Transfer'
      }
    ];
    setPayments(samplePayments);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#28a745';
      case 'Pending': return '#ffc107';
      case 'Refunded': return '#dc3545';
      case 'Failed': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const totalSpent = payments
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '')), 0);

  return (
    <div className="page">
      <h1>💳 Payment Dashboard</h1>
      <p>Track your payment history and transactions</p>

      <div style={{ marginTop: '2rem' }}>
        <div style={{
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          color: 'white',
          padding: '2rem',
          borderRadius: '15px',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h2>Total Spent</h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
            ${totalSpent.toFixed(2)}
          </p>
          <p>This month</p>
        </div>

        <h2>Payment History</h2>
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          {payments.map(payment => (
            <div key={payment.id} style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '1.5rem',
              borderRadius: '15px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                  {payment.bookingType}: {payment.description}
                </h3>
                <p style={{ margin: '0.25rem 0', color: '#666' }}>
                  Date: {payment.date}
                </p>
                <p style={{ margin: '0.25rem 0', color: '#666' }}>
                  Method: {payment.method}
                </p>
              </div>
              <div style={{
                textAlign: 'right',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '0.5rem'
              }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0', color: '#333' }}>
                  {payment.amount}
                </p>
                <span style={{
                  background: getStatusColor(payment.status),
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2>Payment Methods</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '1.5rem',
            borderRadius: '15px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3>💳 Credit Card</h3>
            <p>**** **** **** 1234</p>
            <p>Expires: 12/27</p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '1.5rem',
            borderRadius: '15px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3>🅿️ PayPal</h3>
            <p>user@example.com</p>
            <p>Verified</p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '1.5rem',
            borderRadius: '15px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3>🏦 Bank Transfer</h3>
            <p>Account: ****5678</p>
            <p>Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}