import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BusinessCardOptions from "./BusinessCardOptions";
import './Home.css';

const Flyer = () => {
  return (
     <div className="responsive-container">
      <Header />
      {/* Hero Section */}
   <section
  style={{
    position: "relative",
    backgroundImage: "url('/assets/flyers/banners.jpeg')",
    backgroundSize:" cover",
    backgroundPosition:"center",
    backgroundRepeat: "no-repeat",
   
   
    height: "320px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "0 40px",
    boxSizing: "border-box",
    overflow: "hidden",
  }}
>
  <div
    style={{
      maxWidth: "600px",
     
      padding: "20px",
      borderRadius: "8px",
      color: "#fff",
    }}
  >
    <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>Flyers & Leaflets.</h1>
    <p style={{ fontSize: "18px", lineHeight: "1.5" }}>
      Get creative with your Flyer printing.
      <br />
      Choose from fancy finishes and premium papers.
    </p>
  </div>
</section>


{/* Nav Section */}
{/* <nav
  style={{
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    gap: "40px",
    fontSize: "14px",
    paddingBottom: "20px",
  }}
>
  <span>Shop Flyer by Size</span>
  <span>Flyer Paper</span>
  <span>Flyer Printing</span>
  <span>Design Your Flyer</span>
  <span>Why MOO?</span>
</nav> */}


{/* Navigation Below the Hero */}


      {/* Shop by Size */}
<section style={{ maxWidth: "1200px", margin: "50px auto", padding: "0 20px" }}>
  <h2 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center" }}>
    Shop Flyers & Leaflets by Size
  </h2>

  <div
    style={{
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "30px",
      padding: "20px",
    }}
  >
    {[
      { img: "small-flyer.png", title: "Small Flyer", desc: '4.13" x 5.83"', link: "#" },
      { img: "square-flyer.png", title: "Square Flyer", desc: '4.72" x 4.72"', link: "#" },
      { img: "long-flyer.png", title: "Long Flyer", desc: '3.67" x 8.5"', link: "#" },
      { img: "half-flyer.png", title: "Half Page Flyer", desc: '5.5" x 8.5"', link: "#" },
      { img: "us-flyer.png", title: "US Letter Flyer", desc: '8.5" x 11"', link: "#" },
    ].map((item, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          width: "200px",
          flex: "1 1 200px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          padding: "15px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          textAlign: "center",
          height: "100%",
        }}
      >
        <img
          src={`/assets/flyers/${item.img}`}
          alt={item.title}
          style={{
            width: "100%",
            height: "150px",
            objectFit: "cover",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        />
        <div style={{ marginTop: "12px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: "600" }}>{item.title}</h4>
            <p style={{ color: "#555", fontSize: "14px", margin: "4px 0" }}>{item.desc}</p>
          </div>
          <a
            href={item.link}
            style={{
              color: "#00704A",
              fontSize: "14px",
              textDecoration: "none",
              fontWeight: "500",
              marginTop: "12px",
              display: "inline-block",
            }}
          >
            Shop {item.title}
          </a>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* Shop by Paper */}
      <section style={{ maxWidth: "1200px", margin: "50px auto", padding: "0 20px" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center" }}>Shop Flyers & Leaflets by Paper</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap" }}>
          {[
            {
              img: "premium-paper.jpg",
              title: "Premium Paper Flyer",
              bullets: ["Silky smooth finish", "Choose from gloss or matte", "Double-sided printing"]
            },
            {
              img: "recycled-paper.jpg",
              title: "Recycled Paper Flyer",
              bullets: ["100% recycled", "Uncoated texture", "Eco-friendly choice"]
            }
          ].map((paper, idx) => (
            <div key={idx} style={{ width: "280px", textAlign: "center" }}>
              <img src={`/assets/flyers/${paper.img}`} alt={paper.title} style={{ width: "100%", borderRadius: "8px" }} />
              <h4 style={{ marginTop: "10px", fontSize: "16px" }}>{paper.title}</h4>
              <ul style={{ fontSize: "14px", textAlign: "left", paddingLeft: "20px" }}>
                {paper.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
              <a href="#" style={{ color: "#00704A", fontSize: "14px" }}>Shop {paper.title}</a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {/* <section style={{ backgroundColor: "#003D2B", color: "white", padding: "40px 20px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <img src="/assets/flyers/flyer-cta.jpg" alt="Flyer Help" style={{ width: "200px", borderRadius: "8px", marginBottom: "20px" }} />
          <div style={{ maxWidth: "600px" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Need help designing your Flyer?</h2>
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              Unlock a team of expert designers, enjoy special discounts on custom flyer printing and more with a MOO Business Plan.
            </p>
            <button style={{ backgroundColor: "white", color: "#003D2B", padding: "10px 20px", borderRadius: "5px", marginRight: "10px", border: "none" }}>
              Compare Plans
            </button>
            <button style={{ backgroundColor: "transparent", color: "white", padding: "10px 20px", border: "1px solid white", borderRadius: "5px" }}>
              Talk to Us
            </button>
          </div>
        </div>
      </section> */}

      {/* Templates */}
     <section style={{ maxWidth: "1200px", margin: "50px auto", padding: "0 20px", overflowX: "hidden" }}>
  <h2 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center" }}>
    BlueLink Flyer Templates
  </h2>
  <p style={{ textAlign: "center", color: "#555", marginBottom: "30px" }}>
    Use our unique, modern Flyer designs straight out of the box or customise to suit your style.
  </p>

  <div
    style={{
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "20px",
    }}
  >
    {[
      { img: "template1.jpg", title: "Post Pack Flyer Design" },
      { img: "template2.jpg", title: "Iconic Travel Flyer Design" },
      { img: "template3.jpg", title: "Bar Menu Flyer Design" },
      { img: "template4.jpg", title: "Spotted Data Flyer Design" },
    ].map((tpl, idx) => (
      <div
        key={idx}
        style={{
          flex: "1 1 200px",
          maxWidth: "100%",
          minWidth: "150px",
          textAlign: "center",
        }}
      >
        <img
          src={`/assets/flyers/${tpl.img}`}
          alt={tpl.title}
          style={{ width: "100%", borderRadius: "8px" }}
        />
        <h4 style={{ fontSize: "14px", marginTop: "10px" }}>{tpl.title}</h4>
        <a href="#" style={{ color: "#00704A", fontSize: "14px" }}>Start creating</a>
      </div>
    ))}
  </div>

  <div style={{ textAlign: "center", marginTop: "30px" }}>
    <button
      style={{
        backgroundColor: "#003D2B",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
      }}
    >
      Browse Blue link Flyer Templates
    </button>
  </div>
</section>

      <BusinessCardOptions/>
      <Footer />
    </div>
    
  );
};

export default Flyer;
