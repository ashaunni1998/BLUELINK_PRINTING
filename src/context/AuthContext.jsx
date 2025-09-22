// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

// exported context
export const AuthContext = createContext({
  user: null,
  isLoggedIn: false,
  setUser: () => {},
  setIsLoggedIn: () => {},
  authLoading: true,
  logout: () => {},
});

// provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Custom setIsLoggedIn that also manages localStorage
  const setIsLoggedInWithPersistence = (loggedIn) => {
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      localStorage.setItem("app_is_logged_in", "1");
    } else {
      localStorage.removeItem("app_is_logged_in");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        // Check multiple possible auth indicators
        const persistedAuth = localStorage.getItem("app_is_logged_in");
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        
        // If any auth indicator exists, assume user might be logged in
        if (persistedAuth === "1" || token || storedUser) {
          // Verify with server
          const res = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/user/me`, {
            credentials: "include",
          });

          if (res.ok) {
            const json = await res.json();
            const u = json.user || json.userData || null;
            if (u) {
              setUser(u);
              setIsLoggedInWithPersistence(true);
            } else {
              // Server says not authenticated, clear everything
              setUser(null);
              setIsLoggedInWithPersistence(false);
            }
          } else {
            // Server error or not authenticated, clear everything
            setUser(null);
            setIsLoggedInWithPersistence(false);
          }
        } else {
          // No local auth indicators
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.debug("Auth check error", err);
        // On error, assume not logged in
        setUser(null);
        setIsLoggedInWithPersistence(false);
      } finally {
        setAuthLoading(false);
      }
    })();
  }, []);

  const logout = () => {
    setUser(null);
    setIsLoggedInWithPersistence(false);
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        setUser, 
        isLoggedIn, 
        setIsLoggedIn: setIsLoggedInWithPersistence, // Use the version that manages persistence
        authLoading, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}