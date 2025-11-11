import React, { useState, useEffect, useContext } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config";
import axios from "axios";
import Swal from "sweetalert2";
import "./Home.css";
import AddressAutocomplete from "./components/AddressAutocomplete";

const AccountPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const queryParams = new URLSearchParams(location.search);
  const normalizeTab = (tab) => {
    const mapping = {
      orders: "orderhistory",
      overview: "overview",
      address: "address",
    };
    return mapping[tab?.toLowerCase()] || "overview";
  };
// ---- auth presence (ask server, not localStorage) ----
const [isLoggedIn, setIsLoggedIn] = useState(null); // null = unknown

useEffect(() => {
  let isMounted = true;
  (async () => {
    try {
      const r = await axios.get(`${API_BASE_URL}/user/me`, { withCredentials: true });
      if (isMounted) setIsLoggedIn(!!r?.data);
    } catch {
      if (isMounted) setIsLoggedIn(false);
    }
  })();
  return () => { isMounted = false; };
}, []);
  const defaultTab = normalizeTab(queryParams.get("tab"));
  const [activeSection, setActiveSection] = useState(defaultTab);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth > 768 && window.innerWidth <= 1024);

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addressError, setAddressError] = useState("");

  // Order history state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState("");




  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);

useEffect(() => {
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// ADD this helper function:
const getPadding = () => {
  if (windowWidth < 1050) return '1rem';
  if (windowWidth < 1200) return '1.5rem';
  return '2.5rem';
};




// ADD: single source of truth for the whole address
const [newAddress, setNewAddress] = useState({
  address: "",
  city: "",
  region: "",
  postalCode: "",
  country: "New Zealand",
  geometry: null,
});


  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const newTab = new URLSearchParams(location.search).get("tab");
    if (newTab && normalizeTab(newTab) !== activeSection) {
      setActiveSection(normalizeTab(newTab));
    }
  }, [location]);

const fetchOrders = async () => {
  if (!isLoggedIn) { setOrders([]); setOrdersError(""); return; }

  try {
    setLoadingOrders(true);
    setOrdersError("");
    const res = await axios.get(`${API_BASE_URL}/order/all`, { withCredentials: true });
    const orderData = res.data.orders || res.data.data || res.data || [];
    setOrders(Array.isArray(orderData) ? orderData : []);
  } catch (err) {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      // Not authenticated yet → show empty state, no popup
      setOrders([]); 
      setOrdersError("");
    } else if (status === 404) {
      // Some backends return 404 when no orders
      setOrders([]);
      setOrdersError("");
    } else {
      const errorMessage = err.response?.data?.message || "Failed to fetch orders";
      setOrdersError(errorMessage);
      Swal.fire("Error", errorMessage, "error");
    }
  } finally {
    setLoadingOrders(false);
  }
};


const fetchAddresses = async () => {
  try {
    setLoadingAddresses(true);
    const res = await axios.get(`${API_BASE_URL}/address/addresses`, { withCredentials: true });
    console.log("GET /address/addresses response:", res.data);

    const extractAddresses = (data) => {
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.addresses)) return data.addresses;
      if (Array.isArray(data?.data)) return data.data;
      if (data?.address && typeof data.address === "object") return [data.address];
      return [];
    };

    setAddresses(extractAddresses(res.data));
  } catch (err) {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      setAddresses([]);
      setIsLoggedIn(false);
    } else if (status === 404) {
      setAddresses([]);
    } else {
      console.error("Error fetching addresses:", err);
    }
  } finally {
    setLoadingAddresses(false);
  }
};

useEffect(() => {
  if (activeSection === "orderhistory") {
    if (isLoggedIn) fetchOrders();
    else { setOrders([]); setOrdersError(""); }
  }
}, [activeSection, isLoggedIn]);

useEffect(() => {
  if (activeSection === "address") {
    fetchAddresses(); // let fetchAddresses handle 401/403
  }
}, [activeSection]);


  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-NZ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const normalizePrice = (value) => {
    if (value == null || value === "") return 0;
    const n = Number(value);
    if (Number.isNaN(n)) return 0;
    // If integer and large, assume cents
    if (Number.isInteger(n) && Math.abs(n) >= 1000) {
      return n / 100;
    }
    return n;
  };

  const formatCurrency = (amount) => {
    const normalized = normalizePrice(amount);
    return `$${normalized.toFixed(2)}`;
  };

  // optional helper to compute a line total safely (price may be cents)
  const computeLineTotal = (price, qty) => {
    const p = normalizePrice(price);
    const q = Number(qty || 0);
    if (Number.isNaN(q)) return 0;
    return p * q;
  };
