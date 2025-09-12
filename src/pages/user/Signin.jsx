import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { jwtDecode } from "jwt-decode";
// import GoogleLogin from "./GoogleLogin";
import './Home.css';
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext"; 
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";



const SignIn = () => {
  const [hasAccount, setHasAccount] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle Google Login callback
  //   window.handleGoogleResponse = (response) => {
  //     const userObject = jwtDecode(response.credential);
  //     console.log("Google User:", userObject);
  //     // Cookies are set in backend; just update logged-in state
  //      setIsLoggedIn(true);
  //     navigate("/dashboard");
  //   };
  
  }, [navigate, setIsLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://kerala-digital-park-server.vercel.app/api/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include", // 👈 important for cookies
        }
      );

      const data = await response.json();

      if (response.ok && data.userData) {
        // Token is in HttpOnly cookie, no need for localStorage
        setIsLoggedIn(true);

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back!",
          timer: 1500,
          toast: true,
          position: "top-end",
          showConfirmButton: false
        }).then(() => {
          navigate("/", { replace: true });
        });
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update logged-in state if cookie changes
  useEffect(() => {
    const handleAuthChange = () => {
      // We cannot read HttpOnly cookie from JS, so rely on backend response
      setIsLoggedIn(true); // assume user is logged in if backend call succeeds
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, [setIsLoggedIn]);

  return (
    <div className="responsive-container">
      <Header />
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h2 style={styles.heading}>Sign in</h2>

          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  name="account"
                  checked={hasAccount}
                  onChange={() => { setHasAccount(true); navigate("/signin"); }}
                />
                <span style={styles.radioLabel}>I have an account</span>
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name="account"
                  checked={!hasAccount}
                  onChange={() => { setHasAccount(false); navigate("/signup"); }}
                />
                <span style={styles.radioLabel}>I don't have an account</span>
              </label>
            </div>

            {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

            <div style={styles.inputGroup}>
              <label>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          {/* 👇 Password with toggle (fixed inside input box) */}
<div style={styles.inputGroup}>
  <label>Password</label>
  <div style={styles.passwordWrapper}>
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      style={styles.passwordInput}
      required
    />
    <span
      onClick={() => setShowPassword(!showPassword)}
      style={styles.eyeIcon}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
</div>


            <a href="/forgotpassword" style={styles.forgotPassword}>
              Forgotten your password?
            </a>
{/* 
            <GoogleLogin /> */}

            <button type="submit" disabled={isSubmitting} style={styles.button}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>

            <p style={styles.disclaimer}>
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="#">Privacy Policy</a> and{" "}
              <a href="#">Terms of Service</a> apply.
            </p>
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
    flexDirection: "row",
    padding: "40px",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "40px",
    flexWrap: "wrap",
  },
  formContainer: {
    border: "1px solid #ddd",
    padding: "30px",
    width: "420px",
    borderRadius: "5px",
  },
  heading: { marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column" },
  radioGroup: { marginBottom: "20px" },
  radioLabel: { marginLeft: "8px" },
  // inputGroup: { marginBottom: "15px" },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginTop: "5px",
  },
  forgotPassword: { fontSize: "13px", color: "blue", textDecoration: "none", marginBottom: "20px" },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
    marginBottom: "20px",
  },
  disclaimer: { fontSize: "12px", color: "#555" },
    inputGroup: { marginBottom: "15px" },

  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  passwordInput: {
    width: "100%",
    padding: "10px 40px 10px 10px", // 👈 add right padding so text doesn't overlap with icon
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginTop: "5px",
  },
  eyeIcon: {
    position: "absolute",
    right: "10px",
    cursor: "pointer",
    color: "#555",
    fontSize: "18px",
  },
};

export default SignIn;
