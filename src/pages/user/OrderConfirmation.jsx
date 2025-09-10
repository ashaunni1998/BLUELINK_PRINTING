import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId, date, items, total } = location.state || {};

  return (
     <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
       <div style={{ width: '90%', margin: '0 auto' }}>
             <Header/>
        <h2>🎉 Thank you for your order!</h2>

        {orderId ? (
          <>
            <p>Your order has been placed successfully.</p>
            <p><strong>Order ID:</strong> {orderId}</p>
            <p><strong>Date:</strong> {date}</p>

            <h3 style={{ marginTop: '30px' }}>Order Summary</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr>
                  <th style={cell}>Product</th>
                  <th style={cell}>Quantity</th>
                  <th style={cell}>Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td style={cell}>{item.name}</td>
                    <td style={cell}>{item.quantity}</td>
                    <td style={cell}>₹{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p style={{ marginTop: '20px', fontWeight: 'bold' }}>Total: ₹{total}</p>

            <Link to="/account?tab=orders">
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#007BFF',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                marginTop: '20px',
                cursor: 'pointer'
              }}>
                View My Orders
              </button>
            </Link>
          </>
        ) : (
          <p>No order data available.</p>
        )}
      <Footer />
      </div>
    </div>
    
  );
};

const cell = {
  border: '1px solid #ccc',
  padding: '10px',
  textAlign: 'left',
};

export default OrderConfirmation;