const parseMoneyToDollars = (v) => {
  if (v == null || v === "") return 0;
  const n = Number(v);
  if (!isFinite(n)) return 0;
  return n;
};

const computeOrderTotal = (order) => {
  if (!order) return 0;
  // items may be in different fields
  const rawItems = order.orderItems || order.items || order.products || [];
  // 1) items subtotal: prefer lineTotal, otherwise use unitPrice (do NOT multiply by qty)
  const itemsSubtotal = rawItems.reduce((sum, it) => {
    const rawLine = it.lineTotal ?? it.line_total ?? it.total ?? it.subtotal ?? it.amount ?? null;
    const rawUnit = it.unitPrice ?? it.price ?? it.pricePerUnit ?? it.price_unit ?? null;
    const parsedLine = parseMoneyToDollars(rawLine);
    const parsedUnit = parseMoneyToDollars(rawUnit);
    const line = (parsedLine && parsedLine > 0) ? parsedLine : (parsedUnit && parsedUnit > 0 ? parsedUnit : 0);
    return sum + Number(line);
  }, 0);

  // helper to read raw possible fields
  const getRaw = (keys, fallback = 0) => {
    for (const k of keys) {
      if (k !== undefined && k !== null) return k;
    }
    return fallback;
  };

  // 2) shipping / tax / discount with cents heuristic
  const rawShipping = getRaw([order.shippingPrice, order.shipping, order.shipping_amount, order.shipping_price], 0);
  let shipping = parseMoneyToDollars(rawShipping);
  if (Number(rawShipping) >= 100 && !String(rawShipping).includes(".") && itemsSubtotal < 1000) {
    shipping = Number((Number(rawShipping) / 100).toFixed(2));
  }

  const rawTax = getRaw([order.taxPrice, order.tax, order.tax_amount, order.tax_price], 0);
  let tax = parseMoneyToDollars(rawTax);
  if (Number(rawTax) >= 100 && !String(rawTax).includes(".") && itemsSubtotal < 1000) {
    tax = Number((Number(rawTax) / 100).toFixed(2));
  }

  const rawDiscount = getRaw([order.discountAmount, order.discount, order.discount_amount, order.couponDiscount], 0);
  let discount = parseMoneyToDollars(rawDiscount);
  if (Number(rawDiscount) >= 100 && !String(rawDiscount).includes(".") && itemsSubtotal < 1000) {
    discount = Number((Number(rawDiscount) / 100).toFixed(2));
  }

  const total = Number((itemsSubtotal + shipping + tax - discount).toFixed(2));
  return total;
};

// small formatter for computed number totals (use same style as the rest)
const formatCurrencyFromNumber = (num) => {
  const n = Number(num || 0);
  return `$${n.toFixed(2)}`;
};

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': '#ffc107',
      'processing': '#17a2b8',
      'shipped': '#007bff',
      'delivered': '#28a745',
      'cancelled': '#dc3545',
      'completed': '#28a745'
    };
    return statusColors[status?.toLowerCase()] || '#6c757d';
  };

