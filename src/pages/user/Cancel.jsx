import React from 'react';

const Cancel = () => {
  return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <h1 style={{ color: 'red' }}>❌ Payment Cancelled</h1>
      <p>Your payment was not completed. You can try again later.</p>
    </div>
  );
};

export default Cancel;
