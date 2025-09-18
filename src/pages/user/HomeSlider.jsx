import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../config";
import { useNavigate } from "react-router-dom";

export default function HomeSlider() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [homeSlides, setHomeSlides] = useState([]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Slide auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (homeSlides.length ? (prev + 1) % homeSlides.length : 0));
    }, 7000);
    return () => clearInterval(interval);
  }, [homeSlides]);

  const goToPrev = () => {
    if (!homeSlides.length) return;
    setCurrentSlide((prev) => (prev === 0 ? homeSlides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    if (!homeSlides.length) return;
    setCurrentSlide((prev) => (prev + 1) % homeSlides.length);
  };

  const slide = homeSlides[currentSlide] || {}; // Safe fallback

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

        // Extract category IDs
        const business = categories.find((cat) => cat.name === "Business Cards")?._id;
        const gift = categories.find((cat) => cat.name === "Personalized Gifts")?._id;
        const postcards = categories.find((cat) => cat.name === "Postcards")?._id;

        // Build slides array
        const slides = [
          {
            image:
              "https://www.moo.com/dam/jcr:cfd23cfc-64cf-451c-90e2-b6fee400f950/0812WF-HPC-3840x1000-Business-Cards-Standard.jpg",
            title: "Fast & Reliable Blueprint Printing",
            description: "Upload your files, customize your order, and we’ll deliver it to your door.",
            cardLinks: [
              { label: "New Business Cards", link: `/allProducts/${business}` },
              { label: "Indian Business Man Cards", link: `/allProducts/${business}` },
              { label: "Normal Business Cards", link: `/allProducts/${business}` },
            ],
          },
          {
            image:
              "https://www.moo.com/dam/jcr:cc5361fb-cdeb-4763-a58b-1d6c45358e65/0812WF-HPC-3840x1000-EN-Business-Reseller0.jpg",
            title: "High-Quality Prints for Professionals",
            description: "Architectural and engineering prints done with precision and care.",
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
            description: "Just drag and drop your files, select options, and checkout quickly.",
            cardLinks: [
              { label: "Photo Frames", link: `/allProducts/${gift}` },
              { label: "Birthday Mugs", link: `/allProducts/${gift}` },
              // { label: "Flyers", link: `/allProducts/${gift}` },
              // { label: "Cotton Business Cards", link: `/allProducts/${business}` },
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

  return (
    <>
      {/* Background Image Section */}
      <section
        style={{
          backgroundImage: `url(${slide.image || ""})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: isMobile ? "200px" : "340px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: isMobile ? "center" : "space-between",
          flexDirection: isMobile ? "column" : "row",
          transition: "background-image 1s ease-in-out",
        }}
      >
        {/* Arrows (hidden on mobile) */}
        {!isMobile && (
          <>
            <button onClick={goToPrev} style={arrowButtonStyle("left")} aria-label="Previous Slide">
              &#10094;
            </button>
            <button onClick={goToNext} style={arrowButtonStyle("right")} aria-label="Next Slide">
              &#10095;
            </button>
          </>
        )}

        {/* Slide Content (Desktop Only) */}
        {!isMobile && (
          <div
            style={{
              padding: "30px",
              color: "black",
              maxWidth: "400px",
              borderRadius: "10px",
              paddingLeft: "100px",
              textAlign: "left",
            }}
          >
            <h2 style={{ fontSize: "32px", marginBottom: "15px" }}>{slide.title}</h2>
            <p style={{ fontSize: "16px", marginBottom: "25px" }}>{slide.description}</p>
            <a href="/businesscards">
              <button
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "16px",
                  cursor: "pointer",
                  marginBottom: "15px",
                }}
              >
                View Our Products
              </button>
            </a>
          </div>
        )}

        {/* Slide Bottom Section: Progress Bars + Card Links */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            width: "100%",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(248,213,148,0.95) 70%, rgba(248,213,148,1) 100%)",
            padding: "10px 30px 20px",
            boxSizing: "border-box",
            paddingLeft: "100px",
          }}
        >
          {/* Progress Bars (Desktop Only) */}
          {!isMobile && (
            <div style={{ display: "flex", justifyContent: "flex-start", gap: "6px", marginTop: "15px", marginBottom: "10px" }}>
              {homeSlides.map((_, index) => (
                <div
                  key={index}
                  style={{
                    height: "2px",
                    backgroundColor: "#ddd",
                    borderRadius: "10px",
                    overflow: "hidden",
                    position: "relative",
                    width: "50px",
                    marginTop:"50px",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: index === currentSlide ? "100%" : "0%",
                      backgroundColor: "#333",
                      transition: index === currentSlide ? "width 7s linear" : "none",
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Card Links (Desktop Only) */}
          {!isMobile && slide.cardLinks && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "15px",
                marginTop: "15px",
              }}
            >
              {slide.cardLinks.map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  style={{
                    fontSize: "14px",
                    color: "#007bff",
                    fontWeight: "400",
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: "color 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = "#0056b3";
                    e.currentTarget.style.textDecoration = "underline";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = "#007bff";
                    e.currentTarget.style.textDecoration = "none";
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Mobile Content Section */}
      {isMobile && (
        <div
          style={{
            padding: "25px 15px",
            textAlign: "center",
            background: "linear-gradient(135deg, #f9f9f9, #ffffff)",
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            margin: "20px",
          }}
        >
          <h2 style={{ fontSize: "24px", marginBottom: "12px", fontWeight: "700", color: "#222" }}>
            {slide.title}
          </h2>
          <p style={{ fontSize: "16px", marginBottom: "20px", color: "#555", lineHeight: "1.5" }}>
            {slide.description}
          </p>
          <button
            style={{
              padding: "12px 30px",
              background: "linear-gradient(90deg, #007bff, #00c6ff)",
              color: "#fff",
              border: "none",
              borderRadius: "50px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,123,255,0.4)",
              transition: "all 0.3s ease",
            }}
            onClick={() => navigate("/sign-in")}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            Upload Your Blueprint
          </button>

          {/* Progress Bars (Mobile Only) */}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "25px" }}>
            {homeSlides.map((_, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  height: "2px",
                  background: "linear-gradient(90deg, #eee, #ddd)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  maxWidth: "70px",
                  position: "relative",
                  boxShadow: "inset 0 2px 5px rgba(0,0,0,0.15)",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: index === currentSlide ? "100%" : "0%",
                    background: "linear-gradient(90deg, #007bff, #00c6ff)",
                    transition: index === currentSlide ? "width 7s linear" : "none",
                    borderRadius: "20px",
                    boxShadow: index === currentSlide ? "0 0 10px rgba(0, 123, 255, 0.8)" : "none",
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

const arrowButtonStyle = (side) => ({
  position: "absolute",
  top: "50%",
  [side]: "20px",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(0,0,0,0.5)",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  fontSize: "15px",
  cursor: "pointer",
  borderRadius: "40%",
  zIndex: 2,
});