const handleAddAddress = async (e) => {
  e.preventDefault();

  // try to read userId (some backends need it)
  let userId = null;
  try {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    userId = stored?.userId || stored?.id || null;
  } catch {
    userId = null;
  }

  const basePayload = {
    fullName: `${newAddress.firstName || ""} ${newAddress.lastName || ""}`.trim(),
    phone: newAddress.phone,
    country: newAddress.country,
    address: newAddress.address,
    city: newAddress.city || "",
    region: newAddress.region || "",
    postalCode: newAddress.postalCode || "",
    landmark: newAddress.landmark || "",
    addressType: newAddress.addressType || "Home",
    isDefault: !!newAddress.isDefault,
  };

  const postAddress = async (payload) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/address/add`, payload, { withCredentials: true });
      return { ok: true, data: res.data };
    } catch (err) {
      return {
        ok: false,
        status: err?.response?.status ?? null,
        body: err?.response?.data ?? null,
        raw: err,
      };
    }
  };

  // --- try 1: plain payload
  let result = await postAddress(basePayload);
  if (result.ok) {
    const created = result.data?.address || result.data?.data || result.data;
    if (created) setAddresses(prev => [created, ...prev]);     // show instantly

    // reset + close + sync with server
    setNewAddress({
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "",
      region: "",
      postalCode: "",
      landmark: "",
      addressType: "Home",
      isDefault: false,
      country: "New Zealand",
    });
    setAddressError("");
    setShowAddForm(false);
    fetchAddresses();
    Swal.fire("Success", "Address added successfully!", "success");
    return;
  }

  // --- try 2: backend asks for userId explicitly
  const bodyMsg = JSON.stringify(result.body || "");
  if (userId && /userId|user id|userId.*required/i.test(bodyMsg)) {
    result = await postAddress({ ...basePayload, userId });
    if (result.ok) {
      const created = result.data?.address || result.data?.data || result.data;
      if (created) setAddresses(prev => [created, ...prev]);

      setNewAddress({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        city: "",
        region: "",
        postalCode: "",
        landmark: "",
        addressType: "Home",
        isDefault: false,
        country: "New Zealand",
      });
      setAddressError("");
      setShowAddForm(false);
      fetchAddresses();
      Swal.fire("Success", "Address added successfully!", "success");
      return;
    }
  }

  // --- try 3: other common shapes for user field
  if (userId) {
    for (const shape of [
      { ...basePayload, user: userId },
      { ...basePayload, user: { _id: userId } },
    ]) {
      result = await postAddress(shape);
      if (result.ok) {
        const created = result.data?.address || result.data?.data || result.data;
        if (created) setAddresses(prev => [created, ...prev]);

        setNewAddress({
          firstName: "",
          lastName: "",
          phone: "",
          address: "",
          city: "",
          region: "",
          postalCode: "",
          landmark: "",
          addressType: "Home",
          isDefault: false,
          country: "New Zealand",
        });
        setAddressError("");
        setShowAddForm(false);
        fetchAddresses();
        Swal.fire("Success", "Address added successfully!", "success");
        return;
      }
    }
  }

  // --- failed
  const serverMessage =
    (result.body && (result.body.message || result.body.error || JSON.stringify(result.body))) ||
    "Failed to save address. See console for details.";
  setAddressError(serverMessage);
  console.error("Final address save error:", result);
  Swal.fire("Error", "Failed to add address (see error message)", "error");
};

const handleDeleteAddress = async (id) => {
  if (!id) {
    Swal.fire("Error", "Missing address id.", "error");
    return;
  }
  Swal.fire({
    title: "Are you sure?",
    text: "This address will be deleted permanently.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/address/delete/${id}`, { withCredentials: true });
        setAddresses(prev => prev.filter(a => (a._id || a.id) !== id));
        Swal.fire("Deleted!", "Address has been deleted.", "success");
      } catch (err) {
        console.error("Error deleting address:", err);
        Swal.fire("Error", "At least one address is required.", "error");
      }
    }
  });
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
          await fetch(`${API_BASE_URL}/user/logout`, {
            method: "POST",
            credentials: "include",
          });
        } catch (err) {
          console.error("Logout error:", err);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
setIsLoggedIn(false);

        Swal.fire({
          icon: "success",
          title: "Logged Out",
          timer: 1200,
          showConfirmButton: false,
        }).then(() => {
          navigate("/sign-in");
        });
      }
    });
  };

  // Responsive Styles
 const containerStyle = {
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
  gap: isMobile ? "16px" : isTablet ? "20px" : "24px",
  width: "100%",
  maxWidth: "1440px",
  margin: isMobile ? "0 auto" : "0 auto",
  padding: `${isMobile ? "1.5rem" : "1.875rem"} ${getPadding()}`,
  boxSizing: "border-box",
  alignItems: "flex-start"
};

  const sidebarStyle = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: isMobile ? "16px" : "20px",
    width: isMobile ? "100%" : isTablet ? "200px" : "240px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    flexShrink: 0
  };

  const buttonStyle = {
    padding: isMobile ? "14px 16px" : "12px 16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    color: "#333",
    cursor: "pointer",
    whiteSpace: "nowrap",
    width: "100%",
    textAlign: "center",
    transition: "all 0.2s ease-in-out",
    fontSize: isMobile ? "15px" : "14px",
    fontWeight: "500"
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#007BFF",
    color: "#fff",
    fontWeight: "600",
    border: "none",
    boxShadow: "0 2px 6px rgba(0, 123, 255, 0.3)",
  };

  const mainContentStyle = {
    flex: 1,
    padding: isMobile ? "20px 0" : isTablet ? "24px" : "30px",
    minWidth: 0,
    width: "100%"
  };

  const viewButtonStyle = {
    padding: isMobile ? "10px 16px" : "8px 16px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: isMobile ? "15px" : "14px",
    fontWeight: "500",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "all 0.2s ease-in-out",
  };

  const formStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e9ecef',
    borderRadius: '12px',
    padding: isMobile ? '20px' : '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  };

  const inputStyle = {
    width: '100%',
    padding: isMobile ? '14px' : '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: isMobile ? '16px' : '14px',
    marginBottom: '16px',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#333',
    fontSize: isMobile ? '15px' : '14px',
  };
