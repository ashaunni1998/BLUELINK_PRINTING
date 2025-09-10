import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BusinessCardOptions from './BusinessCardOptions';
import './Home.css';

const styles = {
  container: {
    fontFamily: 'sans-serif',
    color: '#333',
    width: '90%', margin: '0 auto' 
  },
  hero: {
    background: 'linear-gradient(to bottom, #c7e9c0, #b0dfb0)',
    textAlign: 'center',
    padding: '60px 20px',
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: 600,
    marginBottom: '16px',
  },
  heroText: {
    fontSize: '18px',
    marginBottom: '24px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
  },
  primaryButton: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: '#000',
    padding: '10px 20px',
    borderRadius: '6px',
    border: '1px solid #000',
    cursor: 'pointer',
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    padding: '16px',
    borderBottom: '1px solid #ddd',
    fontSize: '14px',
    fontWeight: 500,
  },
  tabItem: {
    cursor: 'pointer',
    color: '#333',
  },
  section: {
    padding: '60px 20px',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '40px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    textAlign: 'left',
  },
  cardImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '6px',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '8px',
  },
  cardPrice: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '12px',
  },
  cardList: {
    fontSize: '14px',
    marginBottom: '12px',
    paddingLeft: '20px',
  },
  link: {
    color: '#2c7a7b',
    fontWeight: 500,
    textDecoration: 'none',
  },
};

const sizes = [
  {
    title: 'Standard Postcards',
    price: '25 postcards from $18.00',
    image: '/assets/postcards/Standard1.png',
    link: '#',
  },
  {
    title: 'Square Postcards',
    price: '25 postcards from $18.00',
    image: '/assets/postcards/Standard2.png',
    link: '#',
  },
  {
    title: 'Rack Cards',
    price: '25 postcards from $18.00',
    image: '/assets/postcards/Standard3.png',
    link: '#',
  },
  {
    title: 'Half Page Postcards',
    price: '25 postcards from $18.00',
    image: '/assets/postcards/Standard4.png',
    link: '#',
  },
  {
    title: 'Small Postcards',
    price: '25 postcards from $18.00',
    image: '/assets/postcards/Standard5.png',
    link: '#',
  },
  {
    title: 'Medium Postcards',
    price: '25 postcards from $18.00',
    image: '/assets/postcards/Standard6.png',
    link: '#',
  },
  {
    title: 'Large Postcards',
    price: '25 postcards from $18.00',
    image: '/assets/postcards/Standard7.png',
    link: '#',
  },
   {
    title: 'Large Postcards',
    price: '25 postcards from $18.00',
    image: '/assets/postcards/Standard3.png',
    link: '#',
  },
];

const PostCards = () => {
  return (
    <div className="responsive-container">
      <Header/>

      {/* Hero */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Postcards.<br />For fresh announcements.</h1>
        <p style={styles.heroText}>Get the word out there in a range of sizes and special finishes.</p>
        <div style={styles.buttonGroup}>
          <button style={styles.primaryButton}>Shop Postcards</button>
          <button style={styles.secondaryButton}>Resellers</button>
        </div>
      </section>

      {/* Tabs */}
      <div style={styles.tabs}>
        <div style={styles.tabItem}>Original Postcards</div>
        <div style={styles.tabItem}>Super Postcards</div>
        <div style={styles.tabItem}>Luxe Postcards</div>
        <div style={styles.tabItem}>Foil Postcards</div>
      </div>

      {/* Postcard Types */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Shop & print custom Postcards by paper or foil</h2>
        <div style={styles.cardGrid}>
          <div style={styles.card}>
            <img src="/assets/postcards/template1.jpg" alt="Original" style={styles.cardImage} />
            <h3 style={styles.cardTitle}>Original Postcards</h3>
            <p style={styles.cardPrice}>20 postcards from $18.00</p>
            <ul style={styles.cardList}>
              <li>14 pt recycled paper</li>
              <li>Double-sided color</li>
              <li>Available in all common sizes</li>
            </ul>
            <a href="/cart" style={styles.link}>Add to cart</a>
          </div>

          <div style={styles.card}>
            <img src="/assets/postcards/template2.jpg" alt="Super" style={styles.cardImage} />
            <h3 style={styles.cardTitle}>Super Postcards</h3>
            <p style={styles.cardPrice}>20 postcards from $21.00</p>
            <ul style={styles.cardList}>
              <li>Thicker, premium paper</li>
              <li>Soft touch finish</li>
              <li>Sharp and durable</li>
            </ul>
            <a href="#" style={styles.link}>Shop Super Postcards</a>
          </div>


           <div style={styles.card}>
            <img src="/assets/postcards/template3.jpg" alt="Super" style={styles.cardImage} />
            <h3 style={styles.cardTitle}>Super Postcards</h3>
            <p style={styles.cardPrice}>20 postcards from $21.00</p>
            <ul style={styles.cardList}>
              <li>Thicker, premium paper</li>
              <li>Soft touch finish</li>
              <li>Sharp and durable</li>
            </ul>
            <a href="#" style={styles.link}>Shop Super Postcards</a>
          </div>


           <div style={styles.card}>
            <img src="/assets/postcards/template4.jpg" alt="Super" style={styles.cardImage} />
            <h3 style={styles.cardTitle}>Super Postcards</h3>
            <p style={styles.cardPrice}>20 postcards from $21.00</p>
            <ul style={styles.cardList}>
              <li>Thicker, premium paper</li>
              <li>Soft touch finish</li>
              <li>Sharp and durable</li>
            </ul>
            <a href="#" style={styles.link}>Shop Super Postcards</a>
          </div>


        </div>
      </section>

      {/* Postcards by Size */}
      <section style={{ ...styles.section, backgroundColor: '#fff' }}>
        <h2 style={styles.sectionTitle}>Shop Postcards by Size</h2>
        <div style={styles.cardGrid}>
          {sizes.map((size, index) => (
            <div key={index} style={styles.card}>
              <img src={size.image} alt={size.title} style={styles.cardImage} />
              <h3 style={styles.cardTitle}>{size.title}</h3>
              <p style={styles.cardPrice}>{size.price}</p>
              <a href={size.link} style={styles.link}>Shop {size.title}</a>
            </div>
          ))}
        </div>
      </section>
      <BusinessCardOptions/>
<Footer/>
    </div>
    
  );
};

export default PostCards;
