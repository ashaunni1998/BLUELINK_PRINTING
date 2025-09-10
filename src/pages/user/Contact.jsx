import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './Home.css';

const Contact = () => {
  return (
  <div className="responsive-container">
            <Header/>

      <div style={styles.container}>
        <h1 style={styles.title}>Contact Us</h1>
        <p style={styles.subtitle}>We're here to help. Reach out to us anytime!</p>

        <div style={styles.centerBox}>
          <p style={styles.infoText}>
            <strong>📍 Address:</strong><br />
            45 Print Street, Auckland 1010, New Zealand
          </p>
          <p style={styles.infoText}>
            <strong>📧 Email:</strong><br />
            <a href="mailto:support@bluelinkprint.nz" style={styles.link}>support@bluelinkprint.nz</a>
          </p>
          <p style={styles.infoText}>
            <strong>📞 Phone:</strong><br />
            <a href="tel:+6491234567" style={styles.link}>+64 9 123 4567</a>
          </p>
          <p style={styles.infoText}>
            <strong>⏰ Hours:</strong><br />
            Mon - Fri, 9:00am - 5:00pm (NZDT)
          </p>
        </div>
      </div>

      <Footer />
    </div>
    
  );
};

const styles = {
  container: {
    padding: '40px 20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '36px',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '18px',
    marginBottom: '40px',
    color: '#555',
  },
  centerBox: {
    maxWidth: '500px',
    margin: '0 auto',
    textAlign: 'left',
    background: '#f9f9f9',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
  infoText: {
    fontSize: '16px',
    marginBottom: '20px',
    lineHeight: '1.6',
  },
  link: {
    color: '#007BFF',
    textDecoration: 'none',
  },
};

export default Contact;
