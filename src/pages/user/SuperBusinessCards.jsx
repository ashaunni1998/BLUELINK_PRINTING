import React from 'react'
import Header from './components/Header';
import Footer from './components/Footer';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Recycle, BadgeCheck } from "lucide-react";

export default function SuperBusinessCards() {
  
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


const features = [
  {
    icon: <Sparkles size={32} color="#00B0B9" />,
    title: "Premium Print Quality",
    desc: "Your design deserves the best materials and ink.",
  },
  {
    icon: <Recycle size={32} color="#00B0B9" />,
    title: "Sustainable Options",
    desc: "Eco-friendly options like Cotton and recycled paper.",
  },
  {
    icon: <BadgeCheck size={32} color="#00B0B9" />,
    title: "Satisfaction Guarantee",
    desc: "We reprint or refund if you’re not 100% happy.",
  },
];


   const styles = {
    wrapper: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "flex-start",
      backgroundColor: "#147136dc",
      color: "white",
      padding: "60px 5%",
      gap: "30px",
    },
    content: {
      flex: 1,
      minWidth: "300px",
      maxWidth: "400px",
    },
    heading: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    paragraph: {
      fontSize: "1.1rem",
      lineHeight: 1.6,
      marginBottom: "30px",
    },
    buttons: {
      display: "flex",
      gap: "20px",
    },
    btnPrimary: {
      backgroundColor: "white",
      color: "black",
      padding: "14px 24px",
      fontSize: "1rem",
      borderRadius: "6px",
      fontWeight: "bold",
      border: "none",
      cursor: "pointer",
    },
    btnSecondary: {
      backgroundColor: "#0c2e1a",
      color: "white",
      padding: "14px 24px",
      fontSize: "1rem",
      borderRadius: "6px",
      fontWeight: "bold",
      border: "none",
      cursor: "pointer",
    },
    cardsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      flex: 2,
      justifyContent: "flex-start",
      minWidth: "300px",
    },
    cardImage: {
      width: "120px",
      height: "120px",
      objectFit: "cover",
      borderRadius: "4px",
      boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.2)",
    },
  };
 const navigate = useNavigate();

  const handleNavigate = (card) => {
    // You could pass state or params if needed
    navigate("/businesscardDetails", { state: { card } });
  };

  
  
    return (
 <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
    <div style={{ width: '90%', margin: '0 auto' }}>
            <Header/>
         <div style={styles.wrapper}>
      <div style={styles.content}>
        <h1 style={styles.heading}>Business Cards</h1>
        <p style={styles.paragraph}>
          Stand out with the best custom business cards—special finishes, unique
          sizes, and instant impressions! Let your cards speak for themselves.
        </p>
        <div style={styles.buttons}>
          <button style={styles.btnPrimary}>Shop Business Cards</button>
          <button style={styles.btnSecondary}>Reorder</button>
        </div>
      </div>

      <div style={styles.cardsContainer}>
        {cardImages.map((src, index) => (
          <img key={index} src={src} alt={`card${index}`} style={styles.cardImage} />
        ))}
      
      </div>
    </div>


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
          <div key={index} style={{ textAlign: "center" }}>
            <img
              src={card.image}
              alt={card.title}
              style={{ width: "100%", borderRadius: "12px" }}
            />
            <h3 style={{ fontSize: "20px", marginTop: "15px", fontWeight: "600" }}>
              {card.title}
            </h3>
            <p style={{ fontSize: "14px", color: "#555", marginTop: "8px" }}>
              {card.description}
            </p>
            <button
              onClick={() => handleNavigate(card)}
              style={{
                marginTop: "10px",
                padding: "8px 20px",
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
        ))}
      </div>
    </div>


      <div
      style={{
        backgroundColor: "#FDF6ED",
        padding: "60px 20px",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "32px", marginBottom: "40px", fontWeight: "bold" }}>
        Why MOO Business Cards?
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "40px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {features.map((item, index) => (
          <div key={index}>
            <div>{item.icon}</div>
            <h4 style={{ marginTop: "15px", fontSize: "18px", fontWeight: "600" }}>
              {item.title}
            </h4>
            <p style={{ color: "#555", fontSize: "14px", marginTop: "8px" }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>


  <Footer/>
  </div>
  </div>
  )
}
