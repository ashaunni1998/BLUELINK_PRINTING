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
import API_BASE_URL from "../../../config";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [expanded, setExpanded] = useState(null); // Accordion control
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
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

  const sections = [
    {
      title: "Products",
      links: [
        { label: "All Products", path: "/" },
        // 👇 categories will be appended dynamically below
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

  return (
    <footer
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#fff",
        color: "#333",
      }}
    >
      {/* Top Bar - Aligned with header */}
      <div
        style={{
          backgroundColor: "#2c3e50",
          color: "#fff",
          padding: "12px 0",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontWeight: "bold", color: "#F37934" }}>
              🟧 TRUSTPILOT
            </span>
            <span style={{ color: "#00B67A" }}>★★★★☆</span>
            <span>4.6/5</span>
          </div>
          <div style={{ display: "flex", gap: "16px", fontSize: "20px" }}>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: socialColors.facebook }}
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: socialColors.instagram }}
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: socialColors.twitter }}
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: socialColors.youtube }}
            >
              <FaYoutube />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: socialColors.whatsapp }}
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      {/* Translate - Aligned with header */}
      <div
        style={{
          borderBottom: "1px solid #ddd",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: isMobile ? "16px 20px" : "16px 20px",
          }}
        >
          <GoogleTranslateDropdown />
        </div>
      </div>

      {/* Main Section - Aligned with header */}
      <div
        style={{
          backgroundColor: "#f9f9f9",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: isMobile ? "0" : "40px 20px",
          }}
        >
          {!isMobile ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              {sections.map((section, index) => (
                <div key={index} style={{ flex: "1 1 200px" }}>
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
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div>
              {sections.map((section, index) => (
                <div key={index} style={{ borderBottom: "1px solid #ccc" }}>
                  <button
                    onClick={() => toggleAccordion(index)}
                    style={{
                      width: "100%",
                      padding: "16px",
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
                    <span>{expanded === index ? "−" : "+"}</span>
                  </button>
                  {expanded === index && (
                    <div style={{ padding: "0 16px 16px" }}>
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
                            margin: "6px 0",
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

      {/* Legal Section - Aligned with header */}
      <div
        style={{
          borderTop: "1px solid #eee",
          fontSize: "13px",
          color: "#666",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: isMobile ? "20px 20px" : "20px 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "10px",
            }}
          >
            {legalLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                style={{ color: "#00754a", textDecoration: "none" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div
            style={{
              backgroundColor: "#f0f8ff",
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              width: "fit-content",
              margin: "0 auto",
            }}
          >
            <span
              style={{
                fontSize: "12px",
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
                fontSize: "11px",
                color: "#555",
              }}
            >
              Designed And Developed By{" "}
              <a
                href="https://keraladigitalpark.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0077cc", textDecoration: "none" }}
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