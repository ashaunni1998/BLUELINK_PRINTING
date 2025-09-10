import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './Home.css';

const stationeryData = {
  customBusiness: [
    { 
      title: 'Stickers and Labels',
      description: 'Add a pop of personality to your product and packaging with Sticker materials in classic vinyl or curved corners.',
      price: 'from $10.00',
      button: 'Shop Stickers and Labels',
      image: '/assets/Stationery/image1.jpg'
    },
    {
      title: 'MOOD Notebooks',
      description: 'With a clean edge design and signature MOOD quality, this sustainable custom Notebook is perfect for bulk drops.',
      price: 'from $12.75 per item',
      button: 'Shop MOOD Notebooks',
      image: '/assets/Stationery/image2.jpg'
    },
    {
      title: 'Greeting Cards',
      description: 'Create a personal pack of Greeting Cards for clients, friends or family and share them any way you like.',
      price: '25 greeting cards from $40.00',
      button: 'Shop Greeting Cards',
      image: '/assets/Stationery/image3.jpg'
    },
    {
      title: 'Letterheads',
      description: 'Custom business stationery available in Original and Luxe paper stocks.',
      price: '50 sheets from $40.00',
      button: 'Shop Letterheads',
      image: '/assets/Stationery/image4.jpg'
    },
    {
      title: 'Luxe Notecards',
      description: 'Write only in handwritten words with Luxe thick-card stock and Nordeska prints perfect for client gifts.',
      price: '10 notecards from $32.00',
      button: 'Shop Luxe Notecards',
      image: '/assets/Stationery/image5.jpg'
    },
    {
      title: 'Envelopes',
      description: 'Send your personal products in style with premium Envelopes in all colors and stocks.',
      price: '25 envelopes from $40.00',
      button: 'Shop Envelopes',
      image: '/assets/Stationery/image6.jpg'
    }
  ],
  personalizedDesk: [
    {
      title: 'MOOD Softcover Notebooks',
      description: 'A premium Notebook with a proudly soft cover. It’s perfect for planning your next big idea.',
      price: 'from $10.00 per item',
      button: 'Shop MOOD Softcover Notebooks',
      image: '/assets/Stationery/image7.jpg'
    },
    {
      title: 'Tape Bound Notebooks',
      description: 'A simple, premium Notebook – with a bookcloth spine for added touch.',
      price: 'from $7.25 per item',
      button: 'Shop Tape Bound Notebooks',
      image: '/assets/Stationery/image13.jpg'
    },
    {
      title: 'Softcover Journals',
      description: 'Design your own Journal filled with custom features. Just choose the size or create it all.',
      price: 'from $8.50 per item',
      button: 'Shop Softcover Journals',
      image: '/assets/Stationery/image9.jpg'
    },
    {
      title: 'MOOD Hardcover Notebooks',
      description: 'Add pages that do more. A truly flexible design that’s customized front to back.',
      price: 'from $22.00 per item',
      button: 'Shop Hardcover Notebooks',
      image: '/assets/Stationery/image10.jpg'
    },
    {
      title: 'MOOD Perpetual Planners',
      description: 'A flexible planner designed for focus. Featuring weekly layout for long-term planning.',
      price: 'from $24.00 per item',
      button: 'Shop MOOD Perpetual Planners',
      image: '/assets/Stationery/image11.jpg'
    },
    {
      title: 'MOOD Softcover Planners',
      description: 'Plan big with the seriously popular MOOD Softcover Planner in colors and designs for your desk.',
      price: 'from $20.00 per item',
      button: 'Shop MOOD Softcover Planners',
      image: '/assets/Stationery/image12.jpg'
    },
    {
      title: 'Display Books',
      description: 'Keep memories organized and neatly stored. Available in three sizes.',
      price: 'from $20.00 per item',
      button: 'Shop Display Books',
      image: '/assets/Stationery/image13.jpg'
    }
  ]
};