// --- Locked card UI for non-logged users ---
const LockedCard = ({ title }) => (
  <div style={{textAlign:'center', padding:'40px 20px', background:'#f8f9fa',
    border:'2px dashed #dee2e6', borderRadius:'12px'}}>
    
    <div style={{fontSize:'48px', marginBottom:'10px'}}>🔐</div>
    
    <h3 style={{margin:'0 0 10px'}}>{title}</h3>
    <p style={{margin:'0 0 20px', color:'#6c757d'}}>
      Please sign in to continue.
    </p>

    <Link to="/sign-in"
      style={{padding:'12px 20px', background:'#007bff', color:'#fff',
      textDecoration:'none', borderRadius:'8px'}}>
      Sign In
    </Link>
  </div>
);

  return (
         <div style={{ backgroundColor: "#e6f2ff", width: "100%", minHeight: "100vh" }}>

    <div className="responsive-container">
      <Header />
      <div style={containerStyle}>
        {/* Sidebar */}
        <nav style={sidebarStyle}>
          <button
            style={activeSection === "overview" ? activeButtonStyle : buttonStyle}
            onClick={() => setActiveSection("overview")}
          >
            Overview
          </button>
          <button
            style={activeSection === "orderhistory" ? activeButtonStyle : buttonStyle}
            onClick={() => setActiveSection("orderhistory")}
          >
            Order History
          </button>
          <button
            style={activeSection === "address" ? activeButtonStyle : buttonStyle}
            onClick={() => setActiveSection("address")}
          >
            Address Details
          </button>
          <button style={buttonStyle} onClick={handleLogout}>
            Logout
          </button>
        </nav>

        {/* Content */}
        <main style={mainContentStyle}>
          <h2 style={{ 
            fontSize: isMobile ? "22px" : "24px", 
            marginBottom: "20px", 
            textTransform: "capitalize",
            fontWeight: "600"
          }}>
            {activeSection.replace("-", " ")}
          </h2>
          
          {activeSection === "overview" && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: isMobile ? "24px" : "30px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <h2 style={{ fontSize: isMobile ? "20px" : "22px", marginBottom: "16px", color: "#111827" }}>
                👋 Welcome back!
              </h2>
              <p style={{ fontSize: isMobile ? "15px" : "16px", lineHeight: "1.6", color: "#374151" }}>
                From your account dashboard you can easily view your{" "}
                <strong>recent orders</strong>, manage{" "}
                <strong>shipping & billing addresses</strong>, track{" "}
                <strong>returns</strong>, and update your{" "}
                <strong>account details</strong>.
              </p>
            </div>
          )}
          
          {activeSection === "orderhistory" && (
            <div>
              {loadingOrders ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: isMobile ? '40px 20px' : '60px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <div style={{
                      width: isMobile ? '40px' : '48px',
                      height: isMobile ? '40px' : '48px',
                      border: '4px solid #f3f3f3',
                      borderTop: '4px solid #007BFF',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{ margin: 0, color: '#666', fontSize: isMobile ? '15px' : '16px' }}>
                      Loading your orders...
                    </p>
                  </div>
                </div>
              ) : ordersError ? (
                <div style={{
                  textAlign: 'center',
                  padding: isMobile ? '40px 20px' : '60px 20px',
                  backgroundColor: '#fff3cd',
                  borderRadius: '12px',
                  border: '1px solid #ffeaa7'
                }}>
                  <div style={{ fontSize: isMobile ? '40px' : '48px', color: '#856404', marginBottom: '16px' }}>⚠️</div>
                  <h3 style={{ color: '#856404', marginBottom: '8px', fontSize: isMobile ? '18px' : '20px' }}>Unable to Load Orders</h3>
                  <p style={{ color: '#856404', margin: '0 0 20px 0', fontSize: isMobile ? '14px' : '15px' }}>{ordersError}</p>
                  <button 
                    style={{
                      padding: isMobile ? '14px 24px' : '12px 24px',
                      backgroundColor: '#007BFF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: isMobile ? '15px' : '14px',
                      fontWeight: '500'
                    }}
                    onClick={fetchOrders}
                  >
                    Try Again
                  </button>
                </div>
              ) : orders.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: isMobile ? '40px 20px' : '60px 20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  border: '2px dashed #dee2e6'
                }}>
                  <div style={{ fontSize: isMobile ? '56px' : '64px', color: '#6c757d', marginBottom: '20px' }}>📦</div>
                  <h3 style={{ color: '#495057', marginBottom: '12px', fontSize: isMobile ? '20px' : '24px' }}>
                    No Orders Yet
                  </h3>
                  <p style={{ color: '#6c757d', margin: '0 0 24px 0', fontSize: isMobile ? '15px' : '16px' }}>
                    You haven't placed any orders yet. Start shopping to see your order history here!
                  </p>
                  <Link 
                    to="/"
                    style={{
                      padding: isMobile ? '14px 24px' : '12px 24px',
                      backgroundColor: '#007BFF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: isMobile ? '15px' : '16px',
                      fontWeight: '500',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    🛍️ Start Shopping
                  </Link>
                </div>
              ) : (
                <div>
                  <div style={{
                    marginBottom: '24px',
                    padding: isMobile ? '16px' : '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    border: '1px solid #dee2e6'
                  }}>
                    <h3 style={{
                      margin: '0 0 8px 0',
                      color: '#212529',
                      fontSize: isMobile ? '18px' : '20px',
                      fontWeight: '600'
                    }}>
                      📋 Your Order History
                    </h3>
                    <p style={{
                      margin: 0,
                      color: '#6c757d',
                      fontSize: isMobile ? '13px' : '14px'
                    }}>
                      You have <strong>{orders.length}</strong> order{orders.length !== 1 ? 's' : ''} in total
                    </p>
                  </div>

                  {isMobile || isTablet ? (
                    // Mobile/Tablet Card Layout
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {orders.map((order) => (
                        <div key={order._id || order.id} style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e9ecef',
                          borderRadius: '12px',
                          padding: isMobile ? '16px' : '20px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '16px',
                            gap: '12px'
                          }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h4 style={{
                                margin: '0 0 4px 0',
                                fontSize: isMobile ? '15px' : '16px',
                                fontWeight: '600',
                                color: '#212529',
                                wordBreak: 'break-word'
                              }}>
                                #{order.orderNumber || order._id?.slice(-8) || 'N/A'}
                              </h4>
                              <p style={{
                                margin: '0',
                                fontSize: isMobile ? '13px' : '14px',
                                color: '#6c757d'
                              }}>
                                {formatDate(order.createdAt || order.orderDate)}
                              </p>
                            </div>
                            <span style={{
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: isMobile ? '11px' : '12px',
                              fontWeight: '600',
                              textTransform: 'capitalize',
                              backgroundColor: getStatusColor(order.status) + '20',
                              color: getStatusColor(order.status),
                              border: `1px solid ${getStatusColor(order.status)}40`,
                              whiteSpace: 'nowrap',
                              flexShrink: 0
                            }}>
                              {order.status || 'Pending'}
                            </span>
                          </div>
                          
                        <div style={{
  marginBottom: '16px',
  paddingBottom: '16px',
  borderBottom: '1px solid #e9ecef'
}}>
  <p style={{
    margin: '0 0 8px 0',
    fontSize: isMobile ? '13px' : '14px',
    color: '#6c757d'
  }}>
    Items: {order.orderItems?.length || order.items?.length || order.products?.length || 0}
  </p>
  <p style={{
  margin: '0',
  fontSize: isMobile ? '17px' : '18px',
  fontWeight: '700',
  color: '#212529'
}}>
  {formatCurrencyFromNumber(computeOrderTotal(order))}
</p>
</div>
                          
                          <Link 
                            to={`/orders/${order._id || order.id}`}
                            style={viewButtonStyle}
                          >
                            👁️ View Details
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Desktop Table Layout
                    <div style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      border: '1px solid #e9ecef'
                    }}>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          minWidth: '600px'
                        }}>
                          <thead>
                            <tr style={{
                              backgroundColor: '#f8f9fa',
                              borderBottom: '2px solid #dee2e6'
                            }}>
                              <th style={{
                                padding: '16px',
                                textAlign: 'left',
                                fontWeight: '600',
                                color: '#495057',
                                fontSize: '14px'
                              }}>
                                Order ID
                              </th>
                              <th style={{
                                padding: '16px',
                                textAlign: 'left',
                                fontWeight: '600',
                                color: '#495057',
                                fontSize: '14px'
                              }}>
                                Date
                              </th>
                              <th style={{
                                padding: '16px',
                                textAlign: 'left',
                                fontWeight: '600',
                                color: '#495057',
                                fontSize: '14px'
                              }}>
                                Status
                              </th>
                              <th style={{
                                padding: '16px',
                                textAlign: 'left',
                                fontWeight: '600',
                                color: '#495057',
                                fontSize: '14px'
                              }}>
                                Items
                              </th>
                              <th style={{
                                padding: '16px',
                                textAlign: 'right',
                                fontWeight: '600',
                                color: '#495057',
                                fontSize: '14px'
                              }}>
                                Amount
                              </th>
                              <th style={{
                                padding: '16px',
                                textAlign: 'center',
                                fontWeight: '600',
                                color: '#495057',
                                fontSize: '14px'
                              }}>
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((order, index) => (
                              <tr key={order._id || order.id} style={{
                                borderBottom: '1px solid #e9ecef',
                                transition: 'background-color 0.2s ease',
                                backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa'
                              }}>
                                <td style={{
                                  padding: '16px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: '#495057'
                                }}>
                                  #{order.orderNumber || order._id?.slice(-8) || 'N/A'}
                                </td>
                                <td style={{
                                  padding: '16px',
                                  fontSize: '14px',
                                  color: '#6c757d'
                                }}>
                                  {formatDate(order.createdAt || order.orderDate)}
                                </td>
                                <td style={{ padding: '16px' }}>
                                  <span style={{
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    textTransform: 'capitalize',
                                    backgroundColor: getStatusColor(order.status) + '20',
                                    color: getStatusColor(order.status),
                                    border: `1px solid ${getStatusColor(order.status)}40`
                                  }}>
                                    {order.status || 'Pending'}
                                  </span>
                                </td>
                              <td style={{
  padding: '16px',
  fontSize: '14px',
  color: '#6c757d'
}}>
  {order.orderItems?.length || order.items?.length || order.products?.length || 0} item(s)
</td>
                           <td style={{
  padding: '16px',
  fontSize: '16px',
  fontWeight: '700',
  color: '#212529',
  textAlign: 'right'
}}>
  {formatCurrencyFromNumber(computeOrderTotal(order))}
</td>
                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                  <Link 
                                    to={`/orders/${order._id || order.id}`}
                                    style={viewButtonStyle}
                                  >
                                     View
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {activeSection === "address" && (
            <div>
              {showAddForm && (
                <div style={formStyle}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                  }}>
                    <h3 style={{ margin: 0, color: '#333', fontSize: isMobile ? '18px' : '20px' }}>Add New Address</h3>
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#999',
                        padding: '0',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onClick={() => {
                        setShowAddForm(false);
                        setAddressError("");
                      }}
                    >
                      ×
                    </button>
                  </div>
                  
                  {addressError && (
                    <div style={{
                      backgroundColor: '#fee',
                      border: '1px solid #fcc',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '16px',
                      color: '#c33',
                      fontSize: isMobile ? '14px' : '13px'
                    }}>
                      {addressError}
                    </div>
                  )}

<form onSubmit={handleAddAddress}>
  {/* ROW 1: First / Last Name */}
  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
    <div>
      <label style={labelStyle}>First Name *</label>
      <input
        style={inputStyle}
        type="text"
        required
        value={newAddress.firstName || ""}
        onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
        placeholder="Enter first name"
      />
    </div>
    <div>
      <label style={labelStyle}>Last Name *</label>
      <input
        style={inputStyle}
        type="text"
        required
        value={newAddress.lastName || ""}
        onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
        placeholder="Enter last name"
      />
    </div>
  </div>

  {/* ROW 2: Country / Phone */}
  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginTop: '12px' }}>
    <div>
      <label style={labelStyle}>Country *</label>
      <select
        style={inputStyle}
        required
        value={newAddress.country}
        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
      >
        <option value="New Zealand">New Zealand</option>
        <option value="Australia">Australia</option>
      </select>
    </div>

    <div>
      <label style={labelStyle}>Phone Number *</label>
      <input
        style={inputStyle}
        type="tel"
        required
        value={newAddress.phone || ""}
        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
        placeholder="Enter your phone number"
      />
    </div>
  </div>

  {/* ROW 3: Street Address (with autocomplete) */}
  <div style={{ marginTop: '16px', marginBottom: '16px' }}>
    <label style={labelStyle}>Street Address *</label>
    <AddressAutocomplete
      newAddress={newAddress}
      setNewAddress={setNewAddress}
      countryBias={newAddress.country || "New Zealand"}
      style={{ ...inputStyle, marginBottom: 0 }}
    />
  </div>

  {/* ROW 4: City / Region / Postal */}
  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '16px' }}>
    <div>
      <label style={labelStyle}>City</label>
      <input
        style={inputStyle}
        type="text"
        value={newAddress.city || ""}
        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
        placeholder="Enter city"
      />
    </div>
    <div>
      <label style={labelStyle}>Region/State</label>
      <input
        style={inputStyle}
        type="text"
        value={newAddress.region || ""}
        onChange={(e) => setNewAddress({ ...newAddress, region: e.target.value })}
        placeholder="Enter region"
      />
    </div>
    <div>
      <label style={labelStyle}>Postal Code</label>
      <input
        style={inputStyle}
        type="text"
        value={newAddress.postalCode || ""}
        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
        placeholder="Enter postal code"
      />
    </div>
  </div>

{/* FUTURE FIELDS — HIDDEN FOR NOW */}
<div style={{ display: "none" }}>
  {/* Address Type */}
  <div>
    <label style={labelStyle}>Address Type</label>
    <select
      style={{ ...inputStyle }}
      value={newAddress.addressType || "Home"}
      onChange={(e) => setNewAddress({ ...newAddress, addressType: e.target.value })}
      disabled
    >
      <option value="Home">Null</option>
      <option value="Work">Work</option>
      <option value="Other">Other</option>
    </select>
  </div>

  {/* Landmark */}
  <div>
    <label style={labelStyle}>Landmark (Optional)</label>
    <input
      style={{ ...inputStyle }}
      type="text"
      value={newAddress.landmark || ""}
      onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
      placeholder="Enter nearby landmark"
      disabled
    />
  </div>
</div>

  {/* Default checkbox */}
  <div style={{ marginTop: '20px' }}>
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: isMobile ? '15px' : '14px' }}>
      <input
        type="checkbox"
        checked={!!newAddress.isDefault}
        onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
      />
      Set as default address
    </label>
  </div>

  {/* Actions – keep your existing buttons */}
  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '16px' }}>
    <button
      type="button"
      style={{ padding: isMobile ? '14px 24px' : '12px 24px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', color: '#333', cursor: 'pointer', fontSize: isMobile ? '15px' : '14px' }}
      onClick={() => { setShowAddForm(false); setAddressError(""); }}
    >
      Cancel
    </button>
    <button
      type="submit"
      style={{ padding: isMobile ? '14px 24px' : '12px 24px', border: 'none', borderRadius: '8px', backgroundColor: '#28a745', color: 'white', cursor: 'pointer', fontSize: isMobile ? '15px' : '14px', fontWeight: '500' }}
    >
      Save Address
    </button>
  </div>
