import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

const VerifyOtp = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/user/verifyResetOtp`,
        { email, otp }
      );
      if (res.data.userData && res.data.userData.token) {
        navigate(`/reset-password?token=${encodeURIComponent(res.data.userData.token)}`);
      } else {
        setMessage(res.data.message || "Reset token missing");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Server error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.cardWrapper}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Verify OTP</h2>
          <p style={styles.subtext}>Enter the OTP sent to your email.</p>
          {message && <p style={message.includes("success") ? styles.success : styles.error}>{message}</p>}
          <form onSubmit={handleVerifyOtp} style={styles.form}>
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              style={styles.input}
              required
            />
            <label>OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              style={styles.input}
              required
            />

            <button type="submit" style={styles.button} disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  page: { width: "90%", margin: "0 auto" },
  cardWrapper: { display: "flex", justifyContent: "center", padding: "50px 0" },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "30px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    background: "#fff"
  },
  heading: { fontSize: "24px", marginBottom: "10px", color: "#007f4f" },
  subtext: { fontSize: "14px", color: "#555", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column" },
  input: { padding: "10px", marginBottom: "15px", fontSize: "14px", borderRadius: "4px", border: "1px solid #ccc" },
  button: { padding: "10px", fontSize: "16px", background: "#007f4f", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  error: { color: "red", fontSize: "13px", marginBottom: "10px" },
  success: { color: "green", fontSize: "13px", marginBottom: "10px" }
};

export default VerifyOtp;
