import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './Home.css';

const TermsAndCondition = () => {
  return (
    <div className="responsive-container">
             <Header/>
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <h1 style={styles.title}>Terms and Conditions</h1>
          <p style={styles.effective}><strong>Effective Date:</strong> [Insert Date]</p>

          <section style={styles.section}>
            <h2 style={styles.heading}>1. General</h2>
            <p style={styles.text}>These Terms apply to all users of the Blue Link Printing website. By accessing or using our website, you agree to be bound by these Terms. If you do not agree, please do not use our services.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>2. Products and Services</h2>
            <p style={styles.text}>We offer custom printing products including business cards, flyers, postcards, and stationery. All products are printed based on the specifications provided by you during the ordering process.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>3. Orders</h2>
            <p style={styles.text}>Orders must be placed through our website or an authorized representative. You are responsible for checking the accuracy of all order details before submission. Once an order is confirmed, it cannot be modified or cancelled unless explicitly agreed by us.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>4. Pricing and Payment</h2>
            <p style={styles.text}>All prices are listed in New Zealand Dollars (NZD) and include GST unless otherwise stated. Payments must be made in full at the time of ordering via our secure payment gateway. We reserve the right to change pricing without prior notice.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>5. Shipping and Delivery</h2>
            <p style={styles.text}>We offer standard and express delivery options within New Zealand. Estimated delivery times are provided at checkout but are not guaranteed. We are not liable for delays caused by external couriers or unforeseen circumstances.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>6. Returns and Refunds</h2>
            <p style={styles.text}>Due to the custom nature of our products, returns are only accepted for defective or incorrect items. If your order is damaged or incorrect, contact us within 7 days of receiving your order. Approved refunds will be processed to your original payment method.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>7. Intellectual Property</h2>
            <p style={styles.text}>All content on this website including logos, designs, and text is the property of Blue Link Printing. You may not copy, reproduce, or distribute our content without written permission.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>8. User Content</h2>
            <p style={styles.text}>You are responsible for ensuring that any content (images, text, designs) you upload for printing does not infringe on copyright or intellectual property laws. We reserve the right to reject any material we consider offensive, illegal, or inappropriate.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>9. Privacy</h2>
            <p style={styles.text}>
              We respect your privacy and handle your personal data according to our{' '}
              <a href="/privacy-policy" style={styles.link}>Privacy Policy</a>. We comply with the New Zealand Privacy Act 2020.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>10. Limitation of Liability</h2>
            <p style={styles.text}>Our liability is limited to the total amount paid for the relevant product or service. We are not liable for indirect or consequential damages, including loss of business or profits.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>11. Governing Law</h2>
            <p style={styles.text}>These Terms are governed by the laws of New Zealand. Any disputes shall be resolved under the exclusive jurisdiction of New Zealand courts.</p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>12. Contact Us</h2>
            <p style={styles.text}>
              If you have any questions about these Terms, please contact us at:<br />
              📧 <strong>Email:</strong> <a href="mailto:support@bluelinkprinting.co.nz" style={styles.link}>support@bluelinkprinting.co.nz</a><br />
              📞 <strong>Phone:</strong> +64 9 123 4567<br />
              📍 <strong>Address:</strong> Blue Link Printing, 123 Print Street, Auckland 1010, New Zealand
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
    
  );
};

const styles = {
  wrapper: {
    padding: '60px 20px',
    backgroundColor: '#f7f9fc',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
    fontFamily: 'Segoe UI, sans-serif',
    color: '#333',
    lineHeight: '1.7',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '10px',
  },
  effective: {
    textAlign: 'center',
    marginBottom: '40px',
    color: '#666',
  },
  section: {
    marginBottom: '30px',
  },
  heading: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#222',
  },
  text: {
    fontSize: '16px',
  },
  link: {
    color: '#007BFF',
    textDecoration: 'none',
  },
};

export default TermsAndCondition;
