import React, { useState, useEffect, useContext } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config";
import axios from "axios";
import Swal from "sweetalert2";
import "./Home.css";

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




  // New address form state
  const [newAddress, setNewAddress] = useState({
    fullName: "",
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

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      setOrdersError("");
      const res = await axios.get(`${API_BASE_URL}/order/all`, {
        withCredentials: true,
      });
      
      const orderData = res.data.orders || res.data.data || res.data || [];
      setOrders(Array.isArray(orderData) ? orderData : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      const errorMessage = err.response?.data?.message || "Failed to fetch orders";
      setOrdersError(errorMessage);
      
      if (err.response?.status !== 404) {
        Swal.fire("Error", errorMessage, "error");
      }
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const res = await axios.get(`${API_BASE_URL}/address/addresses`, {
        withCredentials: true,
      });
      setAddresses(res.data.addresses || []);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      Swal.fire("Error", "Failed to fetch addresses", "error");
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (activeSection === "orderhistory") {
      fetchOrders();
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === "address") {
      fetchAddresses();
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

  const formatCurrency = (amount) => {
    if (typeof amount === 'number') {
      return `$${amount.toFixed(2)}`;
    }
    if (typeof amount === 'string' && !isNaN(parseFloat(amount))) {
      return `$${parseFloat(amount).toFixed(2)}`;
    }
    return amount;
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

    let userId = null;
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      userId = stored?.userId || stored?.id || null;
    } catch (err) {
      userId = null;
    }

    const basePayload = {
      fullName: newAddress.fullName,
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
        const resp = err?.response;
        const body = resp?.data ?? null;
        const status = resp?.status ?? null;
        return { ok: false, status, body, raw: err };
      }
    };

    let result = await postAddress(basePayload);

    if (result.ok) {
      setNewAddress({
        fullName: "",
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

    setAddressError("");

    const bodyMsg = JSON.stringify(result.body || "");
    if (userId && /userId|user id|userId.*required/i.test(bodyMsg)) {
      const payload2 = { ...basePayload, userId };
      result = await postAddress(payload2);

      if (result.ok) {
        setNewAddress({
          fullName: "",
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

    if (userId) {
      const tryShapes = [
        { ...basePayload, user: userId },
        { ...basePayload, user: { _id: userId } },
      ];

      for (let i = 0; i < tryShapes.length; i++) {
        result = await postAddress(tryShapes[i]);
        if (result.ok) {
          setNewAddress({
            fullName: "",
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

    const serverMessage =
      (result.body && (result.body.message || result.body.error || JSON.stringify(result.body))) ||
      "Failed to save address. See console for details.";
    setAddressError(serverMessage);
    console.error("Final address save error:", result);
    Swal.fire("Error", "Failed to add address (see error message)", "error");
  };

  const handleDeleteAddress = async (id) => {
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
          await axios.delete(`${API_BASE_URL}/address/delete/${id}`, {
            withCredentials: true,
          });
          setAddresses(addresses.filter((addr) => addr._id !== id));
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

  return (
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
    {formatCurrency(order.totalPrice || order.totalAmount || order.total || order.grandTotal || 0)}
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
  {formatCurrency(order.totalPrice || order.totalAmount || order.total || order.grandTotal || 0)}
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
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>Full Name *</label>
                        <input
                          style={inputStyle}
                          type="text"
                          required
                          value={newAddress.fullName}
                          onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Phone Number *</label>
                        <input
                          style={inputStyle}
                          type="tel"
                          required
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Street Address *</label>
                      <input
                        style={inputStyle}
                        type="text"
                        required
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                        placeholder="Enter street address"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>City</label>
                        <input
                          style={inputStyle}
                          type="text"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                          placeholder="Enter city"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Region/State</label>
                        <input
                          style={inputStyle}
                          type="text"
                          value={newAddress.region}
                          onChange={(e) => setNewAddress({...newAddress, region: e.target.value})}
                          placeholder="Enter region"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Postal Code</label>
                        <input
                          style={inputStyle}
                          type="text"
                          value={newAddress.postalCode}
                          onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                          placeholder="Enter postal code"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>Country *</label>
                        <select
                          style={inputStyle}
                          required
                          value={newAddress.country}
                          onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                        >
                          <option value="New Zealand">New Zealand</option>
                          <option value="Australia">Australia</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Canada">Canada</option>
                        </select>
                      </div>
                     <div>
  <label style={labelStyle}>Address Type</label>
  <select
    style={{
      ...inputStyle,
      cursor: 'not-allowed',
      opacity: 0.6,
      background: '#f3f4f6'
    }}
    value={newAddress.addressType || "Home"}
    onChange={(e) => setNewAddress({...newAddress, addressType: e.target.value})}
    disabled
  >
    <option value="Home">Null</option>
    <option value="Work">Work</option>
    <option value="Other">Other</option>
  </select>
</div>
                    </div>
<div>
  <label style={labelStyle}>Landmark (Optional)</label>
  <input
    style={{
      ...inputStyle,
      cursor: 'not-allowed',
      opacity: 0.6,
      background: '#f3f4f6'
    }}
    type="text"
    value={newAddress.landmark || ""}
    onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
    placeholder="Enter nearby landmark"
    disabled
  />
</div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontSize: isMobile ? '15px' : '14px'
                      }}>
                        <input
                          type="checkbox"
                          checked={newAddress.isDefault}
                          onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        Set as default address
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        style={{
                          padding: isMobile ? '14px 24px' : '12px 24px',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          backgroundColor: '#fff',
                          color: '#333',
                          cursor: 'pointer',
                          fontSize: isMobile ? '15px' : '14px',
                          minWidth: isMobile ? '120px' : 'auto'
                        }}
                        onClick={() => {
                          setShowAddForm(false);
                          setAddressError("");
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{
                          padding: isMobile ? '14px 24px' : '12px 24px',
                          border: 'none',
                          borderRadius: '8px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: isMobile ? '15px' : '14px',
                          fontWeight: '500',
                          minWidth: isMobile ? '120px' : 'auto'
                        }}
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
                      <div key={addr._id} style={{
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
                            onClick={() => handleDeleteAddress(addr._id)}
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
  );
};

export default AccountPage;