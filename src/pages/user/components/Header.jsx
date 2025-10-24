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
const [isMobile, setIsMobile] = useState(isWindow ? window.innerWidth < 1050 : false);
const [isTablet, setIsTablet] = useState(
  isWindow ? window.innerWidth >= 768 && window.innerWidth < 1050 : false
);
const [isOfferBarMobile, setIsOfferBarMobile] = useState(
  isWindow ? window.innerWidth <= 768 : false
);
const [isLargeDesktop, setIsLargeDesktop] = useState(
  isWindow ? window.innerWidth >= 1920 : false
);
const [windowWidth, setWindowWidth] = useState(isWindow ? window.innerWidth : 1440);

// REPLACE all your separate useEffect hooks with this SINGLE consolidated one:
useEffect(() => {
  if (!isWindow) return;
  const onResize = () => {
    const width = window.innerWidth;
    setIsMobile(width < 1050);
    setIsTablet(width >= 768 && width < 1050);
    setIsOfferBarMobile(width <= 768);
    setIsLargeDesktop(width >= 1920);
    setWindowWidth(width);
  };
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}, [isWindow]);


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
  const onResize = () => {
    setIsMobile(window.innerWidth < 1050);
    setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1050);
  };
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

/* ---------- styles ---------- */
const styles = {
  header: {
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "white",
    position: "sticky",
    top: "0",
    zIndex: "100",
  },
topBar: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  maxWidth: "1440px", // Centralized container like MOO
  margin: "0 auto", // Center the container
  width: "100%",
  minHeight: "4.5rem",
  paddingTop: isMobile ? "0.75rem" : "1rem",
  paddingBottom: isMobile ? "0.75rem" : "1rem",
  paddingLeft: isMobile ? "1rem" : windowWidth < 1200 ? "1.5rem" : "2.5rem",
  paddingRight: isMobile ? "1rem" : windowWidth < 1200 ? "1.5rem" : "2.5rem",
},

  
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh", // Changed from 100%
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 998,
  },
  

logoWrapper: { 
  display: "flex", 
  alignItems: "center",
  flexShrink: 0,
  marginRight: "0", // Add space after logo
},

logo: { 
  height: isMobile ? "2.5rem" : "2.5rem", // Match MOO's logo size
  width: "auto",
  maxWidth: isMobile ? "7.5rem" : "8rem",
  objectFit: "contain",
},
topRightRow: { 
  display: "flex", 
  alignItems: "center", 
  gap: windowWidth < 1200 ? "1rem" : "1.5rem",
  flexShrink: 0,
  
},

topLink: { 
  cursor: "pointer", 
  color: "#333", 
  fontSize: "0.875rem", // Smaller font size
  textDecoration: "none",
  whiteSpace: "nowrap",
  fontWeight: "400", // Normal weight, not 500
  fontFamily: "'Segoe UI', sans-serif",
  transition: "color 0.2s ease",
},
  
  accountContainer: { 
    position: "relative", 
    display: "inline-block", 
    zIndex: 4000 
  },
  
 searchWrapper: { 
  position: "relative", 
 width: windowWidth < 1200 ? "160px" : "200px",
  minWidth: windowWidth < 1200 ? "140px" : "180px",
  zIndex: 4000,
},

