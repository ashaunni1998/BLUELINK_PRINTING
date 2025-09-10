import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Star } from 'lucide-react';
import './Home.css';

const StickerDetails = () => {
  const images = [
    '/assets/Stationery/main.jpg',
    '/assets/Stationery/thumb1.jpg',
    '/assets/Stationery/thumb2.jpg',
    '/assets/Stationery/thumb3.jpg',
  ];

  const colors = ['Gold', 'Silver'];
  const shapes = ['Round', 'Rectangular'];
  const sizes = ['1" x 1"', '1.5" x 1.5"', '2" x 2"', '3" x 3"', '4" x 4"'];
  const format = 'Sheet';

  const quantities = [
    { label: '24 items', value: 24, pricePerItem: 0.85 },
    { label: '48 items', value: 48, pricePerItem: 0.80 },
    { label: '72 items', value: 72, pricePerItem: 0.78 },
    { label: '100 items', value: 100, pricePerItem: 0.75 },
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('Gold');
  const [selectedShape, setSelectedShape] = useState('Round');
  const [selectedSize, setSelectedSize] = useState('1" x 1"');
  const [selectedQty, setSelectedQty] = useState(quantities[0]);
  const isMobile = window.innerWidth <= 768;


  const totalPrice = (selectedQty.value * selectedQty.pricePerItem).toFixed(2);


    const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showReviews, setShowReviews] = useState(false);



  const handleSubmitReview = () => {
    if (rating === 0 || reviewText.trim() === '') {
      alert('Please provide both a star rating and a review.');
      return;
    }
    alert(`Review submitted!\nRating: ${rating} stars\nComment: ${reviewText}`);
    setRating(0);
    setReviewText('');
  };

  return (
    <div className="responsive-container">
   <Header />

<div
  style={{
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px',
    boxSizing: 'border-box',
    width: '100%'
  }}
>
  {/* Product Content */}
  <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 30, gap: 30 }}>
    {/* Left Image Gallery */}
    <div style={{ flex: 1, minWidth: 300 }}>
      <div style={{ position: 'relative' }}>
        <img
          src={images[currentImage]}
          alt="Sticker"
          style={{ width: '100%', borderRadius: 10 }}
        />
        <button
          onClick={() => setCurrentImage((currentImage - 1 + images.length) % images.length)}
          style={{
            position: 'absolute',
            top: '50%',
            left: 10,
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.8)',
            border: 'none',
            borderRadius: '50%',
            width: 30,
            height: 30,
            fontSize: 18,
            cursor: 'pointer'
          }}
        >
          ‹
        </button>
        <button
          onClick={() => setCurrentImage((currentImage + 1) % images.length)}
          style={{
            position: 'absolute',
            top: '50%',
            right: 10,
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.8)',
            border: 'none',
            borderRadius: '50%',
            width: 30,
            height: 30,
            fontSize: 18,
            cursor: 'pointer'
          }}
        >
          ›
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`thumb-${i}`}
            onClick={() => setCurrentImage(i)}
            style={{
              width: 60,
              height: 60,
              objectFit: 'cover',
              borderRadius: 6,
              border: i === currentImage ? '2px solid #00b388' : '1px solid #ccc',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>
    </div>

    {/* Right Panel */}
    <div
  style={{
    flex: 1.2,
    minWidth: 300,
    maxHeight: isMobile ? 'none' : 'calc(100vh - 200px)',
    overflowY: isMobile ? 'visible' : 'auto',
    paddingRight: 10
  }}
>

      <h2 style={{ fontSize: 24, marginBottom: 4 }}>Metallic Stickers</h2>
      <p style={{ color: '#00b388', fontWeight: 600, marginBottom: 8 }}>New</p>
      <p style={{ marginBottom: 16 }}>
        Just the right amount of shine with a smooth matte finish. Meet our luxuriously understated Metallic Stickers –
        they bring a hint of glam to everything they touch. Irresistibly eye-catching, tearable, and perfect for packages.
      </p>

      {/* Color */}
      <h4>Color</h4>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {colors.map((color) => (
          <div
            key={color}
            onClick={() => setSelectedColor(color)}
            style={{
              padding: '6px 14px',
              border: selectedColor === color ? '2px solid #00b388' : '1px solid #ccc',
              borderRadius: 20,
              cursor: 'pointer',
              backgroundColor: selectedColor === color ? '#f6fdfb' : '#fff'
            }}
          >
            {color}
          </div>
        ))}
      </div>

      {/* Shape */}
      <h4>Shape</h4>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {shapes.map((shape) => (
          <div
            key={shape}
            onClick={() => setSelectedShape(shape)}
            style={{
              padding: '6px 14px',
              border: selectedShape === shape ? '2px solid #00b388' : '1px solid #ccc',
              borderRadius: 20,
              cursor: 'pointer',
              backgroundColor: selectedShape === shape ? '#f6fdfb' : '#fff'
            }}
          >
            {shape}
          </div>
        ))}
      </div>

      {/* Size */}
      <h4>Size</h4>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        {sizes.map((size) => (
          <div
            key={size}
            onClick={() => setSelectedSize(size)}
            style={{
              padding: '6px 14px',
              border: selectedSize === size ? '2px solid #00b388' : '1px solid #ccc',
              borderRadius: 20,
              cursor: 'pointer',
              backgroundColor: selectedSize === size ? '#f6fdfb' : '#fff'
            }}
          >
            {size}
          </div>
        ))}
      </div>

      {/* Format */}
      <h4>Format</h4>
      <div
        style={{
          padding: '6px 14px',
          border: '2px solid #00b388',
          borderRadius: 20,
          display: 'inline-block',
          backgroundColor: '#f6fdfb',
          marginBottom: 20
        }}
      >
        {format}
      </div>

      {/* Quantity */}
      <h4>Quantity</h4>
      <select
        onChange={(e) => {
          const q = quantities.find((qty) => qty.value === parseInt(e.target.value));
          if (q) setSelectedQty(q);
        }}
        value={selectedQty.value}
        style={{
          padding: 10,
          borderRadius: 6,
          border: '1px solid #ccc',
          width: '100%',
          maxWidth: 250,
          marginBottom: 20
        }}
      >
        {quantities.map((q, i) => (
          <option key={i} value={q.value}>
            {q.label}
          </option>
        ))}
      </select>

      {/* Price */}
      <h3 style={{ marginBottom: 20 }}>
        Total price: ${totalPrice}{' '}
        <span style={{ fontSize: 14, color: '#888' }}>(${selectedQty.pricePerItem.toFixed(2)} per item)</span>
      </h3>

      {/* Start Customizing Button */}
      <button
        style={{
          background: '#00b388',
          color: '#fff',
          padding: '12px 24px',
          fontSize: 16,
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          marginBottom: 16
        }}
      >
        Start customizing
      </button>

      {/* Chat Box */}
      <div style={{ background: '#f0f8f5', padding: 16, borderRadius: 6 }}>
        <p style={{ marginBottom: 8 }}>
          <strong>Not sure where to start?</strong> <a href="#" style={{ color: '#00b388' }}>Let's chat</a>
        </p>
        <p style={{ fontSize: 14 }}>
          Looking for higher quantity orders or a unique shape? Our experts would love to help.
          <br />
          Email <a href="mailto:bluelink@gmail.com">bluelink@gmail.com</a> or call <strong>1-401-484-0988</strong>
        </p>
      </div>
    </div>
  </div>

  {/* Standalone Start Customizing Button */}
  {/* <button
    style={{
      background: '#00b388',
      color: '#fff',
      padding: '12px 24px',
      fontSize: 16,
      border: 'none',
      borderRadius: 6,
      cursor: 'pointer',
      marginTop: 40,
      marginBottom: 40
    }}
  >
    Start customizing
  </button> */}

  {/* Review Section */}
  <div
    style={{
      marginTop: 60,
      marginBottom: 100,
      padding: '0 16px',
      maxWidth: 600,
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      boxSizing: 'border-box'
    }}
  >
    <h3 style={{ fontSize: 20, marginBottom: 12 }}>Leave a Review</h3>

    {/* Star Rating */}
    <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={28}
          color={i < rating ? '#FFD700' : '#ccc'}
          fill={i < rating ? '#FFD700' : 'none'}
          style={{ cursor: 'pointer' }}
          onClick={() => setRating(i + 1)}
        />
      ))}
    </div>

    {/* Textarea */}
    <textarea
      value={reviewText}
      onChange={(e) => setReviewText(e.target.value)}
      placeholder="Write your review here..."
      rows={4}
      style={{
        width: '100%',
        padding: 12,
        fontSize: 16,
        borderRadius: 6,
        border: '1px solid #ccc',
        resize: 'none',
        marginBottom: 16
      }}
    />

    {/* Buttons */}
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <button
        onClick={handleSubmitReview}
        style={{
          backgroundColor: '#00b388',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '10px 20px',
          cursor: 'pointer',
          fontSize: 14
        }}
      >
        Submit Review
      </button>
      <button
        onClick={() => setShowReviews(!showReviews)}
        style={{
          backgroundColor: '#f0f0f0',
          color: '#333',
          border: '1px solid #ccc',
          borderRadius: 6,
          padding: '10px 20px',
          cursor: 'pointer',
          fontSize: 14
        }}
      >
        {showReviews ? 'Hide Reviews' : 'View Reviews'}
      </button>
    </div>

    {/* Placeholder for Reviews */}
    {showReviews && (
      <div style={{ marginTop: 20 }}>
        <p style={{ fontStyle: 'italic', color: '#666' }}>Customer reviews will be displayed here...</p>
      </div>
    )}
  </div>
</div>

<Footer />

    </div>
  );
};

export default StickerDetails;
