import React from "react";

const cardSizes = [
  {
    title: "Standard Business Cards",
    dimensions: '3.5" × 2.0"',
    price: "50 cards from $22.00",
    linkText: "Shop Standard Business Cards ›",
    image: "/assets/businesssize/temp1.png",
  },
  {
    title: "Square Business Cards",
    dimensions: '2.56" × 2.56"',
    price: "50 cards from $25.00",
    linkText: "Shop Square Business Cards ›",
    image: "/assets/businesssize/temp2.png",
  },
  {
    title: "Mini Business Cards",
    dimensions: '2.75" × 1.1"',
    price: "100 cards from $21.00",
    linkText: "Shop Mini Cards ›",
    image: "/assets/businesssize/temp3.png",
  },
  {
    title: "Size Business Cards",
    dimensions: '3.3" × 2.16"',
    price: "50 cards from $22.00",
    linkText: "Shop  Size Business Cards ›",
    image: "/assets/businesssize/temp4.png",
  },
];

const BusinessCardSizes = () => {
  return (
    <div
      style={{
        padding: "60px 20px",
        fontFamily: "'Helvetica Neue', sans-serif",
        backgroundColor: "#F6F8F6",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "32px",
          fontWeight: "600",
          marginBottom: "8px",
        }}
      >
        Shop Business Cards by size
      </h2>
      <p
        style={{
          textAlign: "center",
          fontSize: "18px",
          color: "#333",
          marginBottom: "40px",
        }}
      >
        From Standard, to Mini, to Blue Link Cards, find the perfect fit for your business.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {cardSizes.map((card, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            <img
              src={card.image}
              alt={card.title}
              style={{
                width: "100%",
                maxHeight: "180px",
                objectFit: "contain",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                marginBottom: "20px",
              }}
            />
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>
              {card.title}
            </h3>
            <p style={{ fontSize: "14px", color: "#333", marginBottom: "2px" }}>
              {card.dimensions}
            </p>
            <p style={{ fontSize: "14px", color: "#333", marginBottom: "10px" }}>
              {card.price}
            </p>
            <a
              href="#"
              style={{
                color: "#00754A",
                fontWeight: "500",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              {card.linkText}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessCardSizes;
