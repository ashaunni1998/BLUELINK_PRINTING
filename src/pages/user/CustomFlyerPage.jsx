import React, { useState } from 'react';
import { Check, Rocket, Palette, Zap, Mail, Phone } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
export default function CustomFlyerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: '',
    size: '',
    paperType: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you! We will contact you soon with your custom quote.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      quantity: '',
      size: '',
      paperType: '',
      description: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
             <div style={{ backgroundColor: "#e6f2ff", width: "100%", minHeight: "100vh" }}>

    <div style={styles.container}>
         <div className="responsive-container">
        <Header/>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Custom Flyer Design & Printing
          </h1>
          <p style={styles.heroSubtitle}>
            Create stunning, professional flyers tailored to your exact specifications. 
            From concept to delivery, we bring your vision to life.
          </p>
          <button 
            style={styles.ctaButton}
            onClick={() => document.getElementById('quote-form').scrollIntoView({ behavior: 'smooth' })}
          >
            Get Custom Quote
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Why Choose Custom Flyers?</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.iconWrapper}>
              <Palette size={32} color="#667eea" />
            </div>
            <h3 style={styles.featureTitle}>Fully Customizable</h3>
            <p style={styles.featureText}>
              Choose your size, paper type, finish, colors, and design. 
              We work with your brand guidelines and preferences.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.iconWrapper}>
              <Zap size={32} color="#667eea" />
            </div>
            <h3 style={styles.featureTitle}>Quick Turnaround</h3>
            <p style={styles.featureText}>
              Fast production times without compromising quality. 
              Rush orders available for urgent needs.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.iconWrapper}>
              <Check size={32} color="#667eea" />
            </div>
            <h3 style={styles.featureTitle}>Premium Quality</h3>
            <p style={styles.featureText}>
              High-resolution printing on premium paper stocks. 
              Professional results guaranteed.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.iconWrapper}>
              <Rocket size={32} color="#667eea" />
            </div>
            <h3 style={styles.featureTitle}>Design Support</h3>
            <p style={styles.featureText}>
              Need help with design? Our expert team can create 
              eye-catching layouts that get results.
            </p>
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <div style={styles.specsSection}>
        <h2 style={styles.sectionTitle}>Available Options</h2>
        <div style={styles.specsGrid}>
          <div style={styles.specCard}>
            <h3 style={styles.specTitle}>Sizes</h3>
            <ul style={styles.specList}>
              <li>A4 (8.3" × 11.7")</li>
              <li>A5 (5.8" × 8.3")</li>
              <li>A6 (4.1" × 5.8")</li>
              <li>DL (4.3" × 8.7")</li>
              <li>Custom sizes available</li>
            </ul>
          </div>

          <div style={styles.specCard}>
            <h3 style={styles.specTitle}>Paper Types</h3>
            <ul style={styles.specList}>
              <li>130gsm Gloss</li>
              <li>150gsm Silk</li>
              <li>170gsm Uncoated</li>
              <li>200gsm Matt</li>
              <li>250gsm Premium</li>
            </ul>
          </div>

          <div style={styles.specCard}>
            <h3 style={styles.specTitle}>Finishes</h3>
            <ul style={styles.specList}>
              <li>Gloss Lamination</li>
              <li>Matt Lamination</li>
              <li>Spot UV</li>
              <li>Embossing</li>
              <li>Foil Stamping</li>
            </ul>
          </div>

          <div style={styles.specCard}>
            <h3 style={styles.specTitle}>Quantities</h3>
            <ul style={styles.specList}>
              <li>As low as 50 units</li>
              <li>500 - 1,000 units</li>
              <li>1,000 - 5,000 units</li>
              <li>5,000+ units</li>
              <li>Bulk discounts available</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quote Form Section */}
      <div style={styles.formSection} id="quote-form">
        <h2 style={styles.sectionTitle}>Get Your Custom Quote</h2>
        <p style={styles.formSubtitle}>
          Fill out the form below and we'll get back to you within 24 hours with a detailed quote.
        </p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="John Doe"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="500"
                min="50"
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Preferred Size *</label>
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
                style={styles.select}
              >
                <option value="">Select size</option>
                <option value="A4">A4 (8.3" × 11.7")</option>
                <option value="A5">A5 (5.8" × 8.3")</option>
                <option value="A6">A6 (4.1" × 5.8")</option>
                <option value="DL">DL (4.3" × 8.7")</option>
                <option value="custom">Custom Size</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Paper Type *</label>
              <select
                name="paperType"
                value={formData.paperType}
                onChange={handleChange}
                required
                style={styles.select}
              >
                <option value="">Select paper type</option>
                <option value="130gsm-gloss">130gsm Gloss</option>
                <option value="150gsm-silk">150gsm Silk</option>
                <option value="170gsm-uncoated">170gsm Uncoated</option>
                <option value="200gsm-matt">200gsm Matt</option>
                <option value="250gsm-premium">250gsm Premium</option>
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Project Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              style={styles.textarea}
              placeholder="Tell us about your project. Include details about design requirements, intended use, timeline, and any special requests..."
              rows="5"
            />
          </div>

          <button type="submit" style={styles.submitButton}>
            Request Custom Quote
          </button>
        </form>
      </div>

 
     
      <Footer/>
    </div>
    </div>
    </div>
  );
}

const styles = {

  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
    lineHeight: '1.2',
  },
  heroSubtitle: {
    fontSize: '1.125rem',
    marginBottom: '2rem',
    opacity: '0.95',
    lineHeight: '1.6',
  },
  ctaButton: {
    backgroundColor: '#fff',
    color: '#667eea',
    border: 'none',
    padding: '1rem 2.5rem',
    fontSize: '1.125rem',
    fontWeight: '600',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  section: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '4rem 2rem',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '3rem',
    color: '#1f2937',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  },
  featureCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    textAlign: 'center',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    color: '#1f2937',
  },
  featureText: {
    fontSize: '0.938rem',
    color: '#6b7280',
    lineHeight: '1.6',
  },
  specsSection: {
    backgroundColor: '#fff',
    padding: '4rem 2rem',
  },
  specsGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  },
  specCard: {
    backgroundColor: '#f9fafb',
    padding: '2rem',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb',
  },
  specTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#667eea',
  },
  specList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  formSection: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '4rem 2rem',
  },
  formSubtitle: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: '2rem',
    fontSize: '1rem',
  },
  form: {
    backgroundColor: '#fff',
    padding: '2.5rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.938rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#374151',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    transition: 'border-color 0.2s ease',
    fontFamily: "'Segoe UI', sans-serif",
  },
  select: {
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    transition: 'border-color 0.2s ease',
    backgroundColor: '#fff',
    fontFamily: "'Segoe UI', sans-serif",
  },
  textarea: {
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    transition: 'border-color 0.2s ease',
    resize: 'vertical',
    fontFamily: "'Segoe UI', sans-serif",
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#667eea',
    color: '#fff',
    border: 'none',
    padding: '1rem',
    fontSize: '1.125rem',
    fontWeight: '600',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background-color 0.2s ease',
  },
  contactSection: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
  },
  contactCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  contactTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    margin: '1rem 0 0.5rem',
    color: '#1f2937',
  },
  contactText: {
    fontSize: '1rem',
    color: '#667eea',
    fontWeight: '500',
  },
};