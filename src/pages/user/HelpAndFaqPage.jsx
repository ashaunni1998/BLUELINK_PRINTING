import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import './Home.css'

const HelpAndFaqPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "To place an order, browse our products, customize your item, and proceed to checkout. You'll need to create an account or sign in before completing your purchase.",
    },
    {
      question: "Can I cancel or modify my order?",
      answer:
        "Orders can only be modified or canceled within 1 hour of placing them. Please contact our support team immediately for assistance.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept major credit cards (Visa, Mastercard, American Express), UPI, NetBanking, and PayPal.",
    },
    {
      question: "How do I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking link via email or under 'My Orders' in your account dashboard.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer reprints or refunds for damaged or incorrect items. Contact us within 7 days of delivery with your order number and a photo of the issue.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="responsive-container">
      <Header/>

      <div style={styles.container}>
        <h2 style={styles.heading}>Help & FAQs</h2>
        <p style={styles.subheading}>
          Find answers to common questions about ordering, shipping, and our services.
        </p>

        <div style={styles.faqSection}>
          {faqs.map((faq, index) => (
            <div key={index} style={styles.faqItem}>
              <div
                style={styles.question}
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <span style={styles.arrow}>
                  {activeIndex === index ? "▲" : "▼"}
                </span>
              </div>
              {activeIndex === index && (
                <div style={styles.answer}>{faq.answer}</div>
              )}
            </div>
          ))}
        </div>

        <div style={styles.contactBox}>
          <h3 style={styles.contactHeading}>Still need help?</h3>
          <p style={styles.contactText}>Contact our customer service team—we're happy to assist you.</p>
          <p style={styles.contactInfo}>
            <strong>Email:</strong>{" "}
            <a href="mailto:support@bluelinkprinting.com" style={styles.link}>
              support@bluelinkprinting.com
            </a>
          </p>
          <p style={styles.contactInfo}>
            <strong>Phone:</strong> +91 98765 43210
          </p>
          <p style={styles.contactInfo}>
            <strong>Live Chat:</strong> Available Mon–Fri, 9am–6pm IST
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const styles = {
  container: {
    // backgroundColor: "#f5f8f6",
    padding: "1.875rem 0 2.5rem",
    marginLeft: "6%",
    marginRight: "9%",
  },
  heading: {
    fontSize: "32px",
    marginBottom: "12px",
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
  },
  subheading: {
    fontSize: "17px",
    color: "#555",
    marginBottom: "50px",
    maxWidth: "700px",
    marginInline: "auto",
    lineHeight: "1.6",
    textAlign: "center",
  },
  faqSection: {
    maxWidth: "72%",
    margin: "0 auto 40px",
    backgroundColor: "#fff",
    borderRadius: "0.375rem",
    padding: "20px",
    boxShadow: "0 0.0625rem 0.375rem rgba(0,0,0,0.07)",
  },
  faqItem: {
    borderBottom: "1px solid #eee",
    padding: "15px 0",
  },
  question: {
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "500",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#111",
  },
  answer: {
    marginTop: "10px",
    fontSize: "16px",
    color: "#555",
    lineHeight: "1.6",
  },
  arrow: {
    fontSize: "14px",
    color: "#007abf",
  },
  contactBox: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "0.375rem",
    boxShadow: "0 0.0625rem 0.375rem rgba(0,0,0,0.07)",
    maxWidth: "72%",
    margin: "0 auto",
  },
  contactHeading: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111",
    marginBottom: "12px",
  },
  contactText: {
    fontSize: "17px",
    color: "#555",
    marginBottom: "20px",
    lineHeight: "1.6",
  },
  contactInfo: {
    fontSize: "16px",
    color: "#444",
    marginBottom: "10px",
    lineHeight: "1.6",
  },
  link: {
    color: "#007abf",
    textDecoration: "none",
  },
};

export default HelpAndFaqPage;