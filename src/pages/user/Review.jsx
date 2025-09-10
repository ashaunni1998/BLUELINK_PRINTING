import React, { useState, useEffect } from "react";
import { Star, Trash2 } from "lucide-react"; 
import API_BASE_URL from "../../config"; 

const Review = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  // ✅ Fetch reviews from backend
  const fetchReviews = async () => {
    try {
      setLoading(true);
       console.log("🔎 Fetching reviews for productId:", productId);
      const res = await fetch(
        `${API_BASE_URL}/review/productReview?productId=68a3fcbd8bb89752830da307&limit=10&page=1`,
        { credentials: "include" }
      );
       console.log("🔎 Response status:", res.status);
      const data = await res.json();
      console.log("🔎 Response JSON:", data);
      if (res.ok) {
        // console.log("Fetched reviews raw:", data); // 🔎 debug
        let fetchedReviews = [];

        // normalize response
     if (data.reviews && Array.isArray(data.reviews.reviews)) {
  fetchedReviews = data.reviews.reviews;
} else {
  fetchedReviews = [];
}

console.log("✅ Normalized reviews:", fetchedReviews);
        setReviews(fetchedReviews);
      } else {
        console.error(data.message);
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Submit new review
  const handleReviewSubmit = async () => {
    if (!rating || !reviewText.trim()) {
      alert("Please select a rating and write a review.");
      return;
    }
const productId="68a3fcbd8bb89752830da307";
    try {
      const res = await fetch(`${API_BASE_URL}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({ productId, rating, comment: reviewText }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Thank you for your review!");
        setRating(0);
        setReviewText("");
        setShowReviews(true);   // ✅ auto show reviews after submit
        fetchReviews();         // ✅ refresh reviews
      } else {
        alert(data.message || "Error submitting review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  // ✅ Delete review
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

  // Fetch reviews when user clicks "View Reviews"
  useEffect(() => {
    if (showReviews) {
      fetchReviews();
    }
  }, [showReviews]);

  return (
    <div>
      {/* Review Section */}
      <div
        className="review-wrapper"
        style={{
          marginTop: 50,
          maxWidth: 600,
          marginLeft: "auto",
          marginRight: "auto",
          padding: "0 16px",
        }}
      >
        <h3 style={{ fontSize: 20, marginBottom: 10 }}>Leave a Review</h3>

        {/* Star Rating */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 16,
          }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={28}
              onClick={() => setRating(star)}
              style={{
                cursor: "pointer",
                fill: rating >= star ? "#facc15" : "none",
                stroke: "#facc15",
              }}
            />
          ))}
        </div>

        {/* Review Text */}
        <textarea
          placeholder="Write your review here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            maxWidth: 500,
            padding: 12,
            borderRadius: 6,
            border: "1px solid #ccc",
            marginBottom: 16,
            fontFamily: "inherit",
            fontSize: 14,
          }}
        />

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "30px",
            marginBottom: "20px",
            flexWrap: "nowrap",
          }}
        >
          <button
            onClick={handleReviewSubmit}
            style={{
              background: "#007BFF",
              color: "#fff",
              padding: "10px 16px",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
              whiteSpace: "nowrap",
            }}
          >
            Submit Review
          </button>

          <button
            onClick={() => setShowReviews(!showReviews)}
            style={{
              background: "#f0f0f0",
              color: "#333",
              padding: "10px 16px",
              border: "1px solid #ccc",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
              whiteSpace: "nowrap",
            }}
          >
            {showReviews ? "Hide Reviews" : "View Reviews"}
          </button>
        </div>
      </div>

      {/* Customer Reviews */}
      {showReviews && (
        <div
          className="customer-reviews"
          style={{
            marginTop: 20,
            maxWidth: 600,
            marginLeft: "auto",
            marginRight: "auto",
            padding: "0 16px",
          }}
        >
          <h3 style={{ fontSize: 18, marginBottom: 10 }}>Customer Reviews</h3>

          {loading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p style={{ fontSize: 14, color: "#777" }}>No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  padding: 12,
                  marginBottom: 12,
                  backgroundColor: "#fafafa",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 6,
                  }}
                >
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < review.rating ? "#facc15" : "none"}
                      stroke="#facc15"
                    />
                  ))}
                </div>
                <p style={{ fontSize: 14 }}>{review.comment}</p>

                {/* Delete button (only show if review belongs to logged-in user) */}
                {review.isOwner && (
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "red",
                      marginTop: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Review;
