import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star } from 'lucide-react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Review from "./Review";
// import CropImage from "./CropImage";
// import CustomRequirement from "./CustomerRequirement";
import API_BASE_URL from "../../config";
import { FaWhatsapp, FaFacebookMessenger, FaPhoneAlt } from "react-icons/fa";
import { FaPaperPlane } from "react-icons/fa";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedFinish, setSelectedFinish] = useState("");
  const [selectedCorner, setSelectedCorner] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showReviews, setShowReviews] = useState(false);



  const [isCropOpen, setIsCropOpen] = useState(false);
const [croppedImage, setCroppedImage] = useState(null);
const [selectedFile, setSelectedFile] = useState(null);
const [orderId, setOrderId] = useState(null);
const [selectedOption, setSelectedOption] = useState(null);

const [frontFile, setFrontFile] = useState(null);
const [backFile, setBackFile] = useState(null);
const [frontPreview, setFrontPreview] = useState(null);
const [backPreview, setBackPreview] = useState(null);

const [croppingSide, setCroppingSide] = useState(null); // "front" | "back"
const [croppedImages, setCroppedImages] = useState({ front: null, back: null });



const [showContactModal, setShowContactModal] = useState(false);
const [showScratchModal, setShowScratchModal] = useState(false);
const [showGuideline, setShowGuideline] = useState(false);


  // ✅ add this hook at the top of your file
function useMediaQuery(query) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  return matches;
}

// inside your component
const isMobile = useMediaQuery("(max-width: 768px)");


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching product with ID:", id);

        // Try different endpoints
        const endpoints = [
          `https://kerala-digital-park-server.vercel.app/api/products/${id}`,
          `https://kerala-digital-park-server.vercel.app/api/product/${id}`,
          `https://kerala-digital-park-server.vercel.app/api/productDetail/${id}`,
          `https://kerala-digital-park-server.vercel.app/api/getProduct/${id}`,
          `https://kerala-digital-park-server.vercel.app/api/productDetails/${id}`
        ];

        let res;
        let lastError;
        let workingEndpoint;

        for (const endpoint of endpoints) {
          try {
            console.log("🔍 Trying endpoint:", endpoint);
            res = await fetch(endpoint, {
              headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
            });

            if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
              workingEndpoint = endpoint;
              break;
            } else {
              lastError = `HTTP ${res.status} - ${endpoint}`;
            }
          } catch (err) {
            lastError = err.message;
          }
        }

        if (!res || !res.ok || !workingEndpoint) {
          // fallback: fetch list
          const listRes = await fetch('https://kerala-digital-park-server.vercel.app/api/products');
          if (listRes.ok) {
            const listData = await listRes.json();
            const products = listData.productData || listData.data || listData.products || listData;
            if (Array.isArray(products)) {
              const foundProduct = products.find(p => (p._id === id) || (p.id === id));
              if (foundProduct) {
                setProduct(foundProduct);
                if (foundProduct.sizes?.length) setSelectedSize(foundProduct.sizes[0].label);
                if (foundProduct.finishes?.length) setSelectedFinish(foundProduct.finishes[0].label);
                if (foundProduct.corners?.length) setSelectedCorner(foundProduct.corners[0].label);
                return;
              } else {
                setError(`Product ID "${id}" not found.`);
                return;
              }
            }
          }
          throw new Error(`All methods failed. Last error: ${lastError}`);
        }

        const data = await res.json();
        const productData = data.data || data;
        setProduct(productData);
        if (productData.sizes?.length) setSelectedSize(productData.sizes[0].label);
        if (productData.finishes?.length) setSelectedFinish(productData.finishes[0].label);
        if (productData.corners?.length) setSelectedCorner(productData.corners[0].label);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
    else {
      setError("No product ID provided");
      setLoading(false);
    }
  }, [id]);

  // image navigation
  const goToPrev = () => {
    setCurrentIndex(prev => (prev === 0 ? (product?.images?.length || 1) - 1 : prev - 1));
  };
  const goToNext = () => {
    setCurrentIndex(prev => (prev === (product?.images?.length || 1) - 1 ? 0 : prev + 1));
  };

  // ✅ fixed: Add to cart using cookies (no localStorage token)
  const handleAddToCart = async () => {
    try {
      if (!product?._id) {
        alert("Product not loaded yet.");
        return;
      }

      const res = await fetch("https://kerala-digital-park-server.vercel.app/api/addToCart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 👈 send login cookie
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
          size: selectedSize,
          finish: selectedFinish,
          corner: selectedCorner
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Product added to cart!");
        // window.location.href = "/getCart";
        navigate("/cart");
      } else if (res.status === 401) {
        alert("⚠️ Session expired. Please login again.");
        // window.location.href = "/signin";
        navigate("/signin");
      } else {
        alert(data.message || "Failed to add product to cart.");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  // reviews
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






const handleFileChange = (e, side) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    if (side === "front") {
      setFrontFile(file);
      setFrontPreview(reader.result);
      setCroppingSide("front");
      setIsCropOpen(true);
    } else {
      setBackFile(file);
      setBackPreview(reader.result);
      setCroppingSide("back");
      setIsCropOpen(true);
    }
  };
  reader.readAsDataURL(file);
};

// const handleCropComplete = (croppedDataUrl) => {
//   if (croppingSide === "front") {
//     setFrontPreview(croppedDataUrl);
//   } else if (croppingSide === "back") {
//     setBackPreview(croppedDataUrl);
//   }
//   setIsCropOpen(false);
//   setCroppingSide(null);
// };


const handleSubmit = () => {
  if (!croppedImage) {
    alert("Please upload and crop an image before submitting.");
    return;
  }

  // For now just log/alert
  console.log("Submitted cropped image:", croppedImage);
  alert("Image submitted successfully!");

  // 🚀 Later, replace with API upload
  // const formData = new FormData();
  // formData.append("image", croppedImage.file);
  // await fetch("/api/upload", { method: "POST", body: formData });
};


const handleScratchSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const payload = {
    name: formData.get("name"),
    mobile: formData.get("mobile"),
    email: formData.get("email"),
    requirement: formData.get("requirement"),
  };

  try {
    const res = await fetch(`${API_BASE_URL}/scratch-design`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Your design request has been submitted!");
      e.target.reset();
    } else {
      alert("Something went wrong!");
    }
  } catch (err) {
    console.error(err);
    alert("Error submitting request.");
  }
};

