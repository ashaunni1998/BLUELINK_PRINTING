import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import API_BASE_URL from "../../config";
import BusinessCardOptions from "./BusinessCardOptions";

export default function AllProducts() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  const navigate = useNavigate();
  
  

  const homeSlides = [
    {
 image: "/assets/Business/banner1.jpg",
      // title: "High-Quality Printing",
      // description: "We provide premium printing services for all your business needs.",
    },
    {
      image:
      "/assets/Business/banner2.jpg",
      // title: "Custom Designs",
      // description: "Personalize your products with unique, professional designs.",
    },
    {
      image:
        "/assets/Business/banner3.jpg",
      //   title: "Wide Range of Products",
      // description: "From business cards to banners, explore our full catalog.",
    },
  ];
  // ✅ Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const slide = homeSlides[currentSlide];
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  
  // Auto slide every 7s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % homeSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [homeSlides.length]);

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + homeSlides.length) % homeSlides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % homeSlides.length);
  };

  
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/product/tobBarCategory`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        const categories = data.data;

        const matchedCategory = categories.find((cat) => cat._id === categoryId);

        if (matchedCategory && matchedCategory.products) {
          setProducts(matchedCategory.products);
          setCategoryName(matchedCategory.name);
        } else {
          setProducts([]);
          setCategoryName("");
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Something went wrong while fetching products.");
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) fetchProducts();
  }, [categoryId]);

  if (loading)
    return <p style={{ textAlign: "center", padding: "40px" }}>Loading products...</p>;
  if (error)
    return (
      <p style={{ textAlign: "center", color: "red", padding: "40px" }}>{error}</p>
    );

 

// useEffect(() => {
//   const fetchProducts = async () => {
//     try {
//       const res = await fetch(
//         `${API_BASE_URL}/product/tobBarCategory`,
//         {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//         }
//       );

//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

//       const data = await res.json();
//       const categories = data.data;

//       const matchedCategory = categories.find((cat) => cat._id === categoryId);

//       if (matchedCategory && matchedCategory.products) {
//         setProducts(matchedCategory.products);
//         setCategoryName(matchedCategory.name); // ✅ save category name
//       } else {
//         setProducts([]);
//         setCategoryName("");
//       }
//     } catch (err) {
//       console.error("Failed to fetch products:", err);
//       setError("Something went wrong while fetching products.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (categoryId) fetchProducts();
// }, [categoryId]);
//   if (loading) return <p style={{ textAlign: "center", padding: "40px" }}>Loading products...</p>;
//   if (error) return <p style={{ textAlign: "center", color: "red", padding: "40px" }}>{error}</p>;



// ✅ Move helper OUTSIDE the component return
const arrowButtonStyle = (position) => ({
  position: "absolute",
  top: "50%",
  [position]: "20px",
  transform: "translateY(-50%)",
  fontSize: "30px",
  color: "#fff",
  background: "rgba(0,0,0,0.4)",
  border: "none",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  cursor: "pointer",
});
  return (
     <div >
      <div className="responsive-container">
      <Header />
      
 {/* ✅ Slider Section */}
        <section
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: isMobile ? "200px" : "450px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "center" : "space-between",
            flexDirection: isMobile ? "column" : "row",
            transition: "background-image 1s ease-in-out",
          }}
        >
          {/* Arrows (hidden on mobile) */}
          {!isMobile && (
            <>
              <button
                onClick={goToPrev}
                style={arrowButtonStyle("left")}
                aria-label="Previous Slide"
              >
                &#10094;
              </button>
              <button
                onClick={goToNext}
                style={arrowButtonStyle("right")}
                aria-label="Next Slide"
              >
                &#10095;
              </button>
            </>
          )}

          {/* Slide Content */}
          <div
            style={{
              padding: "30px",
              color: "black",
              maxWidth: "400px",
              borderRadius: "10px",
              paddingLeft: "60px",
              textAlign: "left",
              backgroundColor: "rgba(255,255,255,0.6)",
            }}
          >
            <h2 style={{ fontSize: "32px", marginBottom: "15px" }}>{slide.title}</h2>
            <p style={{ fontSize: "16px", marginBottom: "25px" }}>{slide.description}</p>
            {/* <a href="/businesscards">
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                View Our Products
              </button>
            </a> */}
          </div>
        </section>

      <style>
        
        {`
          .all-products-container {
            padding: 30px;
            max-width: 1300px;
            margin: auto;
          }

          .page-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 24px;
            text-align: center;
            color: #222;
          }

          .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 28px;
          }

          .product-card {
            background: #fff;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 4px 16px rgba(0,0,0,0.08);
            transition: transform 0.25s ease, box-shadow 0.25s ease;
            display: flex;
            flex-direction: column;
          }

          .product-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 10px 24px rgba(0,0,0,0.18);
          }

          .product-image {
            width: 100%;
            height: 240px;
            object-fit: cover;
            background: #f9f9f9;
          }

          .product-info {
            padding: 18px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-grow: 1;
          }

          .product-name {
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 6px;
            color: #222;
          }

          .product-subtitle {
            font-size: 14px;
            color: #666;
            margin: 0 0 12px;
            min-height: 18px;
          }

          .product-price {
            font-size: 18px;
            font-weight: 700;
            color: #007bff;
            margin: 12px 0;
          }

          .product-actions {
            margin-top: auto;
          }

          .btn {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.25s ease, transform 0.1s ease;
          }

          .btn:active {
            transform: scale(0.97);
          }

          .btn-primary {
            background: #007bff;
            color: #fff;
          }
          .btn-primary:hover {
            background: #0056b3;
          }

          /* Responsive */
          @media (max-width: 768px) {
            .all-products-container {
              padding: 16px;
            }
            .page-title {
              font-size: 22px;
            }
            .product-image {
              height: 200px;
            }
          }

          @media (max-width: 480px) {
            .product-name {
              font-size: 16px;
            }
            .product-price {
              font-size: 16px;
            }
          }
        `}
      </style>

      <div className="all-products-container">
        <h2 className="page-title">
          {categoryName ? `All ${categoryName}` : "All Products"}
        </h2>
        {products.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>No products found for this category.</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div className="product-card" key={product._id}>
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-info">
                  <div>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-subtitle">{product.subtitle}</p>
                    <p className="product-price">₹{product.price}</p>
                  </div>
                  <div className="product-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <BusinessCardOptions/>
      </div>
      

      <Footer />
    </div>
    </div>
  );
}
