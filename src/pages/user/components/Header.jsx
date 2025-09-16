import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GoogleTranslateDropdown from "../GoogleTranslateDropdown.jsx";
import { AuthContext } from "../../../context/AuthContext.jsx";
import API_BASE_URL from "../../../config.js";
import Swal from "sweetalert2";
import { X } from "lucide-react";



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


  // const MobileMenuItem = ({ item }) => {
  //   const hasSubItems = item.subItems?.length > 0;
  //   if (!hasSubItems) {
  //     return (
  //       <Link key={item.name} to={item.link} style={styles.mobileNavItem} onClick={() => setMenuOpen(false)}>
  //         {item.name}
  //       </Link>
  //     );
  //   }

    

  //   return (
  //     <div key={item.name}>
  //       <div onClick={() => toggleSubMenu(item.name)} style={styles.mobileNavToggle}>
  //         <span>{item.name}</span>
  //         <i className={`fa-solid fa-angle-${expandedMenus[item.name] ? 'up' : 'down'}`}></i>
  //       </div>
  //       {expandedMenus[item.name] && (
  //         <div style={styles.mobileSubMenu}>
  //           {item.subItems.map((subItem, i) => (
  //             <div key={i}>
  //               {subItem.subItems ? (
  //                 <>
  //                   <div onClick={() => toggleSubMenu(`${item.name} > ${subItem.label}`)} style={styles.mobileSubToggle}>
  //                     <span>{subItem.label}</span>
  //                     <i className={`fa-solid fa-angle-${expandedMenus[`${item.name} > ${subItem.label}`] ? 'up' : 'down'}`}></i>
  //                   </div>
  //                   {expandedMenus[`${item.name} > ${subItem.label}`] && (
  //                     <div style={styles.mobileNestedMenu}>
  //                       {subItem.subItems.map((child, j) => (
  //                         <Link key={j} to={child.link} style={styles.mobileSubItem} onClick={() => setMenuOpen(false)}>
  //                           {child.label}
  //                         </Link>
  //                       ))}
  //                     </div>
  //                   )}
  //                 </>
  //               ) : (
  //                 <Link to={subItem.link} style={styles.mobileSubLink} onClick={() => setMenuOpen(false)}>
  //                   {subItem.label}
  //                 </Link>
  //               )}
  //             </div>
  //           ))}
  //         </div>
  //       )}
  //     </div>
  //   );
  // };


  // Dynamic Mobile Menu Item
