import React, { useState, useEffect } from "react";

const menuItems = [
  "Dashboard",
  "Product Management",
  "Category Management",
  "Order Management",
  "Customer Details",
  "Payment Settings",
  "Stock Management",
  "User Management Systems",
  "Custom Reporting Tools",
  "Security Plugins",
  "Reports",
  "Performance Optimization Tools",
  "Social Media",
  "Settings",
];

export default function AdminSidebar({ active, setActive, isOpen, onClose }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setAccountOpen(false); // Hide dropdown if switching to desktop
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarStyle = {
    width: "250px",
    backgroundColor: "#2a2a40",
    color: "#fff",
    height: "100vh",
    position: "fixed",
    top: "60px",
    left: isOpen ? "0" : "-260px",
    overflowY: "auto",
    transition: "left 0.3s ease",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
  };

  const menuItemStyle = (item) => ({
    padding: "15px 20px",
    cursor: "pointer",
    backgroundColor: active === item ? "#3f3f5e" : "transparent",
    borderBottom: "1px solid #3a3a50",
    fontWeight: active === item ? "bold" : "normal",
  });

  return (
    <>
      <div className="hide-scrollbar" style={sidebarStyle}>
        {menuItems.map((item) => (
          <div
            key={item}
            onClick={() => {
              setActive(item);
              onClose();
            }}
            style={menuItemStyle(item)}
          >
            {item}
          </div>
        ))}

        {/* Mobile-only Account Dropdown */}
        {isMobile && (
          <div
            style={{
              marginTop: "auto",
              borderTop: "1px solid #3a3a50",
              padding: "20px",
              cursor: "pointer",
            }}
          >
            <div
              onClick={() => setAccountOpen(!accountOpen)}
              style={{
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              Account
              <span>{accountOpen ? "▲" : "▼"}</span>
            </div>

            {accountOpen && (
              <div style={{ marginTop: "10px" }}>
                <div
                  onClick={() => alert("Login clicked")}
                  style={{ padding: "10px 0" }}
                >
                  Login
                </div>
                <div
                  onClick={() => alert("Logout clicked")}
                  style={{ padding: "10px 0" }}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hide scrollbar with cross-browser support */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </>
  );
}
