import React, { useState } from 'react';
import { Star } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import './Home.css';

const PostcardDetails = () => {
  const quantities = [
    { qty: 25, pricePerCard: 0.80, packPrice: 20.0 },
    { qty: 50, pricePerCard: 0.75, packPrice: 37.5, oldPrice: 40.0 },
    { qty: 100, pricePerCard: 0.70, packPrice: 70.0, oldPrice: 80.0 },
    { qty: 200, pricePerCard: 0.65, packPrice: 130.0, oldPrice: 160.0, recommended: true },
    { qty: 500, pricePerCard: 0.60, packPrice: 300.0, oldPrice: 400.0 }
  ];

  const imageList = [
    `${process.env.PUBLIC_URL}/assets/postcards/template1.jpg`,
    `${process.env.PUBLIC_URL}/assets/postcards/template2.jpg`,
    `${process.env.PUBLIC_URL}/assets/postcards/template3.jpg`
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };


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
<style>
  {`
    @media (max-width: 768px) {
      .details-container {
        flex-direction: column;
        padding: 16px;
        height: auto !important;
        overflow: visible !important;
      }

      .image-section, .content-section {
        padding: 0 !important;
        width: 100% !important;
        position: static !important;
        top: auto !important;
      }

      .content-section {
        height: auto !important;
        overflow-y: visible !important;
      }

      .quantity-table th, .quantity-table td {
        font-size: 13px;
        padding: 8px;
      }

      .review-wrapper {
        max-width: 90%;
        margin: 0 auto;
        padding: 0 12px;
      }
    }
  `}
</style>



      <div
        className="details-container"
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          padding: 20,
          gap: 20,
          height: '80vh',
          overflow: 'hidden'
        }}
      >
        {/* Left Image Section */}
        <div className="image-section" style={{ flex: 1, minWidth: 300, position: 'relative' }}>
          <img
            src={imageList[currentIndex]}
            alt={`Postcards ${currentIndex + 1}`}
            style={{
              width: '100%',
              borderRadius: 10,
              transition: '0.3s ease-in-out',
              marginBottom: 10
            }}
          />
          <button onClick={goToPrev} style={{
            position: 'absolute', top: '45%', left: 10, transform: 'translateY(-50%)',
            background: '#fff', border: '1px solid #ccc', borderRadius: '50%',
            width: 32, height: 32, fontSize: 16, cursor: 'pointer', boxShadow: '0 0 5px rgba(0,0,0,0.2)'
          }}>‹</button>
          <button onClick={goToNext} style={{
            position: 'absolute', top: '45%', right: 10, transform: 'translateY(-50%)',
            background: '#fff', border: '1px solid #ccc', borderRadius: '50%',
            width: 32, height: 32, fontSize: 16, cursor: 'pointer', boxShadow: '0 0 5px rgba(0,0,0,0.2)'
          }}>›</button>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            {imageList.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Thumb ${i + 1}`}
                onClick={() => setCurrentIndex(i)}
                style={{
                  width: 60, height: 60, objectFit: 'cover', borderRadius: 6, cursor: 'pointer',
                  border: i === currentIndex ? '2px solid #00b388' : '1px solid #ccc',
                  boxShadow: i === currentIndex ? '0 0 5px rgba(0,179,136,0.4)' : 'none'
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Content Section */}
        <div
          className="content-section"
          style={{
            flex: 1.2,
            paddingLeft: 40,
            minWidth: 300,
            overflowY: 'auto',
            paddingRight: 16,
            height: '100%'
          }}
        >
          <h2 style={{ fontSize: '26px', marginBottom: 10 }}>Personalized Postcards</h2>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>Glossy, full-color postcards for any occasion</p>
          <p style={{ marginBottom: 10 }}>
            <strong>25</strong> cards from <strong>$20.00</strong>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} color="#00b388" fill="#00b388" style={{ marginRight: 4 }} />
            ))}
            <span style={{ color: '#00b388', marginLeft: 8 }}>1240 reviews</span>
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 600 }}>Send a message that sticks</h3>
          <p style={{ fontSize: 14, lineHeight: '1.6', color: '#333' }}>
            Whether you're promoting a business, announcing an event, or just saying hello,
            custom postcards are a vibrant and effective way to connect.
          </p>
          <ul style={{ marginTop: 10, paddingLeft: 20, fontSize: 14 }}>
            <li>Premium 14pt glossy cardstock</li>
            <li>Full-color, double-sided printing</li>
            <li>Standard 4"x6" size</li>
          </ul>
          <p style={{ fontSize: 13, color: '#555', marginTop: 10 }}>
            Eco-friendly materials. Made with FSC® certified paper.
          </p>

          {/* Paper Type Selection */}
          <div style={{ marginTop: 40 }}>
            <h4 style={{ fontWeight: 600, marginBottom: 16 }}>Choose your paper</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              {[
                {
                  title: 'Original',
                  description: ['16–17pt paper thickness', 'Available in matte or gloss', 'With a coating on one or both sides'],
                  image: `${process.env.PUBLIC_URL}/assets/postcards/original.jpg`
                },
                {
                  title: 'Super',
                  description: ['18pt paper thickness', 'Silky smooth, strong and durable Postcards', 'Shine-free, so there’s no glare'],
                  image: `${process.env.PUBLIC_URL}/assets/postcards/super.jpg`
                },
                {
                  title: 'Luxe',
                  description: ['32pt paper thickness', 'Choice of 8 colour seams', 'Uncoated and naturally textured Postcards'],
                  image: `${process.env.PUBLIC_URL}/assets/postcards/luxe.jpg`
                },
                {
                  title: 'Special Finishes',
                  description: ['18pt paper thickness', 'Raised Gold or Silver Foil', 'Strong Super paper, Soft Touch coating'],
                  image: `${process.env.PUBLIC_URL}/assets/postcards/special.jpg`
                }
              ].map((item, i) => (
                <div key={i} style={{ flex: '1 1 220px', border: '1px solid #ccc', borderRadius: 10, padding: 16 }}>
                  <img src={item.image} alt={item.title} style={{ width: '100%', borderRadius: 6, marginBottom: 10 }} />
                  <h5 style={{ marginBottom: 10 }}>{item.title}</h5>
                  <ul style={{ fontSize: 14, paddingLeft: 18 }}>
                    {item.description.map((line, j) => (
                      <li key={j}>{line}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity Table */}
          <div style={{ marginTop: 30 }}>
            <h4 style={{ fontWeight: 600 }}>Choose your quantity</h4>
            <table className="quantity-table" style={{ width: '100%', marginTop: 10, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', fontSize: 14, color: '#555' }}>
                  <th>Quantity</th>
                  <th>Price per postcard</th>
                  <th>Pack price</th>
                </tr>
              </thead>
              <tbody>
                {quantities.map((q, index) => (
                  <tr key={index} style={{
                    background: q.recommended ? '#f6fdfb' : '#fff',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer'
                  }}>
                    <td style={{ padding: 10 }}>{q.qty}</td>
                    <td>${q.pricePerCard.toFixed(2)}</td>
                    <td>
                      ${q.packPrice.toFixed(2)}{' '}
                      {q.oldPrice && (
                        <span style={{
                          textDecoration: 'line-through',
                          color: '#999',
                          fontSize: 12,
                          marginLeft: 4
                        }}>
                          ${q.oldPrice.toFixed(2)}
                        </span>
                      )}
                      {q.recommended && (
                        <span style={{
                          background: '#d0f2ea',
                          color: '#00795c',
                          fontSize: 12,
                          padding: '2px 6px',
                          borderRadius: 4,
                          marginLeft: 6
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

          {/* Continue Button */}
          <div style={{ marginTop: 30 }}>
            <button style={{
              background: '#00b388',
              color: '#fff',
              padding: '12px 24px',
              border: 'none',
              borderRadius: 6,
              fontSize: 16,
              cursor: 'pointer',
              width: '100%',
              maxWidth: 300
            }}>
              Continue
            </button>
          </div>
        </div>
      </div>
{/* Review Section */}

<div className="review-wrapper" style={{
  marginTop: 60,
  paddingBottom: 100,
  maxWidth: 600,
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: '0 16px 100px 16px'
}}>

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
      maxWidth: 600,
      padding: 12,
      fontSize: 16,
      borderRadius: 6,
      border: '1px solid #ccc',
      resize: 'none',
      marginBottom: 16
    }}
  />

  {/* Buttons */}
  <div style={{
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap'
  }}>
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

      <Footer />
    </div>
  );
};

export default PostcardDetails;