searchInput: { 
  width: "100%",
  padding: "0.5rem 2.5rem 0.5rem 0.875rem", // Smaller padding
  border: "1px solid #ddd",
  borderRadius: "0.25rem", // Less rounded
  fontSize: "0.875rem",
  transition: "border-color 0.2s ease",
},
  
  searchIcon: { 
    position: "absolute", 
    right: "0.625rem", // Already in rem
    top: "50%", // Already in %
    transform: "translateY(-50%)", // Already in %
    fontSize: "1rem", // Already in rem
    color: "#333", 
    pointerEvents: "none" 
  },

  searchDropdown: { 
    position: "absolute", 
    top: "2.625rem", // Already in rem
    left: 0, 
    right: 0, 
    backgroundColor: "#fff", 
    border: "0.0625rem solid #ccc", // 1px = 0.0625rem
    zIndex: 5002,
    maxHeight: "15.625rem", // Already in rem
    overflowY: "auto", 
    borderRadius: "0.375rem", // Already in rem
    boxShadow: "0 0.25rem 0.75rem rgba(0,0,0,0.15)", // Already in rem
  },
  
  searchItem: { 
    padding: "0.625rem", // Already in rem
    borderBottom: "0.0625rem solid #eee", // 1px = 0.0625rem
    cursor: "pointer", 
    color: "#333",
    fontSize: "0.875rem", // Already in rem
  },

  hamburger: { 
    background: "none",
    border: "none",
    cursor: "pointer", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.5rem", // Already in rem
    borderRadius: "0.25rem", // Already in rem
    transition: "background-color 0.2s ease",
    flexShrink: 0,
  },
  
  navBar: { 
  backgroundColor: "white",
  position: "relative",
  zIndex: 100,
  overflow: "visible",
  // borderTop: "1px solid #e5e7eb",
  borderBottom: "1px solid #e5e7eb",
  
},

navLinks: { 
  display: "flex", 
  gap: "0",
  justifyContent: "flex-start",
  flexWrap: "nowrap", 
  whiteSpace: "nowrap", 
  maxWidth: "1440px",
  margin: "0 auto", 
padding: windowWidth < 1200 ? "0 1.5rem" : "0 2.5rem",
  width: "100%",
  overflowX: windowWidth < 1200 ? "auto" : "visible",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  WebkitOverflowScrolling: "touch",
},


  navItem: { 
    position: "relative",
    zIndex: 1,
  },
  
     navLink: { 
  fontSize: windowWidth < 1200 ? "0.875rem" : "0.905rem",
  color: "#0c0c0cff",
  fontWeight: "600", // Normal weight like MOO
  textDecoration: "none", 
   padding: windowWidth < 1200 ? "0.75rem 1rem" : "0.875rem 1.5rem",
  display: "inline-block",
  transition: "color 0.2s ease",
},

   dropdown: {
    position: "absolute",
    top: "100%",
    left: "50%", // Center dropdown under nav item
    transform: "translateX(-50%)",
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    zIndex: 9999,
    minWidth: "200px",
    maxWidth: "280px",
    padding: "0.75rem 0",
    marginTop: "0.5rem",
  },
  
  dropdownItem: {
    display: "block",
    padding: "0.75rem 1.5rem",
    textDecoration: "none",
    color: "#4b5563",
    fontSize: "0.9rem",
    fontWeight: "400",
    borderBottom: "none", // Removed border
    transition: "all 0.2s ease",
    position: "relative",
  },

  
dropdownItemFirst: {
    display: "block",
    padding: "0.75rem 1.5rem",
    textDecoration: "none",
    color: "#111",
    fontSize: "0.9rem",
    fontWeight: "600",
    borderBottom: "1px solid #f3f4f6",
    backgroundColor: "transparent", // Removed background
    marginBottom: "0.5rem",
  },


  accountDropdown: { 
    position: "absolute", 
    top: "calc(100% + 0.5rem)",
    right: "0", // Changed from center to right-aligned
    transform: "none", // Removed translateX
    backgroundColor: "#fff", 
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    display: "flex", 
    flexDirection: "column", 
    alignItems: "stretch", 
    minWidth: "180px",
    padding: "0.75rem 0",
    zIndex: 5002,
  },
  
  accountLink: { 
    padding: "0.75rem 1.25rem",
    textDecoration: "none", 
    color: "#333",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
  },
  
  divider: { 
    borderTop: "0.0625rem solid #eee", // 1px = 0.0625rem
    marginTop: "0.5rem" // Already in rem
  },
  
