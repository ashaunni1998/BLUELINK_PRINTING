import React from "react";
import { useNavigate } from "react-router-dom";

const cards = [
  {
    title: "Original Business Cards",
    description: "The go-to for good quality and good value.",
    image: "/assets/cards/card7.jpg",
  },
  {
    title: "Luxe Business Cards",
    description: "Four layers of Mohawk Superfine paper.",
    image: "/assets/cards/card8.jpg",
  },
  {
    title: "Cotton Business Cards",
    description: "Made from T-shirt offcuts.",
    image: "/assets/cards/card9.jpg",
  },
  {
    title: "Super Business Cards",
    description: "Tough, long-lasting and rich in color.",
    image: "/assets/cards/card10.jpg",
  },
];

const BusinessCardGrid = () => {
  const navigate = useNavigate();

  const handleNavigate = (card) => {
    navigate("/businesscardDetails", { state: { card } });
  };

  return (
    <div style={{ padding: "60px 20px", backgroundColor: "#fff" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "40px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              height: "100%",
              backgroundColor: "#f9f9f9",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
            }}
          >
            <img
              src={card.image}
              alt={card.title}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
              }}
            />

            {/* Content section */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "20px",
              }}
            >
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px" }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#555" }}>{card.description}</p>
              </div>

              <button
                onClick={() => handleNavigate(card)}
                style={{
                  marginTop: "20px",
                  padding: "10px",
                  backgroundColor: "#00B0B9",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Shop BusinessCards
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessCardGrid;
