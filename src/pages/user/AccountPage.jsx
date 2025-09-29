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

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addressError, setAddressError] = useState("");

  // Order history state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState("");

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
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
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
      console.log("📤 Sending GET /order/all with cookies");
      const res = await axios.get(`${API_BASE_URL}/order/all`, {
        withCredentials: true,
      });
      console.log("📥 Orders response:", res.data);
      
      // Handle different response structures
      const orderData = res.data.orders || res.data.data || res.data || [];
      setOrders(Array.isArray(orderData) ? orderData : []);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      const errorMessage = err.response?.data?.message || "Failed to fetch orders";
      setOrdersError(errorMessage);
      
      // Show error only if it's not a simple "no orders found" case
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
      console.log("📤 Sending GET /address/addresses with cookies");
      const res = await axios.get(`${API_BASE_URL}/address/addresses`, {
        withCredentials: true,
      });
      console.log("📥 Addresses response:", res.data);
      setAddresses(res.data.addresses || []);
    } catch (err) {
      console.error("❌ Error fetching addresses:", err);
      Swal.fire("Error", "Failed to fetch addresses", "error");
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Load orders only when Order History tab is active
  useEffect(() => {
    if (activeSection === "orderhistory") {
      fetchOrders();
    }
  }, [activeSection]);

  // Load addresses only when Address tab is active
  useEffect(() => {
    if (activeSection === "address") {
      fetchAddresses();
    }
  }, [activeSection]);

  // Format date helper
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

  // Format currency helper
  const formatCurrency = (amount) => {
    if (typeof amount === 'number') {
      return `$${amount.toFixed(2)}`;
    }
    if (typeof amount === 'string' && !isNaN(parseFloat(amount))) {
      return `$${parseFloat(amount).toFixed(2)}`;
    }
    return amount;
  };

  // Get order status color
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

  // Add address handler
  const handleAddAddress = async (e) => {
    e.preventDefault();

    // Try to read the logged-in user id from localStorage
    let userId = null;
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      userId = stored?.userId || stored?.id || null;
    } catch (err) {
      userId = null;
    }

    // Build base payload (no user info) – backend may use session cookies
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

    // Helper to post and return response/error
    const postAddress = async (payload) => {
      try {
        const res = await axios.post(`${API_BASE_URL}/address/add`, payload, { withCredentials: true });
        return { ok: true, data: res.data };
      } catch (err) {
        // Normalize axios error shape
        const resp = err?.response;
        const body = resp?.data ?? null;
        const status = resp?.status ?? null;
        return { ok: false, status, body, raw: err };
      }
    };

    // 1) Try posting base payload (no userId) – good when backend uses session
    console.log("Posting address payload (attempt 1, no user):", basePayload);
    let result = await postAddress(basePayload);

    // If success, finish
    if (result.ok) {
      console.log("Address saved (attempt 1):", result.data);
      // reset and fetch addresses
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

    // Clear previous error display
    setAddressError("");

    // 2) If failed, inspect server body for hints
    console.warn("Attempt 1 failed:", result.status, result.body, result.raw?.message ?? result.raw);

    // If server tells that userId is required, try again with userId included
    const bodyMsg = JSON.stringify(result.body || "");
    if (userId && /userId|user id|userId.*required/i.test(bodyMsg)) {
      const payload2 = { ...basePayload, userId };
      console.log("Retrying with userId (attempt 2):", payload2);
      result = await postAddress(payload2);

      if (result.ok) {
        console.log("Address saved (attempt 2):", result.data);
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

      console.warn("Attempt 2 failed:", result.status, result.body, result.raw?.message ?? result.raw);
    }

    // 3) Some backends expect an object like { user: userId } or { user: { _id: userId } }
    if (userId) {
      const tryShapes = [
        { ...basePayload, user: userId },
        { ...basePayload, user: { _id: userId } },
      ];

      for (let i = 0; i < tryShapes.length; i++) {
        console.log(`Retrying with alternate user shape (attempt ${3 + i}):`, tryShapes[i]);
        result = await postAddress(tryShapes[i]);
        if (result.ok) {
          console.log("Address saved (alternate shape):", result.data);
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
        console.warn(`Attempt ${3 + i} failed:`, result.status, result.body, result.raw?.message ?? result.raw);
      }
    }

    // 4) Still failed – show server error to user and log details
    const serverMessage =
      (result.body && (result.body.message || result.body.error || JSON.stringify(result.body))) ||
      "Failed to save address. See console for details.";
    setAddressError(serverMessage);
    console.error("Final address save error:", result);
    Swal.fire("Error", "Failed to add address (see error message)", "error");
  };

  // Delete address with confirmation
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

  const sections = {
    orderhistory: "Here you can view and track your orders.",
    address: "Manage your shipping and billing addresses.",
  };

  // ✅ Updated Logout Handler
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
          // Call backend logout API
          await fetch(`${API_BASE_URL}/user/logout`, {
            method: "POST",
            credentials: "include", // ensure cookies/session cleared
          });
        } catch (err) {
          console.error("Logout error:", err);
        }

        // Use AuthContext's logout if available
        if (typeof logout === "function") {
          logout(); // clears user + localStorage
        } else {
          // fallback cleanup if no logout() in context
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }

        // Show success and redirect
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

  // Styles
  const buttonStyle = {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    color: "#333",
    cursor: "pointer",
    whiteSpace: "nowrap",
    width: isMobile ? "100%" : "auto",
    textAlign: "center",
    transition: "all 0.2s ease-in-out",
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#007BFF",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    boxShadow: "0 2px 6px rgba(0, 123, 255, 0.3)",
  };

  const viewButtonStyle = {
    padding: "8px 16px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.2s ease-in-out",
  };

  const formStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e9ecef',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '16px',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#333',
    fontSize: '14px',
  };

  return (
    <div className="responsive-container">
      <Header />
     <div
  style={{
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "16px" : "22px",
    width: "100%",
    maxWidth: isMobile ? "100%" : "65%",
    margin: "20px auto",
    padding: isMobile ? "0 12px" : "0 20px",
    boxSizing: "border-box",
    alignItems: "flex-start"
  }}
>

        {/* Sidebar */}
        <nav
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "20px",
            width: isMobile ? "100%" : "220px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
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
        <main style={{ flex: 1, padding: "30px",marginRight:"5%" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px", textTransform: "capitalize" }}>
            {activeSection.replace("-", " ")}
          </h2>
          
          <main style={{ flex: 1 }}>
            {activeSection === "overview" && (
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "30px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  marginLeft:"10px",
                }}
              >
                <h2 style={{ fontSize: "22px", marginBottom: "16px", color: "#111827" }}>
                  👋 Welcome back!
                </h2>
                <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#374151" }}>
                  From your account dashboard you can easily view your{" "}
                  <strong>recent orders</strong>, manage{" "}
                  <strong>shipping & billing addresses</strong>, track{" "}
                  <strong>returns</strong>, and update your{" "}
                  <strong>account details</strong>.
                </p>
              </div>
            )}
          </main>
          
          {activeSection === "orderhistory" ? (
            <div>
              {loadingOrders ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '60px',
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
                      width: '48px',
                      height: '48px',
                      border: '4px solid #f3f3f3',
                      borderTop: '4px solid #007BFF',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>
                      Loading your orders...
                    </p>
                  </div>
                </div>
              ) : ordersError ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  backgroundColor: '#fff3cd',
                  borderRadius: '12px',
                  border: '1px solid #ffeaa7'
                }}>
                  <div style={{ fontSize: '48px', color: '#856404', marginBottom: '16px' }}>⚠️</div>
                  <h3 style={{ color: '#856404', marginBottom: '8px' }}>Unable to Load Orders</h3>
                  <p style={{ color: '#856404', margin: '0 0 20px 0' }}>{ordersError}</p>
                  <button 
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#007BFF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
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
                  padding: '60px 20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  border: '2px dashed #dee2e6'
                }}>
                  <div style={{ fontSize: '64px', color: '#6c757d', marginBottom: '20px' }}>📦</div>
                  <h3 style={{ color: '#495057', marginBottom: '12px', fontSize: '24px' }}>
                    No Orders Yet
                  </h3>
                  <p style={{ color: '#6c757d', margin: '0 0 24px 0', fontSize: '16px' }}>
                    You haven't placed any orders yet. Start shopping to see your order history here!
                  </p>
                  <Link 
                    to="/"
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#007BFF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '16px',
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
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    border: '1px solid #dee2e6'
                  }}>
                    <h3 style={{
                      margin: '0 0 8px 0',
                      color: '#212529',
                      fontSize: '20px',
                      fontWeight: '600'
                    }}>
                      📋 Your Order History
                    </h3>
                    <p style={{
                      margin: 0,
                      color: '#6c757d',
                      fontSize: '14px'
                    }}>
                      You have <strong>{orders.length}</strong> order{orders.length !== 1 ? 's' : ''} in total
                    </p>
                  </div>

                  {isMobile ? (
                    // Mobile Card Layout
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {orders.map((order) => (
                        <div key={order._id || order.id} style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e9ecef',
                          borderRadius: '12px',
                          padding: '20px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '16px'
                          }}>
                            <div>
                              <h4 style={{
                                margin: '0 0 4px 0',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#212529'
                              }}>
                                #{order.orderNumber || order._id?.slice(-8) || 'N/A'}
                              </h4>
                              <p style={{
                                margin: '0',
                                fontSize: '14px',
                                color: '#6c757d'
                              }}>
                                {formatDate(order.createdAt || order.orderDate)}
                              </p>
                            </div>
                            <span style={{
                              padding: '4px 12px',
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
                          </div>
                          
                          <div style={{
                            marginBottom: '16px',
                            paddingBottom: '16px',
                            borderBottom: '1px solid #e9ecef'
                          }}>
                            <p style={{
                              margin: '0 0 8px 0',
                              fontSize: '14px',
                              color: '#6c757d'
                            }}>
                              Items: {order.items?.length || order.products?.length || 'N/A'}
                            </p>
                            <p style={{
                              margin: '0',
                              fontSize: '18px',
                              fontWeight: '700',
                              color: '#212529'
                            }}>
                              {formatCurrency(order.totalAmount || order.total || 0)}
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
                                  {order.items?.length || order.products?.length || 'N/A'} item(s)
                                </td>
                                <td style={{
                                  padding: '16px',
                                  fontSize: '16px',
                                  fontWeight: '700',
                                  color: '#212529',
                                  textAlign: 'right'
                                }}>
                                  {formatCurrency(order.totalAmount || order.total || 0)}
                                </td>
                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                  <Link 
                                    to={`/orders/${order._id || order.id}`}
                                    style={viewButtonStyle}
                                  >
                                    👁️ View
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
          ) : activeSection === "address" ? (
            <div>
              {/* Add Address Form */}
              {showAddForm && (
                <div style={formStyle}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                  }}>
                    <h3 style={{ margin: 0, color: '#333' }}>Add New Address</h3>
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#999'
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
                      borderRadius: '4px',
                      padding: '12px',
                      marginBottom: '16px',
                      color: '#c33'
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
                          style={inputStyle}
                          value={newAddress.addressType}
                          onChange={(e) => setNewAddress({...newAddress, addressType: e.target.value})}
                        >
                          <option value="Home">Home</option>
                          <option value="Work">Work</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Landmark (Optional)</label>
                      <input
                        style={inputStyle}
                        type="text"
                        value={newAddress.landmark}
                        onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
                        placeholder="Enter nearby landmark"
                      />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}>
                        <input
                          type="checkbox"
                          checked={newAddress.isDefault}
                          onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                        />
                        Set as default address
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        style={{
                          padding: '12px 24px',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          backgroundColor: '#fff',
                          color: '#333',
                          cursor: 'pointer',
                          fontSize: '14px'
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
                          padding: '12px 24px',
                          border: 'none',
                          borderRadius: '8px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Address List */}
              {loadingAddresses ? (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  padding: '40px',
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
                    <p style={{ margin: 0, fontSize: '16px' }}>Loading addresses...</p>
                  </div>
                </div>
              ) : addresses.length === 0 && !showAddForm ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  border: '2px dashed #dee2e6'
                }}>
                  <div style={{
                    fontSize: '48px',
                    color: '#6c757d',
                    marginBottom: '16px'
                  }}>📍</div>
                  <h3 style={{
                    color: '#495057',
                    marginBottom: '8px',
                    fontSize: '20px'
                  }}>No saved addresses yet</h3>
                  <p style={{
                    color: '#6c757d',
                    margin: '0 0 20px 0',
                    fontSize: '14px'
                  }}>Add your first address to get started with faster checkout</p>
                  <button 
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
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
                    alignItems: 'center',
                    marginBottom: '24px',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                  <div style={{ marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #eee" }}>
  <h3
    style={{
      margin: 0,
      color: "#222",
      fontSize: "20px",
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
      fontSize: "15px",
      lineHeight: "1.5",
    }}
  >
    Manage your <span style={{ fontWeight: 500 }}>shipping</span> and{" "}
    <span style={{ fontWeight: 500 }}>billing</span> addresses easily.
  </p>
</div>

                    <button 
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background-color 0.2s'
                      }}
                      onClick={() => setShowAddForm(true)}
                    >
                      <span style={{ fontSize: '16px' }}>+</span>
                      Add New Address
                    </button>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '20px'
                  }}>
                    {addresses.map((addr, index) => (
                      <div key={addr._id} style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e9ecef',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        transition: 'all 0.2s ease-in-out',
                        position: 'relative'
                      }}>
                        {/* Address Type Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          backgroundColor: index === 0 ? '#007BFF' : '#6c757d',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {index === 0 ? 'Primary' : `Address ${index + 1}`}
                        </div>

                        {/* Name and Phone */}
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px'
                          }}>
                            <span style={{ fontSize: '20px' }}>👤</span>
                            <h4 style={{
                              margin: 0,
                              fontSize: '18px',
                              color: '#333',
                              fontWeight: '600'
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
                            <span style={{ fontSize: '16px' }}>📞</span>
                            <span style={{ fontSize: '14px' }}>{addr.phone}</span>
                          </div>
                        </div>

                        {/* Address */}
                        <div style={{
                          backgroundColor: '#f8f9fa',
                          padding: '16px',
                          borderRadius: '8px',
                          marginBottom: '20px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px'
                          }}>
                            <span style={{ fontSize: '16px', marginTop: '2px' }}>📍</span>
                            <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#333' }}>
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

                        {/* Action Buttons */}
                        <div style={{
                          display: 'flex',
                          gap: '10px',
                          flexWrap: 'wrap'
                        }}>
                          <button
                            style={{
                              flex: 1,
                              minWidth: '100px',
                              padding: '10px 16px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
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

              {/* Add CSS Animation for loading spinner */}
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                  
                  .address-card:hover {
                    box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
                    transform: translateY(-2px) !important;
                  }
                  
                  .action-button:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                  }
                `}
              </style>
            </div>
          ) : (
            <p style={{ color: "#555", fontSize: "16px" }}>{sections[activeSection]}</p>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AccountPage;