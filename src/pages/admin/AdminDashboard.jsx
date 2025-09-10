import React, { useState, useEffect } from "react";
import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/AdminSidebar";
import DashboardContent from "./components/DashboardContent";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mainContentStyle = {
    marginTop: "60px",
    marginLeft: window.innerWidth > 768 ? "250px" : "0",
    padding: "20px",
    background: "#f4f4f7",
    minHeight: "100vh",
    transition: "margin-left 0.3s ease",
  };

  return (
    <div>
      <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <AdminSidebar
        active={activeSection}
        setActive={setActiveSection}
        isOpen={sidebarOpen}
        onClose={() => {
          if (window.innerWidth <= 768) setSidebarOpen(false);
        }}
      />
      <div style={mainContentStyle}>
        <DashboardContent activeSection={activeSection} />
      </div>
    </div>
  );
}
