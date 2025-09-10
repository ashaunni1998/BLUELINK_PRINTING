import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setMessage("");
  setIsSubmitting(true);

  try {
    const response = await fetch(`https://kerala-digital-park-server.vercel.app/api/user/forgot-password/${email}`, {
      method: "POST",
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setMessage("Password reset instructions have been sent to your email.");
    } else {
      setError(data.message || "Unable to send reset link.");
    }
  } catch (err) {
    setError("Something went wrong. Please try again later.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div style={{ width: "90%" }} className="mx-auto">
      <Header />
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Forgot Password</h2>
          <p style={styles.subtext}>
            Enter your email address and we’ll send you instructions to reset your password.
          </p>

          {message && <p style={styles.success}>{message}</p>}
          {error && <p style={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={styles.input}
            />

            <button type="submit" disabled={isSubmitting} style={styles.button}>
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "50px 20px",
  },
  card: {
    maxWidth: "400px",
    width: "100%",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "10px",
    color: "#007f4f",
  },
  subtext: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginBottom: "15px",
  },
  button: {
    backgroundColor: "#007f4f",
    color: "#fff",
    padding: "10px",
    fontSize: "16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginBottom: "10px",
  },
  success: {
    color: "green",
    fontSize: "13px",
    marginBottom: "10px",
  },
};

export default ForgotPassword;