const handleCropComplete = (cropped, side) => {
  setCroppedImages((prev) => ({ ...prev, [side]: cropped }));
  setIsCropOpen(false);
};

const handleUploadSubmit = () => {
  if (!frontPreview || !backPreview) {
    alert("Please upload both front and back images!");
    return;
  }
  alert("Design submitted successfully!");
};
  // ---- STYLES ----
  const styles = {
    container: { backgroundColor: "#f8f9fa", minHeight: "100vh" },
    imageSection: {
      flex: 1,
      maxWidth: isMobile ? '100%' : '500px',
      position: isMobile ? 'relative' : 'sticky',
      top: isMobile ? 'auto' : '100px',
      height: 'fit-content'
    },
    detailsSection: {
      flex: 1.2,
      backgroundColor: 'white',
      borderRadius: '12px',
     padding: isMobile ? '20px' : '30px'
    },
    reviewsSection: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: isMobile ? '20px' : '40px',
      backgroundColor: 'white',
      borderRadius: '12px',
      marginBottom: '40px'
    },
    thumbnailContainer: {
      display: 'flex',
      gap: '10px',
      marginTop: '15px',
     overflowX: isMobile ? 'auto' : 'visible',
   padding: isMobile ? '0 0 10px 0' : '0'
    },
    thumbnail: {
      width: '60px',
      height: '60px',
      cursor: 'pointer',
      borderRadius: '8px',
      objectFit: 'cover',
      flexShrink: 0
    },
    button: {
      width: '100%',
      padding: '15px',
      background: '#2563EB',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginBottom: '20px'
    },
    backButton: {
      padding: "10px 20px",
      backgroundColor: "#6c757d",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px"
    },
   
};
const inputStyle = {
  width: "100%",
  padding: "13px",
  marginBottom: "14px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontSize: "15px",
  outline: "none",
  transition: "0.2s",
  color: "#111",
  background: "#f9fafb"
};

