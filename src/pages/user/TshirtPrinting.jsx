import React from "react";
import Header from "./components/Header";
import { Link } from "react-router-dom";
import Footer from "./components/Footer";
import BusinessCardOptions from "./BusinessCardOptions";

import './Home.css';
const TShirtPrinting = () => {
  return (
     <div className="responsive-container">
        <Header />

        {/* Hero Section */}
        <section style={{ position: "relative", width: "100%" }}>
          <img
            src="/assets/tshirt/banner.jpg"
            alt="T-Shirt Printing"
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
            <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>Custom T-Shirt Printing</h1>
            <p style={{ fontSize: "18px", lineHeight: "1.5" }}>
              Bring your ideas to life with vibrant, long-lasting T-shirt prints.
              <br />
              Perfect for teams, events, or personal style.
            </p>
          </div>
        </section>


        <section style={{ maxWidth: "1200px", margin: "50px auto", padding: "0 20px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center" }}>Shop by T-Shirt Type</h2>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "30px", padding: "20px" }}>
            {[
              { img: "round-neck.jpg", title: "Round Neck", desc: "Classic everyday tees", path: "/tshirtprintingdetail" },
              { img: "polo.jpg", title: "Polo T-Shirts", desc: "Smart casual prints", path: "/tshirtprintingdetail" },
              { img: "full-sleeve.jpg", title: "Full Sleeve", desc: "All-season comfort", path: "/tshirtpriningtdetail" },
              { img: "crop-top.jpg", title: "Crop Tops", desc: "Trendy & stylish", path: "/tshirtprintingdetail" },
              { img: "sports.jpg", title: "Sports Tees", desc: "Performance-ready prints", path: "/tshirtprintingdetail" },
            ].map((item, index) => (
              <div key={index} style={{ textAlign: "center", width: "200px", flex: "1 1 200px" }}>
                <img
                  src={`/assets/tshirt/${item.img}`}
                  alt={item.title}
                  style={{ width: "100%", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" , height: "180px",objectFit:"cover", }}
                />
                <h4 style={{ marginTop: "12px", fontSize: "16px", fontWeight: "600" }}>{item.title}</h4>
                <p style={{ color: "#555", fontSize: "14px", margin: "4px 0" }}>{item.desc}</p>
                <Link
                  to={item.path}
                  style={{ color: "#00704A", fontSize: "14px", textDecoration: "none", fontWeight: "500" }}
                >
                  Shop {item.title}
                </Link>
              </div>
            ))}
          </div>
        </section>


        {/* Themes or Use Cases */}
        <section style={{ maxWidth: "1200px", margin: "50px auto", padding: "0 20px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center" }}>Shop by Purpose</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap" }}>
            {[
              {
                img: "event.jpg",
                title: "Event & Team Tees",
                bullets: ["Group orders available", "Logo & name printing", "Sizes for all"],
              },
              {
                img: "personal.jpg",
                title: "Personalized Designs",
                bullets: ["Upload your artwork", "Photo or text-based", "Unique gift idea"],
              },
            ].map((purpose, idx) => (
              <div key={idx} style={{ width: "280px", textAlign: "center" }}>
                <img src={`/assets/tshirt/${purpose.img}`} alt={purpose.title} style={{ width: "100%", borderRadius: "8px" }} />
                <h4 style={{ marginTop: "10px", fontSize: "16px" }}>{purpose.title}</h4>
                <ul style={{ fontSize: "14px", textAlign: "left", paddingLeft: "20px" }}>
                  {purpose.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
                <a href="/tshirtprintingdetail" style={{ color: "#00704A", fontSize: "14px" }}>Shop {purpose.title}</a>
              </div>
            ))}
          </div>
        </section>

        {/* Templates Section */}
        <section style={{ maxWidth: "1200px", margin: "50px auto", padding: "0 20px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center" }}>Start with a Design Template</h2>
          <p style={{ textAlign: "center", color: "#555", marginBottom: "30px" }}>
            Pick a professionally designed T-shirt template and make it your own.
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
            {[
              { img: "template1.jpg", title: "Corporate Team Tee" },
              { img: "template2.jpg", title: "Birthday Bash Tee" },
              { img: "template3.jpg", title: "Fitness Club Tee" },
              { img: "template4.jpg", title: "Funny Quote Tee" },
            ].map((tpl, idx) => (
              <div key={idx} style={{ width: "200px", textAlign: "center" }}>
                <img src={`/assets/tshirt/${tpl.img}`} alt={tpl.title} style={{ width: "100%", borderRadius: "8px",height:"180px",objectFit:"cover"}} />
                <h4 style={{ fontSize: "14px", marginTop: "10px" }}>{tpl.title}</h4>
                <a href="/tshirtprintingdetail" style={{ color: "#00704A", fontSize: "14px" }}>Start creating</a>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button style={{ backgroundColor: "#003D2B", color: "white", padding: "10px 20px", borderRadius: "5px", border: "none" }}>
              Browse T-Shirt Templates
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
              src="/assets/tshirts/cta.jpg"
              alt="T-Shirt Design Help"
              style={{ width: "200px", borderRadius: "8px", marginBottom: "20px" }}
            />
            <div style={{ maxWidth: "600px" }}>
              <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
                Need help creating your T-shirt design?
              </h2>
              <p style={{ fontSize: "16px", marginBottom: "20px" }}>
                Our design experts are here to help you craft eye-catching T-shirts—just the way you imagined.
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
        </section> */}


        <Footer />
      </div>
    
  );
};

export default TShirtPrinting;
