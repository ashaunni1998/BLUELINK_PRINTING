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

  // Load addresses only when Address tab is active
  useEffect(() => {
    if (activeSection === "address") {
      fetchAddresses();
    }
  }, [activeSection]);

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

    // Build base payload (no user info) — backend may use session cookies
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

    // 1) Try posting base payload (no userId) — good when backend uses session
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

    // 4) Still failed — show server error to user and log details
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
    overview:
      "Welcome to your Blue Link Printing dashboard. From your account dashboard you can view your recent orders, manage your shipping and billing addresses, manage your order return, view your orders, and edit your password and account details.",
    orderhistory: "Here you can view and track your orders.",
    address: "Manage your shipping and billing addresses.",
  };

  const orders = [
    { id: "ORD001", product: "Business Cards", date: "2025-07-20", amount: "$49.99" },
    { id: "ORD002", product: "Flyers", date: "2025-07-25", amount: "$89.00" },
    { id: "ORD003", product: "Posters", date: "2025-08-01", amount: "$120.50" },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/sign-in");
    }
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
    padding: "6px 12px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginLeft: "10px",
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
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", flex: 1 }}>
        {/* Sidebar */}
        <nav
          style={{
            backgroundColor: "#f9f9f9",
            width: isMobile ? "100%" : "240px",
            padding: isMobile ? "10px" : "20px",
            borderRight: isMobile ? "none" : "1px solid #ddd",
            borderBottom: isMobile ? "1px solid #ddd" : "none",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
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
        <main style={{ flex: 1, padding: "30px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px", textTransform: "capitalize" }}>
            {activeSection.replace("-", " ")}
          </h2>

          {activeSection === "orderhistory" ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Product Name</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.product}</td>
                      <td>{order.date}</td>
                      <td>{order.amount}</td>
                      <td>
                        <Link to={`/orders/${order.id}`}>
                          <button style={viewButtonStyle}>View</button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                          {/* <button style={{
                            flex: 1,
                            minWidth: '100px',
                            padding: '10px 16px',
                            backgroundColor: '#007BFF',
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
                          }}>
                            <span>✏️</span>
                            Edit
                          </button> */}
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