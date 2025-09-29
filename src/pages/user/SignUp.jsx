// src/pages/user/SignUp.jsx
import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./Home.css";
import { API_BASE_URL, REACT_APP_GOOGLE_CLIENT_ID } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";

/* country options */
const countryOptions = [
  { name: "India", code: "+91" },
  { name: "United States", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "Canada", code: "+1" },
  { name: "France", code: "+33" },
  { name: "Germany", code: "+49" },
  { name: "Italy", code: "+39" },
  { name: "Netherlands", code: "+31" },
  { name: "Spain", code: "+34" },
  { name: "New Zealand", code: "+64" },
];

const tokenEndpoint = `${API_BASE_URL.replace(/\/$/, "")}/auth/google/token`;

function GoogleLoginButton({ clientId = REACT_APP_GOOGLE_CLIENT_ID, onSuccess, onError }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Ensure GSI script present
    if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      const s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client";
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    }

    let mounted = true;

    const tryRender = () => {
      if (!mounted) return;
      if (window.google && window.google.accounts && window.google.accounts.id && containerRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              try {
                const id_token = response?.credential;
                if (!id_token) {
                  onError?.({ ok: false, message: "No id_token received from Google." });
                  return;
                }

                // Post to backend
                const r = await fetch(tokenEndpoint, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id_token }),
                  credentials: "include",
                });

                const body = await r.json();
                if (r.ok) {
                  onSuccess?.(body);
                } else {
                  onError?.(body || { ok: false, message: "Server error" });
                }
              } catch (err) {
                console.error("[GSI] post error:", err);
                onError?.({ ok: false, message: err.message || "Network error" });
              }
            },
            ux_mode: "popup",
          });

          // Render button with increased width; Google's button height responds to `size: "large"`.
          window.google.accounts.id.renderButton(containerRef.current, {
            theme: "outline",
            size: "large",
            type: "standard",
            shape: "rectangular",
            width: 320, // adjust width as needed
          });
        } catch (err) {
          console.error("GSI initialize/render error:", err);
          onError?.({ ok: false, message: err.message || "Google initialization error" });
        }
      } else {
        setTimeout(tryRender, 250);
      }
    };

    tryRender();

    return () => {
      mounted = false;
    };
  }, [clientId, onSuccess, onError]);

  // Wrapper styles provide the rounded-rect / cut-edge look while keeping Google's official button inside.
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          // container shape
          borderRadius: 12,
          padding: 6, // small padding to create inner border feel
          background: "#fff",
          boxShadow: "0 4px 14px rgba(16,24,40,0.06)",
          border: "1px solid rgba(16,24,40,0.06)",
          display: "inline-block",
          transformOrigin: "center",
        }}
      >
        <div
          ref={containerRef}
          style={{
            // Keep the inner Google button from overflowing the rounded border
            overflow: "hidden",
            borderRadius: 10,
            display: "inline-block",
          }}
        />
      </div>
    </div>
  );
}

