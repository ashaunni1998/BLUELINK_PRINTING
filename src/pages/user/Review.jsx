import React, { useState, useEffect } from "react";
import { Star, Trash2, MessageSquare, TrendingUp } from "lucide-react";
import { API_BASE_URL } from "../../config";

const Review = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);


  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
const [isTablet, setIsTablet] = useState(window.innerWidth > 768 && window.innerWidth <= 1024);

useEffect(() => {
  const handleResize = () => {
    const width = window.innerWidth;
    setIsMobile(width <= 768);
    setIsTablet(width > 768 && width <= 1024);
  };
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      console.log("🔎 Fetching reviews for productId:", productId);
      
      const res = await fetch(
        `${API_BASE_URL}/review/productReview?productId=${productId}&limit=10&page=1`,
        { credentials: "include" }
      );
      
      console.log("🔎 Response status:", res.status);
      const data = await res.json();
      console.log("🔎 Response JSON:", data);
      
      if (res.ok) {
        let fetchedReviews = [];

        if (!data) {
          fetchedReviews = [];
        } else if (Array.isArray(data)) {
          fetchedReviews = data;
        } else if (data.reviews) {
          if (Array.isArray(data.reviews)) {
            fetchedReviews = data.reviews;
          } else if (data.reviews.reviews && Array.isArray(data.reviews.reviews)) {
            fetchedReviews = data.reviews.reviews;
          }
        } else if (data.data && Array.isArray(data.data)) {
          fetchedReviews = data.data;
        }

        console.log("✅ Normalized reviews:", fetchedReviews);
        setReviews(fetchedReviews);
      } else {
        console.error("API Error:", data?.message || "Unknown error");
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🎯 Review Component Mounted");
    console.log("📦 Received productId:", productId);
  }, [productId]);

  const handleReviewSubmit = async () => {
    if (!rating || !reviewText.trim()) {
      alert("Please select a rating and write a review.");
      return;
    }

    console.log("=".repeat(50));
    console.log("📤 SUBMITTING REVIEW");
    console.log("=".repeat(50));
    console.log("📦 ProductId:", productId);
    console.log("⭐ Rating:", rating);
    console.log("💬 Comment:", reviewText);

    try {
      const res = await fetch(`${API_BASE_URL}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, rating, comment: reviewText }),
      });

      console.log("📥 Response status:", res.status);
      
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse response as JSON:", e);
        data = { message: text || "Server error" };
      }

      if (res.ok) {
        alert("Thank you for your review!");
        setRating(0);
        setReviewText("");
        setShowReviews(true);
        fetchReviews();
      } else {
        const errorMsg = data?.message || data?.error || "Error submitting review";
        console.error("❌ Server error:", errorMsg);
        alert(errorMsg);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/review/deleteReview/${id}`, {
        method: "PUT",
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        alert("Review deleted successfully!");
        fetchReviews();
      } else {
        alert(data.message || "Error deleting review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  useEffect(() => {
    if (showReviews) {
      fetchReviews();
    }
  }, [showReviews]);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Write Review Section */}
   <div
  style={{
    marginTop: isMobile ? 30 : 50,
    maxWidth: isMobile ? "95%" : isTablet ? "80%" : 600,
    marginLeft: "auto",
    marginRight: "auto",
    padding: isMobile ? "0 12px" : "0 16px",
  }}
>

        <div style={{
          background: 'linear-gradient(135deg, #b0bcc9ff 0%, #b0c0d1ff 100%)',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 10px 40px rgba(102, 126, 234, 0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            {/* <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 12,
              padding: 10,
              backdropFilter: 'blur(10px)',
            }}>
              <MessageSquare size={24} color="#fff" />
            </div> */}
            <h3 style={{ 
              fontSize: 24, 
              margin: 0,
              color: '#007BFF',
              fontWeight: 600,
            }}>
              Share Your Experience
            </h3>
          </div>

          {/* Star Rating with Hover Effect */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              marginBottom: 12,
              fontSize: 14,
              fontWeight: 500,
            }}>
              Rate this product
            </p>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    cursor: "pointer",
                    fill: (hoverRating || rating) >= star ? "#fbbf24" : "rgba(255, 255, 255, 0.3)",
                    stroke: (hoverRating || rating) >= star ? "#fbbf24" : "rgba(255, 255, 255, 0.5)",
                    transition: 'all 0.2s ease',
                    transform: (hoverRating || rating) >= star ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
              ))}
              {rating > 0 && (
                <span style={{ 
                  color: '#fbbf24', 
                  marginLeft: 8, 
                  fontWeight: 600,
                  fontSize: 16,
                }}>
                  {rating}.0
                </span>
              )}
            </div>
          </div>

          {/* Review Text Area */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              marginBottom: 12,
              fontSize: 14,
              fontWeight: 500,
            }}>
              Write your review
            </p>
            <textarea
              placeholder="Tell us what you think about this product..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: 16,
                borderRadius: 12,
                border: "2px solid rgba(255, 255, 255, 0.2)",
                background: 'rgba(255, 255, 255, 0.95)',
                fontFamily: "inherit",
                fontSize: 14,
                resize: 'vertical',
                outline: 'none',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.border = '2px solid #fbbf24';
                e.target.style.background = '#fff';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid rgba(255, 255, 255, 0.2)';
                e.target.style.background = 'rgba(255, 255, 255, 0.95)';
              }}
            />
          </div>

      {/* Action Buttons */}
