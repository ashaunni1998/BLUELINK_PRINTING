import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { API_BASE_URL } from "../../config";
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

  const categoryBanners = {
    "68d0c2c624e909081c989aad": "/assets/Business/banner1.jpg",   // replace with real _id
    "68a3fbfb8bb89752830da2f3": "/assets/flyers/banners.jpeg",             // replace with real _id
    "'68ca591e1b8685254da74b3e": "/assets/flex/default-banner.jpg",           // replace with real _id
    "68a3fc068bb89752830da2f6": "/assets/Stationery/banner-stickers.jpg",         // replace with real _id
    "68a3fc498bb89752830da2ff": "/assets/badges/banner.jpg",     // replace with real _id
    "68a3fc3a8bb89752830da2fc": "/assets/tshirt/banner.jpg",    // replace with real _id
    "68a3fc278bb89752830da2f9": "/assets/gifts/banner.jpg", // replace with real _id
  };
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

  
 // SOLUTION 1: Update the useEffect to fetch full product details
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
      console.log("Available Categories:", categories);
      const matchedCategory = categories.find((cat) => cat._id === categoryId);

      if (matchedCategory && matchedCategory.products) {
        // ✅ Fetch full details for each product to get priceTiers
        const productsWithDetails = await Promise.all(
          matchedCategory.products.map(async (product) => {
            try {
              const detailRes = await fetch(
                `${API_BASE_URL}/product/productDetails/${product._id}`,
                {
                  headers: { 
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json' 
                  }
                }
              );
              
              if (detailRes.ok) {
                const detailData = await detailRes.json();
                return detailData.data || detailData;
              }
              
              // If detail fetch fails, return original product
              return product;
            } catch (err) {
              console.error(`Failed to fetch details for ${product._id}:`, err);
              return product;
            }
          })
        );
        
        setProducts(productsWithDetails);
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
            {/* ✅ Fixed Banner Section */}
        <section
          style={{
            backgroundImage: `url(${categoryBanners[categoryId] || "/assets/flex/default-banner.jpg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: isMobile ? "200px" : "450px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-image 0.5s ease-in-out",
            maxWidth: isMobile ? "100%" : "88%",
    margin: "0 auto",
    width: isMobile ? "100%" : "calc(100% - 2rem)",
          }}
        >
          {/* <div
            style={{
              padding: "30px",
              color: "black",
              maxWidth: "400px",
              borderRadius: "10px",
              textAlign: "center",
              backgroundColor: "rgba(255,255,255,0.6)",
            }}
          >
            <h2 style={{ fontSize: "32px", marginBottom: "15px" }}>
              {categoryName}
            </h2>
            <p style={{ fontSize: "16px" }}>
              Explore our {categoryName} collection
            </p>
          </div> */}
        </section>
  

        <style>
          {`
          .all-products-container {
            padding: 30px;
            max-width: 88%;
             margin-left: 6%;
  margin-right: 6%;
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



@media (min-width: 768px) {
  .all-products-responsive-grid[data-count="1"] .product-card-all-responsive,
  .all-products-responsive-grid[data-count="2"] .product-card-all-responsive,
  .all-products-responsive-grid[data-count="3"] .product-card-all-responsive {
    max-width: 250px;
    margin: 0 auto;
  }
  
  .all-products-responsive-grid[data-count="1"],
  .all-products-responsive-grid[data-count="2"],
  .all-products-responsive-grid[data-count="3"] {
    justify-items: center;
  }
}
        `}
        </style>
       
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
          

 <div className="all-products-container">
  <style>{`
    /* Only add mobile responsive styles - Desktop stays exactly as inline styles */
    
    @media (max-width: 767px) {
      .all-products-container .page-title {
        font-size: 1.5rem !important;
        padding: 0 1rem;
      }
    }

    /* Tablet and below - 4 columns */
    @media (max-width: 1279px) and (min-width: 1024px) {
      .all-products-responsive-grid {
        grid-template-columns: repeat(4, 1fr) !important;
      }
    }

    /* Small tablet - 3 columns */
    @media (max-width: 1023px) and (min-width: 768px) {
      .all-products-responsive-grid {
        max-width: 100% !important;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 1rem !important;
        padding: 0 1rem !important;
      }
    }

    /* Mobile landscape - 2 columns */
    @media (max-width: 767px) and (min-width: 480px) {
      .all-products-responsive-grid {
        max-width: 100% !important;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 0.875rem !important;
        padding: 0 0.75rem !important;
      }
    }

    /* Mobile portrait - 2 columns */
    @media (max-width: 479px) {
      .all-products-responsive-grid {
        max-width: 100% !important;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 0.75rem !important;
        padding: 0 0.5rem !important;
      }
    }

    .product-card-all-responsive:hover {
      transform: translateY(-4px);
      box-shadow: 0 0.25rem 0.75rem rgba(0,0,0,0.12);
    }

    @media (max-width: 767px) {
      .product-info-all-responsive {
        padding: 0.75rem 0.5rem !important;
      }
      
      .product-name-all-responsive {
        font-size: 0.875rem !important;
      }
      
      .product-price-all-responsive {
        font-size: 0.8125rem !important;
      }
    }

    @media (max-width: 767px) {
      .no-products-message {
        padding: 2rem 1rem !important;
      }
    }
  `}</style>

  <h2 className="page-title">
    {categoryName ? `All ${categoryName}` : "All Products"}
  </h2>
{products.length === 0 ? (
  <p className="no-products-message" style={{ textAlign: "center", color: "#666" }}>
    No products found for this category.
  </p>
) : (
  <div 
    className="all-products-responsive-grid"
    data-count={products.length <= 3 ? products.length : "more"}
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: "1.25rem",
      maxWidth: "75%",
      margin: "0 auto",
      padding: "0 1rem",
    }}
  >
{products.map((product, index) => {
  // Calculate grid-column for centering on desktop only
  let gridColumn = "auto";
  if (!isMobile && products.length <= 4) {
    if (products.length === 1) {
      gridColumn = "2 / 5"; // Center single product
    } else if (products.length === 2) {
      gridColumn = index === 0 ? "2 / 3" : "4 / 5"; // Two products with gap
    } else if (products.length === 3) {
      // Three products centered
      gridColumn = index === 0 ? "2 / 3" : index === 1 ? "3 / 4" : "4 / 5";
    } else if (products.length === 4) {
      // Four products centered - columns 1,2,3,4 (skipping column 5)
      gridColumn = index === 0 ? "1 / 2" : index === 1 ? "2 / 3" : index === 2 ? "3 / 4" : "4 / 5";
    }
  }

// ✅ Get starting quantity price (now with priceTiers available)
  const getStartingPrice = () => {
    // Check if product has priceTiers array
    if (product.priceTiers && Array.isArray(product.priceTiers) && product.priceTiers.length > 0) {
      // Sort by quantity to get the lowest tier
      const sortedTiers = [...product.priceTiers].sort((a, b) => (a.qty || 0) - (b.qty || 0));
      const startingTier = sortedTiers[0];
      
      // Return priceSingle (default for single-sided design)
      return startingTier.priceSingle || startingTier.priceDouble || startingTier.price || product.price;
    }
    
    // Fallback to product.price if no priceTiers
    return product.price || 0;
  };

  const displayPrice = getStartingPrice();

  return (
    <div 
      className="product-card-all-responsive" 
      key={product._id}
      style={{
        backgroundColor: "#fff",
        borderRadius: "0.375rem",
        overflow: "hidden",
        boxShadow: "0 0.0625rem 0.375rem rgba(0,0,0,0.07)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        width: "100%",
        gridColumn: gridColumn,
      }}
    >
      <div
        className="product-image-wrapper-all"
        style={{
          width: "100%",
          aspectRatio: "4/3",
          overflow: "hidden",
          display: "block",
          cursor: "pointer",
        }}
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <img
          src={product.images?.[0] || "https://via.placeholder.com/300"}
          alt={product.name}
          className="product-image-all"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            backgroundColor: "#f9f9f9",
          }}
        />
      </div>

      <div 
        className="product-info-all-responsive"
        style={{
          padding: "0.875rem",
          borderTop: "1px solid #eee",
          textAlign: "center",
        }}
      >
        <h3 
          className="product-name-all-responsive"
          onClick={() => navigate(`/product/${product._id}`)}
          style={{
            color: "#007abf",
            textDecoration: "none",
            fontWeight: "500",
            fontSize: "0.9375rem",
            marginBottom: "0.375rem",
            cursor: "pointer",
            margin: "0 0 0.375rem 0",
          }}
        >
          {product.name}
        </h3>
        <p 
          className="product-price-all-responsive"
          style={{
            fontSize: "0.875rem",
            color: "#444",
            margin: 0,
          }}
        >
        ${displayPrice}
        </p>
      </div>
    </div>
  );
})}
  </div>
)}
</div>

      <Footer />
    </div>
    </div>
  );
}
