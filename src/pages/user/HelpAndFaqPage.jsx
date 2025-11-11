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
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout for faster delivery within 2-3 business days.",
    },
    {
      question: "Do you offer bulk discounts?",
      answer:
        "Yes! We offer competitive pricing for bulk orders. Contact our sales team for a custom quote on orders over 500 units.",
    },
    {
      question: "Can I see a proof before printing?",
      answer:
        "Absolutely! We provide a digital proof for your approval before proceeding with production. You can request revisions if needed.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="responsive-container">
      <Header/>

      <style>{`
        .help-faq-wrapper {
          background: #f5f7fa;
          min-height: 100vh;
        }

        .help-hero-section {
          background: linear-gradient(135deg, rgba(0, 123, 255, 0.95) 0%, rgba(0, 86, 179, 0.95) 100%),
                      url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600') center/cover;
          padding: 5rem 2rem;
          text-align: center;
          color: white;
          position: relative;
        }

        .help-hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.1);
          pointer-events: none;
        }

        .help-hero-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
        }

        .help-hero-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
        }

        .help-hero-subtitle {
          font-size: 1.25rem;
          opacity: 0.95;
          line-height: 1.6;
          margin-bottom: 2.5rem;
          text-shadow: 1px 1px 4px rgba(0,0,0,0.2);
        }

        .help-search-box {
          max-width: 600px;
          margin: 0 auto;
          position: relative;
        }

        .help-search-input {
          width: 100%;
          padding: 1.125rem 1.75rem;
          font-size: 1rem;
          border: none;
          border-radius: 50px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          outline: none;
          transition: box-shadow 0.3s ease;
        }

        .help-search-input:focus {
          box-shadow: 0 8px 32px rgba(0,123,255,0.3);
        }

        .help-content-section {
          background: #f5f7fa;
          padding: 4rem 2rem;
        }

        .help-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .help-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 2rem;
          margin-bottom: 5rem;
        }

        .help-stat-card {
          background: white;
          padding: 2.5rem 2rem;
          border-radius: 1rem;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          transition: all 0.3s ease;
          border: 1px solid #e8eef5;
        }

        .help-stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.12);
          border-color: #007bff;
        }

        .help-stat-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        .help-stat-number {
          font-size: 2.25rem;
          font-weight: 800;
          color: #007bff;
          margin-bottom: 0.5rem;
        }

        .help-stat-label {
          font-size: 0.9375rem;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .help-section-title {
          font-size: 2.25rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 0.75rem;
          color: #1a1a1a;
        }

        .help-section-subtitle {
          text-align: center;
          color: #6c757d;
          margin-bottom: 3.5rem;
          font-size: 1.125rem;
        }

        .faq-grid {
          display: grid;
          gap: 1.25rem;
          margin-bottom: 5rem;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }

        .faq-item {
          background: white;
          border-radius: 0.875rem;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          transition: all 0.3s ease;
          border: 1px solid #e8eef5;
        }

        .faq-item:hover {
          box-shadow: 0 6px 24px rgba(0,0,0,0.1);
          border-color: #007bff;
        }

        .faq-question {
          padding: 1.75rem 2rem;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1a1a;
          transition: all 0.3s ease;
        }

        .faq-question:hover {
          background: #f8f9fa;
          color: #007bff;
        }

        .faq-question-text {
          flex: 1;
          padding-right: 1.5rem;
        }

        .faq-icon {
          width: 36px;
          height: 36px;
          background: #007bff;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .faq-icon.active {
          transform: rotate(180deg);
          background: #0056b3;
        }

        .faq-answer {
          padding: 0 2rem 1.75rem;
          color: #555;
          line-height: 1.8;
          font-size: 1rem;
          animation: slideDown 0.3s ease;
          border-top: 1px solid #f0f2f5;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .contact-section {
          background: white;
          padding: 4rem 2rem;
          border-radius: 1.5rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          border: 1px solid #e8eef5;
        }

        .contact-title {
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: #1a1a1a;
          text-align: center;
        }

        .contact-description {
          font-size: 1.125rem;
          color: #6c757d;
          margin-bottom: 3.5rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          text-align: center;
          line-height: 1.7;
        }

        .contact-methods {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .contact-card {
          background: #f8f9fa;
          padding: 2.5rem 2rem;
          border-radius: 1rem;
          text-align: center;
          transition: all 0.3s ease;
          border: 2px solid #e8eef5;
        }

        .contact-card:hover {
          background: white;
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0,123,255,0.15);
          border-color: #007bff;
        }

        .contact-icon {
          font-size: 3rem;
          margin-bottom: 1.25rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        .contact-label {
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #6c757d;
          margin-bottom: 0.75rem;
          font-weight: 700;
        }

        .contact-value {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1a1a;
        }

        .contact-link {
          color: #007bff;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .contact-link:hover {
          color: #0056b3;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .help-hero-title {
            font-size: 2rem;
          }

          .help-hero-subtitle {
            font-size: 1rem;
          }

          .help-hero-section {
            padding: 3.5rem 1.5rem;
          }

          .help-content-section {
            padding: 3rem 1.5rem;
          }

          .help-section-title {
            font-size: 1.75rem;
          }

          .help-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25rem;
            margin-bottom: 3rem;
          }

          .help-stat-card {
            padding: 2rem 1.25rem;
          }

          .help-stat-icon {
            font-size: 2.5rem;
          }

          .help-stat-number {
            font-size: 1.75rem;
          }

          .faq-question {
            padding: 1.5rem 1.25rem;
            font-size: 1rem;
          }

          .faq-answer {
            padding: 0 1.25rem 1.5rem;
            font-size: 0.9375rem;
          }

          .contact-section {
            padding: 3rem 1.5rem;
          }

          .contact-title {
            font-size: 1.75rem;
          }

          .contact-description {
            font-size: 1rem;
            margin-bottom: 2.5rem;
          }

          .contact-methods {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .contact-card {
            padding: 2rem 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .help-hero-title {
            font-size: 1.75rem;
          }

          .help-stats-grid {
            grid-template-columns: 1fr;
          }

          .help-section-title {
            font-size: 1.5rem;
          }

          .faq-icon {
            width: 32px;
            height: 32px;
            font-size: 1.125rem;
          }
        }
      `}</style>

      <div className="help-faq-wrapper">
        <div className="help-hero-section">
          <div className="help-hero-content">
            <h1 className="help-hero-title">How can we help you?</h1>
            <p className="help-hero-subtitle">
              Find answers to common questions or get in touch with our support team
            </p>
            <div className="help-search-box">
              <input 
                type="text" 
                className="help-search-input" 
                placeholder="Search for answers..."
              />
            </div>
          </div>
        </div>

        <div className="help-content-section">
          <div className="help-container">
            <div className="help-stats-grid">
              <div className="help-stat-card">
                <div className="help-stat-icon">📦</div>
                <div className="help-stat-number">50K+</div>
                <div className="help-stat-label">Orders Delivered</div>
              </div>
              <div className="help-stat-card">
                <div className="help-stat-icon">⭐</div>
                <div className="help-stat-number">4.9/5</div>
                <div className="help-stat-label">Customer Rating</div>
              </div>
              <div className="help-stat-card">
                <div className="help-stat-icon">⚡</div>
                <div className="help-stat-number">24h</div>
                <div className="help-stat-label">Response Time</div>
              </div>
              <div className="help-stat-card">
                <div className="help-stat-icon">🎨</div>
                <div className="help-stat-number">500+</div>
                <div className="help-stat-label">Design Templates</div>
              </div>
            </div>

            <h2 className="help-section-title">Frequently Asked Questions</h2>
            <p className="help-section-subtitle">
              Quick answers to questions you may have
            </p>

            <div className="faq-grid">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <div
                    className="faq-question"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="faq-question-text">{faq.question}</span>
                    <div className={`faq-icon ${activeIndex === index ? 'active' : ''}`}>
                      {activeIndex === index ? '−' : '+'}
                    </div>
                  </div>
                  {activeIndex === index && (
                    <div className="faq-answer">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="contact-section">
              <h3 className="contact-title">Still need assistance?</h3>
              <p className="contact-description">
                Our dedicated support team is here to help you with any questions or concerns
              </p>
              <div className="contact-methods">
                <div className="contact-card">
                  <div className="contact-icon">📧</div>
                  <div className="contact-label">Email Us</div>
                  <div className="contact-value">
                    <a href="mailto:support@bluelinkprinting.com" className="contact-link">
                      support@bluelinkprinting.com
                    </a>
                  </div>
                </div>
                <div className="contact-card">
                  <div className="contact-icon">📞</div>
                  <div className="contact-label">Call Us</div>
                  <div className="contact-value">
                    <a href="tel:+919876543210" className="contact-link">
                      +91 98765 43210
                    </a>
                  </div>
                </div>
                <div className="contact-card">
                  <div className="contact-icon">💬</div>
                  <div className="contact-label">Live Chat</div>
                  <div className="contact-value">Mon–Fri, 9am–6pm IST</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HelpAndFaqPage;