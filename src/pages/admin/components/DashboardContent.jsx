import React from "react";

export default function DashboardContent({ activeSection }) {
  const contentBox = {
    background: "#fff",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  };

  const dummyContent = {
    "Dashboard": ["Business Cards", "Flyers", "Promo Banner"],
    "Product Management": ["Create Product", "Edit Product"],
    "Category Management": ["Add Category", "List Categories"],
    "Order Management": ["Pending Orders", "Completed Orders"],
    "Customers": ["Customer List", "Feedback"],
    "Reports": ["Sales Report", "Product Report"],
    "Social Media": ["Facebook", "Instagram"],
    "Settings": ["Admin Profile", "Site Config"],
  };

  return (
    <div>
      <h2>{activeSection}</h2>
      {(dummyContent[activeSection] || []).map((item, idx) => (
        <div key={idx} style={contentBox}>
          <h4>{item}</h4>
          <p>This is a dummy card for <strong>{item}</strong>.</p>
        </div>
      ))}
    </div>
  );
}
