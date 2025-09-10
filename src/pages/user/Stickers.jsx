import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './Home.css';

const stickerData = [
  {
    title: 'Metallic Round Stickers',
    description: 'Luxurious metallic finish for standout branding. Perfect for packaging and gifting.',
    price: 'from $20.40',
    button: 'Shop Metallic Stickers',
    image: '/assets/Stationery/stickerimage1.jpg'
  },
  {
    title: 'Coated Paper Round Stickers',
    description: 'Durable and eye-catching, great for both product branding and promotions.',
    price: 'from $10.00',
    button: 'Shop Coated Paper Stickers',
    image: '/assets/Stationery/stickerimage2.jpg'
  },
  {
    title: 'Vinyl Sticker Books',
    description: 'Waterproof, tear-resistant stickers in a handy booklet format.',
    price: 'from $25.00',
    button: 'Shop Sticker Books',
    image: '/assets/Stationery/stickerimage3.jpg'
  },
  {
    title: 'Mate Paper Stickers',
    description: 'Smooth matte finish for subtle elegance, ideal for minimalist designs.',
    price: 'from $15.00',
    button: 'Shop Matte Paper Stickers',
    image: '/assets/Stationery/stickerimage4.jpg'
  }
];

const styles = {
  section: {
    margin: '40px auto',
    padding: '20px',
    maxWidth: '1200px',
    fontFamily: 'sans-serif'
  },
  heading: {
    fontSize: '22px',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '10px'
  },
  subHeading: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#555'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column'
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover'
  },
  content: {
    padding: '15px',
    flexGrow: 1
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  description: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '10px'
  },
  price: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '10px'
  },
  button: {
    backgroundColor: '#00754A',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '0 15px 15px 15px'
  }
};

const Card = ({ item }) => (
  <div style={styles.card}>
    <img src={item.image} alt={item.title} style={styles.image} />
    <div style={styles.content}>
      <div style={styles.title}>{item.title}</div>
      <div style={styles.description}>{item.description}</div>
      <div style={styles.price}>{item.price}</div>
    </div>
    <button style={styles.button}>{item.button}</button>
  </div>
);

const Stickers = () => (
  <div className="responsive-container">
      <Header />

      {/* Hero Banner */}
      <section
        style={{
          backgroundImage: "url('/assets/Stationery/banner-stickers.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '400px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          padding: '60px 40px',
          color: '#fff'
        }}
      >
        {/* <div style={{ maxWidth: '520px', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 20, borderRadius: 8 }}>
          <h1 style={{ fontSize: 36, marginBottom: 12 }}>Stickers & Labels</h1>
          <p style={{ fontSize: 18 }}>
            Add a pop of personality to your packaging or products.
            <br />
            Explore round, rectangular, waterproof, metallic and more sticker options.
          </p>
        </div> */}
      </section>

      {/* Sticker Section */}
      <div style={styles.section}>
        <h2 style={styles.heading}>Explore Our Stickers</h2>
        <p style={styles.subHeading}>Choose from a variety of finishes and formats to match your brand’s personality.</p>
        <div style={styles.grid}>
          {stickerData.map((item, index) => (
            <Card key={index} item={item} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  
);

export default Stickers;
