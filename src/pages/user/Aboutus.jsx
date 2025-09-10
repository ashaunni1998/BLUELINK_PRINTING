import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './Home.css';

const Aboutus = () => {
  return (
      <div className="responsive-container">
              <Header/>
      <div style={styles.container}>
        <h1 style={styles.heading}>About BlueLink Printing</h1>
        <p style={styles.text}>
          At <strong>BlueLink Printing</strong>, we believe in making first impressions last. Since our inception, we’ve been committed to delivering high-quality custom printing solutions for businesses of all sizes. From sleek business cards to vibrant flyers, our range of products helps you stand out in a crowded marketplace.
        </p>
        <p style={styles.text}>
          We combine premium materials, innovative technology, and exceptional design to help you showcase your brand professionally and uniquely. Our mission is to empower creativity, support small businesses, and deliver outstanding customer service every step of the way.
        </p>
        <h2 style={styles.subheading}>What We Offer</h2>
        <ul style={styles.list}>
          <li>Business Cards, Flyers, Postcards, and Stationery</li>
          <li>Eco-friendly printing options</li>
          <li>Custom design support</li>
          <li>Fast turnaround and delivery options</li>
        </ul>

        <h2 style={styles.subheading}>Why Choose BlueLink?</h2>
        <ul style={styles.list}>
          <li>Top-quality print materials and finishes</li>
          <li>User-friendly ordering system</li>
          <li>Responsive and helpful support team</li>
          <li>Trusted by thousands of professionals</li>
        </ul>

        <p style={styles.text}>
          Join us on our journey to create stunning print solutions that connect people, build brands, and tell powerful stories — one print at a time.
        </p>
      </div>
      <Footer />
   </div>
   
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '50px auto',
    padding: '20px',
    lineHeight: '1.7',
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  heading: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  subheading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginTop: '30px',
    marginBottom: '10px',
  },
  text: {
    marginBottom: '20px',
  },
  list: {
    paddingLeft: '20px',
    marginBottom: '20px',
  },
};

export default Aboutus;