/* --- SignUp component (main) */
export default function SignUp() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext) || {};

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "New Zealand",
    countryCode: "+64",
    phoneNumber: "",
    newsletter: true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }
    if (name === "country") {
      const selected = countryOptions.find((c) => c.name === value);
      setFormData((prev) => ({
        ...prev,
        country: selected ? selected.name : value,
        countryCode: selected ? selected.code : prev.countryCode,
      }));
      return;
    }
    if (name === "countryCode") {
      const selected = countryOptions.find((c) => c.code === value);
      setFormData((prev) => ({ ...prev, country: selected ? selected.name : prev.country, countryCode: value }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    const phoneDigits = (formData.phoneNumber || "").replace(/[^0-9]/g, "");
    if (!phoneDigits) newErrors.phoneNumber = "Phone number is required";
    else if (phoneDigits.length < 6) newErrors.phoneNumber = "Phone number looks too short";

    // require explicit newsletter consent (as you requested)
    if (!formData.newsletter) newErrors.newsletter = "You must agree to receive occasional newsletters";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        country: formData.country,
        countryCode: formData.countryCode,
        phoneNumber: formData.phoneNumber,
        newsletter: !!formData.newsletter,
      };

      const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          country: "New Zealand",
          countryCode: "+64",
          phoneNumber: "",
          newsletter: true,
        });
        navigate("/emailverification", { state: { email: payload.email } });
      } else {
        if (data.errors) setErrors(data.errors);
        else setErrors({ general: data.message || "Registration failed" });
      }
    } catch (err) {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = (json) => {
    try {
      setIsLoggedIn?.(true);
    } catch (e) {}
    Swal.fire({ icon: "success", title: json?.message || "Signed in with Google", toast: true, position: "top-end", timer: 1400, showConfirmButton: false });
    navigate("/", { replace: true });
  };

  const handleGoogleError = (err) => {
    console.error("Google login error:", err);
    Swal.fire({ icon: "error", title: "Google login failed", text: err?.message || JSON.stringify(err) || "Try again" });
  };

  return (
    <div className="responsive-container">
      <Header />

      <div
        style={{
          // minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // backgroundColor: "#f4f6fb",
          fontFamily: "Inter, Roboto, Arial, sans-serif",
          padding: isMobile ? "20px" : "48px",
        }}
      >
        <div
          style={{
            maxWidth: "680px",
            width: "100%",
            padding: isMobile ? "20px" : "36px",
            borderRadius: "12px",
            background: "#ffffff",
            boxShadow: "0 8px 24px rgba(16,24,40,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <h2 style={{ margin: 0 }}>Create your account</h2>
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              Already have an account?{" "}
              <button onClick={() => navigate("/sign-in")} style={{ background: "transparent", border: "none", color: "#2563eb", cursor: "pointer" }}>
                Sign in
              </button>
            </div>
          </div>

          {errors.general && (
            <div style={{ color: "#b91c1c", marginBottom: 12 }}>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", gap: isMobile ? 12 : 20, flexDirection: isMobile ? "column" : "row", marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600 }}>First name</label>
                <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" style={inputStyle} />
                {errors.firstName && <div style={errorStyle}>{errors.firstName}</div>}
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600 }}>Last name</label>
                <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" style={inputStyle} />
                {errors.lastName && <div style={errorStyle}>{errors.lastName}</div>}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>Email address</label>
              <input name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" style={inputStyle} />
              {errors.email && <div style={errorStyle}>{errors.email}</div>}
            </div>

            <div style={{ display: "flex", gap: isMobile ? 12 : 20, flexDirection: isMobile ? "column" : "row", marginBottom: 12 }}>
              <div style={{ width: isMobile ? "100%" : 180 }}>
                <label style={{ fontSize: 13, fontWeight: 600 }}>Country code</label>
                <select name="countryCode" value={formData.countryCode} onChange={handleChange} style={{ ...inputStyle, padding: "8px 10px" }}>
                  {countryOptions.map((c) => (
                    <option key={c.code + c.name} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600 }}>Phone number</label>
                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="e.g. 211234567" style={inputStyle} />
                {errors.phoneNumber && <div style={errorStyle}>{errors.phoneNumber}</div>}
              </div>
            </div>

            <div style={{ display: "flex", gap: isMobile ? 12 : 20, flexDirection: isMobile ? "column" : "row", marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600 }}>Password</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="At least 6 characters" style={inputStyle} />
                {errors.password && <div style={errorStyle}>{errors.password}</div>}
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600 }}>Confirm password</label>
                <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" style={inputStyle} />
                {errors.confirmPassword && <div style={errorStyle}>{errors.confirmPassword}</div>}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <input id="newsletter" name="newsletter" type="checkbox" checked={formData.newsletter} onChange={handleChange} />
              <label htmlFor="newsletter" style={{ fontSize: 13 }}>
                I agree to receive occasional product updates and newsletters.
              </label>
            </div>

            {errors.newsletter && <div style={{ color: "#b91c1c", marginBottom: 12 }}>{errors.newsletter}</div>}

            <button type="submit" disabled={isSubmitting} style={{ ...primaryButtonStyle, width: "100%" }}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 14, marginBottom: 14, color: "#6b7280" }}>or</div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <GoogleLoginButton clientId={REACT_APP_GOOGLE_CLIENT_ID} onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </div>

          <div style={{ marginTop: 14, fontSize: 12, color: "#9ca3af" }}>
            By creating an account you agree to our <span style={{ color: "#2563eb" }}>Terms</span> and <span style={{ color: "#2563eb" }}>Privacy Policy</span>.
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* styles */
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

const tertiaryButtonStyle = {
  background: "transparent",
  border: "1px dashed #cbd5e1",
  padding: "10px 12px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};
