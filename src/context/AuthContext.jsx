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
        const persistedAuth = localStorage.getItem("app_is_logged_in");
        const storedUser = localStorage.getItem("user");

        if (persistedAuth === "1" || storedUser) {
          // ✅ verify with server using cookie
          const res = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/user/me`, {
            method: "GET",
            credentials: "include", // browser will send cookie automatically
          });

          if (res.ok) {
            const json = await res.json();
            console.log("[AuthContext] /user/me response:", json);

            const u = json.user || json.userData || json || null;

            if (u) {
              setUser(u);
              setIsLoggedInWithPersistence(true);
            } else {
              setUser(null);
              setIsLoggedInWithPersistence(false);
            }
          } else {
            setUser(null);
            setIsLoggedInWithPersistence(false);
          }
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.debug("Auth check error", err);
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
        setIsLoggedIn: setIsLoggedInWithPersistence,
        authLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
