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



const isWindow = typeof window !== "undefined";
const [isMobile, setIsMobile] = useState(isWindow ? window.innerWidth < 768 : false);
const [isTablet, setIsTablet] = useState(
  isWindow ? window.innerWidth >= 768 && window.innerWidth < 1024 : false
);


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

const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);

useEffect(() => {
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);


  const getPadding = () => {
  const width = window.innerWidth;
  if (width <= 768) return "1rem";
  if (width < 1200) return "1.5rem";
  return "2.5rem";
};


const [currentPage, setCurrentPage] = useState(0);

const filteredProducts = products.filter((product) => {
  const category = typeof product.category === "string" ? product.category.toLowerCase() : "";
  const name = typeof product.name === "string" ? product.name.toLowerCase() : "";
  return category.includes("photoframe") || name.includes("photo frame") || name.includes("mugs");
});

const productsPerPage = windowWidth < 640 ? 2 : windowWidth < 1024 ? 4 : 8;
const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

const handleNextPage = () => {
  if (currentPage < totalPages - 1) {
    setCurrentPage(currentPage + 1);
  }
};

const handlePrevPage = () => {
  if (currentPage > 0) {
    setCurrentPage(currentPage - 1);
  }
};

const startIndex = currentPage * productsPerPage;
const endIndex = startIndex + productsPerPage;
const visibleProducts = filteredProducts.slice(startIndex, endIndex);


const [currentFlyerPage, setCurrentFlyerPage] = useState(0);

// Add this before the return statement
const filteredFlyers = products.filter((product) => {
  const category = typeof product.category === "string" ? product.category.toLowerCase() : "";
  const name = typeof product.name === "string" ? product.name.toLowerCase() : "";
  return category.includes("flyer") || name.includes("flyer");
});

const flyersPerPage = windowWidth < 640 ? 2 : windowWidth < 1024 ? 4 : windowWidth < 1280 ? 8 : 10;
const totalFlyerPages = Math.ceil(filteredFlyers.length / flyersPerPage);
const flyerStartIndex = currentFlyerPage * flyersPerPage;
const flyerEndIndex = flyerStartIndex + flyersPerPage;
const visibleFlyers = filteredFlyers.slice(flyerStartIndex, flyerEndIndex);

const handleNextFlyerPage = () => {
  if (currentFlyerPage < totalFlyerPages - 1) {
    setCurrentFlyerPage(currentFlyerPage + 1);
  }
};

const handlePrevFlyerPage = () => {
  if (currentFlyerPage > 0) {
    setCurrentFlyerPage(currentFlyerPage - 1);
  }
};


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


// Replace your existing itemsPerView and maxIndex with:
const productsPerSlide = isMobile ? 2 : 10;
const maxIndex = Math.ceil(products.length / productsPerSlide) - 1;
 
// Add this state at the top of your component (similar to Header)


// Add this useEffect for responsive detection
// useEffect(() => {
//   if (!isWindow) return;
//   const onResize = () => {
//     setIsMobile(window.innerWidth < 768);
//     setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
//   };
//   window.addEventListener("resize", onResize);
//   return () => window.removeEventListener("resize", onResize);
// }, [isWindow]);


return (
     <div style={{ backgroundColor: "#e6f2ff", width: "100%", minHeight: "100vh" }}>
    <div className="responsive-container"  >
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
<section
  style={{
    padding: isMobile ? "1.25rem 1rem" : "1.875rem 2rem",
    backgroundColor: "#ffffff",
    width: "100%",
    boxSizing: "border-box",
  }}
>
  <div
    className="features-container"
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "stretch",
      flexWrap: "wrap",
      gap: isMobile ? "1rem" : "1.25rem",
      textAlign: "center",
      maxWidth: isMobile ? "100%" : isTablet ? "90%" : "65%",
      margin: "0 auto",
      width: "100%",
    }}
  >
    {[
      {
        img: "https://img.icons8.com/ios-filled/100/007bff/blueprint.png",
        title: "High-Quality Prints",
        text: "Crisp, clear, and durable blueprint prints for professionals.",
      },
      {
        img: "https://img.icons8.com/ios-filled/100/007bff/shipped.png",
        title: "Fast Delivery",
        text: "Next-day delivery available for urgent projects and deadlines.",
      },
      {
        img: "https://img.icons8.com/ios-filled/100/007bff/customer-support.png",
        title: "Customer Support",
        text: "Reach out any time—our team is here to help you succeed.",
      },
    ].map((card, i) => (
      <div
        key={i}
        style={{
          flex: isMobile ? "1 1 100%" : isTablet ? "1 1 calc(50% - 1.25rem)" : "1 1 16.25rem",
          maxWidth: isMobile ? "100%" : isTablet ? "20rem" : "17.5rem",
          padding: isMobile ? "1rem 0.75rem" : "1rem 0.75rem",
          borderRadius: "0.5rem",
          boxShadow: "0 0.125rem 0.375rem rgba(0,0,0,0.05)",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          transition: "transform 0.2s ease",
          boxSizing: "border-box",
        }}
        onMouseEnter={(e) => {
          if (!isMobile) e.currentTarget.style.transform = "translateY(-0.3125rem)";
        }}
        onMouseLeave={(e) => {
          if (!isMobile) e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <img
          src={card.img}
          alt={card.title}
          style={{
            marginBottom: "0.5rem",
            height: isMobile ? "2.5rem" : "3.125rem",
            width: "auto",
          }}
        />
        <h3
          style={{
            fontSize: isMobile ? "0.9375rem" : "1rem",
            marginBottom: "0.25rem",
            fontWeight: "600",
            color: "#111",
          }}
        >
          {card.title}
        </h3>
        <p
          style={{
            color: "#555",
            fontSize: isMobile ? "0.8125rem" : "0.8125rem",
            lineHeight: "1.4",
            margin: 0,
          }}
        >
          {card.text}
        </p>
      </div>
    ))}
  </div>

  <style>
    {`
      .features-container > div:hover {
        box-shadow: 0 0.25rem 0.75rem rgba(0,0,0,0.1);
      }

      /* Mobile optimization */
      @media (max-width: 767px) {
        .features-container {
          padding: 0 0.625rem;
        }
        .features-container > div {
          width: 100% !important;
          max-width: 100% !important;
        }
      }

      /* Tablet optimization */
      @media (min-width: 768px) and (max-width: 1023px) {
        .features-container > div {
          flex: 1 1 calc(50% - 1.25rem) !important;
          max-width: 20rem !important;
        }
      }

      /* Desktop optimization */
      @media (min-width: 1024px) {
        .features-container > div {
          flex: 1 1 16.25rem !important;
        }
      }

      /* Large desktop scaling */
      @media (min-width: 900px) {
        .features-container {
          max-width: 68.75rem !important;
        }
      }

      /* Extra large screens */
      @media (min-width: 1920px) {
        .features-container {
          max-width: 75rem !important;
        }
      }
    `}
  </style>
</section>









<section style={{ 
  backgroundColor: "#f5f8f6", 
  padding: "0",
  width: "100%",
  boxSizing: "border-box",
}}>
  {/* Wrapper matching Header layout */}
    <div
    style={{
      maxWidth: "1440px",
      margin: "0 auto",
      width: "100%",
      paddingTop: isMobile ? "1.5rem" : "1.875rem",
      paddingBottom: isMobile ? "2rem" : "2.5rem",
      paddingLeft: isMobile ? "1rem" : windowWidth < 1200 ? "1.5rem" : "2.5rem",
      paddingRight: isMobile ? "1rem" : windowWidth < 1200 ? "1.5rem" : "2.5rem",
      boxSizing: "border-box",
      textAlign: "center",
    }}
  >
    <h2
      style={{
        fontSize: isMobile ? "1.5rem" : "2rem",
        marginBottom: "0.75rem",
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
        fontSize: isMobile ? "0.9375rem" : "1.0625rem",
        color: "#555",
        marginBottom: isMobile ? "1.875rem" : "3.125rem",
        maxWidth: isMobile ? "100%" : "43.75rem",
        marginInline: "auto",
        lineHeight: "1.6",
        padding: isMobile ? "0" : "0",
      }}
    >
      These are tried and true favorites that will have you set to get down to business.
    </p>

    <div
      style={{
        width: "100%",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        style={{
          position: "absolute",
          left: isMobile ? "-2.5rem" : "-3.75rem",
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "#fff",
          border: "0.0625rem solid #ddd",
          borderRadius: "50%",
          width: isMobile ? "2rem" : "2.5rem",
          height: isMobile ? "2rem" : "2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: currentIndex === 0 ? "not-allowed" : "pointer",
          opacity: currentIndex === 0 ? 0.5 : 1,
          transition: "all 0.2s ease",
          boxShadow: "0 0.125rem 0.5rem rgba(0,0,0,0.1)",
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
                {/* First Row */}
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
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        }}
                        onMouseEnter={(e) => {
                          if (!isMobile) {
                            e.currentTarget.style.transform = "translateY(-0.25rem)";
                            e.currentTarget.style.boxShadow = "0 0.375rem 0.75rem rgba(0,0,0,0.15)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isMobile) {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 0.0625rem 0.375rem rgba(0,0,0,0.07)";
                          }
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
                            flexShrink: 0,
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
                            padding: "0.75rem",
                            borderTop: "0.0625rem solid #eee",
                            textAlign: "center",
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            gap: "0.5rem",
                          }}
                        >
                          <Link
                            to={`/allProducts/${product.categories && product.categories[0] ? product.categories[0] : ''}`}
                            style={{
                              color: "#007abf",
                              textDecoration: "none",
                              fontWeight: "500",
                              fontSize: "0.8rem",
                              height: "2.4rem",
                              overflow: "hidden",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              lineHeight: "1.2",
                              wordWrap: "break-word",
                              hyphens: "auto",
                            }}
                          >
                            {product.name}
                          </Link>
                          
                          <p 
                            style={{ 
                              fontSize: "0.875rem", 
                              color: "#007abf",
                              fontWeight: "600",
                              margin: 0,
                            }}
                          >
                            ${product.price}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Second Row */}
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
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        }}
                        onMouseEnter={(e) => {
                          if (!isMobile) {
                            e.currentTarget.style.transform = "translateY(-0.25rem)";
                            e.currentTarget.style.boxShadow = "0 0.375rem 0.75rem rgba(0,0,0,0.15)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isMobile) {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 0.0625rem 0.375rem rgba(0,0,0,0.07)";
                          }
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
                            flexShrink: 0,
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
                            padding: "0.75rem",
                            borderTop: "0.0625rem solid #eee",
                            textAlign: "center",
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            gap: "0.5rem",
                          }}
                        >
                          <Link
                            to={`/allProducts/${product.categories && product.categories[0] ? product.categories[0] : ''}`}
                            style={{
                              color: "#007abf",
                              textDecoration: "none",
                              fontWeight: "500",
                              fontSize: "0.8rem",
                              height: "2.4rem",
                              overflow: "hidden",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              lineHeight: "1.2",
                              wordWrap: "break-word",
                              hyphens: "auto",
                            }}
                          >
                            {product.name}
                          </Link>
                          
                          <p 
                            style={{ 
                              fontSize: "0.875rem", 
                              color: "#007abf",
                              fontWeight: "600",
                              margin: 0,
                            }}
                          >
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
          right: isMobile ? "-2.5rem" : "-3.75rem",
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "#fff",
          border: "0.0625rem solid #ddd",
          borderRadius: "50%",
          width: isMobile ? "2rem" : "2.5rem",
          height: isMobile ? "2rem" : "2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: currentIndex === maxIndex ? "not-allowed" : "pointer",
          opacity: currentIndex === maxIndex ? 0.5 : 1,
          transition: "all 0.2s ease",
          boxShadow: "0 0.125rem 0.5rem rgba(0,0,0,0.1)",
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
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  </div>
</section>






    
<FlyerSection/>

{/*  */}








<EnhancedHomeSections/>









{/* Personalized Gifts Section - Mobile Responsive */}
  <section style={{ 
    backgroundColor: "#f5f8f6",
    width: "100%",
    margin: "0",
    padding: "0",
    boxSizing: "border-box",
  }}>
    <div style={{
      maxWidth: "1440px",
      margin: "0 auto",
      width: "100%",
      boxSizing: "border-box",
    }}>
      <div style={{
        paddingLeft: getPadding(),
        paddingRight: getPadding(),
        paddingTop: windowWidth < 1050 ? '1.5rem' : '1.875rem',
        paddingBottom: windowWidth < 1050 ? '2rem' : '2.5rem',
        boxSizing: "border-box",
        textAlign: "center",
      }}>
        <h2
          style={{
            fontSize: windowWidth < 768 ? "1.5rem" : "2rem",
            marginBottom: "0.75rem",
            fontWeight: "700",
            color: "#111",
            position: "relative",
            display: "inline-block",
            paddingBottom: "0.75rem",
          }}
        >
          Personalized Gifts
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
            fontSize: windowWidth < 768 ? "0.9375rem" : "1.0625rem",
            color: "#555",
            marginBottom: windowWidth < 768 ? "1.875rem" : "3.125rem",
            maxWidth: windowWidth < 768 ? "100%" : "43.75rem",
            marginInline: "auto",
            lineHeight: "1.6",
            padding: "0",
          }}
        >
          Make every occasion special with personalized gifts designed to create lasting memories.
        </p>

        <div
          style={{
            width: "100%",
            position: "relative",
            boxSizing: "border-box",
          }}
        >
          {/* Navigation Arrows for Mobile */}
          {windowWidth < 640 && currentPage > 0 && (
            <button
              onClick={handlePrevPage}
              style={{
                position: "absolute",
                left: "-0.625rem",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "0.0625rem solid #ddd",
                borderRadius: "50%",
                width: "2rem",
                height: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
                boxShadow: "0 0.125rem 0.375rem rgba(0,0,0,0.15)",
              }}
            >
              <span style={{ fontSize: "1.25rem", color: "#007abf" }}>‹</span>
            </button>
          )}
          
          {windowWidth < 640 && currentPage < totalPages - 1 && (
            <button
              onClick={handleNextPage}
              style={{
                position: "absolute",
                right: "-0.625rem",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "0.0625rem solid #ddd",
                borderRadius: "50%",
                width: "2rem",
                height: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
                boxShadow: "0 0.125rem 0.375rem rgba(0,0,0,0.15)",
              }}
            >
              <span style={{ fontSize: "1.25rem", color: "#007abf" }}>›</span>
            </button>
          )}

          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: windowWidth < 768 ? "1rem" : "1.25rem" 
          }}>
            {/* First Row */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: windowWidth < 640 
                ? "1fr" 
                : windowWidth < 1024 
                ? "repeat(2, 1fr)" 
                : windowWidth < 1280
                ? "repeat(4, 1fr)"
                : "repeat(5, 1fr)", 
              gap: windowWidth < 768 ? "1rem" : "1.25rem" 
            }}>
              {visibleProducts
                .slice(0, windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : windowWidth < 1280 ? 4 : 5)
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
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                    onMouseEnter={(e) => {
                      if (windowWidth >= 768) {
                        e.currentTarget.style.transform = "translateY(-0.25rem)";
                        e.currentTarget.style.boxShadow = "0 0.375rem 0.75rem rgba(0,0,0,0.15)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (windowWidth >= 768) {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 0.0625rem 0.375rem rgba(0,0,0,0.07)";
                      }
                    }}
                  >
                    <Link
                      to={`/product/${product._id}`}
                      style={{
                        width: "100%",
                        aspectRatio: "4/3",
                        overflow: "hidden",
                        display: "block",
                        textDecoration: "none",
                        flexShrink: 0,
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
                        padding: "0.75rem",
                        borderTop: "0.0625rem solid #eee",
                        textAlign: "center",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        gap: "0.5rem",
                      }}
                    >
                      <Link
                        to={`/product/${product._id}`}
                        style={{
                          color: "#007abf",
                          textDecoration: "none",
                          fontWeight: "500",
                          fontSize: "0.8rem",
                          height: "2.4rem",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          lineHeight: "1.2",
                          wordWrap: "break-word",
                          hyphens: "auto",
                        }}
                      >
                        {product.name}
                      </Link>
                      
                      <p 
                        style={{ 
                          fontSize: "0.875rem", 
                          color: "#007abf",
                          fontWeight: "600",
                          margin: 0,
                        }}
                      >
                        ${product.price}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Second Row */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: windowWidth < 640 
                ? "1fr" 
                : windowWidth < 1024 
                ? "repeat(2, 1fr)" 
                : windowWidth < 1280
                ? "repeat(4, 1fr)"
                : "repeat(5, 1fr)", 
              gap: windowWidth < 768 ? "1rem" : "1.25rem" 
            }}>
              {visibleProducts
                .slice(
                  windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : windowWidth < 1280 ? 4 : 5,
                  windowWidth < 640 ? 2 : windowWidth < 1024 ? 4 : 8
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
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                    onMouseEnter={(e) => {
                      if (windowWidth >= 768) {
                        e.currentTarget.style.transform = "translateY(-0.25rem)";
                        e.currentTarget.style.boxShadow = "0 0.375rem 0.75rem rgba(0,0,0,0.15)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (windowWidth >= 768) {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 0.0625rem 0.375rem rgba(0,0,0,0.07)";
                      }
                    }}
                  >
                    <Link
                      to={`/product/${product._id}`}
                      style={{
                        width: "100%",
                        aspectRatio: "4/3",
                        overflow: "hidden",
                        display: "block",
                        textDecoration: "none",
                        flexShrink: 0,
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
                        padding: "0.75rem",
                        borderTop: "0.0625rem solid #eee",
                        textAlign: "center",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        gap: "0.5rem",
                      }}
                    >
                      <Link
                        to={`/product/${product._id}`}
                        style={{
                          color: "#007abf",
                          textDecoration: "none",
                          fontWeight: "500",
                          fontSize: "0.8rem",
                          height: "2.4rem",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          lineHeight: "1.2",
                          wordWrap: "break-word",
                          hyphens: "auto",
                        }}
                      >
                        {product.name}
                      </Link>
                      
                      <p 
                        style={{ 
                          fontSize: "0.875rem", 
                          color: "#007abf",
                          fontWeight: "600",
                          margin: 0,
                        }}
                      >
                        ${product.price}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

{/* Flyers Section - Mobile Responsive */}
 <section style={{ 
    backgroundColor: "#f5f8f6",
    width: "100%",
    margin: "0",
    padding: "0",
    boxSizing: "border-box",
  }}>
    <div style={{
      maxWidth: "1440px",
      margin: "0 auto",
      width: "100%",
      boxSizing: "border-box",
    }}>
      <div style={{
        paddingLeft: getPadding(),
        paddingRight: getPadding(),
        paddingTop: windowWidth < 1050 ? '1.5rem' : '1.875rem',
        paddingBottom: windowWidth < 1050 ? '2rem' : '2.5rem',
        boxSizing: "border-box",
        textAlign: "center",
      }}>
        <h2
          style={{
            fontSize: windowWidth < 768 ? "1.5rem" : "2rem",
            marginBottom: "0.75rem",
            fontWeight: "700",
            color: "#111",
            position: "relative",
            display: "inline-block",
            paddingBottom: "0.75rem",
          }}
        >
          Our Flyers
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
            fontSize: windowWidth < 768 ? "0.9375rem" : "1.0625rem",
            color: "#555",
            marginBottom: windowWidth < 768 ? "1.875rem" : "3.125rem",
            maxWidth: windowWidth < 768 ? "100%" : "43.75rem",
            marginInline: "auto",
            lineHeight: "1.6",
            padding: "0",
          }}
        >
          Showcase your business with professional, eye-catching flyers designed to leave a lasting impression.
        </p>

        <div
          style={{
            width: "100%",
            position: "relative",
            boxSizing: "border-box",
          }}
        >
          {/* Navigation Arrows for Mobile */}
          {windowWidth < 640 && currentFlyerPage > 0 && (
            <button
              onClick={handlePrevFlyerPage}
              style={{
                position: "absolute",
                left: "-0.625rem",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "0.0625rem solid #ddd",
                borderRadius: "50%",
                width: "2rem",
                height: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
                boxShadow: "0 0.125rem 0.375rem rgba(0,0,0,0.15)",
              }}
            >
              <span style={{ fontSize: "1.25rem", color: "#007abf" }}>‹</span>
            </button>
          )}
          
          {windowWidth < 640 && currentFlyerPage < totalFlyerPages - 1 && (
            <button
              onClick={handleNextFlyerPage}
              style={{
                position: "absolute",
                right: "-0.625rem",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "0.0625rem solid #ddd",
                borderRadius: "50%",
                width: "2rem",
                height: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
                boxShadow: "0 0.125rem 0.375rem rgba(0,0,0,0.15)",
              }}
            >
              <span style={{ fontSize: "1.25rem", color: "#007abf" }}>›</span>
            </button>
          )}

          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: windowWidth < 768 ? "1rem" : "1.25rem" 
          }}>
            {/* First Row */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: windowWidth < 640 
                ? "1fr" 
                : windowWidth < 1024 
                ? "repeat(2, 1fr)" 
                : windowWidth < 1280
                ? "repeat(4, 1fr)"
                : "repeat(5, 1fr)", 
              gap: windowWidth < 768 ? "1rem" : "1.25rem" 
            }}>
              {visibleFlyers
                .slice(0, windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : windowWidth < 1280 ? 4 : 5)
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
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                    onMouseEnter={(e) => {
                      if (windowWidth >= 768) {
                        e.currentTarget.style.transform = "translateY(-0.25rem)";
                        e.currentTarget.style.boxShadow = "0 0.375rem 0.75rem rgba(0,0,0,0.15)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (windowWidth >= 768) {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 0.0625rem 0.375rem rgba(0,0,0,0.07)";
                      }
                    }}
                  >
                    <Link
                      to={`/product/${product._id}`}
                      style={{
                        width: "100%",
                        aspectRatio: "4/3",
                        overflow: "hidden",
                        display: "block",
                        textDecoration: "none",
                        flexShrink: 0,
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
                        padding: "0.75rem",
                        borderTop: "0.0625rem solid #eee",
                        textAlign: "center",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        gap: "0.5rem",
                      }}
                    >
                      <Link
                        to={`/product/${product._id}`}
                        style={{
                          color: "#007abf",
                          textDecoration: "none",
                          fontWeight: "500",
                          fontSize: "0.8rem",
                          height: "2.4rem",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          lineHeight: "1.2",
                          wordWrap: "break-word",
                          hyphens: "auto",
                        }}
                      >
                        {product.name}
                      </Link>
                      
                      <p 
                        style={{ 
                          fontSize: "0.875rem", 
                          color: "#007abf",
                          fontWeight: "600",
                          margin: 0,
                        }}
                      >
                        ${product.price}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Second Row */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: windowWidth < 640 
                ? "1fr" 
                : windowWidth < 1024 
                ? "repeat(2, 1fr)" 
                : windowWidth < 1280
                ? "repeat(4, 1fr)"
                : "repeat(5, 1fr)", 
              gap: windowWidth < 768 ? "1rem" : "1.25rem" 
            }}>
              {visibleFlyers
                .slice(
                  windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : windowWidth < 1280 ? 4 : 5,
                  windowWidth < 640 ? 2 : windowWidth < 1024 ? 4 : 8
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
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                    onMouseEnter={(e) => {
                      if (windowWidth >= 768) {
                        e.currentTarget.style.transform = "translateY(-0.25rem)";
                        e.currentTarget.style.boxShadow = "0 0.375rem 0.75rem rgba(0,0,0,0.15)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (windowWidth >= 768) {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 0.0625rem 0.375rem rgba(0,0,0,0.07)";
                      }
                    }}
                  >
                    <Link
                      to={`/product/${product._id}`}
                      style={{
                        width: "100%",
                        aspectRatio: "4/3",
                        overflow: "hidden",
                        display: "block",
                        textDecoration: "none",
                        flexShrink: 0,
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
                        padding: "0.75rem",
                        borderTop: "0.0625rem solid #eee",
                        textAlign: "center",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        gap: "0.5rem",
                      }}
                    >
                      <Link
                        to={`/product/${product._id}`}
                        style={{
                          color: "#007abf",
                          textDecoration: "none",
                          fontWeight: "500",
                          fontSize: "0.8rem",
                          height: "2.4rem",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          lineHeight: "1.2",
                          wordWrap: "break-word",
                          hyphens: "auto",
                        }}
                      >
                        {product.name}
                      </Link>
                      
                      <p 
                        style={{ 
                          fontSize: "0.875rem", 
                          color: "#007abf",
                          fontWeight: "600",
                          margin: 0,
                        }}
                      >
                        ${product.price}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
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
  
</section>


      <Footer />



    </div>
</div>

  );
};

export default Home;
