import React, { useEffect, useState } from "react";

const homeSlides = [
  {
    image: "https://www.moo.com/dam/jcr:cfd23cfc-64cf-451c-90e2-b6fee400f950/0812WF-HPC-3840x1000-Business-Cards-Standard.jpg",
    title: "Fast & Reliable Blueprint Printing",
    description: "Upload your files, customize your order, and we’ll deliver it to your door.",
    cardLinks: [
      { label: "New Business Cards", link: "/allProducts/${cat._id}" },
      { label: "Indian Business Cards", link: "/products/business-cards/super" },
      { label: "Indian Business Cards", link: "/products/business-cards/luxe" },
      { label: "Super Business Cards", link: "/products/business-cards/cotton" },
    ],
  },
  {
    image: "https://www.moo.com/dam/jcr:cc5361fb-cdeb-4763-a58b-1d6c45358e65/0812WF-HPC-3840x1000-EN-Business-Reseller0.jpg",
    title: "High-Quality Prints for Professionals",
    description: "Architectural and engineering prints done with precision and care.",
     cardLinks: [
      { label: "Normal Business Cards", link: "/products/business-cards/normal" },
      { label: "Super Business Cards", link: "/products/business-cards/super" },
      { label: "Luxe Business Cards", link: "/products/business-cards/luxe" },
      { label: "Cotton Business Cards", link: "/products/business-cards/cotton" },
    ],
  },
  {
    image: "https://www.moo.com/dam/jcr:77605a35-92ad-48a8-8b13-076f67780224/0812WF-HPC-3840x1000-Invitations.jpg",
    title: "Upload Blueprints with Ease",
    description: "Just drag and drop your files, select options, and checkout quickly.",
     cardLinks: [
      { label: "New Business Cards", link: "/products/business-cards/normal" },
      { label: "Super Business Cards", link: "/products/business-cards/super" },
      { label: "Luxe Business Cards", link: "/products/business-cards/luxe" },
      { label: "Cotton Business Cards", link: "/products/business-cards/cotton" },
    ],
  },
];

export default function HomeSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % homeSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const slide = homeSlides[currentSlide];

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? homeSlides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % homeSlides.length);
  };

  return (
    <>
      {/* Background Image Section */}
      <section
        style={{
          backgroundImage: `url(${slide.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: isMobile ? "200px" : "450px",
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
              paddingLeft: "60px",
              textAlign: "left",
            }}
          >
            <h2 style={{ fontSize: "32px", marginBottom: "15px" }}>{slide.title}</h2>
            <p style={{ fontSize: "16px", marginBottom: "25px" }}>{slide.description}</p>
          <a href="/businesscards">  <button
              style={{
                padding: "5px 10px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                cursor: "pointer",
                marginBottom:"15px",
              }}
            >
              View Our Products
            </button>
            </a>
          </div>
        )}

        {/* Progress Bars */}
        {/* <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: isMobile ? "50%" : "16%",
            transform: "translateX(-50%)",
            width: "220px",
            display: "flex",
            gap: "8px",
             justifyContent: "start",
          }}
        >
          {homeSlides.map((_, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                height: "5px",
                backgroundColor: "#ddd",
                borderRadius: "10px",
                overflow: "hidden",
                position: "relative",
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
        </div> */}

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
          }}
        >
          {/* Progress Bars */}
         {/* Progress Bars (Desktop Only) */}
{!isMobile && (
  <div
    style={{
      display: "flex",
      justifyContent: "flex-start",
      gap: "6px",
      marginTop: "5px",
      marginBottom:"10px"
    }}
  >
    {homeSlides.map((_, index) => (
      <div
        key={index}
        style={{
          // flex: 1,
          height: "2px",
          backgroundColor: "#ddd",
          borderRadius: "10px",
          overflow: "hidden",
          // position: "relative",
          Width: "50px",
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


          {/* Card Links */}
        
{/* Card Links (Desktop Only) */}
{/* Card Links (Desktop Only) */}
{!isMobile && (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "30px",
    }}
  >
    {slide.cardLinks.map((item, idx) => (
      <a
        key={idx}
        href={item.link}
        style={{
          fontSize: "13px",
          color: "#112211",
          fontWeight: "600",
          cursor: "pointer",
          whiteSpace: "nowrap",
          textDecoration: "none",
        }}
      >
        {item.label}
      </a>
    ))}
  </div>
)}


        </div>


      </section>

      {/* Mobile Content Section (Below Image) */}
      {isMobile && (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "24px", marginBottom: "15px" }}>{slide.title}</h2>
          <p style={{ fontSize: "16px", marginBottom: "25px" }}>{slide.description}</p>
          <button
            style={{
              padding: "10px 25px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Upload Your Blueprint
          </button>
{/* Progress Bars (Mobile Only) */}
<div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    marginTop: "20px",
  }}
>
  {homeSlides.map((_, index) => (
    <div
      key={index}
      style={{
        flex: 1,
        height: "5px",
        backgroundColor: "#ddd",
        borderRadius: "10px",
        overflow: "hidden",
        maxWidth: "60px",
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
