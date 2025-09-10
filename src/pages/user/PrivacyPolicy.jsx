import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './Home.css';
const PrivacyPolicy = () => {
  return (
    <div className="responsive-container">
               <Header/>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '40px 20px' }}>
        <div
          style={{
            maxWidth: '800px',
            width: '100%',
            backgroundColor: '#fff',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '28px', color: '#333' }}>Privacy Policy</h2>

          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#555' }}>
            At <strong>BlueLink Printing</strong>, we are committed to protecting your privacy in accordance with the New Zealand Privacy Act 2020.
            This Privacy Policy explains how we collect, use, disclose, and protect your personal information.
          </p>

          <Section title="1. Information We Collect" items={[
            "Full name, email address, phone number",
            "Shipping and billing addresses",
            "Order details and purchase history",
            "IP address and device/browser information"
          ]} />

          <Section title="2. How We Use Your Information" items={[
            "Processing orders and delivering products",
            "Providing customer service and account support",
            "Sending order updates, promotional offers, or newsletters",
            "Improving website functionality and user experience"
          ]} />

          <ParagraphSection title="3. Sharing Your Information" content="We do not sell your personal information. We may share your information with trusted third parties for purposes like payment processing, shipping, and marketing — only to the extent necessary." />

          <ParagraphSection title="4. Cookies and Tracking" content="Our website uses cookies and similar technologies to improve your experience and analyse traffic. You can choose to disable cookies through your browser settings." />

          <ParagraphSection title="5. Security" content="We take reasonable steps to protect your personal data from loss, misuse, or unauthorized access. However, no data transmission over the internet is completely secure." />

          <ParagraphSection title="6. Access and Correction" content="Under the New Zealand Privacy Act, you have the right to access and request correction of your personal information at any time." />

          <ParagraphSection title="7. Third-Party Links" content="Our website may contain links to third-party sites. We are not responsible for their privacy practices or content." />

          <ParagraphSection title="8. Changes to This Policy" content="We may update this policy periodically. Any changes will be posted on this page with an updated revision date." />

          <h3 style={{ fontSize: '20px', marginTop: '30px', color: '#333' }}>9. Contact Us</h3>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#555' }}>
            If you have any questions or concerns about this Privacy Policy, please contact us at: <br />
            <strong>Email:</strong> support@bluelinkprinting.co.nz <br />
            <strong>Phone:</strong> +64 9 123 4567
          </p>
        </div>
      </div>
      <Footer />
    </div>
    
  );
};

// Reusable sections
const Section = ({ title, items }) => (
  <>
    <h3 style={{ fontSize: '20px', marginTop: '30px', color: '#333' }}>{title}</h3>
    <ul style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.7' }}>
      {items.map((item, index) => (
        <li key={index} style={{ marginBottom: '8px', fontSize: '16px' }}>{item}</li>
      ))}
    </ul>
  </>
);

const ParagraphSection = ({ title, content }) => (
  <>
    <h3 style={{ fontSize: '20px', marginTop: '30px', color: '#333' }}>{title}</h3>
    <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#555' }}>{content}</p>
  </>
);

export default PrivacyPolicy;