const inspirationItems = [
  {
    image: '/assets/Stationery/image14.jpg',
    title: 'Three notable Notebooks',
    description: 'Custom designs from real brands. All very different. All with something special about them.',
    link: 'Read more ›'
  },
  {
    image: '/assets/Stationery/image15.jpg',
    title: 'Yes, we do those',
    description: 'Eight custom products you might not think we did, but we do. From Folders to Brochures.',
    link: 'Read more ›'
  },
  {
    image: '/assets/Stationery/image1.jpg',
    title: 'Stuck on a blank page?',
    description: 'Writing a personal message isn’t always easy. So here are 8 tips to help get that pen moving.',
    link: 'Read more ›'
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
  cardHover: {
    boxShadow: '0 6px 15px rgba(0,0,0,0.15)'
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
    transition: 'background-color 0.2s ease',
    margin: '0 15px 15px 15px'
  },
  leftPanel: {
    maxWidth: '400px',
    margin: '0 auto 40px'
  },
  paragraph: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center'
  },
  link: {
    color: '#00754A',
    fontWeight: '500',
    textDecoration: 'none',
    display: 'block',
    textAlign: 'center'
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center'
  },
  cardImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover'
  },
  cardContent: {
    padding: '15px'
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: '16px',
    marginBottom: '10px'
  },
  cardText: {
    fontSize: '14px',
    color: '#444',
    marginBottom: '15px'
  }
};

class Card extends React.Component {
  state = { hover: false };

  toggleHover = () => this.setState({ hover: !this.state.hover });

  render() {
    const { title, description, price, button, image } = this.props.item;
    const hoverStyle = this.state.hover ? styles.cardHover : {};
    return (
      <div
        style={{ ...styles.card, ...hoverStyle }}
        onMouseEnter={this.toggleHover}
        onMouseLeave={this.toggleHover}
      >

        

        <img src={image} alt={title} style={styles.image} />
        <div style={styles.content}>
          <div style={styles.title}>{title}</div>
          <div style={styles.description}>{description}</div>
          <div style={styles.price}>{price}</div>
        </div>
        <button
          style={{
            ...styles.button,
            backgroundColor: this.state.hover ? '#005D3A' : '#00754A'
          }}
        >
          {button}
        </button>
      </div>
    );
  }
}

const StationerySection = ({ title, subtitle, data }) => (
  <div style={styles.section}>
    <h2 style={styles.heading}>{title}</h2>
    <p style={styles.subHeading}>{subtitle}</p>
    <div style={styles.grid}>
      {data.map((item, index) => (
        <Card key={index} item={item} />
      ))}
    </div>
  </div>
);

const Stationery = () => (
    <div className="responsive-container">
    <Header />

    <section
  style={{
    position: "relative",
    backgroundImage: "url('/assets/Stationery/banners.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "400px", // slightly more height for content breathing space
    width: "100%",
    display: "flex",
    alignItems: "flex-start", // align to top
    justifyContent: "flex-start", // align content to left
    padding: "60px 40px", // top padding creates the left-aligned spacing like the screenshot
    boxSizing: "border-box",
    overflow: "hidden",
  }}
>
  <div
    style={{
      maxWidth: "520px",
      padding: "20px 30px",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // optional: subtle background for text readability
      borderRadius: "8px",
      color: "#fff",
    }}
  >
    <h1 style={{ fontSize: "36px", marginBottom: "12px", lineHeight: "1.2" }}>
   Stationery
    </h1>
    <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
     Personalized Stationery
to get your ideas moving
Shop our Personalized Stationery collection, including Customizable Postcards, Stickers, Greeting Cards, and more.
      <br />
     All waiting for you to reimagine.
    </p>
  </div>
</section>

    <StationerySection
      title="Custom Business Stationery"
      subtitle="From luxurious paper stocks to vibrant colors, take your brand to the next level with our premium business stationery."
      data={stationeryData.customBusiness}
    />
    <StationerySection
      title="Personalized Stationery for your desk"
      subtitle="Custom Stationery to help organize your work, life, and ideas."
      data={stationeryData.personalizedDesk}
    />
    <div style={styles.section}>
      <div style={styles.leftPanel}>
        <h2 style={styles.heading}>Creative Stationery inspiration</h2>
        <p style={styles.paragraph}>
          Unleash the power of print with our tips for how to create unique stationery products that promote your brand.
        </p>
        <a href="#" style={styles.link}>Get inspired ›</a>
      </div>
      <div style={styles.cardContainer}>
        {inspirationItems.map((item, index) => (
          <div key={index} style={styles.card}>
            <img src={item.image} alt={item.title} style={styles.cardImage} />
            <div style={styles.cardContent}>
              <div style={styles.cardTitle}>{item.title}</div>
              <div style={styles.cardText}>{item.description}</div>
              <a href="#" style={styles.link}>{item.link}</a>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer />
  </div>
  
);

export default Stationery;