/* ---- Styles ---- */
const fileCardStyle = (color) => ({
  border: `2px solid ${color}`,
  borderRadius: "10px",
  padding: "20px",
  textAlign: "center",
  fontSize: "14px",
  fontWeight: "500",
  color: "#1f2937",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  background: "#fff",
  transition: "all 0.2s ease-in-out",
});

const fileLabelStyle = {
  fontWeight: "700",
  fontSize: "16px",
  textTransform: "uppercase",
};


  // loading
  if (loading) return <p style={{ textAlign: "center", padding: "40px" }}>Loading product...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red", padding: "40px" }}>{error}</p>;
  if (!product) return <p style={{ textAlign: "center", padding: "40px" }}>Product not found.</p>;
console.log(id);
  return (
    <div style={styles.container}>
      <div className="responsive-container">
        <Header />

        {/* Main */}
        <div style={{
          
        
          padding: isMobile ? '20px' : '40px',
          maxWidth: '1200px',
          margin: '0 auto',
          
        }}>
           <div style={{
    display: 'flex',
    gap: isMobile ? '20px' : '40px',
    flexDirection: isMobile ? 'column' : 'row'
  }}>
          {/* Images */}
          <div style={styles.imageSection}>
            {product.images?.length > 0 ? (
              <div style={{ position: 'relative' }}>
                <img
                  src={typeof product.images[currentIndex] === 'string' ? product.images[currentIndex] : product.images[currentIndex]?.url || ''}
                  alt={product.name}
                  style={{ width: '100%', borderRadius: '12px', objectFit: 'cover' }}
                />
                {product.images.length > 1 && (
                  <>
                    <button onClick={goToPrev} style={{ position: 'absolute', left: '15px', top: '50%' }}>‹</button>
                    <button onClick={goToNext} style={{ position: 'absolute', right: '15px', top: '50%' }}>›</button>
                  </>
                )}
                <div style={styles.thumbnailContainer}>
                  {product.images.map((img, i) => (
                    <img
                      key={i}
                      src={typeof img === 'string' ? img : img?.url || ''}
                      onClick={() => setCurrentIndex(i)}
                      style={{
                        ...styles.thumbnail,
                        border: i === currentIndex ? '2px solid #00b388' : '2px solid transparent'
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : <div>No Image</div>}
          </div>

          {/* Details */}
         <div style={styles.detailsSection}>
  {/* Basic Details */}
  <h1>{product.name}</h1>
  <p>{product.description}</p>
  <p><strong>Price:</strong> ${product.price}</p>

  {/* Images */}
  {/* {product.images && product.images.length > 0 && (
    <div style={styles.imageGallery}>
      {product.images.map((img, index) => (
        <img key={index} src={img} alt={product.name} style={styles.productImage} />
      ))}
    </div>
  )} */}

  {/* Sizes */}
  {product.size && product.size.length > 0 && (
    <div>
      <h3>Available Sizes</h3>
      <ul>
        {product.size.map((s, i) => (
          <li key={i}>
            {s.name}: {s.size.width} x {s.size.height}
          </li>
        ))}
      </ul>
    </div>
  )}

  {/* Paper */}
  {product.paper && product.paper.length > 0 && (
    <div>
      <h3>Paper Options</h3>
      <ul>
        {product.paper.map((p, i) => (
          <li key={i}>
            {p.name} - {p.points.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  )}

  {/* Finish */}
  {product.finish && product.finish.length > 0 && (
    <div>
      <h3>Finish</h3>
      <ul>
        {product.finish.map((f, i) => (
          <li key={i}>
            <strong>{f.name}</strong>: {f.description}
          </li>
        ))}
      </ul>
    </div>
  )}

  {/* Corners */}
  {product.corner && product.corner.length > 0 && (
    <div>
      <h3>Corners</h3>
      <ul>
        {product.corner.map((c, i) => (
          <li key={i}>
            <strong>{c.name}</strong>: {c.description}
          </li>
        ))}
      </ul>
    </div>
  )}

  {/* Rating */}
  <div>
    <h3>Rating</h3>
    <p>
      {product.rating.count > 0
        ? `${(product.rating.total / product.rating.count).toFixed(1)} ⭐ (${product.rating.count} reviews)`
        : "No ratings yet"}
    </p>
  </div>

  {/* Add to Cart */}
  <button onClick={handleAddToCart} style={styles.button}>
    🛒 Add to Cart
  </button>
</div>
</div>
<div style={{ marginTop: "10px" }}>
{/* Customer Needs */}

{/* Design Options */}
{/* Design Options */}
<div style={{ marginTop: "40px", textAlign: "center" }}>
  <h2 style={{
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#222"
  }}>
    How would you like to design your cards?
  </h2>

  {/* Options Grid */}
  <div style={{
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
    gap: "25px",
    maxWidth: "1000px",
    margin: "0 auto"
  }}>
    {/* Upload Your Design */}
    <div
      onClick={() => navigate(`/upload-design/${id}`)}
      style={{
        border: selectedOption === "upload" ? "2px solid #2563EB" : "1px solid #ddd",
        borderRadius: "14px",
        padding: "25px 20px",
        backgroundColor: "white",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        transition: "0.3s",
        textAlign: "center"
      }}
    >
      <div style={{ fontSize: "42px", marginBottom: "15px" }}>📂</div>
      <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", fontWeight: "600" }}>
        Upload Your Design
      </h3>
      <ul style={{
        fontSize: "14px",
        color: "#555",
        listStyle: "disc",
        paddingLeft: "18px",
        textAlign: "left",
        lineHeight: "1.6"
      }}>
        <li>Upload your own files</li>
        <li>Supports multiple sides</li>
        <li>Crop before submit</li>
      </ul>
    </div>

    {/* Contact Us */}
    <div
      onClick={() => setShowContactModal("true")}
      style={{
        border: selectedOption === "contact" ? "2px solid #2563EB" : "1px solid #ddd",
        borderRadius: "14px",
        padding: "25px 20px",
        backgroundColor: "white",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        transition: "0.3s",
        textAlign: "center"
      }}
    >
      <div style={{ fontSize: "42px", marginBottom: "15px" }}>☎️</div>
      <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", fontWeight: "600" }}>
        Contact Us
      </h3>
      <ul style={{
        fontSize: "14px",
        color: "#555",
        listStyle: "disc",
        paddingLeft: "18px",
        textAlign: "left",
        lineHeight: "1.6"
      }}>
        <li>WhatsApp support</li>
        <li>Facebook Messenger</li>
        <li>Direct call</li>
      </ul>
    </div>

    {/* Design From Scratch */}
    <div
      onClick={() => setShowScratchModal("true")}
      style={{
        border: selectedOption === "scratch" ? "2px solid #2563EB" : "1px solid #ddd",
        borderRadius: "14px",
        padding: "25px 20px",
        backgroundColor: "white",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        transition: "0.3s",
        textAlign: "center"
      }}
    >
      <div style={{ fontSize: "42px", marginBottom: "15px" }}>✏️</div>
      <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", fontWeight: "600" }}>
        Design From Scratch
      </h3>
      <ul style={{
        fontSize: "14px",
        color: "#555",
        listStyle: "disc",
        paddingLeft: "18px",
        textAlign: "left",
        lineHeight: "1.6"
      }}>
        <li>Custom form</li>
        <li>Share requirements</li>
        <li>We’ll design for you</li>
      </ul>
    </div>
  </div>
</div>

{/* Show option details */}
<div style={{ marginTop: "30px" }}>
  
{/* Contact Modal */}
{showContactModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(16px)",
        borderRadius: "20px",
        padding: "40px",
        width: "90%",
        maxWidth: "500px",
        textAlign: "center",
        color: "#fff",
        boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
        animation: "fadeInUp 0.4s ease",
        position: "relative"
      }}
    >
      {/* Close button */}
      <button
        onClick={() => setShowContactModal(false)}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "36px",
          height: "36px",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        ✖
      </button>

      <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "25px" }}>
        Get in Touch
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "25px",
          flexWrap: "wrap",
        }}
      >
        {/* WhatsApp */}
        <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
          style={{
            textDecoration: "none",
            background: "linear-gradient(135deg, #25D366, #128C7E)",
            padding: "20px",
            borderRadius: "16px",
            width: "120px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#fff",
            fontWeight: "600",
            transition: "transform 0.3s ease, box-shadow 0.3s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-8px) scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(37,211,102,0.6)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <FaWhatsapp size={36} />
          WhatsApp
        </a>

        {/* Messenger */}
        <a href="https://facebook.com/YourPage" target="_blank" rel="noreferrer"
          style={{
            textDecoration: "none",
            background: "linear-gradient(135deg, #1877F2, #0a58ca)",
            padding: "20px",
            borderRadius: "16px",
            width: "120px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#fff",
            fontWeight: "600",
            transition: "transform 0.3s ease, box-shadow 0.3s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-8px) scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(24,119,242,0.6)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <FaFacebookMessenger size={36} />
          Messenger
        </a>

        {/* Phone */}
        <a href="tel:+919876543210"
          style={{
            textDecoration: "none",
            background: "linear-gradient(135deg, #ff4d4d, #cc0000)",
            padding: "20px",
            borderRadius: "16px",
            width: "120px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#fff",
            fontWeight: "600",
            transition: "transform 0.3s ease, box-shadow 0.3s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-8px) scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(255,77,77,0.6)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <FaPhoneAlt size={32} />
          Call
        </a>
      </div>
    </div>
  </div>
)}








</div>

{/* Scratch Design Modal */}
{showScratchModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        background: "linear-gradient(135deg, #ffffff 10%, #f3f4f6 100%)",
        borderRadius: "20px",
        padding: "40px",
        width: "95%",
        maxWidth: "550px",
        textAlign: "center",
        boxShadow: "0 12px 35px rgba(0,0,0,0.3)",
        position: "relative",
        animation: "fadeInUp 0.4s ease",
      }}
    >
      {/* Close */}
      <button
        onClick={() => setShowScratchModal(false)}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "#ef4444",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "34px",
          height: "34px",
          cursor: "pointer",
          fontSize: "16px",
          boxShadow: "0 3px 8px rgba(239,68,68,0.4)",
        }}
      >
        ✖
      </button>

      <h2
        style={{
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "25px",
          background: "linear-gradient(90deg,#2563EB,#1D4ED8)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        Design From Scratch ✏️
      </h2>

      {/* Form */}
      <form onSubmit={handleScratchSubmit} style={{ textAlign: "left" }}>
        <label style={{ fontWeight: "600", fontSize: "14px", marginBottom: "6px", display: "block" }}>
          Your Name
        </label>
        <input
          type="text"
          name="name"
          required
          style={{
            width: "100%",
            padding: "12px 14px",
            marginBottom: "16px",
            border: "1px solid #d1d5db",
            borderRadius: "10px",
            fontSize: "15px",
            outline: "none",
            transition: "0.2s",
          }}
        />

        <label style={{ fontWeight: "600", fontSize: "14px", marginBottom: "6px", display: "block" }}>
          Mobile Number
        </label>
        <input
          type="tel"
          name="mobile"
          required
          style={{
            width: "100%",
            padding: "12px 14px",
            marginBottom: "16px",
            border: "1px solid #d1d5db",
            borderRadius: "10px",
            fontSize: "15px",
            outline: "none",
          }}
        />

        <label style={{ fontWeight: "600", fontSize: "14px", marginBottom: "6px", display: "block" }}>
          Email ID
        </label>
        <input
          type="email"
          name="email"
          required
          style={{
            width: "100%",
            padding: "12px 14px",
            marginBottom: "16px",
            border: "1px solid #d1d5db",
            borderRadius: "10px",
            fontSize: "15px",
            outline: "none",
          }}
        />

        <label style={{ fontWeight: "600", fontSize: "14px", marginBottom: "6px", display: "block" }}>
          Your Requirement
        </label>
        <textarea
          name="requirement"
          required
          placeholder="Describe your design idea..."
          style={{
            width: "100%",
            padding: "12px 14px",
            marginBottom: "20px",
            border: "1px solid #d1d5db",
            borderRadius: "10px",
            fontSize: "15px",
            outline: "none",
            minHeight: "100px",
            resize: "none",
          }}
        />

        {/* Submit button */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px",
            background: "linear-gradient(90deg,#2563EB,#1D4ED8)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: "0 5px 12px rgba(37,99,235,0.4)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.target.style.background = "linear-gradient(90deg,#1D4ED8,#1E40AF)")
          }
          onMouseOut={(e) =>
            (e.target.style.background = "linear-gradient(90deg,#2563EB,#1D4ED8)")
          }
        >
          <FaPaperPlane /> Submit Request
        </button>
      </form>
    </div>
  </div>
)}


        {/* Reviews */}
        {/* <div style={styles.reviewsSection}>
          <h3>Leave a Review</h3>
          {[1,2,3,4,5].map(s => (
            <Star key={s} size={24} onClick={() => setRating(s)}
            fill={rating >= s ? '#facc15' : 'none'} stroke="#facc15" style={{ cursor: 'pointer' }} />
            ))}
            <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Write review..."/>
            <button onClick={handleSubmitReview}>Submit Review</button>
            </div> */}
{/* ---- Download Design Guideline ---- */}
{/* ---- Floating Download Guideline ---- */}
<div
  style={{
    position: "fixed",
    bottom: "25px",
    right: "25px",
    zIndex: 1000,
  }}
>
  {/* Floating Button */}
 <button
  onClick={() => setShowGuideline((prev) => !prev)}
  style={{
    background: "linear-gradient(90deg,#2563EB,#9333EA)",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    padding: "12px 22px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 10px 25px rgba(79,70,229,0.4)",
    transition: "all 0.3s ease",
  }}
  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
>
  📘 <span>Design Guidelines</span>
</button>


  {/* Popover */}
  {showGuideline && (
    <div
      style={{
        position: "absolute",
        bottom: "75px",
        right: "0",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderRadius: "14px",
        padding: "20px",
        width: "220px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        animation: "fadeInUp 0.35s ease",
      }}
    >
      <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "15px", textAlign: "center" }}>
        Design Guideline
      </h3>
      <div style={{ display: "grid", gap: "12px" }}>
        {[
          { ext: "psd", label: "Photoshop", color: "#2563eb" },
          { ext: "ai", label: "Illustrator", color: "#f97316" },
          { ext: "indd", label: "InDesign", color: "#db2777" },
          { ext: "jpg", label: "JPEG", color: "#059669" }
        ].map((file) => (
          <a
            key={file.ext}
            href={`/guidelines/business-card.${file.ext}`}
            download
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              padding: "8px 10px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#111",
              background: "#f9fafb",
              border: `1px solid ${file.color}33`,
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = file.color;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#f9fafb";
              e.currentTarget.style.color = "#111";
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: file.color,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "700",
                textTransform: "uppercase",
              }}
            >
              {file.ext}
            </div>
            {file.label}
          </a>
        ))}
      </div>
    </div>
  )}
</div>




          
<Review productId={id}/>

        </div>
        </div>
        <Footer />
        </div>
       </div>
            
      
    
    
  );
}
