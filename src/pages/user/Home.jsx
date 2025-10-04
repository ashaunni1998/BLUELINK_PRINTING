import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeSlider from "./HomeSlider";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { useEffect } from "react";
import { API_BASE_URL } from "../../config"; // adjust the path properly
import { TranslateProvider } from "../../context/TranslateProvider";
import FlyerSection from "./FlyerSection";
import EnhancedHomeSections from "./EnhancedHomeSections";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {





  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/products`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.productData) setProducts(data.productData);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);


const navigate = useNavigate();

const handleBuyNow = (productId) => {
  const isLoggedIn = localStorage.getItem("userToken"); // adjust to your auth check

  if (!isLoggedIn) {
    Swal.fire({
      title: "Login Required",
      text: "Please sign in to continue your purchase.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#007bff",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sign In",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/sign-in"); // redirect to sign-in
      }
    });
  } else {
    navigate(`/checkout/${productId}`); // go to checkout
  }
};


  const [showModal, setShowModal] = useState(false);

  const handleShopNowClick = () => {
    const isLoggedIn = false; // Replace with real auth check
    if (!isLoggedIn) {
      setShowModal(true);
    } else {
      // Proceed to cart or product detail
    }
  };

  const handleLoginRedirect = () => {
    window.location.href = "/login"; // Adjust route as needed
  };

  useEffect(() => {
    const section = document.getElementById("popular-products");
    if (section) {
      section.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, []);

  const styles = {
    section: {
      backgroundColor: "#f7f9f7",
      padding: "40px 20px",
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
    },
    logosRow: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "40px",
      marginBottom: "40px",
    },
    logo: {
      maxHeight: "40px",
      objectFit: "contain",
    },
    trustpilotBlock: {
      marginBottom: "40px",
    },
    trustpilotStars: {
      display: "flex",
      justifyContent: "center",
      marginTop: "10px",
      gap: "2px",
    },
    reviewCards: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "20px",
      padding: "0 20px",
    },
    card: {
      backgroundColor: "#fff",
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "20px",
      width: "300px",
      textAlign: "left",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    },
    stars: {
      display: "flex",
      gap: "2px",
      marginBottom: "10px",
    },
    starIcon: {
      width: "20px",
      height: "20px",
    },
    reviewTitle: {
      fontWeight: "bold",
      fontSize: "16px",
      marginBottom: "6px",
    },
    reviewText: {
      fontSize: "14px",
      color: "#333",
      marginBottom: "10px",
    },
    reviewer: {
      fontSize: "13px",
      color: "#555",
      fontWeight: "bold",
    },
    timeAgo: {
      fontWeight: "normal",
      color: "#999",
      fontSize: "12px",
    },
  };
  

  const logos = [
    { alt: "Uber", src: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" },
    { alt: "Calm", src: "/homeimages/calm.svg", style: { height: "600px" } },
    { alt: "Glossier", src: "/homeimages/glossier.svg" },
    { alt: "Etsy", src: "/homeimages/etsy.svg" },
    { alt: "Airbnb", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_Bélo.svg/512px-Airbnb_Logo_Bélo.svg.png" },
    { alt: "TED", src: "/homeimages/TED.svg" },
  ];

  const reviews = [
    {
      stars: 5,
      title: "Simple quick excellence",
      text: "It was a simple process to design my business card. They were quickly shipped a...",
      author: "Barry Weber",
      time: "12 hours ago",
    },
    {
      stars: 5,
      title: "BlueLink’s platform is easy to navigate",
      text: "BlueLink’s platform is easy to navigate. I love the cards I designed. Having my art o...",
      author: "Kimberly Brayman",
      time: "12 hours ago",
    },
    {
      stars: 5,
      title: "ABSOLUTELY AMAZING SERVICE!!",
      text: "Orders these cards for a game with my boyfriend and...",
      author: "OliviaDoodles",
      time: "1 day ago",
    },
  ];

  const Star = () => (
    <svg
      width="60px"
      height=""
      viewBox="0 0 46 46"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="tp-star">
        <path
          className="tp-star__canvas"
          fill="#dcdce6"
          d="M0 46.330002h46.375586V0H0z"
        />
        <path
          className="tp-star__shape"
          fill="#FFF"
          d="M39.533936 19.711433L13.230239 38.80065l3.838216-11.797827L7.02115 19.711433h12.418975l3.837417-11.798624 3.837418 11.798624h12.418975zM23.2785 31.510075l7.183595-1.509576 2.862114 8.800152L23.2785 31.510075z"
        />
      </g>
    </svg>
  );
console.log(products);
 const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 1;
  // const maxIndex = Math.ceil(products.length / 10) - 1; // Changed from products.length - itemsPerView

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };


  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };
  
  checkMobile();
  window.addEventListener('resize', checkMobile);
  
  return () => window.removeEventListener('resize', checkMobile);
}, []);
// Replace your existing itemsPerView and maxIndex with:
const productsPerSlide = isMobile ? 2 : 10;
const maxIndex = Math.ceil(products.length / productsPerSlide) - 1;
  return (
    <div className="responsive-container">
      {/* <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <h1 style={{ color: "#007bff", fontSize: "24px" }}>BlueLink Printing</h1>
        <ul style={{ display: "flex", listStyle: "none", gap: "30px", margin: 0 }}>
          <li style={{ cursor: "pointer" }}>Home</li>
          <li style={{ cursor: "pointer" }}>Services</li>
          <li style={{ cursor: "pointer" }}>Upload</li>
          <li style={{ cursor: "pointer" }}>Contact</li>
        </ul>
      </nav> */}
      <Header />

      {/* Hero Section */}
      <HomeSlider  />
      {/* Features Section */}
<section style={{ padding: "20px 10px", backgroundColor: "#ffffff" }}>
  <div
  className="features-container"
    style={{
      display:"flex" ,
      justifyContent: "center",
      alignItems: "stretch",
      flexWrap: "wrap",
      gap: "20px",
      textAlign: "center",
      maxWidth: "900px",
      margin: "0 auto",
    }}
  >
    {/* Card 1 */}
    <div
      style={{
        flex: "1 1 260px",
        maxWidth: "280px",
        padding: "16px 12px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        
      }}
    >
      <img
        src="https://img.icons8.com/ios-filled/100/007bff/blueprint.png"
        alt="Print"
        style={{ marginBottom: "8px", height: "50px" }}
      />
      <h3 style={{ fontSize: "16px", marginBottom: "4px", fontWeight: "600" }}>
        High-Quality Prints
      </h3>
      <p style={{ color: "#555", fontSize: "13px", lineHeight: "1.4" }}>
        Crisp, clear, and durable blueprint prints for professionals.
      </p>
    </div>

    {/* Card 2 */}
    <div
      style={{
        flex: "1 1 260px",
        maxWidth: "280px",
        padding: "16px 12px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <img
        src="https://img.icons8.com/ios-filled/100/007bff/shipped.png"
        alt="Delivery"
        style={{ marginBottom: "8px", height: "50px" }}
      />
      <h3 style={{ fontSize: "16px", marginBottom: "4px", fontWeight: "600" }}>
        Fast Delivery
      </h3>
      <p style={{ color: "#555", fontSize: "13px", lineHeight: "1.4" }}>
        Next-day delivery available for urgent projects and deadlines.
      </p>
    </div>

    {/* Card 3 */}
    <div
      style={{
        flex: "1 1 260px",
        maxWidth: "280px",
        padding: "16px 12px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <img
        src="https://img.icons8.com/ios-filled/100/007bff/customer-support.png"
        alt="Support"
        style={{ marginBottom: "8px", height: "50px" }}
      />
      <h3 style={{ fontSize: "16px", marginBottom: "4px", fontWeight: "600" }}>
        Customer Support
      </h3>
      <p style={{ color: "#555", fontSize: "13px", lineHeight: "1.4" }}>
        Reach out any time—our team is here to help you succeed.
      </p>
    </div>
  </div>
</section>





<section style={{ 
  backgroundColor: "#f5f8f6", 
  padding: isMobile ? "1.5rem 1rem 2rem" : "1.875rem 0 2.5rem", 
  marginLeft: isMobile ? "0" : "6%", 
  marginRight: isMobile ? "0" : "6%", 
  textAlign: "center" 
}}>
  <h2
    style={{
      fontSize: isMobile ? "24px" : "32px",
      marginBottom: "12px",
      fontWeight: "700",
      color: "#111",
      position: "relative",
      display: "inline-block",
      paddingBottom: "0.75rem",
    }}
  >
    Popular Products
    <span
      style={{
        position: "absolute",
        left: "50%",
        bottom: "0",
        transform: "translateX(-50%)",
        width: "3.75rem",
        height: "0.25rem",
        backgroundColor: "#007abf",
        borderRadius: "0.125rem",
      }}
    ></span>
  </h2>

  <p
    style={{
      fontSize: isMobile ? "15px" : "17px",
      color: "#555",
      marginBottom: isMobile ? "30px" : "50px",
      maxWidth: isMobile ? "100%" : "700px",
      marginInline: "auto",
      lineHeight: "1.6",
      padding: isMobile ? "0 1rem" : "0",
    }}
  >
    These are tried and true favorites that will have you set to get down to business.
  </p>

  <div
    style={{
      maxWidth: isMobile ? "100%" : "75%",
      margin: isMobile ? "0 auto" : "0 16% 0 13%",
      padding: isMobile ? "0 2.5rem" : "0 1rem",
      position: "relative",
    }}
  >
    <button
      onClick={handlePrev}
      disabled={currentIndex === 0}
      style={{
        position: "absolute",
        left: isMobile ? "0" : "-2.5rem",
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: "50%",
        width: isMobile ? "2rem" : "2.5rem",
        height: isMobile ? "2rem" : "2.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: currentIndex === 0 ? "not-allowed" : "pointer",
        opacity: currentIndex === 0 ? 0.5 : 1,
        transition: "all 0.2s ease",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        zIndex: 10,
      }}
      onMouseEnter={(e) => {
        if (currentIndex !== 0) {
          e.currentTarget.style.backgroundColor = "#007abf";
          e.currentTarget.style.borderColor = "#007abf";
          e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#fff";
        e.currentTarget.style.borderColor = "#ddd";
        e.currentTarget.style.transform = "translateY(-50%) scale(1)";
      }}
    >
      <ChevronLeft size={isMobile ? 16 : 20} color={currentIndex === 0 ? "#ccc" : "#007abf"} />
    </button>

    <div style={{ overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          transition: "transform 0.4s ease-in-out",
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {Array.from({ length: Math.ceil(products.length / productsPerSlide) }).map((_, slideIndex) => (
          <div
            key={slideIndex}
            style={{
              flex: "0 0 100%",
              padding: isMobile ? "0 0.5rem" : "0 0.625rem",
              boxSizing: "border-box",
            }}
          >
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: isMobile ? "1rem" : "1.25rem" 
            }}>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: isMobile ? "1fr" : "repeat(5, 1fr)", 
                gap: isMobile ? "1rem" : "1.25rem" 
              }}>
                {products
                  .slice(slideIndex * productsPerSlide, slideIndex * productsPerSlide + (isMobile ? 1 : 5))
                  .map((product) => (
                    <div
                      key={product._id}
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "0.375rem",
                        overflow: "hidden",
                        boxShadow: "0 0.0625rem 0.375rem rgba(0,0,0,0.07)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-0.25rem)";
                        e.currentTarget.style.boxShadow = "0 0.375rem 0.75rem rgba(0,0,0,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 0.0625rem 0.375rem rgba(0,0,0,0.07)";
                      }}
                    >
                      <Link
                        to={`/allProducts/${product.categories && product.categories[0] ? product.categories[0] : ''}`}
                        style={{
                          width: "100%",
                          aspectRatio: "4/3",
                          overflow: "hidden",
                          display: "block",
                          textDecoration: "none",
                        }}
                      >
                        <img
                          src={product.images[0] || "https://via.placeholder.com/300"}
                          alt={product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            display: "block",
                            backgroundColor: "#f9f9f9",
                          }}
                        />
                      </Link>

                      <div
                        style={{
                          padding: "0.875rem",
                          borderTop: "1px solid #eee",
                          textAlign: "center",
                        }}
                      >
                        <Link
                          to={`/allProducts/${product.categories && product.categories[0] ? product.categories[0] : ''}`}
                          style={{
                            color: "#007abf",
                            textDecoration: "none",
                            fontWeight: "500",
                            fontSize: "0.9375rem",
                            display: "block",
                            marginBottom: "0.375rem",
                          }}
                        >
                          {product.name}
                        </Link>
                        <p style={{ fontSize: "0.875rem", color: "#444", margin: 0 }}>
                          ${product.price}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              <div style={{ 
                display: "grid", 
                gridTemplateColumns: isMobile ? "1fr" : "repeat(5, 1fr)", 
                gap: isMobile ? "1rem" : "1.25rem" 
              }}>
                {products
                  .slice(
                    slideIndex * productsPerSlide + (isMobile ? 1 : 5), 
                    slideIndex * productsPerSlide + productsPerSlide
                  )
                  .map((product) => (
                    <div
                      key={product._id}
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "0.375rem",
                        overflow: "hidden",
                        boxShadow: "0 0.0625rem 0.375rem rgba(0,0,0,0.07)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-0.25rem)";
                        e.currentTarget.style.boxShadow = "0 0.375rem 0.75rem rgba(0,0,0,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 0.0625rem 0.375rem rgba(0,0,0,0.07)";
                      }}
                    >
                      <Link
                        to={`/allProducts/${product.categories && product.categories[0] ? product.categories[0] : ''}`}
                        style={{
                          width: "100%",
                          aspectRatio: "4/3",
                          overflow: "hidden",
                          display: "block",
                          textDecoration: "none",
                        }}
                      >
                        <img
                          src={product.images[0] || "https://via.placeholder.com/300"}
                          alt={product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            display: "block",
                            backgroundColor: "#f9f9f9",
                          }}
                        />
                      </Link>

                      <div
                        style={{
                          padding: "0.875rem",
                          borderTop: "1px solid #eee",
                          textAlign: "center",
                        }}
                      >
                        <Link
                          to={`/allProducts/${product.categories && product.categories[0] ? product.categories[0] : ''}`}
                          style={{
                            color: "#007abf",
                            textDecoration: "none",
                            fontWeight: "500",
                            fontSize: "0.9375rem",
                            display: "block",
                            marginBottom: "0.375rem",
                          }}
                        >
                          {product.name}
                        </Link>
                        <p style={{ fontSize: "0.875rem", color: "#444", margin: 0 }}>
                          ${product.price}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <button
      onClick={handleNext}
      disabled={currentIndex === maxIndex}
      style={{
        position: "absolute",
        right: isMobile ? "0" : "-2.5rem",
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: "50%",
        width: isMobile ? "2rem" : "2.5rem",
        height: isMobile ? "2rem" : "2.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: currentIndex === maxIndex ? "not-allowed" : "pointer",
        opacity: currentIndex === maxIndex ? 0.5 : 1,
        transition: "all 0.2s ease",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        zIndex: 10,
      }}
      onMouseEnter={(e) => {
        if (currentIndex !== maxIndex) {
          e.currentTarget.style.backgroundColor = "#007abf";
          e.currentTarget.style.borderColor = "#007abf";
          e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#fff";
        e.currentTarget.style.borderColor = "#ddd";
        e.currentTarget.style.transform = "translateY(-50%) scale(1)";
      }}
    >
      <ChevronRight size={isMobile ? 16 : 20} color={currentIndex === maxIndex ? "#ccc" : "#007abf"} />
    </button>
  </div>

  <div style={{ 
    display: "flex", 
    justifyContent: "center", 
    gap: "0.5rem", 
    marginTop: "1.5rem" 
  }}>
    {Array.from({ length: maxIndex + 1 }).map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentIndex(index)}
        style={{
          width: isMobile ? "0.5rem" : "0.625rem",
          height: isMobile ? "0.5rem" : "0.625rem",
          borderRadius: "50%",
          border: "none",
          backgroundColor: currentIndex === index ? "#007abf" : "#ddd",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
      />
    ))}
  </div>
</section>




    
<FlyerSection/>

{/*  */}








<EnhancedHomeSections/>









{/* Personalized Gifts Section - Mobile Responsive */}
<section style={{ backgroundColor: "#f5f8f6", padding: "1.875rem 0 2.5rem", textAlign: "center", marginLeft: "6%", marginRight: "6%" }}>
  <style>{`
    @media (max-width: 1023px) {
      section[style*="marginLeft"] {
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-left: 1rem !important;
        padding-right: 1rem !important;
      }
    }

    .section-title-responsive {
      font-size: 32px;
      margin-bottom: 12px;
      font-weight: 700;
      color: #111;
    }

    @media (max-width: 767px) {
      .section-title-responsive {
        font-size: 24px;
      }
    }

    .section-description-responsive {
      font-size: 17px;
      color: #555;
      margin-bottom: 50px;
      max-width: 700px;
      margin-inline: auto;
      line-height: 1.6;
    }

    @media (max-width: 767px) {
      .section-description-responsive {
        font-size: 15px;
        margin-bottom: 30px;
        padding: 0 0.5rem;
      }
    }

    .products-container-responsive {
      max-width: 75%;
      margin: 0 16% 0 13%;
      padding: 0 1rem;
    }

    @media (max-width: 1023px) {
      .products-container-responsive {
        max-width: 100%;
        margin: 0;
        padding: 0 0.5rem;
      }
    }

    .products-grid-responsive {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1.25rem;
    }

    @media (max-width: 1279px) and (min-width: 1024px) {
      .products-grid-responsive {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    @media (max-width: 1023px) and (min-width: 768px) {
      .products-grid-responsive {
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
      }
    }

    @media (max-width: 767px) and (min-width: 480px) {
      .products-grid-responsive {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.875rem;
      }
    }

    @media (max-width: 479px) {
      .products-grid-responsive {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
      }
    }

    .product-card-responsive {
      background-color: #fff;
      border-radius: 0.375rem;
      overflow: hidden;
      box-shadow: 0 0.0625rem 0.375rem rgba(0,0,0,0.07);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .product-card-responsive:hover {
      transform: translateY(-4px);
      box-shadow: 0 0.25rem 0.75rem rgba(0,0,0,0.12);
    }

    .product-info-responsive {
      padding: 0.875rem;
      border-top: 1px solid #eee;
      text-align: center;
    }

    @media (max-width: 767px) {
      .product-info-responsive {
        padding: 0.75rem 0.5rem;
      }
    }

    .product-name-responsive {
      color: #007abf;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9375rem;
      display: block;
      margin-bottom: 0.375rem;
    }

    @media (max-width: 767px) {
      .product-name-responsive {
        font-size: 0.875rem;
      }
    }

    .product-name-responsive:hover {
      text-decoration: underline;
    }

    .product-price-responsive {
      font-size: 0.875rem;
      color: #444;
      margin: 0;
    }

    @media (max-width: 767px) {
      .product-price-responsive {
        font-size: 0.8125rem;
      }
    }
  `}</style>

  <h2 className="section-title-responsive">
    Personalized Gifts
  </h2>
  <p className="section-description-responsive">
    Make every occasion special with personalized gifts designed to create
    lasting memories.
  </p>
  <div className="products-container-responsive">
    <div className="products-grid-responsive">
      {products
        .filter((product) => {
          const category =
            typeof product.category === "string"
              ? product.category.toLowerCase()
              : "";
          const name =
            typeof product.name === "string"
              ? product.name.toLowerCase()
              : "";
          return category.includes("photoframe") || name.includes("photo frame") || name.includes("mugs");
        })
        .slice(0, 8)
        .map((gift) => (
          <div key={gift._id} className="product-card-responsive">
            <Link
              to={`/product/${gift._id}`}
              style={{
                width: "100%",
                aspectRatio: "4/3",
                overflow: "hidden",
                display: "block",
              }}
            >
              <img
                src={gift.images[0] || "https://via.placeholder.com/300"}
                alt={gift.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                  backgroundColor: "#f9f9f9",
                }}
              />
            </Link>

            <div className="product-info-responsive">
              <Link
                to={`/product/${gift._id}`}
                className="product-name-responsive"
              >
                {gift.name}
              </Link>
              <p className="product-price-responsive">
                ${gift.price}
              </p>
            </div>
          </div>
        ))}
    </div>
  </div>
</section>

{/* Flyers Section - Mobile Responsive */}
<section style={{ backgroundColor: "#f5f8f6", padding: "1.875rem 0 2.5rem", textAlign: "center", marginLeft: "6%", marginRight: "6%" }}>
  <h2 className="section-title-responsive">
    Our Flyers
  </h2>
  <p className="section-description-responsive">
    Showcase your business with professional, eye-catching flyers designed to
    leave a lasting impression.
  </p>
  <div className="products-container-responsive">
    <div className="products-grid-responsive">
      {products
        .filter((product) => {
          const category =
            typeof product.category === "string"
              ? product.category.toLowerCase()
              : "";
          const name =
            typeof product.name === "string"
              ? product.name.toLowerCase()
              : "";
          return category.includes("flyer") || name.includes("flyer");
        })
        .slice(0, 8)
        .map((flyer) => (
          <div key={flyer._id} className="product-card-responsive">
            <Link
              to={`/product/${flyer._id}`}
              style={{
                width: "100%",
                aspectRatio: "4/3",
                overflow: "hidden",
                display: "block",
              }}
            >
              <img
                src={flyer.images[0] || "https://via.placeholder.com/300"}
                alt={flyer.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                  backgroundColor: "#f9f9f9",
                }}
              />
            </Link>

            <div className="product-info-responsive">
              <Link
                to={`/product/${flyer._id}`}
                className="product-name-responsive"
              >
                {flyer.name}
              </Link>
              <p className="product-price-responsive">
                ${flyer.price}
              </p>
            </div>
          </div>
        ))}
    </div>
  </div>
</section>
      {/* CTA Banner */}
      <section
  style={{
    padding: "60px 0",
    backgroundColor: "#007bff",
    color: "#ffffff",
    textAlign: "center",
       marginLeft:"6%",
       marginRight:"6%",
  }}
>
  <div
    style={{
      maxWidth: "65%",
      margin: "0 auto",
      padding: "0 20px",
      // width: "100%",
   
    }}
  >
    <h2 style={{ fontSize: "28px", marginBottom: "15px" }}>
      Let's Get Your Plans Printed!
    </h2>
    <p style={{ fontSize: "18px", marginBottom: "25px" }}>
      Simple process. High-quality. Always on time.
    </p>
    <a href="/sign-in">
      <button
        style={{
          padding: "10px 28px",
          fontSize: "16px",
          backgroundColor: "#ffffff",
          color: "#007bff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Start Now
      </button>
    </a>
  </div>
</section>


      <Footer />



    </div>


  );
};

export default Home;
