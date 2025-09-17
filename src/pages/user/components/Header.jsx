import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GoogleTranslateDropdown from "../GoogleTranslateDropdown.jsx";
import { AuthContext } from "../../../context/AuthContext.jsx";
import API_BASE_URL from "../../../config.js";
import Swal from "sweetalert2";
import { X, ChevronDown, ChevronUp } from "lucide-react";

export default function Header() {
  const [menuItems, setMenuItems] = useState([{ name: "Help & Faq" }, { name: "The Blog" }]);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { t } = useTranslation();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const accountTimeoutRef = useRef(null);
 // Add this hook near top of component
const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 1024);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  // Fetch menu data
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const res = await fetch("https://kerala-digital-park-server.vercel.app/api/product/tobBarCategory", {
          method: "GET", headers: { "Content-Type": "application/json" }, credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        const formatted = data.data
        console.log(formatted);
        setMenuItems((prev) => [...formatted, ...prev]);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };
    fetchMenuData();
  }, []);

  // Search functionality
  useEffect(() => {
  if (!searchQuery.trim()) {
    setSearchResults([]);
    return;
  }

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/product/searchProduct?search=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      console.log("Search API response:", data); // 👀 check shape
      // Adjust this based on API response
      if (data.products) {
        setSearchResults(data.products);
      } else if (data.data) {
        setSearchResults(data.data);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const delayDebounce = setTimeout(fetchResults, 400);
  return () => clearTimeout(delayDebounce);
}, [searchQuery]);

  // Mobile scroll lock
  useEffect(() => {
    document.body.style.overflow = (isMobile && menuOpen) ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [menuOpen, isMobile]);

  const toggleSubMenu = (key) => {
    setExpandedMenus((prev) => {
      const newExpanded = { ...prev };
      const isExpanding = !prev[key];
      if (!isExpanding) {
        Object.keys(newExpanded).forEach(k => {
          if (k.startsWith(`${key} >`) || k === key) delete newExpanded[k];
        });
      } else {
        newExpanded[key] = true;
      }
      return newExpanded;
    });
  };

  const handleAccountMouseEnter = () => {
    clearTimeout(accountTimeoutRef.current);
    setAccountDropdown(true);
  };

  const handleAccountMouseLeave = () => {
    accountTimeoutRef.current = setTimeout(() => setAccountDropdown(false), 200);
  };

 const handleLogout = () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out of your account.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Logout",
    cancelButtonText: "Cancel",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await fetch("https://kerala-digital-park-server.vercel.app/api/user/logout", {
          method: "POST", credentials: "include",
        });
      } catch (err) {
        console.error("Logout error:", err);
      }
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);

      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been logged out successfully.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/sign-in");
      });
    }
  });
};

  // Inside Header component, before return()
const SearchDropdown = ({ results, onSelect, isMobile = false }) => (
  searchQuery && (
    <div style={isMobile ? styles.mobileSearchDropdown : styles.searchDropdown}>
      {loading ? (
        <div style={styles.searchItem}>Searching...</div>
      ) : results.length ? (
        results.map((item) => (
          <div
            key={item._id || item.name }
            style={styles.searchItem}
            onClick={() => onSelect(item)}
          >
            {item.name}
          </div>
        ))
      ) : (
        <div style={styles.searchItem}>No results found</div>
      )}
    </div>
  )
);

const AccountDropdown = () => (
  accountDropdown && (
    <div style={styles.accountDropdown}>
      <Link to="/account?tab=overview" style={styles.accountLink}>
        Overview
      </Link>
      <div style={styles.divider} />
      <button onClick={handleLogout} style={styles.logoutBtn}>
        Logout
      </button>
    </div>
  )
);




