import React, { useState } from 'react';
import { Star } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import './Home.css';
import Review from './Review';

const ButtonBadgesDetail = () => {
  const badgeOptions = [
    { qty: 10, pricePerItem: 1.2, packPrice: 12.0 },
    { qty: 25, pricePerItem: 1.0, packPrice: 25.0 },
    { qty: 50, pricePerItem: 0.85, packPrice: 42.5 },
  ];

  const imagePreviews = [
    "/assets/badges/badge1.jpg",
    "/assets/badges/badge2.jpg",
    "/assets/badges/badge3.jpg",
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const handlePrev = () => {
    if (mainImageIndex > 0) setMainImageIndex(mainImageIndex - 1);
  };

  const handleNext = () => {
    if (mainImageIndex < imagePreviews.length - 1) setMainImageIndex(mainImageIndex + 1);
  };



  return (
    <div className="responsive-container">
      <Header />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        {/* Product Info Section */}
        <div style={{ display: 'flex', marginTop: '40px', flexWrap: 'wrap', gap: '40px' }}>
          {/* Left: Product Image and Arrows */}
          <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={imagePreviews[mainImageIndex]}
                alt="Button Badge"
                style={{ width: '100%', borderRadius: '8px', marginBottom: '15px' }}
              />

              <button
                onClick={handlePrev}
                disabled={mainImageIndex === 0}
                style={{
                  position: 'absolute',
                  top: '45%',
                  left: '-15px',
                  fontSize: '24px',
                  background: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '50%',
                  width: '35px',
                  height: '35px',
                  cursor: mainImageIndex === 0 ? 'not-allowed' : 'pointer',
                  opacity: mainImageIndex === 0 ? 0.4 : 1,
                }}
              >
                ‹
              </button>

              <button
                onClick={handleNext}
                disabled={mainImageIndex === imagePreviews.length - 1}
                style={{
                  position: 'absolute',
                  top: '45%',
                  right: '-15px',
                  fontSize: '24px',
                  background: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '50%',
                  width: '35px',
                  height: '35px',
                  cursor: mainImageIndex === imagePreviews.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: mainImageIndex === imagePreviews.length - 1 ? 0.4 : 1,
                }}
              >
                ›
              </button>
            </div>

            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {imagePreviews.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Preview ${i + 1}`}
                  onClick={() => setMainImageIndex(i)}
                  style={{
                    width: '70px',
                    height: '70px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    border: mainImageIndex === i ? '2px solid #000' : '1px solid #ccc',
                    padding: '2px',
                    boxSizing: 'border-box',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>Custom Button Badges</h2>
            <p style={{ fontSize: '16px', color: '#555', marginBottom: '10px' }}>
              Stand out with custom button badges – perfect for events, branding, or fun giveaways!
            </p>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} color="#FFD700" fill="#FFD700" />
              ))}
              <span style={{ marginLeft: '8px', color: '#777' }}>(150+ reviews)</span>
            </div>

            {/* Quantity Options */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px' }}>Select Quantity:</h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {badgeOptions.map((opt, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    style={{
                      padding: '10px 15px',
                      borderRadius: '8px',
                      border: selectedIndex === index ? '2px solid #000' : '1px solid #ccc',
                      background: selectedIndex === index ? '#f0f0f0' : '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    {opt.qty} pcs
                  </button>
                ))}
              </div>
            </div>

            {/* Price Info */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '16px' }}>
                <strong>Price per item:</strong> ${badgeOptions[selectedIndex].pricePerItem.toFixed(2)}
              </p>
              <p style={{ fontSize: '16px' }}>
                <strong>Total:</strong> ${badgeOptions[selectedIndex].packPrice.toFixed(2)}
              </p>
            </div>

            <button
              style={{
                padding: '12px 25px',
                fontSize: '16px',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Description */}
        <section style={{ marginTop: '60px' }}>
          <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>Product Description</h3>
          <p style={{ fontSize: '16px', color: '#555' }}>
            Custom button badges are the perfect accessory for events, branding, promotions, or just for fun.
            Made with high-quality materials and a glossy finish, these badges feature safety pins and durable backs.
            <br /><br />
            Sizes available: 44mm, 58mm.
            <br />
            Minimum order: 10 pieces.
          </p>
        </section>

   <Review/>
      </div>

      <Footer />
    </div>
  );
};

export default ButtonBadgesDetail;
