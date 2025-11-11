import React from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react"; // optional icon if you’re using lucide-react

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(180deg, #e8f0ff 0%, #f9fbff 100%)",
        textAlign: "center",
        padding: "24px",
      }}
    >
      <h1
        style={{
          fontSize: "96px",
          fontWeight: "700",
          color: "#007bff",
          marginBottom: "16px",
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "600",
          color: "#1a1a1a",
          marginBottom: "8px",
        }}
      >
        Oops! Page not found
      </h2>
      <p
        style={{
          fontSize: "16px",
          color: "#555",
          maxWidth: "480px",
          marginBottom: "32px",
        }}
      >
        The page you’re looking for doesn’t exist or may have been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          padding: "12px 24px",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          transition: "background 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#0069d9")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
      >
        <Home size={18} />
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
