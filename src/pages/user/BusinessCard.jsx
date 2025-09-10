import React from "react";
import "./BusinessCard.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BusinessHero from "./BusinessHero";
import BusinessCardGrid from "./BusinessCardGrid";
import FeaturesSection from "./FeaturesSection";
import BusinessCardOptions from "./BusinessCardOptions";
import BusinessCardSizes from "./BusinessCardSize";
import "./Home.css";


const businessCards = [
  {
    id: 1,
    title: "Classic Business Card",
    image: "/assets/cards/card1.jpg",
  },
  {
    id: 2,
    title: "Modern Business Card",
    image: "/assets/cards/card2.jpg",
  },
  {
    id: 3,
    title: "Luxury Business Card",
    image: "/assets/cards/card3.jpg",
  },
  {
    id: 4,
    title: "Minimalist Business Card",
    image: "/assets/cards/card4.jpg",
  },
  {
    id: 5,
    title: "Creative Business Card",
    image: "/assets/cards/card5.jpg",
  },
   {
    id: 6,
    title: "Creative Business Card",
    image: "/assets/cards/card6.jpg",
  },
   {
    id: 7,
    title: "Creative Business Card",
    image: "/assets/cards/card7.jpg",
  },
   {
    id: 8,
    title: "Creative Business Card",
    image: "/assets/cards/card8.jpg",
  },
   {
    id: 9,
    title: "Creative Business Card",
    image: "/assets/cards/card9.jpg",
  },
   {
    id: 10,
    title: "Creative Business Card",
    image: "/assets/cards/card10.jpg",
  },
   {
    id: 11,
    title: "Creative Business Card",
    image: "/assets/cards/card11.jpg",
  },
  // Add more cards as needed
];

const BusinessCards = () => {
  return (
    <div className="responsive-container">
          <Header/>
       <BusinessHero/>
       <BusinessCardGrid />
      <FeaturesSection />
      <BusinessCardSizes/>
      <BusinessCardOptions/>
      
      {/* <div className="cards-container">
      
      {businessCards.map((card) => (
        <div className="card" key={card.id}>
          <img src={card.image} alt={card.title} />
          <h4>{card.title}</h4>
        </div>
      ))}
   
    </div> */}

    
     <Footer/>
     </div>
     
  );
};

export default BusinessCards;
