// src/components/common/Header.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GoogleTranslateDropdown from "../GoogleTranslateDropdown.jsx";
import { AuthContext } from "../../../context/AuthContext.jsx";
import { API_BASE_URL } from "../../../config.js";
import Swal from "sweetalert2";
import { X, ChevronDown, ChevronUp, Menu } from "lucide-react";

/**
 * Header component
 * - Loads menu from API and caches in localStorage
 * - Ensures Help & Faq and The Blog are appended last
 * - Desktop dropdown remains open when hovering link OR dropdown (uses hoverTimeoutRef)
 */

export default function Header() {
  const { t } = useTranslation();
  const { isLoggedIn,  authLoading,logout} = useContext(AuthContext);
  // const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- menu cache keys and static endings ---
  const STATIC_END_ITEMS = [
    { _id: "__help_faq__", name: "Help & Faq", path: "/help-faq", products: [] },
    { _id: "__the_blog__", name: "The Blog", path: "/blog", products: [] },
  ];
  
  // UI state
  const [menuItems, setMenuItems] = useState([]);
  const [hoveredMenuKey, setHoveredMenuKey] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [authLoading, setAuthLoading] = useState(false);

  const accountTimeoutRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const isWindow = typeof window !== "undefined";
  const [isMobile, setIsMobile] = useState(isWindow ? window.innerWidth < 1024 : false);



// --- Addresses (fetch only when user is logged in) ---
  const [addresses, setAddresses] = useState([]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/address/addresses`, {
        method: "GET",
        credentials: "include", // uses httpOnly cookie if backend sets it
        headers: {
          "Content-Type": "application/json",
        },
      });

      // If backend returns 401 for anonymous users, silently ignore
      if (res.status === 401) {
        // ensure we clear stored addresses so accountLinks is correct
        setAddresses([]);
        return;
      }

      if (!res.ok) {
        // don't show a modal to anonymous users; log for debugging
        console.warn("fetchAddresses unexpected status:", res.status);
        return;
      }

      const data = await res.json();
      setAddresses(data.addresses || []);
    } catch (err) {
      // network errors â€" log only (avoid modal on every page load)
      console.error("fetchAddresses error:", err);
    }
  };

  // only attempt to load addresses for authenticated users
  useEffect(() => {
    // avoid fetching while auth state is still loading
    if (authLoading) return;

    if (isLoggedIn) {
      fetchAddresses();
    } else {
      // ensure addresses cleared for anonymous visitors
      setAddresses([]);
    }
    // re-run when auth state changes
  }, [isLoggedIn, authLoading]);
const accountLinks = [
  { label: "Overview", tab: "overview" },
  { label: "Order History", tab: "orders" },
];
if (addresses.length > 0) {
  accountLinks.push({ label: "Address Details", tab: "address" });
}




  useEffect(() => {
    if (!isWindow) return;
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isWindow]);

  // --- menu cache keys and static endings ---
  const MENU_CACHE_KEY = "kdp_menu_cache_v1";
  const MENU_CACHE_TTL = 1000 * 60 * 10; // 10 min

  // stable key generator
  const itemKey = (item, idx) => item._id || item.id || item.name || `menu-${idx}`;

  // Fetch menu with caching and append static endings last
  useEffect(() => {
    let controller = new AbortController();
    let cancelled = false;

    const readCache = () => {
      if (!isWindow) return null;
      try {
        const raw = localStorage.getItem(MENU_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.items) return null;
        return parsed;
      } catch (err) {
        console.warn("Menu cache read err", err);
        return null;
      }
    };

    const writeCache = (items) => {
      if (!isWindow) return;
      try {
        localStorage.setItem(MENU_CACHE_KEY, JSON.stringify({ ts: Date.now(), items }));
      } catch (err) {
        console.warn("Menu cache write err", err);
      }
    };

    const normalize = (items = []) =>
      items.map((it, idx) => ({
        _id: it._id || it.id || `api-${idx}-${(it.name || it.title || "item").replace(/\s+/g, "-")}`,
        name: it.name || it.title || `Item ${idx + 1}`,
        products: Array.isArray(it.products) ? it.products : [],
        raw: it,
      }));

    const mergeWithStaticLast = (apiItems) => {
      const byKey = new Map();
      apiItems.forEach((it) => byKey.set(it._id || it.name, it));
      // move any API items that match static names to the end OR append static placeholders
      STATIC_END_ITEMS.forEach((s) => {
        // try to find API item with same name (case-insensitive)
        let foundKey = null;
        for (let [k, v] of byKey) {
          if ((v.name || "").toLowerCase() === (s.name || "").toLowerCase()) {
            foundKey = k;
            break;
          }
        }
        if (foundKey) {
          const val = byKey.get(foundKey);
          byKey.delete(foundKey);
          byKey.set(foundKey, val);
        } else {
          byKey.set(s._id, s);
        }
      });
      return Array.from(byKey.values());
    };

    const fetchMenu = async () => {
      const url = `${API_BASE_URL || ""}/product/tobBarCategory`;
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const itemsRaw = (data && data.data) ? data.data : Array.isArray(data) ? data : [];
        const normalized = normalize(itemsRaw);
        const final = mergeWithStaticLast(normalized);
        if (!cancelled) {
          setMenuItems(final);
          writeCache(normalized);
        }
        return normalized;
      } catch (err) {
        if (err.name === "AbortError") return null;
        console.error("menu fetch error", err);
        return null;
      }
    };

    const init = async () => {
      const cache = readCache();
      if (cache && Array.isArray(cache.items)) {
        const normalizedCache = normalize(cache.items);
        setMenuItems(mergeWithStaticLast(normalizedCache));
        const age = Date.now() - cache.ts;
        if (age > MENU_CACHE_TTL) {
          await fetchMenu();
        } else {
          fetchMenu().catch(() => {});
        }
      } else {
        const res = await fetchMenu();
        if (!res) {
          setMenuItems(STATIC_END_ITEMS);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search with debounce and abort
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    let active = true;
    const controller = new AbortController();

    const doSearch = async () => {
      setLoading(true);
      try {
        const url = `${API_BASE_URL || ""}/product/searchProduct?search=${encodeURIComponent(searchQuery)}`;
        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();
        if (!active) return;
        if (data.products) setSearchResults(data.products);
        else if (data.data) setSearchResults(data.data);
        else setSearchResults(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") console.error("search err", err);
        if (active) setSearchResults([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    const timer = setTimeout(doSearch, 400);
    return () => {
      active = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // lock body scroll when mobile menu open
  useEffect(() => {
    if (!isWindow) return;
    document.body.style.overflow = isMobile && menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen, isMobile, isWindow]);

  // account dropdown hover
  const handleAccountMouseEnter = () => {
    clearTimeout(accountTimeoutRef.current);
    setAccountDropdown(true);
  };
  const handleAccountMouseLeave = () => {
    accountTimeoutRef.current = setTimeout(() => setAccountDropdown(false), 200);
  };

 // Updated handleLogout function in Header.jsx
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
        await fetch(`${API_BASE_URL}/user/logout`, {
          method: "POST",
          credentials: "include",
        });
      } catch (err) {
        console.error("logout error", err);
      }
      logout();
      // Use the context logout function which handles all localStorage cleanup
      // setIsLoggedIn(false); // This will now handle localStorage cleanup automatically
      
      Swal.fire({ 
        icon: "success", 
        title: "Logged Out", 
        timer: 1200, 
        showConfirmButton: false 
      }).then(() => {
        navigate("/sign-in");
      });
    }
  });
};

  // expand/collapse mobile submenu
  const toggleSubMenu = (key) => {
    setExpandedMenus((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  };

  // helpers
  const makeKey = (item, idx) => item._id || item.id || item.name || `menu-${idx}`;

  // Dropdown components
  const SearchDropdown = ({ results, onSelect, isMobile = false }) =>
    searchQuery ? (
      <div style={isMobile ? styles.mobileSearchDropdown : styles.searchDropdown}>
        {loading ? (
          <div style={styles.searchItem}>Searching...</div>
        ) : results.length ? (
          results.map((r) => (
            <div key={r._id || r.id || r.name} style={styles.searchItem} onClick={() => onSelect(r)}>
              {r.name || r.title || r.productName}
            </div>
          ))
        ) : (
          <div style={styles.searchItem}>No results found</div>
        )}
      </div>
    ) : null;

  const AccountDropdown = () =>
    accountDropdown ? (
      <div style={styles.accountDropdown}>
  {accountLinks.map((item, i) => (
    <React.Fragment key={i}>
      <Link to={`/account?tab=${item.tab}`} style={styles.accountLink}>
        {item.label}
      </Link>
      {i < accountLinks.length - 1 && <div style={styles.divider} />}
    </React.Fragment>
  ))}

  <div style={styles.divider} />
  <button onClick={handleLogout} style={styles.logoutBtn}>
    Logout
  </button>
</div>

    ) : null;

  // protect cart if not logged
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
      }).then((res) => {
        if (res.isConfirmed) navigate("/sign-in");
      });
    }
  };

  const toggleMobileMenu = () => {
    setMenuOpen(prev => !prev);
  };


  if (authLoading) return null; 


  return (
    <header style={styles.header}>
      {/* TOP BAR */}
      <div style={styles.topBar}>
        {/* Logo */}
        <div style={styles.logoWrapper}>
          <a href="/">
            <img src="/assets/logo/logo2.jpg" alt="Logo" style={styles.logo} />
          </a>
        </div>

        {/* Desktop Navigation */}
       {!isMobile && (
  <div style={styles.topRightRow}>
    <GoogleTranslateDropdown />
    
    {authLoading ? (
      <span style={styles.topLink}>Loading...</span>
    ) : isLoggedIn ? (
      <div
        style={styles.accountContainer}
        onMouseEnter={handleAccountMouseEnter}
        onMouseLeave={handleAccountMouseLeave}
      >
        <span style={styles.topLink}>{t("account") || "Account"}</span>
        <AccountDropdown />
      </div>
    ) : (
      <Link to="/sign-in" style={styles.topLink}>
        {t("sign_in") || "Sign In"}
      </Link>
    )}

    <Link to="/cart" style={styles.topLink} onClick={handleCartClick}>
      <i className="fa-solid fa-cart-shopping" style={{ marginRight: "0.375rem" }} />
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
          navigate(`/product/${item._id || item.id}`);
          setSearchResults([]);
        }}
      />
    </div>
  </div>
)}

{/* Mobile Hamburger */}
{isMobile && (
  <button 
    onClick={toggleMobileMenu}
    style={styles.hamburger}
    aria-label={menuOpen ? "Close menu" : "Open menu"}
  >
    {menuOpen ? (
      <X size={24} color="#333" />
    ) : (
      <Menu size={24} color="#333" />
    )}
  </button>
)}
</div>
      {/* DESKTOP NAV */}
      {!isMobile && (
        <nav style={styles.navBar}>
          <div style={styles.navLinks}>
            {menuItems.map((item, idx) => {
              const key = makeKey(item, idx);
              const hasProducts = Array.isArray(item.products) && item.products.length > 0;

              // hover handlers use hoverTimeoutRef so moving between link and dropdown keeps it open
              const onNavMouseEnter = () => {
                clearTimeout(hoverTimeoutRef.current);
                setHoveredMenuKey(key);
              };
              const onNavMouseLeave = () => {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = setTimeout(() => setHoveredMenuKey((cur) => (cur === key ? null : cur)), 80);
              };
              const onDropdownMouseEnter = () => {
                clearTimeout(hoverTimeoutRef.current);
                setHoveredMenuKey(key);
              };
              const onDropdownMouseLeave = () => {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = setTimeout(() => setHoveredMenuKey((cur) => (cur === key ? null : cur)), 80);
              };

              return (
                <div
                  key={key}
                  style={styles.navItem}
                  onMouseEnter={onNavMouseEnter}
                  onMouseLeave={onNavMouseLeave}
                >
                 <Link
  to={item.path || `/allProducts/${item._id || item.id || key}`}
  style={styles.navLink}
>
  {item.name}
</Link>

                  {hasProducts && (
                    <div
                      style={{
                        ...styles.dropdown,
                        display: hoveredMenuKey === key ? "block" : "none",
                      }}
                      onMouseEnter={onDropdownMouseEnter}
                      onMouseLeave={onDropdownMouseLeave}
                    >
                      <Link
                        to={`/allProducts/${item._id || item.id || key}`}
                        style={styles.dropdownItemFirst}
                      >
                        All {item.name}
                      </Link>
                      {item.products.map((product, pidx) => (
                        <Link
                          key={product._id || product.id || `${key}-p-${pidx}`}
                          to={`/product/${product._id || product.id}`}
                          style={{
                            ...styles.dropdownItem,
                            borderBottom: pidx === item.products.length - 1 ? "none" : "1px solid #f1f3f4",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f7fafc";
                            e.currentTarget.style.color = "#2b6cb0";
                            e.currentTarget.style.paddingLeft = "1.5rem";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "#4a5568";
                            e.currentTarget.style.paddingLeft = "1.25rem";
                          }}
                        >
                          {product.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      )}

      {/* MOBILE MENU OVERLAY */}
      {isMobile && menuOpen && (
        <div style={styles.overlay} onClick={() => setMenuOpen(false)} />
      )}

      {/* MOBILE MENU */}
      {isMobile && (
        <div style={{
          ...styles.mobileMenu,
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          visibility: menuOpen ? 'visible' : 'hidden',
        }}>
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
                  navigate(`/product/${item._id || item.id}`);
                  setSearchResults([]);
                  setMenuOpen(false);
                }}
                isMobile
              />
            </div>
            <button 
              onClick={() => setMenuOpen(false)} 
              style={styles.closeIcon}
              aria-label="Close menu"
            >
              <X size={26} color="#6c757d" />
            </button>
          </div>

          <div style={styles.mobileContent}>
            {menuItems.map((item, idx) => {
              const key = makeKey(item, idx);
              const hasProducts = Array.isArray(item.products) && item.products.length > 0;
              return (
                <div key={key} style={styles.mobileMenuItem}>
                  <div
                    style={styles.mobileMenuHeader}
                    onClick={() => (hasProducts ? toggleSubMenu(key) : setMenuOpen(false))}
                  >
                    <Link
to={item.path || `/allProducts/${item._id || item.id || key}`}
style={styles.mobileMenuLink}
onClick={(e) => {
  if (hasProducts) {
    e.preventDefault();
  } else {
    setMenuOpen(false);
  }
}}
>
{item.name}
</Link>

                    {hasProducts && (
                      <div style={styles.arrowContainer}>
                        {expandedMenus[key] ? <ChevronUp size={18} color="#666" /> : <ChevronDown size={18} color="#666" />}
                      </div>
                    )}
                  </div>

                  {hasProducts && expandedMenus[key] && (
                    <div style={styles.mobileDropdownContent}>
                      <Link
                        to={`/allProducts/${item._id || item.id || key}`}
                        style={styles.mobileDropdownLink}
                        onClick={() => setMenuOpen(false)}
                      >
                        All {item.name}
                      </Link>
                      {item.products.map((product) => (
                        <Link
                          key={product._id || product.id || `${key}-prod-${product.name}`}
                          to={`/product/${product._id || product.id}`}
                          style={styles.mobileDropdownLink}
                          onClick={() => setMenuOpen(false)}
                        >
                          {product.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={styles.mobileFooter}>
            {isLoggedIn ? (
              <div style={styles.mobileAccountSection}>
                <div onClick={() => setShowAccountDropdown((s) => !s)} style={styles.mobileAccountToggle}>
                  Account
                  {showAccountDropdown ? <ChevronUp size={18} color="#fff" /> : <ChevronDown size={18} color="#fff" />}
                </div>
                {showAccountDropdown && (
                 <div style={styles.mobileAccountDropdown}>
  {accountLinks.map((item, i) => (
    <Link
      key={i}
      to={`/account?tab=${item.tab}`}
      style={styles.mobileAccountLink}
    >
      {item.label}
    </Link>
  ))}
  <button onClick={handleLogout} style={styles.mobileLogoutBtn}>
    Logout
  </button>
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
                <i className="fas fa-shopping-cart" style={{ marginRight: "0.5rem" }} />
                Cart
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Offer bar */}
 <div
  style={{
    ...styles.offerBar,
    width: isMobile ? "100%" : "89%",   // ✅ now works inside component
    margin: isMobile ? "0" : "0 auto", // ✅ no error
  }}
>
 
  
        🎉 New members get <strong>$5</strong> off their first order! <a href="/sign-in" style={{ color: "white" }}>Sign up now.</a>
      </div>
      
    </header>
  );
}

/* ---------- styles ---------- */
const styles = {
  header: {
    fontFamily: "'Segoe UI', sans-serif",
    //  borderBottom: "1px solid #eee",
  //  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    backgroundColor: "white",
    // width: "100%",
    position: "sticky",
    top: "0",
    zIndex: "100",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 1rem",
    maxWidth: "65%",
    margin: "0 auto",
    width: "100%",
    minHeight: "3.75rem",
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
  logoWrapper: { 
    display: "flex", 
    alignItems: "center",
    flexShrink: 0,
  },
  logo: { 
    height: "2.8rem", 
    width: "auto",
    maxWidth: "7.5rem",
    objectFit: "contain",
  },
  topRightRow: { 
    display: "flex", 
    alignItems: "center", 
    gap: "1.250rem", 
    marginLeft: "auto", 
    marginRight: "0.99rem", 
  },
  topLink: { 
    cursor: "pointer", 
    color: "#333", 
    fontSize: "0.875rem", 
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
  accountContainer: { 
    position: "relative", 
    display: "inline-block", 
    zIndex: 4000 
  },
  searchWrapper: { 
    position: "relative", 
    width: "12%", 
    minWidth: "10rem",
    zIndex: 4000 
  },
  searchInput: { 
    width: "100%", 
    padding: "0.5rem 2.25rem 0.5rem 0.75rem", 
    border: "1px solid #ccc", 
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
  },
  searchIcon: { 
    position: "absolute", 
    right: "0.625rem", 
    top: "50%", 
    transform: "translateY(-50%)", 
    fontSize: "1rem", 
    color: "#333", 
    pointerEvents: "none" 
  },

  searchDropdown: { 
    position: "absolute", 
    top: "2.625rem", 
    left: 0, 
    right: 0, 
    backgroundColor: "#fff", 
    border: "1px solid #ccc", 
    zIndex: 5002,
    maxHeight: "15.625rem", 
    overflowY: "auto", 
    borderRadius: "0.375rem",
    boxShadow: "0 0.25rem 0.75rem rgba(0,0,0,0.15)",
  },
  searchItem: { 
    padding: "0.625rem", 
    borderBottom: "1px solid #eee", 
    cursor: "pointer", 
    color: "#333",
    fontSize: "0.875rem",
  },

  hamburger: { 
    background: "none",
    border: "none",
    cursor: "pointer", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.5rem",
    borderRadius: "0.25rem",
    transition: "background-color 0.2s ease",
    flexShrink: 0,
  },
  navBar: { 
    backgroundColor: "white",
  },
  navLinks: { 
    display: "flex", 
    gap: "0.0625rem", 
    flexWrap: "nowrap", 
    whiteSpace: "nowrap", 
    maxWidth: "66%",
    margin: "0 auto", 
    padding: "0 1rem",
    width: "100%",
    alignItems: "flex-start",
  },
  navItem: { 
    position: "relative" 
  },
  navLink: { 
    fontSize: "0.75rem", 
    color: "#111", 
    fontWeight: "500", 
    textDecoration: "none", 
    padding: "0.75rem 0.375rem", 
    display: "inline-block",
  },

  dropdown: {
    position: "absolute",
    top: "100%",
    left: "0",
    backgroundColor: "#fff",
    border: "1px solid #e0e6ed",
    borderRadius: "0.5rem",
    boxShadow: "0 0.375rem 1.25rem rgba(0,0,0,0.08)",
    zIndex: 3500,
    minWidth: "15rem",
    padding: "0",
    overflow: "hidden",
  },
  dropdownItem: {
    display: "block",
    padding: "0.75rem 1.25rem",
    textDecoration: "none",
    color: "#4a5568",
    fontSize: "0.9375rem",
    fontWeight: "400",
    borderBottom: "1px solid #f1f3f4",
    transition: "all 0.15s ease",
    position: "relative",
  },
  dropdownItemFirst: {
    display: "block",
    padding: "0.75rem 1.25rem",
    textDecoration: "none",
    color: "#2d3748",
    fontSize: "0.9375rem",
    fontWeight: "600",
    borderBottom: "2px solid #e2e8f0",
    backgroundColor: "#f8f9fa",
  },

  accountDropdown: { 
    position: "absolute", 
    top: "100%", 
    left: "50%", 
    transform: "translateX(-50%)", 
    backgroundColor: "#fff", 
    boxShadow: "0 0.375rem 1.125rem rgba(0,0,0,0.12)", 
    borderRadius: "0.5rem", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "stretch", 
    minWidth: "11.25rem", 
    padding: "0.625rem 0", 
    zIndex: 5002,
  },
  accountLink: { 
    padding: "0.625rem 0.9375rem", 
    textDecoration: "none", 
    color: "#0073e6", 
    fontSize: "0.875rem", 
    fontWeight: "500" 
  },
  divider: { 
    borderTop: "1px solid #eee", 
    marginTop: "0.5rem" 
  },
  logoutBtn: { 
    margin: "0.625rem auto 0 auto", 
    padding: "0.5rem 1rem", 
    backgroundColor: "#0073e6", 
    color: "#fff", 
    border: "none", 
    borderRadius: "0.375rem", 
    cursor: "pointer", 
    fontSize: "0.875rem", 
    fontWeight: "500" 
  },

  // Mobile menu styles
  mobileMenu: { 
    position: "fixed", 
    top: 0, 
    right: 0, 
    bottom: 0, 
    width: "85%", 
    maxWidth: "18.75rem",
    backgroundColor: "#f8f9fa", 
    zIndex: 999, 
    boxShadow: "-0.125rem 0 0.5rem rgba(0,0,0,0.2)", 
    overflowY: "auto", 
    display: "flex", 
    flexDirection: "column",
    transition: "transform 0.3s ease, visibility 0.3s ease",
  },
  mobileHeader: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: "0.9375rem 1rem", 
    borderBottom: "1px solid #dee2e6", 
    backgroundColor: "#fff", 
    position: "sticky", 
    top: 0, 
    zIndex: 1000 
  },
  mobileSearchWrapper: { 
    position: "relative", 
    flex: 1, 
    marginRight: "0.75rem" 
  },
  mobileSearchInput: { 
    width: "100%", 
    padding: "0.625rem 2.5rem 0.625rem 0.9375rem", 
    fontSize: "1rem", 
    border: "1px solid #ced4da", 
    borderRadius: "0.5rem", 
    backgroundColor: "#fff" 
  },
  mobileSearchIcon: { 
    position: "absolute", 
    right: "0.75rem", 
    top: "50%", 
    transform: "translateY(-50%)", 
    fontSize: "1rem", 
    color: "#6c757d" 
  },
  mobileSearchDropdown: { 
    position: "absolute", 
    top: "3rem", 
    left: 0, 
    right: 0, 
    backgroundColor: "#fff", 
    border: "1px solid #ced4da", 
    borderRadius: "0.5rem", 
    zIndex: 2000, 
    maxHeight: "12.5rem", 
    overflowY: "auto", 
    boxShadow: "0 0.25rem 0.375rem rgba(0,0,0,0.1)" 
  },
  closeIcon: { 
    background: "none",
    border: "none",
    cursor: "pointer", 
    color: "#6c757d", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.25rem",
  },
  mobileContent: { 
    flex: 1, 
    overflowY: "auto", 
    padding: "0" 
  },
  mobileMenuItem: { 
    borderBottom: "1px solid #e9ecef", 
    backgroundColor: "#fff" 
  },
  mobileMenuHeader: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: "1rem 1.25rem", 
    cursor: "pointer", 
    transition: "background-color 0.2s ease" 
  },
  mobileMenuLink: { 
    textDecoration: "none", 
    color: "#212529", 
    fontSize: "1rem", 
    fontWeight: "500", 
    flex: 1, 
    display: "block" 
  },
  arrowContainer: { 
    marginLeft: "0.75rem", 
    display: "flex", 
    alignItems: "center", 
    padding: "0.125rem" 
  },
  mobileDropdownContent: { 
    backgroundColor: "#f8f9fa", 
    borderTop: "1px solid #e9ecef", 
    paddingLeft: "1.25rem" 
  },
  mobileDropdownLink: { 
    display: "block", 
    padding: "0.75rem 1.25rem", 
    textDecoration: "none", 
    color: "#495057", 
    fontSize: "0.9375rem", 
    borderBottom: "1px solid #e9ecef", 
    transition: "background-color 0.2s ease" 
  },

  mobileFooter: { 
    backgroundColor: "#343a40", 
    color: "white", 
    padding: "1.25rem", 
    borderTop: "1px solid #495057", 
    marginTop: "auto" 
  },
  mobileAccountSection: { 
    marginBottom: "0.9375rem" 
  },
  mobileAccountToggle: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    fontWeight: "600", 
    fontSize: "1rem", 
    padding: "0.9375rem 1.25rem", 
    backgroundColor: "#495057", 
    borderRadius: "0.5rem", 
    cursor: "pointer", 
    transition: "background-color 0.2s ease" 
  },
  mobileAccountDropdown: { 
    marginTop: "0.625rem", 
    backgroundColor: "#212529", 
    borderRadius: "0.5rem", 
    padding: "0.625rem 0", 
    overflow: "hidden" 
  },
  mobileAccountLink: { 
    padding: "0.75rem 1.25rem", 
    fontSize: "0.9375rem", 
    cursor: "pointer", 
    textDecoration: "none", 
    display: "block", 
    color: "#f8f9fa" 
  },
  mobileLogoutBtn: { 
    background: "none", 
    border: "none", 
    cursor: "pointer", 
    color: "#f8f9fa", 
    textAlign: "left", 
    padding: "0.75rem 1.25rem", 
    width: "100%", 
    fontSize: "0.9375rem" 
  },
  mobileSignIn: { 
    marginBottom: "0.9375rem", 
    padding: "0.9375rem 1.25rem", 
    backgroundColor: "#495057", 
    borderRadius: "0.5rem", 
    textAlign: "center" 
  },
  mobileSignInLink: { 
    color: "#fff", 
    textDecoration: "none", 
    fontWeight: "600", 
    fontSize: "1rem" 
  },
  mobileCart: { 
    padding: "0.9375rem 1.25rem", 
    backgroundColor: "#007bff", 
    textAlign: "center", 
    borderRadius: "0.5rem", 
    fontWeight: "600" 
  },
  mobileCartLink: { 
    color: "white", 
    textDecoration: "none", 
    fontSize: "1rem", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center" 
  },

  offerBar: { 
    backgroundColor: "#007BFF", 
    color: "#fff", 
    textAlign: "center", 
    padding: "0.625rem 1.25rem", 
    fontSize: "0.875rem", 
    fontWeight: "500", 
    lineHeight: "1.4", 
    wordWrap: "break-word" ,
          
    
  },
};