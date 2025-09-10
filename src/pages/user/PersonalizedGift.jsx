import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BusinessCardOptions from "./BusinessCardOptions";
import { Link } from "react-router-dom";
import './Home.css';


const PersonalizedGift = () => {
  return (
    <div className="responsive-container">
      <Header />

      {/* Hero Section */}
      {/* <section
        style={{
          position: "relative",
          backgroundImage: "url('/assets/gifts/banner.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "320px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "0 40px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: "600px", padding: "20px", color: "#fff" }}>
          <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>Personalized Gifts</h1>
          <p style={{ fontSize: "18px", lineHeight: "1.5" }}>
            Unique, custom gifts made just for them.
            <br />
            Thoughtful designs, premium quality.
          </p>
        </div>
      </section> */}


      <section style={{ position: "relative", width: "100%" }}>
  <img
    src="/assets/gifts/banner.jpg"
    alt="Personalized Gifts"
    style={{ width: "100%", height: "450px", display: "block" }}
  />
  <div
    style={{
      position: "absolute",
      top: "20%",
      left: "5%",
      color: "#fff",
      maxWidth: "600px",
    }}
  >
    <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>Personalized Gifts</h1>
    <p style={{ fontSize: "18px", lineHeight: "1.5" }}>
      Unique, custom gifts made just for them.
      <br />
      Thoughtful designs, premium quality.
    </p>
  </div>
</section>


      {/* Shop by Category */}
     <section style={{ maxWidth: "1200px", margin: "50px auto", padding: "0 20px" }}>
  <h2 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center" }}>Shop by Gift Type</h2>
  <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "30px", padding: "20px" }}>
    {[
      { img: "mugs.jpg", title: "Photo Mugs", desc: "Custom printed mugs", link: "/personalizedgiftDetails" },
      { img: "pillows.jpg", title: "Cushions", desc: "Personalized pillows", link: "/personalizedgiftDetails" },
      { img: "keychains.jpg", title: "Keychains", desc: "Engraved & printed", link: "#" },
      { img: "frames.jpg", title: "Photo Frames", desc: "Customized memories", link: "#" },
      { img: "notebooks.jpg", title: "Notebooks", desc: "Printed covers & pages", link: "#" },
    ].map((item, index) => (
      <div key={index} style={{ textAlign: "center", width: "200px", flex: "1 1 200px" }}>
        <img
          src={`/assets/gifts/${item.img}`}
          alt={item.title}
          style={{ width: "100%", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}
        />
        <h4 style={{ marginTop: "12px", fontSize: "16px", fontWeight: "600" }}>{item.title}</h4>
        <p style={{ color: "#555", fontSize: "14px", margin: "4px 0" }}>{item.desc}</p>
        <Link
          to={item.link}
          style={{ color: "#00704A", fontSize: "14px", textDecoration: "none", fontWeight: "500" }}
        >
          Shop {item.title}
        </Link>
      </div>
    ))}
  </div>
</section>

      {/* Gift Themes Section */}
      <section style={{ maxWidth: "1200px", margin: "50px auto", padding: "0 20px" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center" }}>Shop by Occasion</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap" }}>
          {[
            {
              img: "birthday.jpg",
              title: "Birthday Gifts",
              bullets: ["Bright, fun designs", "Add names or messages", "Fast delivery"],
            },
            {
              img: "anniversary.jpg",
              title: "Anniversary Gifts",
              bullets: ["Elegant templates", "Photo personalization", "Romantic touches"],
            },
          ].map((occasion, idx) => (
            <div key={idx} style={{ width: "280px", textAlign: "center" }}>
              <img src={`/assets/gifts/${occasion.img}`} alt={occasion.title} style={{ width: "100%", borderRadius: "8px" }} />
              <h4 style={{ marginTop: "10px", fontSize: "16px" }}>{occasion.title}</h4>
              <ul style={{ fontSize: "14px", textAlign: "left", paddingLeft: "20px" }}>
                {occasion.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
              <a href="#" style={{ color: "#00704A", fontSize: "14px" }}>Shop {occasion.title}</a>
            </div>
          ))}
        </div>
      </section>

      {/* Templates Section */}
      <section style={{ maxWidth: "1200px", margin: "50px auto", padding: "0 20px" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center" }}>Customize with Our Gift Templates</h2>
        <p style={{ textAlign: "center", color: "#555", marginBottom: "30px" }}>
          Start with a beautiful design and personalize it to make it yours.
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
          {[
            { img: "gift-template1.jpg", title: "Birthday Mug Template" },
            { img: "gift-template2.jpg", title: "Love Cushion Template" },
            { img: "gift-template3.jpg", title: "Modern Keychain Template" },
            { img: "gift-template4.jpg", title: "Photo Frame Template" },
          ].map((tpl, idx) => (
            <div key={idx} style={{ width: "200px", textAlign: "center" }}>
              <img src={`/assets/gifts/${tpl.img}`} alt={tpl.title} style={{ width: "100%", borderRadius: "8px",height:"160px",objectFit:"cover" }} />
              <h4 style={{ fontSize: "14px", marginTop: "10px" }}>{tpl.title}</h4>
              <a href="#" style={{ color: "#00704A", fontSize: "14px" }}>Start creating</a>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button style={{ backgroundColor: "#003D2B", color: "white", padding: "10px 20px", borderRadius: "5px", border: "none" }}>
            Browse Personalized Gift Templates
          </button>
        </div>
      </section>

   {/* CTA Section */}
{/* <section style={{ backgroundColor: "#003D2B", color: "white", padding: "40px 20px" }}>
  <div
    style={{
      maxWidth: "1000px",
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
    }}
  >
    <img
      src="/assets/gifts/gift-cta.jpg"
      alt="Personalized Gift Help"
      style={{ width: "200px", borderRadius: "8px", marginBottom: "20px" }}
    />
    <div style={{ maxWidth: "600px" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
        Need help designing your perfect gift?
      </h2>
      <p style={{ fontSize: "16px", marginBottom: "20px" }}>
        Whether it’s for birthdays, anniversaries, or just because—our design experts can help you create memorable, customized gifts with ease.
      </p>
      <button
        style={{
          backgroundColor: "white",
          color: "#003D2B",
          padding: "10px 20px",
          borderRadius: "5px",
          marginRight: "10px",
          border: "none",
          fontWeight: "600",
        }}
      >
        Explore Design Help
      </button>
      <button
        style={{
          backgroundColor: "transparent",
          color: "white",
          padding: "10px 20px",
          border: "1px solid white",
          borderRadius: "5px",
          fontWeight: "600",
        }}
      >
        Contact Us
      </button>
    </div>
  </div>
</section> */}


      <BusinessCardOptions />
      <Footer />
    </div>
    
  );
};

export default PersonalizedGift;