logoutBtn: { 
    margin: "0.5rem 0.75rem 0 0.75rem",
    padding: "0.625rem 1rem",
    backgroundColor: "#007BFF",
    color: "#fff", 
    border: "none", 
    borderRadius: "0.5rem",
    cursor: "pointer", 
    fontSize: "0.9rem",
    fontWeight: "600",
    transition: "background-color 0.2s ease",
  },

  // Mobile menu styles
  mobileMenu: { 
    position: "fixed", 
    top: 0, 
    right: 0, 
    bottom: 0, 
    width: "85%", // Already in %
    maxWidth: "18.75rem", // Already in rem
    backgroundColor: "#f8f9fa", 
    zIndex: 999, 
    boxShadow: "-0.125rem 0 0.5rem rgba(0,0,0,0.2)", // Already in rem
    overflowY: "auto", 
    display: "flex", 
    flexDirection: "column",
    transition: "transform 0.3s ease, visibility 0.3s ease",
  },
  
  mobileHeader: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: "0.9375rem 1rem", // Already in rem
    borderBottom: "0.0625rem solid #dee2e6", // 1px = 0.0625rem
    backgroundColor: "#fff", 
    position: "sticky", 
    top: 0, 
    zIndex: 1000 
  },
  
  mobileSearchWrapper: { 
    position: "relative", 
    flex: 1, 
    marginRight: "0.75rem" // Already in rem
  },
  
  mobileSearchInput: { 
    width: "100%", // Already in %
    padding: "0.625rem 2.5rem 0.625rem 0.9375rem", // Already in rem
    fontSize: "1rem", // Already in rem
    border: "0.0625rem solid #ced4da", // 1px = 0.0625rem
    borderRadius: "0.5rem", // Already in rem
    backgroundColor: "#fff" 
  },
  
  mobileSearchIcon: { 
    position: "absolute", 
    right: "0.75rem", // Already in rem
    top: "50%", // Already in %
    transform: "translateY(-50%)", // Already in %
    fontSize: "1rem", // Already in rem
    color: "#6c757d" 
  },
  
  mobileSearchDropdown: { 
    position: "absolute", 
    top: "3rem", // Already in rem
    left: 0, 
    right: 0, 
    backgroundColor: "#fff", 
    border: "0.0625rem solid #ced4da", // 1px = 0.0625rem
    borderRadius: "0.5rem", // Already in rem
    zIndex: 2000, 
    maxHeight: "12.5rem", // Already in rem
    overflowY: "auto", 
    boxShadow: "0 0.25rem 0.375rem rgba(0,0,0,0.1)" // Already in rem
  },
  
  closeIcon: { 
    background: "none",
    border: "none",
    cursor: "pointer", 
    color: "#6c757d", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.25rem", // Already in rem
  },
  
  mobileContent: { 
    flex: 1, 
    overflowY: "auto", 
    padding: "0" 
  },
  
  mobileMenuItem: { 
    borderBottom: "0.0625rem solid #e9ecef", // 1px = 0.0625rem
    backgroundColor: "#fff" 
  },
  
  mobileMenuHeader: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: "1rem 1.25rem", // Already in rem
    cursor: "pointer", 
    transition: "background-color 0.2s ease" 
  },
  
  mobileMenuLink: { 
    textDecoration: "none", 
    color: "#212529", 
    fontSize: "1rem", // Already in rem
    fontWeight: "500", 
    flex: 1, 
    display: "block" 
  },
  
  arrowContainer: { 
    marginLeft: "0.75rem", // Already in rem
    display: "flex", 
    alignItems: "center", 
    padding: "0.125rem" // Already in rem
  },
  
  mobileDropdownContent: { 
    backgroundColor: "#f8f9fa", 
    borderTop: "0.0625rem solid #e9ecef", // 1px = 0.0625rem
    paddingLeft: "1.25rem" // Already in rem
  },
  
  mobileDropdownLink: { 
    display: "block", 
    padding: "0.75rem 1.25rem", // Already in rem
    textDecoration: "none", 
    color: "#495057", 
    fontSize: "0.9375rem", // Already in rem
    borderBottom: "0.0625rem solid #e9ecef", // 1px = 0.0625rem
    transition: "background-color 0.2s ease" 
  },

  mobileFooter: { 
    backgroundColor: "#343a40", 
    color: "white", 
    padding: "1.25rem", // Already in rem
    borderTop: "0.0625rem solid #495057", // 1px = 0.0625rem
    marginTop: "auto" 
  },
  
  mobileAccountSection: { 
    marginBottom: "0.9375rem" // Already in rem
  },
  
  mobileAccountToggle: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    fontWeight: "600", 
    fontSize: "1rem", // Already in rem
    padding: "0.9375rem 1.25rem", // Already in rem
    backgroundColor: "#495057", 
    borderRadius: "0.5rem", // Already in rem
    cursor: "pointer", 
    transition: "background-color 0.2s ease" 
  },
  
  mobileAccountDropdown: { 
    marginTop: "0.625rem", // Already in rem
    backgroundColor: "#212529", 
    borderRadius: "0.5rem", // Already in rem
    padding: "0.625rem 0", // Already in rem
    overflow: "hidden" 
  },
  
  mobileAccountLink: { 
    padding: "0.75rem 1.25rem", // Already in rem
    fontSize: "0.9375rem", // Already in rem
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
    padding: "0.75rem 1.25rem", // Already in rem
    width: "100%", // Already in %
    fontSize: "0.9375rem" // Already in rem
  },
  
  mobileSignIn: { 
    marginBottom: "0.9375rem", // Already in rem
    padding: "0.9375rem 1.25rem", // Already in rem
    backgroundColor: "#495057", 
    borderRadius: "0.5rem", // Already in rem
    textAlign: "center" 
  },
  
  mobileSignInLink: { 
    color: "#fff", 
    textDecoration: "none", 
    fontWeight: "600", 
    fontSize: "1rem" // Already in rem
  },
  
  mobileCart: { 
    padding: "0.9375rem 1.25rem", // Already in rem
    backgroundColor: "#007bff", 
    textAlign: "center", 
    borderRadius: "0.5rem", // Already in rem
    fontWeight: "600" 
  },
  
  mobileCartLink: { 
    color: "white", 
    textDecoration: "none", 
    fontSize: "1rem", // Already in rem
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center" 
  },

 offerBar: { 
    backgroundColor: "#007BFF", 
    color: "#fff", 
    textAlign: "center", 
    fontSize: isOfferBarMobile ? "0.8125rem" : "0.9375rem",
    fontWeight: "500", 
    lineHeight: "1.5",
    padding: isOfferBarMobile ? "0.625rem 1rem" : "0.75rem 2rem",
    wordWrap: "break-word",
    boxSizing: "border-box",
  },
}




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
  style={{
    ...styles.navLink,
    paddingLeft: idx === 0 ? "0" : undefined,
  }}
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

 
 {/* Offer bar - Fully Responsive */}

 <div
  style={{
    width: "100%", // Changed from conditional width
    margin: "0",
    backgroundColor: "#007BFF",
    color: "#fff",
    textAlign: "center",
    fontSize: isOfferBarMobile ? "0.75rem" : "0.875rem",
    fontWeight: "500",
    lineHeight: "1.4",
    wordWrap: "break-word",
    padding: isOfferBarMobile ? "0.5rem 1rem" : "0.625rem 2rem",
    boxSizing: "border-box",
  }}
>
  {isOfferBarMobile ? (
    <>
      🎉 New members get <strong>$5</strong> off! <a href="/sign-in" style={{ color: "white", textDecoration: "underline" }}>Sign up</a>
    </>
  ) : (
    <>
      🎉 New members get <strong>$5</strong> off their first order! <a href="/sign-in" style={{ color: "white", textDecoration: "underline" }}>Sign up now.</a>
    </>
  )}
</div>



      
    </header>
  );
}


