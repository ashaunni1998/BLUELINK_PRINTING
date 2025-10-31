import React, { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import GoogleTranslateDropdown from "../GoogleTranslateDropdown";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../../config";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/product/tobBarCategory`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (data.data) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories for footer:", err);
      }
    };

    fetchCategories();
  }, []);

  const toggleAccordion = (index) => {
    setExpanded(expanded === index ? null : index);
  };


  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);

useEffect(() => {
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// ADD this helper function:
const getPadding = () => {
  if (windowWidth < 1050) return '1rem';
  if (windowWidth < 1200) return '1.5rem';
  return '2.5rem';
};



  const sections = [
    {
      title: "Products",
      links: [
        { label: "All Products", path: "/" },
        ...categories.map((cat) => ({
          label: cat.name,
          path: `/allProducts/${cat._id}`,
        })),
      ],
    },
    {
      title: "About Us",
      links: [{ label: "About Blue Link", path: "/about" }],
    },
    {
      title: "Help",
      links: [
        { label: "Contact us", path: "/contact" },
        { label: "FAQs", path: "/help" },
      ],
    },
  ];

  const legalLinks = [
    { label: "Terms & Conditions", path: "/terms" },
    { label: "Privacy Policy", path: "/privacy" },
  ];

  const socialColors = {
    facebook: "#4267B2",
    instagram: "#C13584",
    twitter: "#1DA1F2",
    youtube: "#FF0000",
    whatsapp: "#25D366",
  };

  // Keep original alignment - only adjust for mobile
  const getContainerStyles = () => {
    if (isMobile) {
      return {
        maxWidth: "100%",
        padding: "0 1rem",
      };
    }
    return {
      maxWidth: "100%",
      padding: "0 1.5rem",
    };
  };

  return (
    <footer
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#fff",
        color: "#333",
      }}
    >
      {/* Top Bar - Maintains original alignment */}
      <div
        style={{
          backgroundColor: "#2c3e50",
          color: "#fff",
          padding: isMobile ? "10px 0" : "12px 0",
         
        }}
      >
         <div
    style={{
      maxWidth: "1440px",
      margin: "0 auto",
      padding: `0 ${getPadding()}`,
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "center",
      gap: isMobile ? "12px" : "10px",
    }}
  >
          {/* Trustpilot Rating */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "6px" : "8px",
              flexWrap: "wrap",
              fontSize: isMobile ? "12px" : "14px",
              flex: isMobile ? "1 1 100%" : "0 1 auto",
              justifyContent: isMobile ? "center" : "flex-start",
            }}
          >
            <span style={{ fontWeight: "bold", color: "#F37934" }}>
              🟧 TRUSTPILOT
            </span>
            <span style={{ color: "#00B67A" }}>★★★★☆</span>
            <span>4.6/5</span>
          </div>

          {/* Social Media Icons */}
          <div
            style={{
              display: "flex",
              gap: isMobile ? "14px" : "16px",
              fontSize: isMobile ? "18px" : "20px",
              flexWrap: "wrap",
              justifyContent: "center",
              flex: isMobile ? "1 1 100%" : "0 1 auto",
            }}
          >
            <a
              href="#"
              style={{ color: socialColors.facebook, transition: "opacity 0.2s" }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              style={{ color: socialColors.instagram, transition: "opacity 0.2s" }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              style={{ color: socialColors.twitter, transition: "opacity 0.2s" }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              style={{ color: socialColors.youtube, transition: "opacity 0.2s" }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              <FaYoutube />
            </a>
            <a
              href="#"
              style={{ color: socialColors.whatsapp, transition: "opacity 0.2s" }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      {/* Translate Section - Maintains original alignment */}
      <div
        style={{
          borderBottom: "1px solid #ddd",
        }}
      >
 <div
    style={{
      maxWidth: "1440px",
      margin: "0 auto",
      padding: `${isMobile ? "12px" : "16px"} ${getPadding()}`,
      width: "100%",
    }}
  >

          {/* <GoogleTranslateDropdown /> */}
        </div>
      </div>

      {/* Main Section - Maintains original alignment */}
      <div
        style={{
          backgroundColor: "#f9f9f9",
          
        }}
      >
         <div
    style={{
      maxWidth: "1440px",
      margin: "0 auto",
      padding: `${isMobile ? "20px" : "40px"} ${getPadding()}`,
      width: "100%",
    }}
  >
          {!isMobile ? (
            // Desktop View - Maintains original layout
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "40px",
              }}
            >
              {sections.map((section, index) => (
                <div
                  key={index}
                  style={{
                    flex: "1 1 250px",
                    minWidth: "200px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      marginBottom: "12px",
                      color: "#222",
                    }}
                  >
                    {section.title}
                  </div>
                  {section.links.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      style={{
                        display: "block",
                        color: "#555",
                        textDecoration: "none",
                        margin: "6px 0",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#00754a")}
                      onMouseLeave={(e) => (e.target.style.color = "#555")}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            // Mobile Accordion View
            <div>
              {sections.map((section, index) => (
                <div key={index} style={{ borderBottom: "1px solid #ccc" }}>
                  <button
                    onClick={() => toggleAccordion(index)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      background: "#e9ecef",
                      border: "none",
                      textAlign: "left",
                      fontWeight: "bold",
                      fontSize: "15px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {section.title}
                    <span style={{ fontSize: "18px" }}>
                      {expanded === index ? "−" : "+"}
                    </span>
                  </button>
                  {expanded === index && (
                    <div style={{ padding: "12px 16px 16px", background: "#fff" }}>
                      {section.links.map((item) => (
                        <Link
                          key={item.label}
                          to={item.path}
                          onClick={() => {
                            if (item.label !== "FAQs") {
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }
                          }}
                          style={{
                            display: "block",
                            color: "#555",
                            textDecoration: "none",
                            margin: "8px 0",
                            fontSize: "14px",
                          }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Legal Section - Maintains original alignment */}
      <div
        style={{
          borderTop: "1px solid #eee",
          fontSize: isMobile ? "12px" : "13px",
          color: "#666",
          textAlign: "center",
        }}
      >
       <div
    style={{
      maxWidth: "1440px",
      margin: "0 auto",
      padding: `${isMobile ? "16px" : "20px"} ${getPadding()}`,
      width: "100%",
    }}
  >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: isMobile ? "10px" : "12px",
              marginBottom: "12px",
            }}
          >
            {legalLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                style={{
                  color: "#00754a",
                  textDecoration: "none",
                  transition: "text-decoration 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div
            style={{
              backgroundColor: "#f0f8ff",
              padding: isMobile ? "12px" : "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              width: "fit-content",
              maxWidth: "100%",
              margin: "0 auto",
            }}
          >
            <span
              style={{
                fontSize: isMobile ? "11px" : "12px",
                fontFamily: "inherit",
                fontWeight: "bold",
                color: "#003366",
              }}
            >
              Blue Link Printing
            </span>
            <p
              style={{
                margin: "5px 0 0 0",
                fontSize: isMobile ? "10px" : "11px",
                color: "#555",
              }}
            >
              Designed And Developed By{" "}
              <a
                href="https://keraladigitalpark.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0077cc",
                  textDecoration: "none",
                  transition: "text-decoration 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                Kerala Digital Park
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;