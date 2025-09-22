// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

// exported context
export const AuthContext = createContext({
  user: null,
  isLoggedIn: false,
  setUser: () => {},
  setIsLoggedIn: () => {},
  loading: true,
});

// provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Quick optimistic check: if we previously stored the flag, set logged-in immediately
        const persisted = localStorage.getItem("app_is_logged_in");
        if (persisted === "1") {
          setIsLoggedIn(true);
          // we don't set user yet — we'll populate it after /user/me returns
        }

        // Then verify with backend (this will correct state if cookie/token invalid)
        const res = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/user/me`, {
          credentials: "include",
        });

        if (res.ok) {
          const json = await res.json();
          const u = json.user || json.userData || null;
          if (u) {
            setUser(u);
            setIsLoggedIn(true);
          } else {
            // server did not return a user -> clear flag
            setUser(null);
            setIsLoggedIn(false);
            localStorage.removeItem("app_is_logged_in");
          }
        } else {
          // not authenticated server-side
          setUser(null);
          setIsLoggedIn(false);
          localStorage.removeItem("app_is_logged_in");
        }
      } catch (err) {
        // network error -> keep optimistic flag until we know more
        console.debug("Auth check error", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
