import React from "react";
import "./BusinessHero.css";

const BusinessHero = () => {
  const cardImages = [
    "/assets/cards/card1.jpg",
    "/assets/cards/card2.jpg",
    "/assets/cards/card3.jpg",
    "/assets/cards/card4.jpg",
    "/assets/cards/card5.jpg",
    "/assets/cards/card6.jpg",
    "/assets/cards/card7.jpg",
    "/assets/cards/card8.jpg",
  ];

  return (
    <div className="hero-wrapper">
      <div className="hero-content">
        <h1>Business Cards</h1>
        <p>
          Stand out with the best custom business cards—special finishes, unique
          sizes, and instant impressions! Let your cards speak for themselves.
        </p>
        <div className="hero-buttons">
       <a href="/BusinessCardDetails">   <button className="btn-primary">Shop Business Cards</button></a>
          {/* <button className="btn-secondary">Reorder</button> */}
        </div>
      </div>

      <div className="hero-cards">
        {cardImages.map((src, index) => (
          <img key={index} src={src} alt={`card${index}`} className="card-image" />
        ))}
      </div>
    </div>
  );
};

export default BusinessHero;