// Cart click handler
const handleCartClick = (e) => {
  if (!isLoggedIn) {
    e.preventDefault();
    Swal.fire({
      title: "Login Required",
      text: "You need to sign in to access the cart. Do you want to login now?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Login",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/sign-in");
      }
    });
  }
};

  return (
    <header style={styles.header}>
      {/* Top Section */}
      <div style={styles.topBar}>
       <div
  style={{
    ...styles.logoWrapper,
    marginLeft: isMobile ? "5px" : "80px",
  }}
>
          <a href="/">
            <img src="/assets/logo/logo2.jpg" alt="Logo" style={styles.logo} />
          </a>
        </div>

        {!isMobile && (
          <div style={styles.topRightRow}>
            <GoogleTranslateDropdown />
            
            {isLoggedIn ? (
              <div style={styles.accountContainer} onMouseEnter={handleAccountMouseEnter} onMouseLeave={handleAccountMouseLeave}>
                <span style={styles.topLink}>{t("account") || "Account"}</span>
                <AccountDropdown />
              </div>
            ) : (
              <Link to="/sign-in" style={styles.topLink}>
                {t("sign_in") || "Sign In"}
              </Link>
            )}

         <Link to="/cart" style={styles.topLink} onClick={handleCartClick}>
  <i className="fa-solid fa-cart-shopping" style={{ marginRight: "5px" }}></i>
  {t("cart") || "Cart"}
</Link>

            <div style={styles.searchWrapper}>
              <input
                type="text"
                placeholder={t("search") || "Search"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
              <span style={styles.searchIcon}>🔍</span>
              <SearchDropdown 
                results={searchResults} 
                onSelect={(item) => {
                  setSearchQuery(item.name);
                  navigate(`/product/${item._id}`);
                  setSearchResults([]);
                }}
              />
            </div>
          </div>
        )}

        {isMobile && (
          <div onClick={() => setMenuOpen(!menuOpen)} style={styles.hamburger}>☰</div>
        )}
      </div>

      {/* Desktop Navigation */}
      {!isMobile && (
        <nav style={styles.navBar}>
          <div style={styles.navLinks}>
            {menuItems.map((item) => (
              <div key={item._id} style={styles.navItem} onMouseEnter={() => setHoveredMenu(item._id)} onMouseLeave={() => setHoveredMenu(null)}>
                {item.products?.length > 0 ? (
                  <Link to ={ `/allProducts/${item._id}`}style={styles.navLink}>{item.name}</Link>
                ) : (
                    <Link to={`/allProducts/${item._id}`} style={styles.navLink}>{item.name}</Link>
                )}
                
                {item.products?.length > 0 && hoveredMenu === item._id && (
                  <div style={styles.dropdown}>
                     <Link 
      to={`/allProducts/${item._id}`} 
      style={styles.dropdownItemFirst}
      key={`all-${item._id}`}
    >
      All {item.name}
    </Link>
                    {item.products.map((product, index) => (
                      <Link 
                        key={product._id} 
                        to={`/product/${product._id}`} 
                        style={{
                          ...styles.dropdownItem,
                          borderBottom: index === item.products.length - 1 ? 'none' : '1px solid #f1f3f4'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#f7fafc';
                          e.target.style.color = '#2b6cb0';
                          e.target.style.paddingLeft = '24px';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#4a5568';
                          e.target.style.paddingLeft = '20px';
                        }}
                      >
                        {product.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      )}

      {/* Mobile Menu */}
      {isMobile && menuOpen && (
      <>   
        <div 
          style={styles.overlay} 
          onClick={() => setMenuOpen(false)} 
        />
        <div style={styles.mobileMenu}>
          <div style={styles.mobileHeader}>
            <div style={styles.mobileSearchWrapper}>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.mobileSearchInput}
              />
              <span style={styles.mobileSearchIcon}>🔍</span>
              <SearchDropdown 
                results={searchResults} 
                onSelect={(item) => {
                  setSearchQuery(item.name);
                  navigate(`/product/${item._id}`);
                  setSearchResults([]);
                  setMenuOpen(false);
                }}
                isMobile={true}
              />
            </div>
           <X onClick={() => setMenuOpen(false)} size={26} style={styles.closeIcon} />
          </div>

          <div style={styles.mobileContent}>
            {menuItems.map((item) => (
              <div key={item._id} style={styles.mobileMenuItem}>
                <div 
                  style={styles.mobileMenuHeader}
                  onClick={() => item.products?.length > 0 ? toggleSubMenu(item._id) : null}
                >
                  <Link 
                    to={`/allProducts/${item._id}`} 
                    style={styles.mobileMenuLink}
                    onClick={(e) => {
                      if (item.products?.length > 0) {
                        e.preventDefault();
                      } else {
                        setMenuOpen(false);
                      }
                    }}
                  >
                    {item.name}
                  </Link>
                  {item.products?.length > 0 && (
                    <div style={styles.arrowContainer}>
                      {expandedMenus[item._id] ? (
                        <ChevronUp size={18} color="#666" />
                      ) : (
                        <ChevronDown size={18} color="#666" />
                      )}
                    </div>
                  )}
                </div>

                {/* Dropdown content */}
                {item.products?.length > 0 && expandedMenus[item._id] && (
                  <div style={styles.mobileDropdownContent}>
                    <Link
                      to={`/allProducts/${item._id}`}
                      style={styles.mobileDropdownLink}
                      onClick={() => setMenuOpen(false)}
                    >
                      All {item.name}
                    </Link>
                    {item.products.map((product) => (
                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        style={styles.mobileDropdownLink}
                        onClick={() => setMenuOpen(false)}
                      >
                        {product.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Footer */}
          <div style={styles.mobileFooter}>
            {isLoggedIn ? (
              <div style={styles.mobileAccountSection}>
                <div onClick={() => setShowAccountDropdown(!showAccountDropdown)} style={styles.mobileAccountToggle}>
                  Account
                  {showAccountDropdown ? (
                    <ChevronUp size={18} color="#fff" />
                  ) : (
                    <ChevronDown size={18} color="#fff" />
                  )}
                </div>
                {showAccountDropdown && (
                  <div style={styles.mobileAccountDropdown}>
                    {["Overview", "Order History", "Address Details"].map((label, i) => (
                      <Link key={i} to={`/account?tab=${["overview", "orders", "address"][i]}`} style={styles.mobileAccountLink}>
                        {label}
                      </Link>
                    ))}
                    <button onClick={handleLogout} style={styles.mobileLogoutBtn}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.mobileSignIn}>
                <Link to="/sign-in" style={styles.mobileSignInLink}>Sign In</Link>
              </div>
            )}
           <div style={styles.mobileCart}>
              <Link to="/cart" style={styles.mobileCartLink} onClick={handleCartClick}>
                <i className="fas fa-shopping-cart" style={{ marginRight: "8px" }}></i>
                Cart
              </Link>
            </div>
          </div>
        </div>
      </>
      )}

      {/* Offer Bar */}
      <div style={styles.offerBar}>
        🎉 New members get <strong>$5</strong> off their first order! <a href="/sign-in" style={{ color: "white" }}>Sign up now.</a>
      </div>

      <style>{styles.responsive}</style>
    </header>
  );
}

const styles = {
  header: {
    fontFamily: "'Segoe UI', sans-serif",
    borderBottom: "1px solid #eee",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    backgroundColor: "white",
    width: "100%",
    position: "sticky",
    top: "0",
    zIndex: "100",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px 0px",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 998,
  },
  logoWrapper: { display: "flex", alignItems: "center", marginLeft: "50px" },
  
  logo: { height: "50px", objectFit: "contain", width: "115px" },
  topRightRow: { display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", justifyContent: "flex-end", flex: 1 },
  topLink: { cursor: "pointer", color: "#333", fontSize: "14px", textDecoration: "none" },
  accountContainer: { position: "relative", display: "inline-block" },
  searchWrapper: { position: "relative", width: "160px" },
  searchInput: { width: "100%", padding: "8px 36px 8px 12px", border: "1px solid #ccc", borderRadius: "6px" },
  searchIcon: { position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", color: "#333", pointerEvents: "none" },
  searchDropdown: { position: "absolute", top: "42px", left: 0, right: 0, backgroundColor: "#fff", border: "1px solid #ccc", zIndex: 2000, maxHeight: "250px", overflowY: "auto", borderRadius: "6px" },
  searchItem: { padding: "10px", borderBottom: "1px solid #eee", cursor: "pointer", color: "#999" },
  hamburger: { fontSize: "24px", cursor: "pointer", marginRight: "5px" },
  navBar: { position: "relative", zIndex: 20 },
  navLinks: { display: "flex", gap: "25px", flexWrap: "nowrap", whiteSpace: "nowrap", position: "relative", zIndex: 1 ,marginLeft:"80px"},
  navItem: { position: "relative" },
  navLink: { fontSize: "14px", color: "#111", fontWeight: "500", textDecoration: "none" },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: "0",
    backgroundColor: "#fff",
    border: "1px solid #e0e6ed",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    zIndex: 1000,
    minWidth: "240px",
    padding: "0",
    opacity: 0,
    transform: "translateY(10px)",
    animation: "fadeInUp 0.3s forwards",
    overflow: "hidden",
  },
  dropdownItem: {
    display: "block",
    padding: "12px 20px",
    textDecoration: "none",
    color: "#4a5568",
    fontSize: "15px",
    fontWeight: "400",
    borderBottom: "1px solid #f1f3f4",
    transition: "all 0.2s ease",
    position: "relative",
  },
  dropdownItemFirst: {
    display: "block",
    padding: "12px 20px",
    textDecoration: "none",
    color: "#2d3748",
    fontSize: "15px",
    fontWeight: "600",
    borderBottom: "2px solid #e2e8f0",
    transition: "all 0.2s ease",
    backgroundColor: "#f8f9fa",
  },
  accountDropdown: { position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", backgroundColor: "#fff", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "stretch", minWidth: "180px", padding: "10px 0", zIndex: 1000 },
  accountLink: { padding: "10px 15px", textDecoration: "none", color: "#0073e6", fontSize: "14px", fontWeight: "500", transition: "background-color 0.2s ease" },
  divider: { borderTop: "1px solid #eee", marginTop: "8px" },
  logoutBtn: { margin: "10px auto 0 auto", padding: "8px 16px", backgroundColor: "#0073e6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "500" },
  
  // Mobile Menu Styles
  mobileMenu: { 
    position: "fixed", 
    top: 0, 
    right: 0, 
    bottom: 0, 
    maxHeight: "100vh", 
    width: "85%", 
    backgroundColor: "#f8f9fa", 
    zIndex: 999, 
    boxShadow: "-2px 0 8px rgba(0,0,0,0.2)", 
    overflowY: "auto", 
    display: "flex", 
    flexDirection: "column" 
  },
  mobileHeader: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: "15px 20px", 
    borderBottom: "1px solid #dee2e6", 
    backgroundColor: "#fff", 
    position: "sticky",
    top: 0,
    zIndex: 1000
  },
  mobileSearchWrapper: { position: "relative", flex: 1, marginRight: "15px" },
  mobileSearchInput: { width: "100%", padding: "10px 40px 10px 15px", fontSize: "16px", border: "1px solid #ced4da", borderRadius: "8px", backgroundColor: "#fff" },
  mobileSearchIcon: { position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", color: "#6c757d" },
  mobileSearchDropdown: {
    position: "absolute",
    top: "48px",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    border: "1px solid #ced4da",
    borderRadius: "8px",
    zIndex: 2000,
    maxHeight: "200px",
    overflowY: "auto",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
  },
  closeIcon: { fontSize: "22px", cursor: "pointer", color: "#6c757d", marginLeft: "12px" },
  mobileContent: { 
    flex: 1, 
    overflowY: "auto", 
    padding: "0" 
  },
  
  // Updated Mobile Menu Item Styles
  mobileMenuItem: {
    borderBottom: "1px solid #e9ecef",
    backgroundColor: "#fff",
  },
  mobileMenuHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  mobileMenuLink: {
    textDecoration: "none",
    color: "#212529",
    fontSize: "16px",
    fontWeight: "500",
    flex: 1,
    display: "block",
  },
  arrowContainer: {
    marginLeft: "12px",
    display: "flex",
    alignItems: "center",
    padding: "2px",
  },
  mobileDropdownContent: {
    backgroundColor: "#f8f9fa",
    borderTop: "1px solid #e9ecef",
    paddingLeft: "20px",
  },
  mobileDropdownLink: {
    display: "block",
    padding: "12px 20px",
    textDecoration: "none",
    color: "#495057",
    fontSize: "15px",
    borderBottom: "1px solid #e9ecef",
    transition: "background-color 0.2s ease",
  },
  
  mobileFooter: { 
    backgroundColor: "#343a40", 
    color: "white", 
    padding: "20px", 
    borderTop: "1px solid #495057",
    marginTop: "auto"
  },
  mobileAccountSection: { marginBottom: "15px" },
  mobileAccountToggle: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    fontWeight: "600", 
    fontSize: "16px",
    padding: "15px 20px", 
    backgroundColor: "#495057", 
    borderRadius: "8px", 
    cursor: "pointer",
    transition: "background-color 0.2s ease"
  },
  mobileAccountDropdown: { 
    marginTop: "10px", 
    backgroundColor: "#212529", 
    borderRadius: "8px", 
    padding: "10px 0",
    overflow: "hidden"
  },
  mobileAccountLink: { 
    padding: "12px 20px", 
    fontSize: "15px", 
    cursor: "pointer", 
    textDecoration: "none", 
    display: "block", 
    color: "#f8f9fa",
    transition: "background-color 0.2s ease"
  },
  mobileLogoutBtn: { 
    background: "none", 
    border: "none", 
    cursor: "pointer", 
    color: "#f8f9fa", 
    textAlign: "left", 
    padding: "12px 20px", 
    width: "100%",
    fontSize: "15px",
    transition: "background-color 0.2s ease"
  },
  mobileSignIn: { 
    marginBottom: "15px", 
    padding: "15px 20px",
    backgroundColor: "#495057",
    borderRadius: "8px",
    textAlign: "center"
  },
  mobileSignInLink: { 
    color: "#fff", 
    textDecoration: "none", 
    fontWeight: "600",
    fontSize: "16px"
  },
  mobileCart: { 
    padding: "15px 20px", 
    backgroundColor: "#007bff", 
    textAlign: "center", 
    borderRadius: "8px", 
    fontWeight: "600"
  },
  mobileCartLink: { 
    color: "white", 
    textDecoration: "none",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  offerBar: { 
    backgroundColor: "#007BFF", 
    color: "#fff", 
    textAlign: "center", 
    padding: "10px 20px", 
    fontSize: "14px", 
    fontWeight: "500", 
    lineHeight: "1.4", 
    wordWrap: "break-word" 
  },
  responsive: `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (min-width: 768px) {
      .top-bar { flex-direction: row !important; justify-content: space-between !important; padding: 10px 30px; align-items: center; }
    }
    @media (max-width: 768px) {
      .top-bar { padding: 10px 16px !important; }
      .search-wrapper { width: 100% !important; }
      .search-wrapper input { width: 100% !important; }
    }
  `
};