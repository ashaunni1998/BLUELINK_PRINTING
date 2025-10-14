// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

// exported context — include both names for clarity/backwards-compat
export const AuthContext = createContext({
  user: null,
  isLoggedIn: false,
  setUser: () => {},
  setIsLoggedIn: () => {},
  authLoading: true,
  loading: true, // alias for components expecting `loading`
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedInState] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // helper to set isLoggedIn and persist
  const setIsLoggedIn = (loggedIn) => {
    setIsLoggedInState(loggedIn);
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
          const url = `${API_BASE_URL.replace(/\/$/, "")}/user/me`;
          const res = await fetch(url, {
            method: "GET",
            credentials: "include",
          });

          if (res.ok) {
            const json = await res.json();
            // debug
            console.debug("[AuthContext] /user/me response:", json);

            const u = json.user || json.userData || json || null;

            if (u) {
              setUser(u);
              setIsLoggedIn(true);
            } else {
              setUser(null);
              setIsLoggedIn(false);
            }
          } else {
            setUser(null);
            setIsLoggedIn(false);
          }
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.debug("Auth check error", err);
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setAuthLoading(false);
      }
    })();
  }, []);

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    // optionally call API to invalidate cookie/session
  };

  // Provide both `authLoading` and `loading` so RequireAuth (and any other
  // components) can read either name.
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        authLoading,
        loading: authLoading, // <-- alias required by RequireAuth
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}