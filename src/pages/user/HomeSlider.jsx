import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

export default function HomeSlider() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1050
  );
  const [isLargeDesktop, setIsLargeDesktop] = useState(
    window.innerWidth >= 1920
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [homeSlides, setHomeSlides] = useState([]);

  // Consolidated resize handler matching Header.jsx
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobile(width <= 768);
      setIsTablet(width >= 768 && width < 1050);
      setIsLargeDesktop(width >= 1920);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Slide auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        homeSlides.length ? (prev + 1) % homeSlides.length : 0
      );
    }, 7000);
    return () => clearInterval(interval);
  }, [homeSlides]);

  const goToPrev = () => {
    if (!homeSlides.length) return;
    setCurrentSlide((prev) =>
      prev === 0 ? homeSlides.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    if (!homeSlides.length) return;
    setCurrentSlide((prev) => (prev + 1) % homeSlides.length);
  };

  const slide = homeSlides[currentSlide] || {};

  // Fetch categories and create slides
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/product/tobBarCategory`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await res.json();
        const categories = data.data || [];

        const business = categories.find(
          (cat) => cat.name === "Business Cards"
        )?._id;
        const gift = categories.find(
          (cat) => cat.name === "Personalized Gifts"
        )?._id;
        const postcards = categories.find(
          (cat) => cat.name === "Postcards"
        )?._id;

        const slides = [
          {
            image: "/assets/homeslider/banner1.jpg",
            title: "Fast & Reliable Blueprint Printing",
            description:
              "Upload your files, customize your order, and we'll deliver it to your door.",
            cardLinks: [
              { label: "New Business Cards", link: `/allProducts/${business}` },
              {
                label: "Indian Business Man Cards",
                link: `/allProducts/${business}`,
              },
              {
                label: "Normal Business Cards",
                link: `/allProducts/${business}`,
              },
            ],
          },
          {
            image:
              "https://www.moo.com/dam/jcr:cc5361fb-cdeb-4763-a58b-1d6c45358e65/0812WF-HPC-3840x1000-EN-Business-Reseller0.jpg",
            title: "High-Quality Prints for Professionals",
            description:
              "Architectural and engineering prints done with precision and care.",
            cardLinks: [
              { label: "PostCards", link: `/allProducts/${postcards}` },
              { label: "Normal PostCards", link: `/allProducts/${postcards}` },
              { label: "Super PostCards", link: `/allProducts/${postcards}` },
            ],
          },
          {
            image:
              "https://www.moo.com/dam/jcr:77605a35-92ad-48a8-8b13-076f67780224/0812WF-HPC-3840x1000-Invitations.jpg",
            title: "Upload Blueprints with Ease",
            description:
              "Just drag and drop your files, select options, and checkout quickly.",
            cardLinks: [
              { label: "Photo Frames", link: `/allProducts/${gift}` },
              { label: "Birthday Mugs", link: `/allProducts/${gift}` },
            ],
          },
        ];

        setHomeSlides(slides);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Responsive padding matching Header.jsx
  const getPadding = () => {
    if (isMobile) return "1rem";
    if (windowWidth < 1200) return "1.5rem";
    return "2.5rem";
  };

  const padding = getPadding();

  return (
    <>
      {/* Background Image Section - Full Width */}
      <section
        style={{
          backgroundImage: `url(${slide.image || ""})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: isMobile ? "12.5rem" : "21.25rem",
          width: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: isMobile ? "center" : "space-between",
          flexDirection: isMobile ? "column" : "row",
          transition: "background-image 1s ease-in-out",
        }}
      >
        {/* Arrows and Content - Desktop Only */}
        {!isMobile && (
          <>
            {/* Left Arrow */}
            <button
              onClick={goToPrev}
              style={{
                position: "absolute",
                top: "50%",
                left: "0.625rem",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "#fff",
                border: "none",
                padding: "0.625rem 0.9375rem",
                fontSize: "0.9375rem",
                cursor: "pointer",
                borderRadius: "40%",
                zIndex: 3,
              }}
              aria-label="Previous Slide"
            >
              &#10094;
            </button>

            {/* Slide Content Wrapper */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              {/* Content Container */}
              <div
                style={{
                  maxWidth: "1440px",
                  width: "100%",
                  margin: "0 auto",
                  padding: `0 ${padding}`,
                  boxSizing: "border-box",
                  pointerEvents: "auto",
                  display: "block",
                }}
              >
                <div
                  style={{
                    color: "black",
                    maxWidth: "31.25rem",
                    textAlign: "left",
                    marginLeft: windowWidth < 1200 ? "2rem" : "0",
                  }}
                >
                  <h2 style={{ fontSize: "2rem", marginBottom: "0.9375rem" }}>
                    {slide.title}
                  </h2>
                  <p style={{ fontSize: "1rem", marginBottom: "1.5625rem" }}>
                    {slide.description}
                  </p>
                  <a href="/AllProducts">
                    <button
                      style={{
                        padding: "0.3125rem 0.625rem",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "0.3125rem",
                        fontSize: "1rem",
                        cursor: "pointer",
                        marginBottom: "0.9375rem",
                      }}
                    >
                      View Our Products
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={goToNext}
              style={{
                position: "absolute",
                top: "50%",
                right: "0.625rem",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "#fff",
                border: "none",
                padding: "0.625rem 0.9375rem",
                fontSize: "0.9375rem",
                cursor: "pointer",
                borderRadius: "40%",
                zIndex: 3,
              }}
              aria-label="Next Slide"
            >
              &#10095;
            </button>

            {/* Progress Bars - Desktop Only */}
            <div
              style={{
                position: "absolute",
                bottom: "1.25rem",
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                boxSizing: "border-box",
                width: "100%",
              }}
            >
              <div
                style={{
                  maxWidth: "1440px",
                  width: "100%",
                  padding: `0 ${padding}`,
                  boxSizing: "border-box",
                  display: "flex",
                  gap: "0.375rem",
                  marginLeft: windowWidth < 1200 ? "2rem" : "0",
                }}
              >
                {homeSlides.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      height: "0.0625rem",
                      backgroundColor: "#ddd",
                      borderRadius: "0.625rem",
                      overflow: "hidden",
                      position: "relative",
                      width: "3.125rem",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: index === currentSlide ? "100%" : "0%",
                        backgroundColor: "#333",
                        transition:
                          index === currentSlide ? "width 7s linear" : "none",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </section>

      {/* Mobile Content Section */}
      {isMobile && (
        <div
          style={{
            padding: "1.5625rem 0.9375rem",
            textAlign: "center",
            background: "linear-gradient(135deg, #f9f9f9, #ffffff)",
            borderRadius: "0.9375rem",
            boxShadow: "0 0.25rem 0.75rem rgba(0,0,0,0.1)",
            margin: "1.25rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              marginBottom: "0.75rem",
              fontWeight: "700",
              color: "#222",
            }}
          >
            {slide.title}
          </h2>
          <p
            style={{
              fontSize: "1rem",
              marginBottom: "1.25rem",
              color: "#555",
              lineHeight: "1.5",
            }}
          >
            {slide.description}
          </p>
          <button
            style={{
              padding: "0.75rem 1.875rem",
              background: "linear-gradient(90deg, #007bff, #00c6ff)",
              color: "#fff",
              border: "none",
              borderRadius: "3.125rem",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 0.25rem 0.75rem rgba(0,123,255,0.4)",
              transition: "all 0.3s ease",
            }}
            onClick={() => navigate("/sign-in")}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            Upload Your Blueprint
          </button>

          {/* Progress Bars Mobile */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.625rem",
              marginTop: "1.5625rem",
            }}
          >
            {homeSlides.map((_, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  height: "0.125rem",
                  background: "linear-gradient(90deg, #eee, #ddd)",
                  borderRadius: "1.25rem",
                  overflow: "hidden",
                  maxWidth: "4.375rem",
                  position: "relative",
                  boxShadow: "inset 0 0.125rem 0.3125rem rgba(0,0,0,0.15)",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: index === currentSlide ? "100%" : "0%",
                    background: "linear-gradient(90deg, #007bff, #00c6ff)",
                    transition:
                      index === currentSlide ? "width 7s linear" : "none",
                    borderRadius: "1.25rem",
                    boxShadow:
                      index === currentSlide
                        ? "0 0 0.625rem rgba(0, 123, 255, 0.8)"
                        : "none",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}