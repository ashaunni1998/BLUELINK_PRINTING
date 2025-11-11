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
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "70vh",
          background: "linear-gradient(180deg, #f9fbff 0%, #eef4ff 100%)",
        }}
      >
        {/* <div className="loading-spinner"></div> */}
        <p
          style={{
            marginTop: "18px",
            fontSize: "18px",
            color: "#007bff",
            fontWeight: "500",
            letterSpacing: "0.3px",
            // animation: "fadeIn 1.2s ease-in-out infinite alternate",
          }}
        >
          Loading products...
        </p>

        <style>
          {`
          .loading-spinner {
            width: 52px;
            height: 52px;
            border: 5px solid rgba(0, 123, 255, 0.2);
            border-top-color: #007bff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes fadeIn {
            from { opacity: 0.4; }
            to { opacity: 1; }
          }
          `}
        </style>
      </div>
    );

  if (error)
    return (
      <div
        style={{
          textAlign: "center",
          color: "red",
          padding: "60px",
          fontSize: "18px",
          background: "#fff5f5",
        }}
      >
        ⚠️ {error}
      </div>
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
  [position]: "90px",
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
           <div style={{ backgroundColor: "#e6f2ff", width: "100%", minHeight: "100vh" }}>


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
            width: "100%",
    margin: "0",
    padding: "0",
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
    .all-products-container {
      max-width: 1440px;
      margin: 0 auto;
      width: 100%;
      padding: 2.5rem;
      box-sizing: border-box;
    }

    @media (max-width: 1199px) {
      .all-products-container {
        padding: 1.5rem;
      }
    }

    @media (max-width: 767px) {
      .all-products-container {
        padding: 1rem;
      }
    }

    .page-title {
      font-size: 28px;
      font-weight: 700;
      margin: 24px 0;
      text-align: center;
      color: #222;
    }

    @media (max-width: 767px) {
      .page-title {
        font-size: 22px;
        margin: 16px 0;
      }
    }

    .all-products-responsive-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1.25rem;
      width: 100%;
      max-width: 75%;
      margin: 0 auto;
    }

    @media (max-width: 1279px) and (min-width: 1024px) {
      .all-products-responsive-grid {
        grid-template-columns: repeat(4, 1fr);
        max-width: 85%;
      }
    }

    @media (max-width: 1023px) and (min-width: 768px) {
      .all-products-responsive-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        max-width: 95%;
      }
    }

    @media (max-width: 767px) {
      .all-products-responsive-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
        max-width: 100%;
        padding: 0;
      }
    }

    .product-card-all-responsive {
      background-color: #fff;
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      width: 100%;
    }

    .product-card-all-responsive:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    }

    @media (max-width: 767px) {
      .product-card-all-responsive {
        display: flex;
        flex-direction: row;
        align-items: center;
        border-radius: 0.75rem;
      }
    }

    .product-image-wrapper-all {
      width: 100%;
      aspect-ratio: 4/3;
      overflow: hidden;
      display: block;
      cursor: pointer;
      background: #f9f9f9;
    }

    @media (max-width: 767px) {
      .product-image-wrapper-all {
        width: 140px;
        min-width: 140px;
        height: 140px;
        aspect-ratio: 1;
        flex-shrink: 0;
      }
    }

    .product-image-all {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }

    .product-info-all-responsive {
      padding: 1rem;
      border-top: 1px solid #eee;
      text-align: center;
    }

    @media (max-width: 767px) {
      .product-info-all-responsive {
        flex: 1;
        padding: 1rem;
        border-top: none;
        border-left: 1px solid #eee;
        text-align: left;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }

    .product-name-all-responsive {
      color: #007abf;
      text-decoration: none;
      font-weight: 600;
      font-size: 1rem;
      margin: 0 0 0.5rem 0;
      cursor: pointer;
      display: block;
      line-height: 1.4;
    }

    @media (max-width: 767px) {
      .product-name-all-responsive {
        font-size: 1.0625rem;
        margin: 0 0 0.625rem 0;
        line-height: 1.3;
      }
    }

    .product-price-all-responsive {
      font-size: 0.9375rem;
      color: #444;
      margin: 0;
      font-weight: 700;
    }

    @media (max-width: 767px) {
      .product-price-all-responsive {
        font-size: 1.125rem;
        color: #007abf;
      }
    }

    .no-products-message {
      text-align: center;
      color: #666;
      padding: 3rem 1rem;
      font-size: 1.125rem;
    }
  `}</style>

  <h2 className="page-title">
    {categoryName ? `All ${categoryName}` : "All Products"}
  </h2>

  {products.length === 0 ? (
    <p className="no-products-message">
      No products found for this category.
    </p>
  ) : (
    <div className="all-products-responsive-grid">
      {products.map((product, index) => {
        let gridColumn = "auto";
        if (!isMobile && products.length <= 4) {
          if (products.length === 1) {
            gridColumn = "2 / 5";
          } else if (products.length === 2) {
            gridColumn = index === 0 ? "2 / 3" : "4 / 5";
          } else if (products.length === 3) {
            gridColumn = index === 0 ? "2 / 3" : index === 1 ? "3 / 4" : "4 / 5";
          } else if (products.length === 4) {
            gridColumn = index === 0 ? "1 / 2" : index === 1 ? "2 / 3" : index === 2 ? "3 / 4" : "4 / 5";
          }
        }

        const getStartingPrice = () => {
          if (product.priceTiers && Array.isArray(product.priceTiers) && product.priceTiers.length > 0) {
            const sortedTiers = [...product.priceTiers].sort((a, b) => (a.qty || 0) - (b.qty || 0));
            const startingTier = sortedTiers[0];
            return startingTier.priceSingle || startingTier.priceDouble || startingTier.price || product.price;
          }
          return product.price || 0;
        };

        const displayPrice = getStartingPrice();

        return (
          <div 
            className="product-card-all-responsive" 
            key={product._id}
            style={{ gridColumn: gridColumn }}
          >
            <div
              className="product-image-wrapper-all"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <img
                src={product.images?.[0] || "https://via.placeholder.com/300"}
                alt={product.name}
                className="product-image-all"
              />
            </div>

            <div className="product-info-all-responsive">
              <h3 
                className="product-name-all-responsive"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {product.name}
              </h3>
              <p className="product-price-all-responsive">
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
    </div>
  );
}
