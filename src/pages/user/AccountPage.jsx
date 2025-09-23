import React, { useState, useEffect, useContext } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config";   // ✅ using your config
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

  // 🔹 Address state
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

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

  // ✅ Fetch addresses
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

  // ✅ Delete address
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
          Swal.fire("Error", "Failed to delete address", "error");
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

  // 🔹 Styles
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
              {loadingAddresses ? (
                <p>Loading addresses...</p>
              ) : addresses.length === 0 ? (
                <p>No saved addresses yet.</p>
              ) : (
                <ul>
                  {addresses.map((addr) => (
                    <li key={addr._id} style={{ marginBottom: "15px" }}>
                      <strong>{addr.fullName}</strong> ({addr.phone}) <br />
                      {addr.street} {addr.streetNumber}, {addr.suburb} <br />
                      {addr.city}, {addr.region} {addr.postalCode} <br />
                      {addr.country}
                      <button
                        style={{ ...viewButtonStyle, backgroundColor: "red" }}
                        onClick={() => handleDeleteAddress(addr._id)}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
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