</form>
                </div>
              )}

              {loadingAddresses ? (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  padding: isMobile ? '40px 20px' : '40px',
                  color: '#666'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      border: '4px solid #f3f3f3',
                      borderTop: '4px solid #007BFF',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{ margin: 0, fontSize: isMobile ? '15px' : '16px' }}>Loading addresses...</p>
                  </div>
                </div>
              ) : addresses.length === 0 && !showAddForm ? (
                <div style={{
                  textAlign: 'center',
                  padding: isMobile ? '40px 20px' : '60px 20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  border: '2px dashed #dee2e6'
                }}>
                  <div style={{
                    fontSize: isMobile ? '40px' : '48px',
                    color: '#6c757d',
                    marginBottom: '16px'
                  }}>📍</div>
                  <h3 style={{
                    color: '#495057',
                    marginBottom: '8px',
                    fontSize: isMobile ? '18px' : '20px'
                  }}>No saved addresses yet</h3>
                  <p style={{
                    color: '#6c757d',
                    margin: '0 0 20px 0',
                    fontSize: isMobile ? '14px' : '15px',
                    padding: isMobile ? '0 10px' : '0'
                  }}>Add your first address to get started with faster checkout</p>
                  <button 
                    style={{
                      padding: isMobile ? '14px 24px' : '12px 24px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: isMobile ? '15px' : '14px',
                      fontWeight: '500',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onClick={() => setShowAddForm(true)}
                  >
                    <span style={{ fontSize: '16px' }}>+</span>
                    Add Your First Address
                  </button>
                </div>
              ) : addresses.length > 0 ? (
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    marginBottom: '24px',
                    flexWrap: 'wrap',
                    gap: '12px',
                    flexDirection: isMobile ? 'column' : 'row'
                  }}>
                    <div style={{ paddingBottom: isMobile ? '0' : '12px', borderBottom: isMobile ? 'none' : '1px solid #eee', flex: 1 }}>
                      <h3
                        style={{
                          margin: 0,
                          color: "#222",
                          fontSize: isMobile ? '18px' : '20px',
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        📍 Saved Addresses <span style={{ color: "#007bff" }}>({addresses.length})</span>
                      </h3>
                      <p
                        style={{
                          margin: "6px 0 0 0",
                          color: "#555",
                          fontSize: isMobile ? '14px' : '15px',
                          lineHeight: "1.5",
                        }}
                      >
                        Manage your <span style={{ fontWeight: 500 }}>shipping</span> and{" "}
                        <span style={{ fontWeight: 500 }}>billing</span> addresses easily.
                      </p>
                    </div>

                    <button 
                      style={{
                        padding: isMobile ? '12px 20px' : '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: isMobile ? '15px' : '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background-color 0.2s',
                        width: isMobile ? '100%' : 'auto',
                        justifyContent: 'center'
                      }}
                      onClick={() => setShowAddForm(true)}
                    >
                      <span style={{ fontSize: '16px' }}>+</span>
                      Add New Address
                    </button>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(auto-fill, minmax(300px, 1fr))' : 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: isMobile ? '16px' : '20px'
                  }}>
                    {addresses.map((addr, index) => (
                      <div key={addr._id || addr.id || `${addr.address}-${index}`} style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e9ecef',
                        borderRadius: '12px',
                        padding: isMobile ? '20px' : '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        transition: 'all 0.2s ease-in-out',
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: isMobile ? '12px' : '16px',
                          right: isMobile ? '12px' : '16px',
                          backgroundColor: index === 0 ? '#007BFF' : '#6c757d',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: isMobile ? '10px' : '11px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {index === 0 ? 'Primary' : `Address ${index + 1}`}
                        </div>

                        <div style={{ marginBottom: '16px', paddingRight: isMobile ? '70px' : '90px' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px'
                          }}>
                            <span style={{ fontSize: isMobile ? '18px' : '20px' }}>👤</span>
                            <h4 style={{
                              margin: 0,
                              fontSize: isMobile ? '16px' : '18px',
                              color: '#333',
                              fontWeight: '600',
                              wordBreak: 'break-word'
                            }}>
                              {addr.fullName}
                            </h4>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#666'
                          }}>
                            <span style={{ fontSize: isMobile ? '14px' : '16px' }}>📞</span>
                            <span style={{ fontSize: isMobile ? '13px' : '14px' }}>{addr.phone}</span>
                          </div>
                        </div>

                        <div style={{
                          backgroundColor: '#f8f9fa',
                          padding: isMobile ? '14px' : '16px',
                          borderRadius: '8px',
                          marginBottom: '20px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px'
                          }}>
                            <span style={{ fontSize: isMobile ? '14px' : '16px', marginTop: '2px' }}>📍</span>
                            <div style={{ fontSize: isMobile ? '13px' : '14px', lineHeight: '1.5', color: '#333' }}>
                              <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                                {addr.address}
                              </div>
                              <div style={{ color: '#666' }}>
                                {addr.city && `${addr.city}, `}{addr.region} {addr.postalCode}
                              </div>
                              <div style={{ 
                                color: '#666',
                                fontWeight: '500',
                                marginTop: '4px'
                              }}>
                                {addr.country}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          gap: '10px',
                          flexWrap: 'wrap'
                        }}>
                          <button
                            style={{
                              flex: 1,
                              minWidth: isMobile ? '100%' : '100px',
                              padding: isMobile ? '12px 16px' : '10px 16px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: isMobile ? '15px' : '14px',
                              fontWeight: '500',
                              transition: 'background-color 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                            onClick={() => handleDeleteAddress(addr._id || addr.id)}
                          >
                            <span>🗑️</span>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
    </div>
  );
};

export default AccountPage;