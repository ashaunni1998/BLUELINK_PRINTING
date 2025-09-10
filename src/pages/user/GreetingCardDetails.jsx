import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Star } from 'lucide-react';
import './Home.css';

const GreetingCardDetails = () => {
  const imageList = [
    '/assets/Stationery/image1.jpg',
    '/assets/Stationery/image2.jpg',
    '/assets/Stationery/image3.jpg',
    '/assets/Stationery/image4.jpg',
    '/assets/Stationery/image5.jpg'
  ];

  const colors = ['Gold', 'Kraft', 'Red', 'Silver', 'White', 'White Luxe'];

  const quantities = [
    { qty: 25, pricePerCard: 0.32, packPrice: 8.0 },
    { qty: 50, pricePerCard: 0.32, packPrice: 16.0 },
    { qty: 75, pricePerCard: 0.32, packPrice: 24.0 },
    { qty: 100, pricePerCard: 0.32, packPrice: 32.0, recommended: true },
    { qty: 125, pricePerCard: 0.32, packPrice: 40.0 },
    { qty: 150, pricePerCard: 0.32, packPrice: 48.0 },
    { qty: 175, pricePerCard: 0.32, packPrice: 56.0 }
  ];

  const [selectedColor, setSelectedColor] = useState('Gold');
  const [selectedQty, setSelectedQty] = useState(25);
  const [currentImage, setCurrentImage] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const selectedPack = quantities.find(q => q.qty === selectedQty);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);

  const goToPrev = () => {
    setCurrentImage((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImage((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const handleSubmitReview = () => {
    if (review.trim() === '' || rating === 0) {
      alert('Please provide both a review and a rating.');
      return;
    }

    const newReview = {
      text: review,
      rating,
      date: new Date().toLocaleDateString()
    };

    setSubmittedReviews((prev) => [newReview, ...prev]);
    setReview('');
    setRating(0);
    alert('Review submitted successfully!');
  };

  return (
    <div className="responsive-container">
      <Header />

      {/* Full-width centered container */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
        boxSizing: 'border-box'
      }}>
        {/* Product Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 30,
            marginTop: 30,
            height: isMobile ? 'auto' : 'calc(100vh - 160px)',
            overflow: isMobile ? 'visible' : 'hidden'
          }}
        >
          {/* Left Image Section */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ position: 'relative' }}>
              <img
                src={imageList[currentImage]}
                alt="Greeting Card"
                style={{ width: '100%', borderRadius: 10 }}
              />
              <button onClick={goToPrev} style={{
                position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)',
                background: '#fff', border: '1px solid #ccc', borderRadius: '50%',
                width: 32, height: 32, fontSize: 18, cursor: 'pointer'
              }}>‹</button>
              <button onClick={goToNext} style={{
                position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)',
                background: '#fff', border: '1px solid #ccc', borderRadius: '50%',
                width: 32, height: 32, fontSize: 18, cursor: 'pointer'
              }}>›</button>
            </div>

            {/* Thumbnails */}
            <div style={{ display: 'flex', marginTop: 10, gap: 10, flexWrap: 'wrap' }}>
              {imageList.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Thumb ${i}`}
                  onClick={() => setCurrentImage(i)}
                  style={{
                    width: 60, height: 60, objectFit: 'cover',
                    borderRadius: 6, border: i === currentImage ? '2px solid #00b388' : '1px solid #ccc',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right Product Details */}
          <div style={{
            flex: 1.2,
            minWidth: 300,
            maxHeight: isMobile ? 'none' : 'calc(100vh - 160px)',
            overflowY: isMobile ? 'visible' : 'auto',
            paddingRight: 10
          }}>
            <h2 style={{ fontSize: 24, marginBottom: 4 }}>Small Envelopes</h2>
            <p style={{ color: '#666' }}>6.10” x 4.33” – Made from premium paper</p>
            <p><strong>25 Envelopes</strong> from <strong>$8.00</strong></p>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} color="#00b388" fill="#00b388" style={{ marginRight: 4 }} />
              ))}
              <span style={{ color: '#00b388', marginLeft: 8 }}>275 reviews</span>
            </div>

            <p style={{ marginBottom: 10 }}>
              Made with premium paper. Choose from red, gold, silver, white and White Luxe.
              Perfect for Standard Postcards, Invitations, Flyers or Greeting Cards.
            </p>

            <h4>Choose your color</h4>
            <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
              {colors.map((color) => (
                <div
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    padding: '8px 12px',
                    border: selectedColor === color ? '2px solid #00b388' : '1px solid #ccc',
                    borderRadius: 4,
                    cursor: 'pointer',
                    background: selectedColor === color ? '#f6fdfb' : '#fff'
                  }}
                >
                  {color}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 30 }}>
              <h4>Choose your quantity</h4>
              <table style={{ width: '100%', marginTop: 10, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: '#555' }}>
                    <th>Quantity</th>
                    <th>Price per card</th>
                    <th>Pack price</th>
                  </tr>
                </thead>
                <tbody>
                  {quantities.map((q, i) => (
                    <tr
                      key={i}
                      onClick={() => setSelectedQty(q.qty)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: selectedQty === q.qty ? '#e6fff8' : '#fff',
                        borderBottom: '1px solid #eee'
                      }}
                    >
                      <td style={{ padding: 10 }}>{q.qty}</td>
                      <td>${q.pricePerCard.toFixed(2)}</td>
                      <td>
                        ${q.packPrice.toFixed(2)}
                        {q.recommended && (
                          <span style={{
                            background: '#d0f2ea', color: '#00795c', fontSize: 12,
                            padding: '2px 6px', borderRadius: 4, marginLeft: 8
                          }}>
                            RECOMMENDED
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 30 }}>
              <h4>Summary</h4>
              <p><strong>Size:</strong> Small</p>
              <p><strong>Color:</strong> {selectedColor}</p>
              <p><strong>Envelope flap:</strong> Diamond</p>
              <p><strong>Quantity:</strong> {selectedQty}</p>
              <p><strong>Price:</strong> ${selectedPack.packPrice.toFixed(2)}</p>
            </div>

            <button style={{
              marginTop: 20, padding: '12px 24px',
              background: '#00b388', color: '#fff',
              border: 'none', borderRadius: 6, fontSize: 16,
              cursor: 'pointer', width: isMobile ? '100%' : 'auto'
            }}>
              Add to cart
            </button>
          </div>
        </div>

        {/* Review Section Centered */}
        <div style={{
          marginTop: 60,
          marginBottom: 100,
          maxWidth: 600,
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: '0 16px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <h4>Write a Review</h4>

          <div style={{ display: 'flex', marginBottom: 10 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{ cursor: 'pointer', marginRight: 4 }}
                color={(hoverRating || rating) >= star ? '#FFD700' : '#ccc'}
                fill={(hoverRating || rating) >= star ? '#FFD700' : 'none'}
              />
            ))}
          </div>

          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={3}
            placeholder="Write your review here..."
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 6,
              border: '1px solid #ccc',
              resize: 'vertical',
              fontSize: 14
            }}
          />

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
            <button
              onClick={handleSubmitReview}
              style={{
                background: '#00b388',
                color: '#fff',
                padding: '10px 16px',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              Submit Review
            </button>

            <button
              onClick={() => setShowReviews(!showReviews)}
              style={{
                background: '#f0f0f0',
                color: '#333',
                padding: '10px 16px',
                border: '1px solid #ccc',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              {showReviews ? 'Hide Reviews' : 'View Reviews'}
            </button>
          </div>

          {showReviews && (
            <div style={{ marginTop: 20 }}>
              {submittedReviews.length === 0 ? (
                <p>No reviews yet.</p>
              ) : (
                submittedReviews.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: 6,
                      padding: 12,
                      marginBottom: 10,
                      maxWidth: 500
                    }}
                  >
                    <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={16}
                          color={s <= r.rating ? '#FFD700' : '#ccc'}
                          fill={s <= r.rating ? '#FFD700' : 'none'}
                        />
                      ))}
                    </div>
                    <p style={{ margin: 0 }}>{r.text}</p>
                    <small style={{ color: '#777' }}>{r.date}</small>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GreetingCardDetails;
