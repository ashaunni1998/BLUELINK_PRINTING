import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeSlider from "./HomeSlider";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { useEffect } from "react";
import API_BASE_URL from "../../config"; // adjust the path properly
import { TranslateProvider } from "../../context/TranslateProvider";
import FlyerSection from "./FlyerSection";


const Home = () => {





  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/products`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.productData) setProducts(data.productData);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);




  const [showModal, setShowModal] = useState(false);

  const handleShopNowClick = () => {
    const isLoggedIn = false; // Replace with real auth check
    if (!isLoggedIn) {
      setShowModal(true);
    } else {
      // Proceed to cart or product detail
    }
  };

  const handleLoginRedirect = () => {
    window.location.href = "/login"; // Adjust route as needed
  };

  useEffect(() => {
    const section = document.getElementById("popular-products");
    if (section) {
      section.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, []);

  const styles = {
    section: {
      backgroundColor: "#f7f9f7",
      padding: "40px 20px",
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
    },
    logosRow: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "40px",
      marginBottom: "40px",
    },
    logo: {
      maxHeight: "40px",
      objectFit: "contain",
    },
    trustpilotBlock: {
      marginBottom: "40px",
    },
    trustpilotStars: {
      display: "flex",
      justifyContent: "center",
      marginTop: "10px",
      gap: "2px",
    },
    reviewCards: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "20px",
      padding: "0 20px",
    },
    card: {
      backgroundColor: "#fff",
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "20px",
      width: "300px",
      textAlign: "left",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    },
    stars: {
      display: "flex",
      gap: "2px",
      marginBottom: "10px",
    },
    starIcon: {
      width: "20px",
      height: "20px",
    },
    reviewTitle: {
      fontWeight: "bold",
      fontSize: "16px",
      marginBottom: "6px",
    },
    reviewText: {
      fontSize: "14px",
      color: "#333",
      marginBottom: "10px",
    },
    reviewer: {
      fontSize: "13px",
      color: "#555",
      fontWeight: "bold",
    },
    timeAgo: {
      fontWeight: "normal",
      color: "#999",
      fontSize: "12px",
    },
  };
  

  const logos = [
    { alt: "Uber", src: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" },
    { alt: "Calm", src: "/homeimages/calm.svg", style: { height: "600px" } },
    { alt: "Glossier", src: "/homeimages/glossier.svg" },
    { alt: "Etsy", src: "/homeimages/etsy.svg" },
    { alt: "Airbnb", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_Bélo.svg/512px-Airbnb_Logo_Bélo.svg.png" },
    { alt: "TED", src: "/homeimages/TED.svg" },
  ];

  const reviews = [
    {
      stars: 5,
      title: "Simple quick excellence",
      text: "It was a simple process to design my business card. They were quickly shipped a...",
      author: "Barry Weber",
      time: "12 hours ago",
    },
    {
      stars: 5,
      title: "BlueLink’s platform is easy to navigate",
      text: "BlueLink’s platform is easy to navigate. I love the cards I designed. Having my art o...",
      author: "Kimberly Brayman",
      time: "12 hours ago",
    },
    {
      stars: 5,
      title: "ABSOLUTELY AMAZING SERVICE!!",
      text: "Orders these cards for a game with my boyfriend and...",
      author: "OliviaDoodles",
      time: "1 day ago",
    },
  ];

  const Star = () => (
    <svg
      width="60px"
      height=""
      viewBox="0 0 46 46"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="tp-star">
        <path
          className="tp-star__canvas"
          fill="#dcdce6"
          d="M0 46.330002h46.375586V0H0z"
        />
        <path
          className="tp-star__shape"
          fill="#FFF"
          d="M39.533936 19.711433L13.230239 38.80065l3.838216-11.797827L7.02115 19.711433h12.418975l3.837417-11.798624 3.837418 11.798624h12.418975zM23.2785 31.510075l7.183595-1.509576 2.862114 8.800152L23.2785 31.510075z"
        />
      </g>
    </svg>
  );


  return (
    <div className="responsive-container">
      {/* <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <h1 style={{ color: "#007bff", fontSize: "24px" }}>BlueLink Printing</h1>
        <ul style={{ display: "flex", listStyle: "none", gap: "30px", margin: 0 }}>
          <li style={{ cursor: "pointer" }}>Home</li>
          <li style={{ cursor: "pointer" }}>Services</li>
          <li style={{ cursor: "pointer" }}>Upload</li>
          <li style={{ cursor: "pointer" }}>Contact</li>
        </ul>
      </nav> */}
      <Header />

      {/* Hero Section */}
      <HomeSlider />
      {/* Features Section */}
    <section style={{ padding: "40px 20px", backgroundColor: "#ffffff" }}>
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "stretch",
      flexWrap: "wrap",
      gap: "30px",
      textAlign: "center",
      maxWidth: "1200px",
      margin: "0 auto",
    }}
  >
    {/* Card 1 */}
   <div
      style={{
        flex: "1 1 280px",
        maxWidth: "320px",
        padding: "25px 20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <img
        src="https://img.icons8.com/ios-filled/100/007bff/blueprint.png"
        alt="Print"
        style={{ marginBottom: "15px", height: "80px" }}
      />
      <h3 style={{ fontSize: "20px", marginBottom: "10px", fontWeight: "600" }}>
        High-Quality Prints
      </h3>
      <p style={{ color: "#555", fontSize: "15px", lineHeight: "1.6" }}>
        Crisp, clear, and durable blueprint prints for professionals.
      </p>
    </div>
  

    {/* Card 2 */}
    <div
      style={{
        flex: "1 1 280px",
        maxWidth: "320px",
        padding: "25px 20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        backgroundColor: "#fff",
                display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",

      }}
    >
      <img
        src="https://img.icons8.com/ios-filled/100/007bff/shipped.png"
        alt="Delivery"
        style={{ marginBottom: "15px", height: "80px" }}
      />
      <h3 style={{ fontSize: "20px", marginBottom: "10px", fontWeight: "600" }}>
        Fast Delivery
      </h3>
      <p style={{ color: "#555", fontSize: "15px", lineHeight: "1.6" }}>
        Next-day delivery available for urgent projects and deadlines.
      </p>
    </div>

    {/* Card 3 */}
    <div
      style={{
        flex: "1 1 280px",
        maxWidth: "320px",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        backgroundColor: "#fff",
                display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",

      }}
    >
      <img
        src="https://img.icons8.com/ios-filled/100/007bff/customer-support.png"
        alt="Support"
        style={{ marginBottom: "15px", height: "80px" }}
      />
      <h3 style={{ fontSize: "20px", marginBottom: "10px", fontWeight: "600" }}>
        Customer Support
      </h3>
      <p style={{ color: "#555", fontSize: "15px", lineHeight: "1.6" }}>
        Reach out any time—our team is here to help you succeed.
      </p>
    </div>
  </div>
</section>

      {/* Popular Products Section */}
      <section style={{ backgroundColor: "#f5f8f6", padding: "50px 0px", textAlign: "center" }}>
  <h2 style={{ fontSize: "28px", marginBottom: "10px", fontWeight: "600", color: "#111" }}>
    Popular products
  </h2>
  <p style={{ fontSize: "16px", color: "#666", marginBottom: "40px" }}>
    These are tried and true favorites that will have you set to get down to business.
  </p>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "30px",
      maxWidth: "1200px",
      margin: "0 auto",
    }}
  >
    {products.map((product) => (
      <div
        key={product._id}
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          transition: "transform 0.2s ease",
        }}
      >
        {/* Image wrapper */}
        <div
          style={{
            width: "100%",
            aspectRatio: "4/3", // keeps images same shape
            overflow: "hidden",
          }}
        >
          <img
            src={product.images[0] || "https://via.placeholder.com/300"}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain", // prevents cropping
              display: "block",
              backgroundColor: "#f9f9f9",
            }}
          />
        </div>

        {/* Product details */}
        <div
          style={{
            padding: "14px",
            borderTop: "1px solid #eee",
            textAlign: "center",
          }}
        >
          <Link
            to={`/product/${product._id}`}
            style={{
              color: "#007a5e",
              textDecoration: "none",
              fontWeight: "500",
              fontSize: "15px",
              display: "block",
              marginBottom: "6px",
            }}
          >
            {product.name} &gt;
          </Link>
          <p style={{ fontSize: "14px", color: "#444", margin: 0 }}>
            ${product.price}
          </p>
        </div>
      </div>
    ))}
  </div>
</section>






      {/* <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div
          style={{
            flex: "1 1 300px",
            minWidth: "300px",
            maxWidth: "500px",
            height: "300px",
            backgroundImage: "url('/homeimages/flyer.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "8px",
          }}
        />
        <div
          style={{
            flex: "1 1 300px",
            minWidth: "300px",
            maxWidth: "500px",
            backgroundColor: "#fff",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            marginTop: "20px",
          }}
        >
          <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>Flyers & Leaflets.</h1>
          <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
            Get creative with your Flyer printing.
            <br />
            Choose from fancy finishes and premium papers.
          </p>
        </div>
      </section> */}
<FlyerSection/>





      <section
        style={{
          backgroundColor: "#f5f5f5",
          padding: "60px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "30px",
            justifyContent: "center",
          }}
        >
          {/* Business Card Design Examples */}
          <div
            style={{
              backgroundColor: "#fff",
              maxWidth: "500px",
              flex: "1 1 300px",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <img
              src="/homeimages/business-cards-sample.jpg"
              alt="Business Card Examples"
              style={{ width: "100%", height: "auto" }}
            />
            <div style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px" }}>
                10 Business Card design examples
              </h3>
              <p style={{ fontSize: "15px", color: "#555", marginBottom: "16px" }}>
                Blue Links’s designers share 10 standout business cards from different industries.
              </p>
              <a
                href="#"
                style={{
                  color: "#007bff",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Read more &gt;
              </a>
            </div>
          </div>

          {/* Invites Section */}
          <div
            style={{
              backgroundColor: "#fff",
              maxWidth: "500px",
              flex: "1 1 300px",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <img
              src="/homeimages/invites-sample.jpg"
              alt="Event Invitations"
              style={{ width: "100%", height: "auto" }}
            />
            <div style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px" }}>
                Invites they won’t ignore
              </h3>
              <p style={{ fontSize: "15px", color: "#555", marginBottom: "16px" }}>
                How to create paper invites that actually get a “yes.”
              </p>
              <a
                href="#"
                style={{
                  color: "#007bff",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Read more &gt;
              </a>
            </div>
          </div>
        </div>
      </section>

     {/* Section 1 - Flyers */}
<section
 
  className="promo-section"
>
  {/* Left Image */}
  <div
    
  className="promo-image"
  >
    <img
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd19vInA8bUX20OregUR32xvV6CbNZ_kMhDQ&s"
      alt="Flyers & Leaflets"
      style={{
        width: "100%",
        maxWidth: "600px",
        height: "auto",
        borderRadius: "16px",
        boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
        transition: "transform 0.3s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    />
  </div>

  {/* Right Text */}
  <div
   className="promo-card"
  >
    <h2 style={{ fontSize: "32px", marginBottom: "20px", fontWeight: "700", color: "#111" }}>
      Flyers & Leaflets. Spread the word.
    </h2>
    <p style={{ fontSize: "18px", color: "#444", marginBottom: "30px", lineHeight: "1.6" }}>
      Make your message loud and clear with professional, high-impact flyers and
      leaflets – ideal for promotions, menus, and more.
    </p>
    <a
      href="#"
      style={{
        fontSize: "16px",
        padding: "12px 28px",
        borderRadius: "8px",
        backgroundColor: "#007bff",
        color: "#fff",
        fontWeight: "600",
        textDecoration: "none",
        display: "inline-block",
        transition: "background 0.3s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#005f47")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007a5e")}
    >
      Shop Flyers & Leaflets 
    </a>
  </div>
</section>

{/* Section 2 - Gifts */}
<section

  className="promo-section reverse"
>
  {/* Left Text */}
  <div
    className="promo-card"
  >
    <h2 style={{ fontSize: "32px", marginBottom: "20px", fontWeight: "700", color: "#111" }}>
      Personalized Gifts. Make it special.
    </h2>
    <p style={{ fontSize: "18px", color: "#444", marginBottom: "30px", lineHeight: "1.6" }}>
      Add a personal touch with custom gifts perfect for any occasion – from
      birthdays to business branding.
    </p>
    <a
      href="#"
      style={{
        fontSize: "16px",
        padding: "12px 28px",
        borderRadius: "8px",
        backgroundColor: "#007bff",
        color: "#fff",
        fontWeight: "600",
        textDecoration: "none",
        display: "inline-block",
        transition: "background 0.3s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#005f47")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007a5e")}
    >
      Shop Personalized Gifts 
    </a>
  </div>

  {/* Right Image */}
  <div
   className="promo-image "
  >
    <img
      src="https://thesignaturebox.com/cdn/shop/articles/personalised-gifts-5-things-to-consider-before-choosing-personalized-gifts-294055.jpg?v=1706979689&width=1280"
      alt="Personalized Gift"
      style={{
        width: "100%",
        maxWidth: "600px",
        height: "auto",
        borderRadius: "16px",
        boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
        transition: "transform 0.3s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    />
  </div>
</section>



      {/* CTA Banner */}
      <section
        style={{
          padding: "60px 20px",
          backgroundColor: "#007bff",
          color: "#ffffff",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "28px", marginBottom: "15px" }}>
          Let’s Get Your Plans Printed!
        </h2>
        <p style={{ fontSize: "18px", marginBottom: "25px" }}>
          Simple process. High-quality. Always on time.
        </p>
        <a href="/sign-in" ><button
          style={{
            padding: "10px 28px",
            fontSize: "16px",
            backgroundColor: "#ffffff",
            color: "#007bff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Start Now
        </button></a>
      </section>


      <Footer />



    </div>


  );
};

export default Home;
