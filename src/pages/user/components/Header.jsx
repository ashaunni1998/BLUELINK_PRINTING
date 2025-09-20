// src/components/common/Header.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GoogleTranslateDropdown from "../GoogleTranslateDropdown.jsx";
import { AuthContext } from "../../../context/AuthContext.jsx";
import API_BASE_URL from "../../../config.js";
import Swal from "sweetalert2";
import { X, ChevronDown, ChevronUp } from "lucide-react";

/**
 * Header component
 * - Loads menu from API and caches in localStorage
 * - Ensures Help & Faq and The Blog are appended last
 * - Desktop dropdown remains open when hovering link OR dropdown (uses hoverTimeoutRef)
 */

export default function Header() {
  const { t } = useTranslation();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
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

  const accountTimeoutRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const isWindow = typeof window !== "undefined";
  const [isMobile, setIsMobile] = useState(isWindow ? window.innerWidth < 1024 : false);





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
          await fetch(`${API_BASE_URL || ""}/user/logout`, {
            method: "POST",
            credentials: "include",
          });
        } catch (err) {
          console.error("logout error", err);
        }
        if (isWindow) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
        setIsLoggedIn(false);
        Swal.fire({ icon: "success", title: "Logged Out", timer: 1200, showConfirmButton: false }).then(() => {
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
        <Link to="/account?tab=overview" style={styles.accountLink}>
          Overview
        </Link>
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

  return (
    <header style={styles.header}>
      {/* TOP BAR */}
      <div style={styles.topBar}>
        <div style={{ ...styles.logoWrapper, marginLeft: isMobile ? "8px" : "20px" }}>
          <a href="/">
            <img src="/assets/logo/logo2.jpg" alt="Logo" style={styles.logo} />
          </a>
        </div>

        {!isMobile && (
          <div style={styles.topRightRow}>
            <GoogleTranslateDropdown />
            {isLoggedIn ? (
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
              <i className="fa-solid fa-cart-shopping" style={{ marginRight: 6 }} />
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

        {isMobile && (
          <div onClick={() => setMenuOpen(!menuOpen)} style={styles.hamburger}>
            ☰
          </div>
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
                            e.currentTarget.style.paddingLeft = "24px";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "#4a5568";
                            e.currentTarget.style.paddingLeft = "20px";
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

      {/* MOBILE MENU */}
      {isMobile && menuOpen && (
        <>
          <div style={styles.overlay} onClick={() => setMenuOpen(false)} />
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
                    navigate(`/product/${item._id || item.id}`);
                    setSearchResults([]);
                    setMenuOpen(false);
                  }}
                  isMobile
                />
              </div>
              <X onClick={() => setMenuOpen(false)} size={26} style={styles.closeIcon} />
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
                  <i className="fas fa-shopping-cart" style={{ marginRight: 8 }} />
                  Cart
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Offer bar */}
      <div style={styles.offerBar}>
        🎉 New members get <strong>$5</strong> off their first order! <a href="/sign-in" style={{ color: "white" }}>Sign up now.</a>
      </div>

      <style>{styles.responsive}</style>
    </header>
  );
}

/* ---------- styles ---------- */
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
    padding: "6px 0px",
    maxWidth: "1100px",
    margin: "0 auto",

    width: "100%",
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
  logoWrapper: { display: "flex", alignItems: "center" },
  logo: { height: "50px", objectFit: "contain", width: "115px" },
  topRightRow: { display: "flex", alignItems: "center", gap: "18px", marginLeft: "auto", marginRight: "80px", flex: "0 0 auto", justifyContent: "flex-end" },
  topLink: { cursor: "pointer", color: "#333", fontSize: "14px", textDecoration: "none" },
  accountContainer: { position: "relative", display: "inline-block" },
  searchWrapper: { position: "relative", width: "160px" },
  searchInput: { width: "100%", padding: "8px 36px 8px 12px", border: "1px solid #ccc", borderRadius: "6px" },
  searchIcon: { position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", color: "#333", pointerEvents: "none" },

  searchDropdown: { position: "absolute", top: "42px", left: 0, right: 0, backgroundColor: "#fff", border: "1px solid #ccc", zIndex: 3000, maxHeight: "250px", overflowY: "auto", borderRadius: "6px" },
  searchItem: { padding: "10px", borderBottom: "1px solid #eee", cursor: "pointer", color: "#333" },

  hamburger: { fontSize: "24px", cursor: "pointer", marginRight: "10px" },
  navBar: { position: "relative", zIndex: 1200 },
  navLinks: { display: "flex", gap: "12px", flexWrap: "nowrap", whiteSpace: "nowrap", position: "relative", zIndex: 1,  maxWidth: "1100px", 
  margin: "0 auto", 
  padding: "0 20px", 
  width: "100%"  },
  navItem: { position: "relative" },
  navLink: { fontSize: "14px", color: "#111", fontWeight: "500", textDecoration: "none", padding: "12px 6px", display: "inline-block" },

  dropdown: {
    position: "absolute",
    top: "100%",
    left: "0",
    backgroundColor: "#fff",
    border: "1px solid #e0e6ed",
    borderRadius: "8px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    zIndex: 2000,
    minWidth: "240px",
    padding: "0",
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
    transition: "all 0.15s ease",
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
    backgroundColor: "#f8f9fa",
  },

  accountDropdown: { position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", backgroundColor: "#fff", boxShadow: "0px 6px 18px rgba(0,0,0,0.12)", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "stretch", minWidth: "180px", padding: "10px 0", zIndex: 1000 },
  accountLink: { padding: "10px 15px", textDecoration: "none", color: "#0073e6", fontSize: "14px", fontWeight: "500" },
  divider: { borderTop: "1px solid #eee", marginTop: "8px" },
  logoutBtn: { margin: "10px auto 0 auto", padding: "8px 16px", backgroundColor: "#0073e6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "500" },

  // mobile
  mobileMenu: { position: "fixed", top: 0, right: 0, bottom: 0, maxHeight: "100vh", width: "85%", backgroundColor: "#f8f9fa", zIndex: 999, boxShadow: "-2px 0 8px rgba(0,0,0,0.2)", overflowY: "auto", display: "flex", flexDirection: "column" },
  mobileHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 16px", borderBottom: "1px solid #dee2e6", backgroundColor: "#fff", position: "sticky", top: 0, zIndex: 1000 },
  mobileSearchWrapper: { position: "relative", flex: 1, marginRight: "12px" },
  mobileSearchInput: { width: "100%", padding: "10px 40px 10px 15px", fontSize: "16px", border: "1px solid #ced4da", borderRadius: "8px", backgroundColor: "#fff" },
  mobileSearchIcon: { position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", color: "#6c757d" },
  mobileSearchDropdown: { position: "absolute", top: "48px", left: 0, right: 0, backgroundColor: "#fff", border: "1px solid #ced4da", borderRadius: "8px", zIndex: 2000, maxHeight: "200px", overflowY: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
  closeIcon: { fontSize: "22px", cursor: "pointer", color: "#6c757d", marginLeft: "12px" },
  mobileContent: { flex: 1, overflowY: "auto", padding: "0" },
  mobileMenuItem: { borderBottom: "1px solid #e9ecef", backgroundColor: "#fff" },
  mobileMenuHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", cursor: "pointer", transition: "background-color 0.2s ease" },
  mobileMenuLink: { textDecoration: "none", color: "#212529", fontSize: "16px", fontWeight: "500", flex: 1, display: "block" },
  arrowContainer: { marginLeft: "12px", display: "flex", alignItems: "center", padding: "2px" },
  mobileDropdownContent: { backgroundColor: "#f8f9fa", borderTop: "1px solid #e9ecef", paddingLeft: "20px" },
  mobileDropdownLink: { display: "block", padding: "12px 20px", textDecoration: "none", color: "#495057", fontSize: "15px", borderBottom: "1px solid #e9ecef", transition: "background-color 0.2s ease" },

  mobileFooter: { backgroundColor: "#343a40", color: "white", padding: "20px", borderTop: "1px solid #495057", marginTop: "auto" },
  mobileAccountSection: { marginBottom: "15px" },
  mobileAccountToggle: { display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "600", fontSize: "16px", padding: "15px 20px", backgroundColor: "#495057", borderRadius: "8px", cursor: "pointer", transition: "background-color 0.2s ease" },
  mobileAccountDropdown: { marginTop: "10px", backgroundColor: "#212529", borderRadius: "8px", padding: "10px 0", overflow: "hidden" },
  mobileAccountLink: { padding: "12px 20px", fontSize: "15px", cursor: "pointer", textDecoration: "none", display: "block", color: "#f8f9fa" },
  mobileLogoutBtn: { background: "none", border: "none", cursor: "pointer", color: "#f8f9fa", textAlign: "left", padding: "12px 20px", width: "100%", fontSize: "15px" },
  mobileSignIn: { marginBottom: "15px", padding: "15px 20px", backgroundColor: "#495057", borderRadius: "8px", textAlign: "center" },
  mobileSignInLink: { color: "#fff", textDecoration: "none", fontWeight: "600", fontSize: "16px" },
  mobileCart: { padding: "15px 20px", backgroundColor: "#007bff", textAlign: "center", borderRadius: "8px", fontWeight: "600" },
  mobileCartLink: { color: "white", textDecoration: "none", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" },

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
  `,
};
