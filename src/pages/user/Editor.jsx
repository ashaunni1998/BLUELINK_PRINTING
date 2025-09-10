// src/pages/user/Editor.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const templates = [
    {
      id: "upload",
      name: "Upload your own design",
      price: "₹350.00",
      type: "upload",
    },
    {
      id: "t1",
      name: "325 ml Wrap-around",
      price: "₹350.00",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqRXGavAh-cg-gqJ-ioFCgEqMS3Mqx3tvz6A&s",
    },
    {
      id: "t2",
      name: "325 ml 2 Sided",
      price: "₹300.00",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqRXGavAh-cg-gqJ-ioFCgEqMS3Mqx3tvz6A&s",
    },
    {
      id: "t3",
      name: "325 ml Wrap-around",
      price: "₹350.00",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqRXGavAh-cg-gqJ-ioFCgEqMS3Mqx3tvz6A&s",
    },
  ];

  const handleClick = (tpl) => {
    if (tpl.type === "upload") {
      navigate(`/design-selector/${id}`);
    } else {
      alert(`/other-design-selector/${id}`);
    }
  };

  // Responsive styles
  const styles = {
    container: {
      backgroundColor: "#f8f9fa",
      minHeight: "100vh"
    },
    contentWrapper: {
      padding: windowWidth < 768 ? "20px" : "40px",
      maxWidth: "1200px",
      margin: "0 auto"
    },
    heading: {
      marginBottom: windowWidth < 768 ? "30px" : "40px",
      fontSize: windowWidth < 480 ? "20px" : windowWidth < 768 ? "24px" : "28px",
      fontWeight: "700",
      color: "#1b6dbf",
      textAlign: "center",
      letterSpacing: "1px",
      textTransform: "uppercase",
      paddingBottom: "8px",
      margin: "0 auto",
      display: "block",
      lineHeight: "1.3"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: windowWidth < 480 
        ? "1fr" 
        : windowWidth < 768 
        ? "repeat(2, 1fr)" 
        : "repeat(auto-fit, minmax(220px, 1fr))",
      gap: windowWidth < 768 ? "15px" : "20px",
      marginBottom: "40px"
    },
    card: {
      background: "#fff",
      border: "1px solid #e0e0e0",
      borderRadius: "12px",
      padding: windowWidth < 768 ? "12px" : "16px",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      position: "relative",
      overflow: "hidden"
    },
    uploadCard: {
      background: "#f8f9f6",
      border: "2px dashed #1b6dbf",
      borderRadius: "12px",
      padding: windowWidth < 768 ? "20px 12px" : "24px 16px",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      position: "relative"
    },
    uploadIcon: {
      width: windowWidth < 768 ? "50px" : "60px",
      height: windowWidth < 768 ? "50px" : "60px",
      borderRadius: "50%",
      border: "2px dashed #1b6dbf",
      margin: "0 auto 15px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#fff",
      color: "#1b6dbf"
    },
    templateImage: {
      width: "100%",
      height: windowWidth < 480 ? "120px" : windowWidth < 768 ? "130px" : "150px",
      objectFit: "cover",
      borderRadius: "8px",
      marginBottom: "12px"
    },
    templateName: {
      fontWeight: "600",
      fontSize: windowWidth < 768 ? "14px" : "16px",
      color: "#333",
      marginBottom: "6px",
      lineHeight: "1.4"
    },
    templatePrice: {
      fontSize: windowWidth < 768 ? "12px" : "14px",
      color: "#666",
      fontWeight: "500"
    },
    hoverEffect: {
      ':hover': {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        borderColor: "#1b6dbf"
      }
    }
  };

  return (
    <div style={styles.container}>
      <div className="responsive-container">
        <Header />
        
        <div style={styles.contentWrapper}>
          <h2 style={styles.heading}>
            Choose Your Design
          </h2>

          <div style={styles.grid}>
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => handleClick(tpl)}
                style={tpl.type === "upload" ? styles.uploadCard : styles.card}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                  if (tpl.type === "upload") {
                    e.target.style.borderColor = "#0f5a9f";
                    e.target.style.background = "#f0f4f8";
                  } else {
                    e.target.style.borderColor = "#1b6dbf";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = tpl.type === "upload" 
                    ? "0 2px 8px rgba(0,0,0,0.05)" 
                    : "0 2px 8px rgba(0,0,0,0.1)";
                  if (tpl.type === "upload") {
                    e.target.style.borderColor = "#1b6dbf";
                    e.target.style.background = "#f8f9f6";
                  } else {
                    e.target.style.borderColor = "#e0e0e0";
                  }
                }}
              >
                {tpl.type === "upload" ? (
                  <>
                    <div style={styles.uploadIcon}>
                      <Upload size={windowWidth < 768 ? 24 : 28} />
                    </div>
                    <div style={styles.templateName}>{tpl.name}</div>
                    <div style={styles.templatePrice}>
                      1 from {tpl.price}
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={tpl.img}
                      alt={tpl.name}
                      style={styles.templateImage}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/220x150?text=Template+Image';
                      }}
                    />
                    <div style={styles.templateName}>{tpl.name}</div>
                    <div style={styles.templatePrice}>
                      1 from {tpl.price}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .responsive-container {
            padding: 0;
          }
        }
        
        @media (max-width: 480px) {
          .responsive-container {
            padding: 0;
          }
        }

        /* Add some nice animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .responsive-container > div:first-child {
          animation: fadeIn 0.6s ease-out;
        }

        /* Touch device improvements */
        @media (hover: none) and (pointer: coarse) {
          .template-card {
            transform: none !important;
            transition: background-color 0.2s ease, border-color 0.2s ease;
          }
          
          .template-card:active {
            background-color: #f0f4f8 !important;
            border-color: #1b6dbf !important;
          }
        }
      `}</style>
    </div>
  );
}