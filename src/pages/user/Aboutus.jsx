import React from 'react';
import { Award, Truck, Users, Leaf, Palette, Clock, CheckCircle, Star } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
const Aboutus = () => {
  const features = [
    {
      icon: <Award size={32} />,
      title: "Premium Quality",
      description: "Top-quality print materials and professional finishes"
    },
    {
      icon: <Clock size={32} />,
      title: "Fast Turnaround",
      description: "Quick processing and reliable delivery options"
    },
    {
      icon: <Users size={32} />,
      title: "Expert Support",
      description: "Responsive team ready to help you succeed"
    },
    {
      icon: <Leaf size={32} />,
      title: "Eco-Friendly",
      description: "Sustainable printing options for conscious businesses"
    }
  ];

  const offerings = [
    "Business Cards & Stationery",
    "Flyers & Postcards",
    "Custom Design Support",
    "Eco-friendly Options",
    "Bulk Order Discounts",
    "Fast Delivery Services"
  ];

  return (
    <div style={{ backgroundColor: "#e6f2ff", width: "100%", minHeight: "100vh" }}>

    <div className="responsive-container">
      <Header/>
    <div style={styles.wrapper}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>About BlueLink Printing</h1>
            <p style={styles.heroSubtitle}>
              Making first impressions last through exceptional print quality
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.container}>
        {/* Story Section */}
        <section style={styles.section}>
          <div style={styles.storyCard}>
            <h2 style={styles.sectionTitle}>Our Story</h2>
            <p style={styles.text}>
              At <strong style={styles.brandName}>BlueLink Printing</strong>, we believe in making first impressions last. Since our inception, we've been committed to delivering high-quality custom printing solutions for businesses of all sizes. From sleek business cards to vibrant flyers, our range of products helps you stand out in a crowded marketplace.
            </p>
            <p style={styles.text}>
              We combine premium materials, innovative technology, and exceptional design to help you showcase your brand professionally and uniquely. Our mission is to empower creativity, support small businesses, and deliver outstanding customer service every step of the way.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Why Choose BlueLink?</h2>
          <div style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} style={styles.featureCard}>
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDesc}>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What We Offer */}
        <section style={styles.section}>
          <div style={styles.offeringsSection}>
            <div style={styles.offeringsLeft}>
              <h2 style={styles.sectionTitle}>What We Offer</h2>
              <p style={styles.text}>
                Comprehensive printing solutions tailored to your business needs. From concept to delivery, we're with you every step of the way.
              </p>
            </div>
            <div style={styles.offeringsRight}>
              <div style={styles.offeringsGrid}>
                {offerings.map((item, index) => (
                  <div key={index} style={styles.offeringItem}>
                    <CheckCircle size={20} style={styles.checkIcon} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section style={styles.statsSection}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>10K+</div>
            <div style={styles.statLabel}>Happy Clients</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>50K+</div>
            <div style={styles.statLabel}>Orders Completed</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>98%</div>
            <div style={styles.statLabel}>Satisfaction Rate</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>24/7</div>
            <div style={styles.statLabel}>Support Available</div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={styles.ctaSection}>
          <div style={styles.ctaCard}>
            <h2 style={styles.ctaTitle}>Ready to Bring Your Vision to Life?</h2>
            <p style={styles.ctaText}>
              Join thousands of professionals who trust BlueLink Printing for their business needs.
            </p>
            <button 
  style={styles.ctaButton} 
  onClick={() => window.location.href = "/"}
>
  Get Started Today
</button>

          </div>
        </section>
      </div>
    </div>
      <Footer/>
    </div>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  },
  hero: {
    position: 'relative',
    height: '400px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroOverlay: {
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    textAlign: 'center',
    color: '#ffffff',
    padding: '0 20px',
    zIndex: 2,
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '800',
    marginBottom: '16px',
    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
    animation: 'fadeInUp 0.8s ease',
  },
  heroSubtitle: {
    fontSize: '20px',
    fontWeight: '400',
    opacity: 0.95,
    maxWidth: '600px',
    margin: '0 auto',
    animation: 'fadeInUp 1s ease',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 20px',
  },
  section: {
    marginBottom: '80px',
  },
  storyCard: {
    background: '#ffffff',
    padding: '50px',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    lineHeight: '1.8',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '30px',
    color: '#1e293b',
    textAlign: 'center',
  },
  text: {
    fontSize: '17px',
    color: '#475569',
    marginBottom: '20px',
    lineHeight: '1.8',
  },
  brandName: {
    color: '#667eea',
    fontWeight: '700',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    marginTop: '40px',
  },
  featureCard: {
    background: '#ffffff',
    padding: '40px 30px',
    borderRadius: '16px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    cursor: 'pointer',
  },
  featureIcon: {
    width: '70px',
    height: '70px',
    margin: '0 auto 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '12px',
  },
  featureDesc: {
    fontSize: '15px',
    color: '#64748b',
    lineHeight: '1.6',
  },
  offeringsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '50px',
    alignItems: 'center',
    background: '#ffffff',
    padding: '50px',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  offeringsLeft: {
    paddingRight: '20px',
  },
  offeringsRight: {},
  offeringsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  offeringItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '16px',
    color: '#334155',
    fontWeight: '500',
  },
  checkIcon: {
    color: '#10b981',
    flexShrink: 0,
  },
  statsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
    marginBottom: '80px',
  },
  statCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 20px',
    borderRadius: '16px',
    textAlign: 'center',
    color: '#ffffff',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
  },
  statNumber: {
    fontSize: '48px',
    fontWeight: '800',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '16px',
    fontWeight: '500',
    opacity: 0.9,
  },
  ctaSection: {
    marginTop: '60px',
  },
  ctaCard: {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    padding: '60px 40px',
    borderRadius: '20px',
    textAlign: 'center',
    color: '#ffffff',
  },
  ctaTitle: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '16px',
  },
  ctaText: {
    fontSize: '18px',
    marginBottom: '30px',
    opacity: 0.9,
  },
  ctaButton: {
    padding: '16px 40px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    background: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)',
  },
};

// Add hover effects with inline style manipulation
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    div[style*="featureCard"]:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15) !important;
    }
    
    button[style*="ctaButton"]:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3) !important;
    }
  `;
  document.head.appendChild(styleSheet);
}

export default Aboutus;