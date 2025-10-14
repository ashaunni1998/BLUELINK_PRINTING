// RequireAuth.jsx (drop-in, adjust import path above as needed)
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

export default function RequireAuth({ children, redirectTo = "/sign-in" }) {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const location = useLocation();

  // debug log — remove for production
  // eslint-disable-next-line no-console
  console.debug("RequireAuth:", { isLoggedIn, loading, path: location.pathname });

  if (loading === true) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return children;
}