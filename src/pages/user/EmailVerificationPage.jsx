import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Swal from 'sweetalert2';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const EmailVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const hasSentOtp = useRef(false); // ✅ Prevent multiple sends in Strict Mode

  const email = location.state?.email || '';
const { setIsLoggedIn } = useContext(AuthContext);

  // Function to send OTP
  const sendOtp = async () => {
    if (!email) return;

    try {
      const res = await fetch('https://kerala-digital-park-server.vercel.app/api/user/sendVerifyOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        console.error('OTP not sent:', data.message);
      }
    } catch (err) {
      console.error('Failed to send OTP on load:', err);
    }
  };

  // ✅ Send OTP only once
  useEffect(() => {
    if (!email || hasSentOtp.current) return;
    hasSentOtp.current = true;
    sendOtp();
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.trim().length !== 6) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid OTP',
        text: 'Please enter a valid 6-digit OTP.'
      });
      return;
    }

    try {
      const response = await fetch('https://kerala-digital-park-server.vercel.app/api/user/verifyOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

if (response.ok) {
  // ✅ Store token/user if backend returns them
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  if (data.userData) {
    localStorage.setItem("user", JSON.stringify(data.userData));
  }

  // ✅ Update AuthContext immediately
  setIsLoggedIn(true);

  Swal.fire({
    icon: 'success',
    title: 'OTP verified successfully!',
    timer: 1500,
    showConfirmButton: false
  }).then(() => {
    navigate('/'); // ✅ Go to home page
  });
}

       else {
        Swal.fire({
          icon: 'error',
          title: 'Verification Failed',
          text: data.message || 'OTP is not valid.'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Something went wrong. Please try again later.'
      });
      console.error('OTP verification error:', err);
    }
  };

  const handleResend = async () => {
    if (resendDisabled || !email) return;

    setResendDisabled(true);

    try {
      const res = await fetch('https://kerala-digital-park-server.vercel.app/api/user/sendVerifyOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        Swal.fire({
          icon: 'info',
          title: 'OTP Resent',
          text: 'OTP has been resent to your email.',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: data.message || 'Failed to resend OTP.'
        });
      }
    } catch (err) {
      console.error('Resend error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong while resending the OTP.'
      });
    }

    setTimeout(() => setResendDisabled(false), 30000);
  };

  // ⬇️ All your original styles kept exactly the same
  const styles = {
    page: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '20px',
      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
      padding: '40px 30px',
      maxWidth: '400px',
      width: '100%',
      transition: 'all 0.3s ease-in-out',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1d4ed8',
      textAlign: 'center',
      marginBottom: '10px',
    },
    description: {
      color: '#555',
      textAlign: 'center',
      fontSize: '14px',
      marginBottom: '25px',
      lineHeight: '1.6',
    },
    input: {
      width: '100%',
      padding: '14px 18px',
      fontSize: '18px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      textAlign: 'center',
      letterSpacing: '5px',
      outline: 'none',
      marginBottom: '10px',
    },
    error: {
      color: 'red',
      fontSize: '13px',
      textAlign: 'center',
      marginBottom: '10px',
    },
    button: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#2563eb',
      color: '#fff',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    resend: {
      marginTop: '20px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#666',
    },
    resendLink: {
      color: '#2563eb',
      textDecoration: 'underline',
      cursor: 'pointer',
      marginLeft: '4px',
      background: 'none',
      border: 'none',
      padding: 0,
    },
  };

  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      <div style={{ width: '90%', margin: '0 auto' }}>
        <div style={styles.page}>
          <Header />
          <div style={styles.card}>
            <h2 style={styles.title}>Email Verification</h2>
            <p style={styles.description}>
              We’ve sent a 6-digit code to <strong>{email}</strong>. <br />
              Please enter it below to verify your account.
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                style={styles.input}
                maxLength={6}
              />
              {error && <p style={styles.error}>{error}</p>}

              <button type="submit" style={styles.button}>
                Verify & Continue
              </button>
            </form>

            <div style={styles.resend}>
              Didn’t get the code?
              <button
                type="button"
                onClick={handleResend}
                disabled={resendDisabled}
                style={{
                  ...styles.resendLink,
                  ...(resendDisabled ? styles.buttonDisabled : {}),
                }}
              >
                Resend
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default EmailVerificationPage;