const MobileMenuItem = ({ item }) => {
  const hasProducts = item.products?.length > 0;

  if (!hasProducts) {
    return (
      <Link
        key={item._id}
        to={`/category/${item._id}`}
        style={styles.mobileNavItem}
        onClick={() => setMenuOpen(false)}
      >
        {item.name}
      </Link>
    );
  }

  return (
    <div key={item._id}>
      {/* Toggle main category */}
      <div
        onClick={() => toggleSubMenu(item._id)}
        style={styles.mobileNavToggle}
      >
        <span>{item.name}</span>
        <i
          className={`fa-solid fa-angle-${
            expandedMenus[item._id] ? "up" : "down"
          }`}
        ></i>
      </div>

      {/* Products under category */}
      {expandedMenus[item._id] && (
        <div style={styles.mobileSubMenu}>
          {item.products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              style={styles.mobileSubLink}
              onClick={() => setMenuOpen(false)}
            >
              {product.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};


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
        <div style={styles.logoWrapper}>
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
                  // <div onClick={() => {}} style={styles.navButton}>{item.name}</div>
                )}
                
                {item.products?.length > 0 && hoveredMenu === item._id && (
                  <div style={styles.dropdown}>
                     <Link 
      to={`/allProducts/${item._id}`} 
      style={styles.dropdownItem}
      key={`all-${item._id}`}
    >
      All {item.name}
    </Link>
                    {item.products.map((product) => (
                    
                      <Link key={product._id} to={`/product/${product._id}`} style={styles.dropdownItem}>
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
      <>   <div 
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
    <div
      key={item._id}
      style={styles.mobileBox}
      onMouseEnter={() => setHoveredMenu(item._id)}
      onMouseLeave={() => setHoveredMenu(null)}
    >
      <div style={styles.mobileBoxHeader}>
        <Link to={`/allProducts/${item._id}`} style={styles.mobileBoxLink}>
          {item.name}
        </Link>
        {item.products?.length > 0 && (
          <i
            className={`fa-solid fa-angle-${hoveredMenu === item._id ? "up" : "down"}`}
            style={styles.mobileArrow}
          ></i>
        )}
      </div>

      {item.products?.length > 0 && hoveredMenu === item._id && (
        <div style={styles.mobileDropdown}>
          <Link
            to={`/allProducts/${item._id}`}
            style={styles.mobileDropdownItem}
            key={`all-${item._id}`}
          >
            All {item.name}
          </Link>
          {item.products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              style={styles.mobileDropdownItem}
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
                  <i className={`fa-solid fa-angle-${showAccountDropdown ? 'up' : 'down'}`}></i>
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
  mobileBox: {
  background: "#fff",
  borderRadius: "8px",
  padding: "10px 15px",
  margin: "6px 0",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  cursor: "pointer",
},
mobileBoxHeader: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
},
mobileBoxLink: {
  textDecoration: "none",
  color: "#000",
  fontWeight: "600",
},
mobileArrow: {
  marginLeft: "10px",
  fontSize: "14px",
},
mobileDropdown: {
  marginTop: "8px",
  marginLeft: "10px",
  display: "flex",
  flexDirection: "column",
},
mobileDropdownItem: {
  textDecoration: "none",
  color: "#333",
  padding: "6px 0",
  fontSize: "14px",
},
overlay: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)", // dim background
  zIndex: 998,
},


  logoWrapper: { display: "flex", alignItems: "center",marginLeft:"5px" },
  logo: { height: "50px", objectFit: "contain", width: "115px" },
  topRightRow: { display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", justifyContent: "flex-end", flex: 1 },
  topLink: { cursor: "pointer", color: "#333", fontSize: "14px", textDecoration: "none" },
  accountContainer: { position: "relative", display: "inline-block" },
  searchWrapper: { position: "relative", width: "160px" },
  searchInput: { width: "100%", padding: "8px 36px 8px 12px", border: "1px solid #ccc", borderRadius: "6px" },
  searchIcon: { position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", color: "#333", pointerEvents: "none" },
  searchDropdown: { position: "absolute", top: "42px", left: 0, right: 0, backgroundColor: "#fff", border: "1px solid #ccc", zIndex: 2000, maxHeight: "250px", overflowY: "auto",borderRadius:"6px", },
  searchItem: { padding: "10px", borderBottom: "1px solid #eee", cursor: "pointer", color: "#999" },
  hamburger: { fontSize: "24px", cursor: "pointer",marginRight:"5px" },
  navBar: { position: "relative", zIndex: 20 },
  navLinks: { display: "flex", gap: "25px", flexWrap: "nowrap", whiteSpace: "nowrap", position: "relative", zIndex: 1 },
  navItem: { position: "relative" },
  navLink: { fontSize: "14px", color: "#111", fontWeight: "500", textDecoration: "none" },
  navButton: { fontWeight: "600", fontSize: "16px", color: "#222", borderRadius: "4px", cursor: "pointer", padding: "8px 12px" },
  dropdown: { position: "absolute", top: "100%", left: "0", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "4px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 1000, minWidth: "200px", padding: "8px 0" },
  dropdownItem: { display: "block", padding: "8px 16px", textDecoration: "none", color: "#333", whiteSpace: "nowrap", borderBottom: "1px solid #f0f0f0", transition: "background-color 0.2s ease" },
  accountDropdown: { position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", backgroundColor: "#fff", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "stretch", minWidth: "180px", padding: "10px 0", zIndex: 1000 },
  accountLink: { padding: "10px 15px", textDecoration: "none", color: "#0073e6", fontSize: "14px", fontWeight: "500", transition: "background-color 0.2s ease" },
  divider: { borderTop: "1px solid #eee", marginTop: "8px" },
  logoutBtn: { margin: "10px auto 0 auto", padding: "8px 16px", backgroundColor: "#0073e6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "500" },
  mobileMenu: { position: "fixed", top: 0, right: 0, bottom: 0, maxHeight: "100vh", width: "80%", backgroundColor: "#fff", zIndex: 999, boxShadow: "-2px 0 8px rgba(0,0,0,0.2)", overflowY: "scroll", display: "flex", flexDirection: "column" },
  mobileHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid #eee", backgroundColor: "#fff", position: "relative" ,zIndex:1000},
  mobileSearchWrapper: { position: "relative", flex: 1, marginRight: "10px" },
  mobileSearchInput: { width: "100%", padding: "8px 36px 8px 12px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "4px" },
  mobileSearchIcon: { position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", color: "#888" },
  closeIcon: { fontSize: "22px", cursor: "pointer", color: "#333",marginLeft:"12px" },
  mobileContent: { flex: 1, overflowY: "auto", padding: "20px" },
  mobileNavItem: { fontWeight: "bold", display: "block", padding: "12px", marginBottom: "10px", backgroundColor: "#f9f9f9", borderRadius: "8px", textDecoration: "none", color: "#111" },
  mobileNavToggle: { padding: "12px 16px", fontSize: "16px", fontWeight: "500", backgroundColor: "#f8f9fa", borderRadius: "8px", marginBottom: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.08)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" },
  mobileSubMenu: { paddingLeft: "16px" },
  mobileSubToggle: { padding: "6px 10px", fontSize: "14px", borderBottom: "1px solid #eee", textDecoration: "none", color: "black", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "bold", cursor: "pointer" },
  mobileSubLink: { fontWeight: "bold", display: "block", padding: "10px 12px", textDecoration: "none", color: "#000" },
  mobileNestedMenu: { paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" },
  mobileSubItem: { padding: "6px 10px", fontSize: "14px", borderBottom: "1px solid #eee", textDecoration: "none", color: "black" },
  mobileFooter: { backgroundColor: "#374151", color: "white", padding: "10px 15px", borderTop: "1px solid #555" },
  mobileAccountSection: { marginBottom: "10px" },
  mobileAccountToggle: { display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "bold", padding: "12px", backgroundColor: "#4B5563", borderRadius: "6px", cursor: "pointer" },
  mobileAccountDropdown: { marginTop: "10px", backgroundColor: "#1F2937", borderRadius: "6px", padding: "10px" },
  mobileAccountLink: { padding: "8px 0", fontSize: "14px", cursor: "pointer", textDecoration: "none", display: "block", color: "white" },
  mobileLogoutBtn: { background: "none", border: "none", cursor: "pointer", color: "inherit", textAlign: "left", padding: "8px 0", width: "100%" },
  mobileSignIn: { marginBottom: "10px", padding: "12px" },
  mobileSignInLink: { color: "#fff", textDecoration: "none", fontWeight: "bold" },
  mobileCart: { padding: "12px", backgroundColor: "#007bff", textAlign: "center", borderRadius: "6px", fontWeight: "bold", color: "white" },
  mobileCartLink: { color: "white", textDecoration: "none" },
  offerBar: { backgroundColor: "#007BFF", color: "#fff", textAlign: "center", padding: "10px 20px", fontSize: "14px", fontWeight: "500", lineHeight: "1.4", wordWrap: "break-word" },
  responsive: `
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