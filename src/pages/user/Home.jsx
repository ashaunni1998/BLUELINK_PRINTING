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
import EnhancedHomeSections from "./EnhancedHomeSections";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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


const navigate = useNavigate();

const handleBuyNow = (productId) => {
  const isLoggedIn = localStorage.getItem("userToken"); // adjust to your auth check

  if (!isLoggedIn) {
    Swal.fire({
      title: "Login Required",
      text: "Please sign in to continue your purchase.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#007bff",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sign In",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/sign-in"); // redirect to sign-in
      }
    });
  } else {
    navigate(`/checkout/${productId}`); // go to checkout
  }
};


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
console.log(products);


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
      <HomeSlider  />
      {/* Features Section */}
<section style={{ padding: "20px 10px", backgroundColor: "#ffffff" }}>
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "stretch",
      flexWrap: "wrap",
      gap: "15px",
      textAlign: "center",
      maxWidth: "1100px",
      margin: "0 auto",
    }}
  >
    {/* Card 1 */}
    <div
      style={{
        flex: "1 1 220px",
        maxWidth: "260px",
        padding: "12px 10px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
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
        style={{ marginBottom: "8px", height: "50px" }}
      />
      <h3 style={{ fontSize: "16px", marginBottom: "4px", fontWeight: "600" }}>
        High-Quality Prints
      </h3>
      <p style={{ color: "#555", fontSize: "13px", lineHeight: "1.4" }}>
        Crisp, clear, and durable blueprint prints for professionals.
      </p>
    </div>

    {/* Card 2 */}
    <div
      style={{
        flex: "1 1 240px",
        maxWidth: "260px",
        padding: "12px 10px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
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
        style={{ marginBottom: "8px", height: "50px" }}
      />
      <h3 style={{ fontSize: "16px", marginBottom: "4px", fontWeight: "600" }}>
        Fast Delivery
      </h3>
      <p style={{ color: "#555", fontSize: "13px", lineHeight: "1.4" }}>
        Next-day delivery available for urgent projects and deadlines.
      </p>
    </div>

    {/* Card 3 */}
    <div
      style={{
        flex: "1 1 220px",
        maxWidth: "260px",
        padding: "12px 10px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
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
        style={{ marginBottom: "8px", height: "50px" }}
      />
      <h3 style={{ fontSize: "16px", marginBottom: "4px", fontWeight: "600" }}>
        Customer Support
      </h3>
      <p style={{ color: "#555", fontSize: "13px", lineHeight: "1.4" }}>
        Reach out any time—our team is here to help you succeed.
      </p>
    </div>
  </div>
</section>


      {/* Popular Products Section */}
      <section style={{ backgroundColor: "#f5f8f6", padding: "30px 0px 40px", textAlign: "center" }}>
  <h2
  style={{
    fontSize: "26px",
    marginBottom: "10px",
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    position: "relative",
    display: "inline-block",
  }}
>
  Popular Products
  <span
    style={{
      position: "absolute",
      left: "50%",
      bottom: "-6px",
      transform: "translateX(-50%)",
      width: "60px",
      height: "4px",
      // backgroundColor: "#007bff", // brand accent underline
      borderRadius: "2px",
    }}
  ></span>
</h2>

<p
  style={{
    fontSize: "14px",
    color: "#555",
    marginBottom: "30px",
    maxWidth: "600px",
    marginInline: "auto",
    lineHeight: "1.5",
    textAlign: "center",
  }}
>
  These are tried and true favorites that will have you set to get down to business.
</p>


  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      maxWidth: "1100px",
      margin: "0 auto",
    }}
  >
    {products.map((product) => (
      <div
        key={product._id}
        style={{
          backgroundColor: "#fff",
          borderRadius: "6px",
          overflow: "hidden",
          boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
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

{/*  */}


<section
  style={{
    backgroundColor: "#f9fafb", // light grey for contrast
    padding: "70px 20px",
    textAlign: "center",
  }}
>
  <h2
    style={{
      fontSize: "32px",
      marginBottom: "12px",
      fontWeight: "700",
      color: "#111",
    }}
  >
    Our Postcards
  </h2>
  <p
    style={{
      fontSize: "17px",
      color: "#555",
      marginBottom: "50px",
      maxWidth: "700px",
      marginInline: "auto",
      lineHeight: "1.6",
    }}
  >
    Send your message in style with high-quality, beautifully designed postcards
    that make a real impact.
  </p>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "35px",
      maxWidth: "1200px",
      margin: "0 auto",
    }}
  >
    {products
      .filter((product) => {
        const category =
          typeof product.category === "string"
            ? product.category.toLowerCase()
            : "";
        const name =
          typeof product.name === "string"
            ? product.name.toLowerCase()
            : "";
        return category.includes("postcard") || name.includes("postcard");
      })
      .map((postcard) => (
        <div
          key={postcard._id}
          style={{
            backgroundColor: "#fff",
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow =
              "0 8px 25px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 20px rgba(0,0,0,0.08)";
          }}
        >
          {/* Image wrapper */}
          <div
            style={{
              width: "100%",
              aspectRatio: "4/3",
              overflow: "hidden",
              background: "#f3f4f6",
            }}
          >
            <img
              src={postcard.images[0] || "https://via.placeholder.com/300"}
              alt={postcard.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // modern look
                display: "block",
                transition: "transform 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </div>

          {/* Product details */}
          <div
            style={{
              padding: "18px",
              textAlign: "center",
            }}
          >
            <Link
              to={`/product/${postcard._id}`}
              style={{
                color: "#007bff",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "16px",
                display: "block",
                marginBottom: "8px",
              }}
            >
              {postcard.name}
            </Link>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 16px",
                  backgroundColor: "#eaf4ff",
                  color: "#007bff",
                  fontSize: "15px",
                  fontWeight: "700",
                  borderRadius: "30px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  minWidth: "60px",
                }}
              >
                ${postcard.price}
              </span>

              {/* Buy Now button */}
              <button
                style={{
                  padding: "10px 18px",
                  fontSize: "14px",
                  fontWeight: "600",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "background 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#007bff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#007bff")
                }
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      ))}
  </div>
</section>






<EnhancedHomeSections/>









<section
  style={{
    backgroundColor: "#f9fafb", // light grey for contrast
    padding: "70px 20px",
    textAlign: "center",
  }}
>
  <h2
    style={{
      fontSize: "32px",
      marginBottom: "12px",
      fontWeight: "700",
      color: "#111",
    }}
  >
    Personalized Gifts
  </h2>
  <p
    style={{
      fontSize: "17px",
      color: "#555",
      marginBottom: "50px",
      maxWidth: "700px",
      marginInline: "auto",
      lineHeight: "1.6",
    }}
  >
    Make every occasion special with personalized gifts designed to create
    lasting memories.
  </p>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "35px",
      maxWidth: "1200px",
      margin: "0 auto",
    }}
  >
    {products
      .filter((product) => {
        const category =
          typeof product.category === "string"
            ? product.category.toLowerCase()
            : "";
        const name =
          typeof product.name === "string"
            ? product.name.toLowerCase()
            : "";
        return category.includes("PhotoFrame") || name.includes("photo frame") || name.includes("mugs");
      })
      .map((gift) => (
        <div
          key={gift._id}
          style={{
            backgroundColor: "#fff",
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow =
              "0 8px 25px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 20px rgba(0,0,0,0.08)";
          }}
        >
          {/* Image wrapper */}
          <div
            style={{
              width: "100%",
              aspectRatio: "4/3",
              overflow: "hidden",
              background: "#f3f4f6",
            }}
          >
            <img
              src={gift.images[0] || "https://via.placeholder.com/300"}
              alt={gift.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </div>

          {/* Product details */}
          <div
            style={{
              padding: "18px",
              textAlign: "center",
            }}
          >
            <Link
              to={`/product/${gift._id}`}
              style={{
                color: "#007bff",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "16px",
                display: "block",
                marginBottom: "8px",
              }}
            >
              {gift.name}
            </Link>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 16px",
                  backgroundColor: "#eaf4ff",
                  color: "#007bff",
                  fontSize: "15px",
                  fontWeight: "700",
                  borderRadius: "30px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  minWidth: "60px",
                }}
              >
                ${gift.price}
              </span>

              {/* Buy Now button */}
 <button
  style={{
    padding: "10px 18px",
    fontSize: "14px",
    fontWeight: "600",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.3s ease, transform 0.2s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "#0056b3";
    e.currentTarget.style.transform = "translateY(-2px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = "#007bff";
    e.currentTarget.style.transform = "translateY(0)";
  }}
  onClick={() => handleBuyNow(gift._id)}
>
  Buy Now
</button>


            </div>
          </div>
        </div>
      ))}
  </div>
</section>


{/* 🔹 Flyers Section */}
<section
  style={{
    backgroundColor: "#f9fafb", // light grey for contrast
    padding: "70px 20px",
    textAlign: "center",
  }}
>
  <h2
    style={{
      fontSize: "32px",
      marginBottom: "12px",
      fontWeight: "700",
      color: "#111",
    }}
  >
    Our Flyers
  </h2>
  <p
    style={{
      fontSize: "17px",
      color: "#555",
      marginBottom: "50px",
      maxWidth: "700px",
      marginInline: "auto",
      lineHeight: "1.6",
    }}
  >
    Showcase your business with professional, eye-catching flyers designed to
    leave a lasting impression.
  </p>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "35px",
      maxWidth: "1200px",
      margin: "0 auto",
    }}
  >
    {products
      .filter((product) => {
        const category =
          typeof product.category === "string"
            ? product.category.toLowerCase()
            : "";
        const name =
          typeof product.name === "string"
            ? product.name.toLowerCase()
            : "";
        return category.includes("flyer") || name.includes("flyer");
      })
      .map((flyer) => (
        <div
          key={flyer._id}
          style={{
            backgroundColor: "#fff",
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow =
              "0 8px 25px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 20px rgba(0,0,0,0.08)";
          }}
        >
          {/* Image wrapper */}
          <div
            style={{
              width: "100%",
              aspectRatio: "4/3",
              overflow: "hidden",
              background: "#f3f4f6",
            }}
          >
            <img
              src={flyer.images[0] || "https://via.placeholder.com/300"}
              alt={flyer.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // cover = modern look
                display: "block",
                transition: "transform 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </div>

          {/* Product details */}
          <div
            style={{
              padding: "18px",
              textAlign: "center",
            }}
          >
            <Link
              to={`/product/${flyer._id}`}
              style={{
                color: "#007bff",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "16px",
                display: "block",
                marginBottom: "8px",
              }}
            >
              {flyer.name}
            </Link>
<div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  }}
>
  <span
    style={{
      display: "inline-block",
      padding: "6px 16px",
      backgroundColor: "#eaf4ff", // softer light-blue background
      color: "#007bff",           // brand blue
      fontSize: "15px",
      fontWeight: "700",
      borderRadius: "30px",       // round pill shape
      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      minWidth: "60px",
    }}
  >
    ${flyer.price}
  </span>

            {/* Buy Now button */}
            <button
              style={{
                padding: "10px 18px",
                fontSize: "14px",
                fontWeight: "600",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "background 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#007bff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#007bff")
              }
            >
              Buy Now
            </button>
            </div>
          </div>
        </div>
      ))}
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
