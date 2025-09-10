import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import { useParams } from 'react-router-dom';
import API_BASE_URL from '../../config'; // <-- your API base url file
import './Home.css';

const BusinessCardDetails = () => {
  const { id: productId } = useParams();

  const [product, setProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Options
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedFinish, setSelectedFinish] = useState("");
  const [selectedCorner, setSelectedCorner] = useState("");

  // Reviews
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/product/${productId}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data.product); // Assuming API returns { product: {...} }
          // set defaults
          if (data.product?.sizes?.length) setSelectedSize(data.product.sizes[0].label);
          if (data.product?.finishes?.length) setSelectedFinish(data.product.finishes[0].label);
          if (data.product?.corners?.length) setSelectedCorner(data.product.corners[0].label);
        }
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      }
    };
    fetchProduct();
  }, [productId]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? (product?.images?.length || 1) - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === (product?.images?.length || 1) - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to add items to your cart.");
        return;
      }
      if (!product?._id) {
        alert("Product not loaded yet.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/addToCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
          size: selectedSize,
          finish: selectedFinish,
          corner: selectedCorner
        }),
        credentials: "include"
      });

      const data = await res.json();
      if (res.ok) {
        alert("Product added to cart!");
        window.location.href = "/cart";
      } else {
        alert(data.message || "Failed to add product to cart.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleSubmitReview = () => {
    if (!reviewText.trim() || !rating) {
      alert("Please give rating and write review.");
      return;
    }
    console.log("Submitting review:", { rating, reviewText });
    setReviewText('');
    setRating(0);
    alert("Review submitted!");
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="responsive-container">
      <Header />

      <div className="details-container" style={{ display: 'flex', gap: 20, padding: 20 }}>
        {/* Left: Images */}
        <div className="image-section" style={{ flex: 1, maxWidth: 500, position: 'sticky', top: 80 }}>
          {product.images && product.images.length > 0 && (
            <>
              <img
                src={product.images[currentIndex]}
                alt={`Product ${currentIndex + 1}`}
                style={{ width: '100%', borderRadius: 10, objectFit: 'cover' }}
              />
              <button onClick={goToPrev} style={{ position: 'absolute', left: 10, top: '50%' }}>‹</button>
              <button onClick={goToNext} style={{ position: 'absolute', right: 10, top: '50%' }}>›</button>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() => setCurrentIndex(i)}
                    style={{
                      width: 60, height: 60, cursor: 'pointer',
                      border: i === currentIndex ? '2px solid #00b388' : '1px solid #ccc'
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: Details */}
        <div className="content-section" style={{ flex: 1.2, overflowY: 'auto' }}>
          <h2>{product.name}</h2>
          <p>{product.shortDescription}</p>
          <p><strong>From ${product.basePrice}</strong></p>

          {/* Ratings */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill={i < product.rating ? '#00b388' : 'none'} stroke="#00b388" />
            ))}
            <span style={{ marginLeft: 8 }}>{product.totalReviews} reviews</span>
          </div>

          {/* Sizes */}
          {product.sizes && (
            <div style={{ marginTop: 20 }}>
              <h4>Choose Size</h4>
              <div style={{ display: 'flex', gap: 10 }}>
                {product.sizes.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedSize(s.label)}
                    style={{
                      border: selectedSize === s.label ? '2px solid #00b388' : '1px solid #ccc',
                      padding: 10, cursor: 'pointer'
                    }}
                  >
                    {s.label} <br /> <small>{s.desc}</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Finishes */}
          {product.finishes && (
            <div style={{ marginTop: 20 }}>
              <h4>Choose Finish</h4>
              <div style={{ display: 'flex', gap: 10 }}>
                {product.finishes.map((f, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedFinish(f.label)}
                    style={{
                      border: selectedFinish === f.label ? '2px solid #00b388' : '1px solid #ccc',
                      padding: 10, cursor: 'pointer'
                    }}
                  >
                    {f.label} <br /> <small>{f.desc}</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Corners */}
          {product.corners && (
            <div style={{ marginTop: 20 }}>
              <h4>Choose Corners</h4>
              <div style={{ display: 'flex', gap: 10 }}>
                {product.corners.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedCorner(c.label)}
                    style={{
                      border: selectedCorner === c.label ? '2px solid #00b388' : '1px solid #ccc',
                      padding: 10, cursor: 'pointer'
                    }}
                  >
                    {c.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          {product.quantities && (
            <div style={{ marginTop: 20 }}>
              <h4>Choose Quantity</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {product.quantities.map((q, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td>{q.qty}</td>
                      <td>${q.pricePerCard}</td>
                      <td>${q.packPrice} {q.oldPrice && <s>${q.oldPrice}</s>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            style={{ marginTop: 20, padding: 12, background: '#2563EB', color: '#fff', border: 'none', borderRadius: 6 }}
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div style={{ marginTop: 40, maxWidth: 600, margin: 'auto' }}>
        <h3>Leave a Review</h3>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={28} onClick={() => setRating(s)} fill={rating >= s ? '#facc15' : 'none'} stroke="#facc15" />
          ))}
        </div>
        <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} style={{ width: '100%', marginTop: 10 }} />
        <button onClick={handleSubmitReview} style={{ marginTop: 10 }}>Submit</button>
        <button onClick={() => setShowReviews(!showReviews)} style={{ marginTop: 10, marginLeft: 10 }}>
          {showReviews ? "Hide Reviews" : "View Reviews"}
        </button>

        {showReviews && product.reviews && (
          <div style={{ marginTop: 20 }}>
            {product.reviews.map((rev, i) => (
              <div key={i} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 10 }}>
                <div>
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} fill={j < rev.rating ? '#facc15' : 'none'} stroke="#facc15" />
                  ))}
                </div>
                <p>{rev.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BusinessCardDetails;