<div style={{
  display: "flex",
  alignItems: "center",
  gap: 12,
  flexWrap: "nowrap", // Keep buttons in single line
  justifyContent: "space-between", // Space buttons evenly
}}>
  <button
    onClick={handleReviewSubmit}
    style={{
      background: "linear-gradient(135deg, #007BFF 0%, #007BFF 100%)",
      color: "#fff",
      padding: isMobile ? "12px 16px" : "12px 24px",
      border: "none",
      borderRadius: 10,
      cursor: "pointer",
      fontSize: isMobile ? 14 : 15,
      fontWeight: 600,
      whiteSpace: "nowrap",
      boxShadow: '0 4px 15px rgba(27, 48, 185, 0.4)',
      transition: 'all 0.3s ease',
      flex: "1 1 0", // Equal flex basis
      maxWidth: isMobile ? "48%" : "auto", // Limit to 48% width on mobile
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 6px 20px rgba(16, 33, 184, 0.5)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 4px 15px rgba(17, 34, 184, 0.4)';
    }}
  >
    Submit Review
  </button>

  <button
    onClick={() => setShowReviews(!showReviews)}
    style={{
      background: "rgba(255, 255, 255, 0.2)",
      color: "#fff",
      padding: isMobile ? "12px 16px" : "12px 24px",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      borderRadius: 10,
      cursor: "pointer",
      fontSize: isMobile ? 14 : 15,
      fontWeight: 600,
      whiteSpace: "nowrap",
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      flex: "1 1 0", // Equal flex basis
      maxWidth: isMobile ? "48%" : "auto", // Limit to 48% width on mobile
    }}
    onMouseEnter={(e) => {
      e.target.style.background = 'rgba(255, 255, 255, 0.3)';
    }}
    onMouseLeave={(e) => {
      e.target.style.background = 'rgba(255, 255, 255, 0.2)';
    }}
  >
    {showReviews ? "Hide Reviews" : "View Reviews"}
  </button>
</div>
</div>
</div>
      {/* Customer Reviews Section */}
      {showReviews && (
      <div
  style={{
    marginTop: isMobile ? 24 : 40,
    maxWidth: isMobile ? "95%" : isTablet ? "80%" : 600,
    marginLeft: "auto",
    marginRight: "auto",
    padding: isMobile ? "0 12px" : "0 16px",
  }}
>

          {/* Reviews Header with Stats */}
          <div style={{
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          }}>
            <div>
              <h3 style={{ 
                fontSize: 22, 
                margin: 0,
                marginBottom: 8,
                color: '#1f2937',
                fontWeight: 600,
              }}>
                Customer Reviews
              </h3>
              <p style={{ 
                fontSize: 14, 
                color: '#6b7280',
                margin: 0,
              }}>
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>
            {reviews.length > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#fff',
                padding: '12px 20px',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}>
                <Star size={24} fill="#fbbf24" stroke="#fbbf24" />
                <div>
                  <div style={{ 
                    fontSize: 24, 
                    fontWeight: 700,
                    color: '#1f2937',
                    lineHeight: 1,
                  }}>
                    {averageRating}
                  </div>
                  <div style={{ 
                    fontSize: 11, 
                    color: '#9ca3af',
                    marginTop: 2,
                  }}>
                    Average
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reviews List */}
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: 40,
              color: '#6b7280',
            }}>
              <div style={{
                width: 40,
                height: 40,
                border: '3px solid #e5e7eb',
                borderTop: '3px solid #667eea',
                borderRadius: '50%',
                margin: '0 auto 16px',
                animation: 'spin 1s linear infinite',
              }}></div>
              <p>Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: 60,
              background: '#f9fafb',
              borderRadius: 16,
              border: '2px dashed #e5e7eb',
            }}>
              <MessageSquare size={48} color="#d1d5db" style={{ marginBottom: 16 }} />
              <p style={{ 
                fontSize: 16, 
                color: '#6b7280',
                margin: 0,
                fontWeight: 500,
              }}>
                No reviews yet. Be the first to review!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {reviews.map((review) => (
                <div
                  key={review._id}
                  style={{
                    background: '#fff',
                    border: "1px solid #e5e7eb",
                    borderRadius: 12,
                    padding: 20,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          fill={i < review.rating ? "#fbbf24" : "none"}
                          stroke={i < review.rating ? "#fbbf24" : "#d1d5db"}
                          strokeWidth={2}
                        />
                      ))}
                      <span style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#1f2937',
                        marginLeft: 4,
                      }}>
                        {review.rating}.0
                      </span>
                    </div>
                    {review.isOwner && (
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "#ef4444",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          padding: '6px 12px',
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 500,
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#fee2e2';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                  </div>
                  <p style={{ 
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: '#374151',
                    margin: 0,
                  }}>
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Review;