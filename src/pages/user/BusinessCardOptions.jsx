import React from "react";

const options = [
  {
    title: "Use our templates if you...",
    points: [
      "Are looking for inspiration",
      "Want a professional, quality Business Card design",
      "Simple, fast customisation for quick card printing",
    ],
    linkText: "See our design templates ›",
    linkHref: "#",
    bgColor: "#EAD9DC", // light pink
    image: "/assets/Business/template.jpg",
  },
  {
    title: "Design your Business Cards online if you...",
    points: [
      "Already have your logo",
      "Want to create your own design easily",
      "Want to customize every detail",
    ],
    linkText: "Start with a blank template ›",
    linkHref: "#",
    bgColor: "#FDE7A7", // light yellow
    image:"/assets/Business/template1.jpg",
  },
  {
    title: "Upload a full design if you...",
    points: [
      "Have your Business Card design files ready to go",
      "Have design chops or your own designer",
      "Are confident with your layout",
    ],
    linkText: "Upload a full design ›",
    linkHref: "#",
    bgColor: "#D6E3F1", // light blue
    image: "/assets/Business/template2.jpg",
  },
];

const BusinessCardOptions = () => {
  return (
    <div style={{ padding: "60px 20px", fontFamily: "'Helvetica Neue', sans-serif",  maxWidth: "100%",
    boxSizing: "border-box",
    overflowX: "hidden", }}>
      <h2 style={{ textAlign: "center", fontSize: "32px", marginBottom: "16px", fontWeight: "600" }}>
        Make your own Business Cards
      </h2>
      <p style={{ textAlign: "center", fontSize: "18px", color: "#333", maxWidth: "750px", margin: "0 auto 40px" }}>
        Whether you’re a total beginner or a creative professional, we have design options to help you create your own Business Card.
      </p>

      <div
        style={{
          display: "grid",
         gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",

          gap: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {options.map((opt, index) => (
          <div
            key={index}
            style={{
              backgroundColor: opt.bgColor,
              padding: "30px 20px",
              borderRadius: "8px",
              minHeight: "360px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img
                src={opt.image}
                alt="option icon"
                style={{ height: "auto", objectFit: "contain",width:"100%",maxHeight:"180px" }}
              />
            </div>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "10px" }}>{opt.title}</h3>
              <ul style={{ paddingLeft: "20px", marginBottom: "10px", color: "#333", fontSize: "14px" }}>
                {opt.points.map((pt, i) => (
                  <li key={i} style={{ marginBottom: "5px" }}>{pt}</li>
                ))}
              </ul>
              <a
                href={opt.linkHref}
                style={{
                  color: "#00754A",
                  textDecoration: "none",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                {opt.linkText}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessCardOptions;
