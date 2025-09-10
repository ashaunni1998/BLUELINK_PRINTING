import React, { useState, useEffect } from "react";

export default function AdminHeader({ onToggleSidebar }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const headerStyle = {
    height: "60px",
    backgroundColor: "#1e1e2f",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 1001,
  };

  const leftStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const menuButtonStyle = {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "24px",
    cursor: "pointer",
  };

  const accountWrapperStyle = {
    position: "relative",
  };

  const accountButtonStyle = {
    padding: "5px 10px",
    background: "#4e4ef1",
    border: "none",
    color: "#fff",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const dropdownStyle = {
    position: "absolute",
    top: "40px",
    right: 0,
    background: "#2a2a40",
    borderRadius: "4px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    overflow: "hidden",
    zIndex: 1002,
  };

  const dropdownItem = {
    padding: "10px 20px",
    cursor: "pointer",
    color: "#fff",
    background: "transparent",
    borderBottom: "1px solid #3f3f5e",
  };

  return (
    <div style={headerStyle}>
      <div style={leftStyle}>
        <button style={menuButtonStyle} onClick={onToggleSidebar}>
          ☰
        </button>
        <img src="/assets/logo/logo2.jpg" alt="BlueLink" style={{ width: "120px" }} />
    <div className="d-flex justify-content-center">
  <span className="mx-auto">Welcome Admin!!!!!!!</span>
</div>

      </div>

      {/* Show Account button only on desktop */}
      {!isMobile && (
        <div style={accountWrapperStyle}>
          <button
            style={accountButtonStyle}
            onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
          >
            Account
          </button>
          {accountDropdownOpen && (
            <div style={dropdownStyle}>
              <div style={dropdownItem}>Login</div>
              <div style={dropdownItem}>Logout</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
