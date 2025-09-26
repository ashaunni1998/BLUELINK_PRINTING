// src/context/PrivateRoute.jsx
import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { isLoggedIn, authLoading } = useContext(AuthContext);

  // while checking auth, you can return null or a loader
  if (authLoading) return null; // or <Spinner />

  return isLoggedIn ? children : <Navigate to="/sign-in" replace />;
}
