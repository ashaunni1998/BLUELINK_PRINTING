// src/pages/user/SignIn.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./Home.css";
import { API_BASE_URL, REACT_APP_GOOGLE_CLIENT_ID } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
const API = API_BASE_URL.replace(/\/$/, "");

/**
 * SignIn.jsx
 * - Renders Google's official GSI button and handles id_token flow.
 * - Posts id_token to backend at `${API_BASE_URL}/api/auth/google/token`.
 * - Supports email/password login via `${API_BASE_URL}/api/user/login`.
 * - Checks session on mount via `${API_BASE_URL}/api/user/me`.
 */

export default function SignIn() {
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser,isLoggedIn, authLoading } = useContext(AuthContext) || {};

  const googleBtnRef = useRef(null);
  const gsiInitializedRef = useRef(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is already logged in, redirect them
  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [authLoading, isLoggedIn, navigate]);

  // helper to load external script once
  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      if (typeof window === "undefined") return reject(new Error("no window"));
      if (window.google && window.google.accounts) return resolve();
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (existing.getAttribute("data-loaded") === "true") return resolve();
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", (e) => reject(e));
        return;
      }
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.defer = true;
      s.onload = () => {
        s.setAttribute("data-loaded", "true");
        resolve();
      };
      s.onerror = (e) => reject(new Error("Failed to load script: " + (e?.message || e)));
      document.head.appendChild(s);
    });

  const postIdToken = async (id_token) => {
    if (!id_token) return { ok: false, error: "no id_token" };
    const endpoint = `${API}/auth/google/token`;
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token }),
        credentials: "include", // important to receive HttpOnly cookie
      });
      const text = await res.text();
      let body;
      try { body = JSON.parse(text); } catch { body = text; }
      if (!res.ok) return { ok: false, status: res.status, body };
      return { ok: true, status: res.status, body };
    } catch (err) {
      console.error("[SignIn] network error posting id_token:", err);
      return { ok: false, error: err.message || String(err) };
    }
  };

  // callback from Google's GSI when user signs in
  const handleCredentialResponse = async (response) => {
    const id_token = response?.credential;
    if (!id_token) {
      Swal.fire({ icon: "error", title: "Google did not return a credential." });
      return;
    }

    const result = await postIdToken(id_token);
    if (!result.ok) {
      // helpful messages
      const message =
        result.body && typeof result.body === "object"
          ? result.body.message || JSON.stringify(result.body)
          : result.error || result.body || "Login failed";
      console.error("Google login failed:", result);
      Swal.fire({ icon: "error", title: "Google login failed", text: String(message) });
      return;
    }

    // success: backend should have set cookie; update UI
    // ONLY call setIsLoggedIn - let AuthContext handle localStorage
    if (setIsLoggedIn) {
      setIsLoggedIn(true);
    }
    if (setUser && result.body?.userData) {
  setUser(result.body.userData);
  localStorage.setItem("user", JSON.stringify(result.body.userData));
}

    Swal.fire({ 
      icon: "success", 
      title: result.body?.message || "Signed in with Google", 
      toast: true, 
      position: "top-end", 
      timer: 1400, 
      showConfirmButton: false 
    });
    navigate("/", { replace: true });
  };

  // initialize GSI and render button
  const initGsi = async () => {
    const clientId = REACT_APP_GOOGLE_CLIENT_ID || (window && window.__REACT_APP_GOOGLE_CLIENT_ID);
    if (!clientId) {
      console.warn("Google Client ID missing. Set REACT_APP_GOOGLE_CLIENT_ID in config.");
      return;
    }

    try {
      await loadScript("https://accounts.google.com/gsi/client");
    } catch (err) {
      console.error("Failed to load GSI script:", err);
      return;
    }

    if (!window.google || !window.google.accounts) {
      console.warn("window.google.accounts not available after script load.");
      return;
    }

    if (gsiInitializedRef.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      gsiInitializedRef.current = true;
      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signin_with",
        });
      }
    } catch (err) {
      console.error("Error initializing GSI:", err);
    }
  };

  useEffect(() => {
    // Only initialize GSI if not already logged in and auth loading is complete
    if (!authLoading && !isLoggedIn) {
      initGsi();
      // try again shortly if script loads slower
      const t = setTimeout(() => initGsi(), 1500);
      return () => clearTimeout(t);
    }
  }, [authLoading, isLoggedIn]);

  // email/password login
  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok && json.userData) {
        // ONLY call setIsLoggedIn - let AuthContext handle localStorage
        if (setIsLoggedIn) {
          setIsLoggedIn(true);
        }
        if (setUser && json.userData) {
  setUser(json.userData); // save user details in context
  localStorage.setItem("user", JSON.stringify(json.userData));
}

        Swal.fire({ 
          icon: "success", 
          title: "Signed in", 
          toast: true, 
          position: "top-end", 
          timer: 1400, 
          showConfirmButton: false 
        });
        navigate("/", { replace: true });
      } else {
        setErrors({ general: json.message || "Login failed" });
      }
    } catch (err) {
      console.error("SignIn error:", err);
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="responsive-container">
        <Header />
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f4f6fb",
        }}>
          <div>Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  // If already logged in, don't show the form (redirect will happen via useEffect)
  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="responsive-container">
      <Header />

      <div style={{
        // minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "#f4f6fb",
        fontFamily: "Inter, Roboto, Arial, sans-serif",
        padding: "20px",
      }}>
        <div style={{
          maxWidth: "480px",
          width: "100%",
          padding: "32px",
           borderRadius: "12px",
          background: "#ffffff",
           boxShadow: "0 8px 24px rgba(16,24,40,0.08)"
        }}>
          <h2 style={{ margin: 0, marginBottom: 12 }}>Sign in to your account</h2>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 18 }}>
            Don't have an account?{" "}
            <button onClick={() => navigate("/signup")} style={{ background: "transparent", border: "none", color: "#2563eb", cursor: "pointer" }}>
              Sign up
            </button>
          </div>

          {errors.general && <div style={{ color: "#b91c1c", marginBottom: 12 }}>{errors.general}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
              {errors.email && <div style={errorStyle}>{errors.email}</div>}
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" style={{ ...inputStyle, paddingRight: 40 }} />
                <span onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#6b7280" }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && <div style={errorStyle}>{errors.password}</div>}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <a href="/forgotpassword" style={{ fontSize: 13, color: "#2563eb" }}>Forgotten your password?</a>
            </div>

            <button type="submit" disabled={isSubmitting} style={{ ...primaryButtonStyle, width: "100%" }}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 14, marginBottom: 14, color: "#6b7280" }}>or</div>

          {/* Google button placeholder - official Google button will be rendered here */}
          <div ref={googleBtnRef} style={{ marginBottom: 12 }} />

          <div style={{ marginTop: 14, fontSize: 12, color: "#9ca3af" }}>
            This site is protected by reCAPTCHA and the Google <span style={{ color: "#2563eb" }}>Privacy Policy</span> and <span style={{ color: "#2563eb" }}>Terms of Service</span> apply.
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* Styles */
const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: 8,
  border: "1px solid #e6e9ef",
  boxSizing: "border-box",
  marginTop: 6,
  fontSize: 14,
};
const errorStyle = { color: "#b91c1c", fontSize: 13, marginTop: 6 };
const primaryButtonStyle = {
  background: "#2563eb",
  color: "white",
  padding: "12px 16px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};