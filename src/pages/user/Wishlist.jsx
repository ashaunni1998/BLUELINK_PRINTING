import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Premium Business Cards',
      desc: '300gsm, Matte Finish, Double-sided',
      details: 'Size: 3.5" x 2"',
      price: 499,
      image: 'assets/images/products/business-card.jpg',
    },
    {
      id: 2,
      name: 'Thank You Cards',
      desc: '250gsm, Gloss Finish',
      details: 'Size: 4" x 6"',
      price: 299,
      image: 'assets/images/products/posters.jpg',
    },
  ]);

  const handleRemove = (id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const handleMoveToCart = (item) => {
    console.log('Moving to cart:', item);
    // You can implement add-to-cart API logic here
    handleRemove(item.id);
  };

  return (
    // <div style={{  backgroundColor: '#F9FAFB', padding: '2.5rem 1rem' }}>
      <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
    <div style={{ width: '90%', margin: '0 auto' }}>
      <Header />
      <div
        style={{
          maxWidth: '64rem',
          margin: '0 auto',
          backgroundColor: '#fff',
          borderRadius: '1rem',
          boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
          padding: '1.5rem',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937' }}>
          ❤️ Your Wishlist
        </h2>

        {wishlistItems.length === 0 ? (
          <p style={{ marginTop: '2rem', textAlign: 'center', color: '#6B7280' }}>
            Your wishlist is empty.
          </p>
        ) : (
          wishlistItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                gap: '1rem',
                borderBottom: '1px solid #E5E7EB',
                paddingBottom: '1.5rem',
                marginTop: '1.5rem',
                flexWrap: 'wrap',
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '7rem',
                  height: '7rem',
                  objectFit: 'cover',
                  borderRadius: '0.375rem',
                  border: '1px solid #E5E7EB',
                }}
              />
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{item.name}</h3>
                <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{item.desc}</p>
                <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{item.details}</p>
              </div>
              <div style={{ textAlign: 'right', minWidth: '140px' }}>
                <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1F2937' }}>
                  ₹{item.price}
                </p>
                <button
                  onClick={() => handleMoveToCart(item)}
                  style={{
                    fontSize: '0.875rem',
                    backgroundColor: '#22C55E',
                    color: '#fff',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    marginTop: '0.5rem',
                    cursor: 'pointer',
                  }}
                >
                  Add to Cart
                </button>
                <br />
                <button
                  onClick={() => handleRemove(item.id)}
                  style={{
                    fontSize: '0.875rem',
                    color: '#EF4444',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    marginTop: '0.5rem',
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
    </div>
    
  );
};

export default Wishlist;
