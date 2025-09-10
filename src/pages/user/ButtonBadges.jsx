import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Link } from 'react-router-dom';
import './Home.css';


const ButtonBadges = () => {
  return (
    <div className="responsive-container">
        <Header />

        {/* Hero Section */}
        <section style={{ position: "relative", width: "100%" }}>
          <img
            src="/assets/badges/banner.jpg"
            alt="Custom Button Badges"
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
            {/* <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>Custom Button Badges</h1>
            <p style={{ fontSize: "18px", lineHeight: "1.5" }}>
              Perfect for events, branding, or fun expressions. Design your own button badges today!
            </p> */}
          </div>
        </section>

        {/* Shop by Badge Type */}
        <section style={{ maxWidth: "1200px", margin: "50px auto", padding: "0 20px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center" }}>Shop by Badge Type</h2>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "30px", padding: "20px" }}>
            {[
              { img: "round.jpg", title: "Round Badges", desc: "Classic circular design", link: "/buttonbadgesdetails" },
              { img: "square.jpg", title: "Square Badges", desc: "Modern & neat", link: "#" },
              { img: "magnet.jpg", title: "Magnet Badges", desc: "No pins, easy to wear", link: "#" },
              { img: "name-tag.jpg", title: "Name Tags", desc: "For events & staff IDs", link: "#" },
            ].map((item, index) => (
              <div key={index} style={{ textAlign: "center", width: "200px", flex: "1 1 200px" }}>
                <img
                  src={`/assets/badges/${item.img}` }
                  alt={item.title}
                  style={{ width: "100%", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" ,height:"180px",objectFit:"cover"}}
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

        {/* Shop by Purpose */}
        <section style={{ maxWidth: "1200px", margin: "50px auto", padding: "0 20px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center" }}>Shop by Purpose</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap" }}>
            {[
              {
                img: "event.jpg",
                title: "Event Giveaways",
                bullets: ["Perfect for branding", "Bulk order discounts", "Quick turnaround"],
              },
              {
                img: "personal.jpg",
                title: "Personal Expression",
                bullets: ["Upload your design", "Fun, creative options", "Great for gifts"],
              },
            ].map((purpose, idx) => (
              <div key={idx} style={{ width: "280px", textAlign: "center" }}>
                <img src={`/assets/badges/${purpose.img}`} alt={purpose.title} style={{ width: "100%", borderRadius: "8px",height:"180px",objectFit:"cover" }} />
                <h4 style={{ marginTop: "10px", fontSize: "16px" }}>{purpose.title}</h4>
                <ul style={{ fontSize: "14px", textAlign: "left", paddingLeft: "20px" }}>
                  {purpose.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
                <a href="#" style={{ color: "#00704A", fontSize: "14px" }}>Shop {purpose.title}</a>
              </div>
            ))}
          </div>
        </section>

        {/* Templates Section */}
        <section style={{ maxWidth: "1200px", margin: "50px auto", padding: "0 20px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center" }}>Start with a Badge Template</h2>
          <p style={{ textAlign: "center", color: "#555", marginBottom: "30px" }}>
            Choose from our templates to get started quickly and easily.
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
            {[
              { img: "template1.jpg", title: "Vote Campaign Badge" },
              { img: "template2.jpg", title: "Birthday Party Badge" },
              { img: "template3.jpg", title: "Employee of the Month" },
              { img: "template4.jpg", title: "Funny Quote Badge" },
            ].map((tpl, idx) => (
              <div key={idx} style={{ width: "200px", textAlign: "center" }}>
                <img src={`/assets/badges/${tpl.img}`} alt={tpl.title} style={{ width: "100%", borderRadius: "8px",height:"180px",objectFit:"cover" }} />
                <h4 style={{ fontSize: "14px", marginTop: "10px" }}>{tpl.title}</h4>
                <a href="#" style={{ color: "#00704A", fontSize: "14px" }}>Start creating</a>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button style={{ backgroundColor: "#003D2B", color: "white", padding: "10px 20px", borderRadius: "5px", border: "none" }}>
              Browse Badge Templates
            </button>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ backgroundColor: "#003D2B", color: "white", padding: "40px 20px" }}>
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
              src="/assets/badges/cta.jpg"
              alt="Badge Design Help"
              style={{ width: "200px", borderRadius: "8px", marginBottom: "20px" }}
            />
            <div style={{ maxWidth: "600px" }}>
              <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
                Need help creating your Button Badge?
              </h2>
              <p style={{ fontSize: "16px", marginBottom: "20px" }}>
                Let our design experts assist you in creating badges that make a statement.
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
                Get Design Help
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
        </section>

        <Footer />
      </div>
    
  );
};

export default ButtonBadges;
