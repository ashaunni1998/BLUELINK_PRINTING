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
        "To place an order, browse our products, customize your item, and proceed to checkout. You’ll need to create an account or sign in before completing your purchase.",
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
        "Once your order ships, you’ll receive a tracking link via email or under 'My Orders' in your account dashboard.",
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
          <h3>Still need help?</h3>
          <p>Contact our customer service team—we're happy to assist you.</p>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:support@bluelinkprinting.com">support@bluelinkprinting.com</a>
          </p>
          <p>
            <strong>Phone:</strong> +91 98765 43210
          </p>
          <p>
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
    padding: "30px 20px",
    maxWidth: "900px",
    margin: "auto",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  faqSection: {
    marginBottom: "40px",
  },
  faqItem: {
    borderBottom: "1px solid #ddd",
    padding: "15px 0",
  },
  question: {
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "500",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  answer: {
    marginTop: "10px",
    fontSize: "16px",
    color: "#555",
  },
  arrow: {
    fontSize: "14px",
  },
  contactBox: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
};

export default HelpAndFaqPage;
