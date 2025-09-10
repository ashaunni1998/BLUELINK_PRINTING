import React, { useState } from 'react';
import { Star } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import './Home.css';
import Review from './Review';

const FlyerDetails = () => {
  const quantities = [
    { qty: 50, pricePerFlyer: 0.20, packPrice: 10.0 },
    { qty: 100, pricePerFlyer: 0.18, packPrice: 18.0, oldPrice: 20.0 },
    { qty: 250, pricePerFlyer: 0.16, packPrice: 40.0, oldPrice: 50.0 },
    { qty: 500, pricePerFlyer: 0.14, packPrice: 70.0, oldPrice: 90.0, recommended: true },
    { qty: 1000, pricePerFlyer: 0.12, packPrice: 120.0, oldPrice: 150.0 }
  ];

  const imageList = [
    '/assets/flyers/template1.jpg',
    '/assets/flyers/template2.jpg',
    '/assets/flyers/template3.jpg'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };






  return (
     <div className="responsive-container">
      <Header />

  <style>
  {`
    @media (max-width: 768px) {
       .details-container {
    flex-direction: column !important;
    height: auto !important;
    overflow: visible !important;
  }

      .image-section, .content-section {
        padding: 0 !important;
        width: 100% !important;
        height: auto !important;
      }

       .content-section {
    overflow-y: visible !important;
    height: auto !important;
  }
      .quantity-table th, .quantity-table td {
        font-size: 13px;
        padding: 8px;
      }

    
    }
  `}
</style>



      <div
  className="details-container"
  style={{
    display: 'flex',
    flexWrap: 'nowrap', // ensure horizontal layout
    padding: 20,
    gap: 20,
    height: '80vh', // give full height for scroll behavior
    overflow: 'hidden' // prevent container scroll
  }}
>

        {/* Left Image Section */}
        <div className="image-section" style={{ flex: 1, minWidth: 300, position: 'relative' }}>
          <img
            src={imageList[currentIndex]}
            alt={`Flyer ${currentIndex + 1}`}
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
    height: '100%' // so it fills the height and can scroll inside
  }}
>

          <h2 style={{ fontSize: '26px', marginBottom: 10 }}>Custom Flyers</h2>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>Spread the word with full-color promotional flyers</p>
          <p style={{ marginBottom: 10 }}>
            <strong>50</strong> flyers from <strong>$10.00</strong>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} color="#00b388" fill="#00b388" style={{ marginRight: 4 }} />
            ))}
            <span style={{ color: '#00b388', marginLeft: 8 }}>890 reviews</span>
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 600 }}>Make your message fly</h3>
          <p style={{ fontSize: 14, lineHeight: '1.6', color: '#333' }}>
            Flyers are the go-to tool for promoting events, products, and services. High-quality, double-sided printing ensures your message gets noticed.
          </p>
          <ul style={{ marginTop: 10, paddingLeft: 20, fontSize: 14 }}>
            <li>100 lb gloss text stock</li>
            <li>Full-color, front and back</li>
            <li>Standard 8.5" x 11" size</li>
          </ul>
          <p style={{ fontSize: 13, color: '#555', marginTop: 10 }}>
            Recyclable paper. Responsibly printed.
          </p>


          {/* Paper Type Selection */}
<div style={{ marginTop: 40 }}>
  <h4 style={{ fontWeight: 600, marginBottom: 16 }}>Choose your paper</h4>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
    {[
      {
        title: 'Original',
        description: ['16–17pt paper thickness', 'Available in matte or gloss', 'With a coating on one or both sides'],
        image: '/assets/postcards/original.jpg'
      },
      {
        title: 'Super',
        description: ['18pt paper thickness', 'Silky smooth, strong and durable Postcards', 'Shine-free, so there’s no glare'],
        image: '/assets/postcards/super.jpg'
      },
      {
        title: 'Luxe',
        description: ['32pt paper thickness', 'Choice of 8 colour seams', 'Uncoated and naturally textured Postcards'],
        image: '/assets/postcards/luxe.jpg'
      },
      {
        title: 'Special Finishes',
        description: ['18pt paper thickness', 'Raised Gold or Silver Foil', 'Strong Super paper, Soft Touch coating'],
        image: '/assets/postcards/special.jpg'
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
                  <th>Price per flyer</th>
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
                    <td>${q.pricePerFlyer.toFixed(2)}</td>
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
<Review/>
      <Footer />
    </div>
  );
};

export default FlyerDetails;
