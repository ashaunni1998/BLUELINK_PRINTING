import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const dummyOrders = [
  { id: 'ORD001', product: 'Business Cards', date: '2025-07-20' },
  { id: 'ORD002', product: 'Flyers', date: '2025-07-25' },
  { id: 'ORD003', product: 'Posters', date: '2025-08-01' },
];

const Returns = () => {
  const [selectedOrder, setSelectedOrder] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOrder || !reason.trim()) {
      alert('Please select an order and enter a reason.');
      return;
    }

    // Simulate submit
    console.log('Return Submitted:', { selectedOrder, reason });
    setSubmitted(true);

    // Reset
    setSelectedOrder('');
    setReason('');
  };

  return (
      <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
        <div style={{ width: '90%', margin: '0 auto' }}>
              <Header/>
        <h2>📝 Returns & Refunds</h2>

        {submitted && (
          <div style={{
            backgroundColor: '#d4edda',
            padding: '15px',
            borderRadius: '5px',
            color: '#155724',
            marginBottom: '20px',
            border: '1px solid #c3e6cb'
          }}>
            ✅ Your return request has been submitted.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label>
            <strong>Select an Order:</strong>
            <select
              value={selectedOrder}
              onChange={(e) => setSelectedOrder(e.target.value)}
              required
              style={selectStyle}
            >
              <option value="">-- Choose an Order --</option>
              {dummyOrders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.id} - {order.product} ({order.date})
                </option>
              ))}
            </select>
          </label>

          <label>
            <strong>Reason for Return:</strong>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Enter your reason for return..."
              required
              style={textareaStyle}
            />
          </label>

          <button
            type="submit"
            style={{
              padding: '12px 20px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: 'fit-content'
            }}
          >
            Submit Request
          </button>
        </form>
      <Footer />
      </div>
    </div>
  );
};

const selectStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  marginTop: '5px'
};

const textareaStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  marginTop: '5px'
};

export default Returns;
