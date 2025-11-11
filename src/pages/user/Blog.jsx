import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './Home.css';

const blogPosts = [
  {
    id: 1,
    title: 'Top 5 Printing Tips for Small Businesses',
    snippet: 'Discover simple printing strategies that can save you money and boost your brand presence...',
    date: 'August 1, 2025',
    category: 'Business Tips',
    readTime: '5 min read',
    image: '📊',
  },
  {
    id: 2,
    title: 'How to Design the Perfect Business Card',
    snippet: 'Business cards still matter in 2025. Here is how to make yours unforgettable...',
    date: 'August 3, 2025',
    category: 'Design',
    readTime: '4 min read',
    image: '💼',
  },
  {
    id: 3,
    title: 'Choosing the Right Paper for Your Flyers',
    snippet: 'Matte or gloss? Thin or thick? Lets help you pick the right flyer paper...',
    date: 'August 5, 2025',
    category: 'Materials',
    readTime: '6 min read',
    image: '📄',
  },
];

const Blog = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="responsive-container">
      <Header />
      
      <div style={styles.container}>
        {/* Hero Section */}
        <div style={styles.heroSection}>
          <div style={styles.heroContent}>
            <h1 style={styles.mainHeading}>Blue Link Blog</h1>
            <p style={styles.heroSubheading}>
              Expert insights on printing, design, and business growth strategies
            </p>
            <div style={styles.categoryTags}>
              <span style={styles.tag}>All Posts</span>
              <span style={styles.tag}>Business Tips</span>
              <span style={styles.tag}>Design</span>
              <span style={styles.tag}>Materials</span>
            </div>
          </div>
        </div>

        {/* Featured Post */}
        <div style={styles.featuredSection}>
          <div style={styles.featuredBadge}>Featured Article</div>
          <div style={styles.featuredPost}>
            <div style={styles.featuredContent}>
              <div style={styles.featuredMeta}>
                <span style={styles.featuredCategory}>Business Tips</span>
                <span style={styles.featuredDot}>•</span>
                <span style={styles.featuredDate}>August 1, 2025</span>
              </div>
              <h2 style={styles.featuredTitle}>
                Top 5 Printing Tips for Small Businesses
              </h2>
              <p style={styles.featuredSnippet}>
                Discover simple printing strategies that can save you money and boost your brand presence. From choosing the right materials to optimizing your print runs, we cover everything you need to know to make smart printing decisions for your business.
              </p>
              <Link to="/blog/1" state={{ from: "blog" }} style={styles.featuredButton}>
                Read Full Article →
              </Link>
            </div>
            <div style={styles.featuredImage}>
              <div style={styles.featuredImagePlaceholder}>📊</div>
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div style={styles.postsSection}>
          <h2 style={styles.sectionHeading}>Recent Articles</h2>
          <div style={styles.blogGrid}>
            {blogPosts.slice(1).map((post) => (
              <div
                key={post.id}
                style={{
                  ...styles.blogCard,
                  ...(hoveredCard === post.id ? styles.blogCardHovered : {}),
                }}
                onMouseEnter={() => setHoveredCard(post.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.cardImage}>
                  <div style={styles.cardImagePlaceholder}>{post.image}</div>
                  <span style={styles.cardCategory}>{post.category}</span>
                </div>
                
                <div style={styles.cardContent}>
                  <div style={styles.cardMeta}>
                    <span style={styles.cardDate}>{post.date}</span>
                    <span style={styles.cardDot}>•</span>
                    <span style={styles.cardReadTime}>{post.readTime}</span>
                  </div>
                  
                  <h3 style={styles.cardTitle}>{post.title}</h3>
                  <p style={styles.cardSnippet}>{post.snippet}</p>
                  
                  <Link 
                    to={`/blog/${post.id}`} 
                    state={{ from: "blog" }}
                    style={styles.readMoreLink}
                  >
                    Read More
                    <span style={styles.arrow}>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div style={styles.newsletterSection}>
          <h3 style={styles.newsletterHeading}>Stay Updated</h3>
          <p style={styles.newsletterText}>
            Get the latest printing tips and industry insights delivered to your inbox
          </p>
          <div style={styles.newsletterForm}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              style={styles.newsletterInput}
            />
            <button style={styles.newsletterButton}>Subscribe</button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem 0 3rem",
    marginLeft: "6%",
    marginRight: "6%",
    maxWidth: "1400px",
    marginInline: "auto",
  },
  
  // Hero Section
  heroSection: {
    textAlign: "center",
    padding: "3.5rem 0 2.5rem",
    marginBottom: "3rem",
    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
    borderRadius: "1rem",
  },
  heroContent: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "0 2rem",
  },
  mainHeading: {
    fontSize: "48px",
    fontWeight: "800",
    color: "#111",
    marginBottom: "1rem",
    letterSpacing: "-0.02em",
  },
  heroSubheading: {
    fontSize: "20px",
    color: "#555",
    marginBottom: "2rem",
    lineHeight: "1.6",
  },
  categoryTags: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  tag: {
    padding: "0.5rem 1.25rem",
    backgroundColor: "#fff",
    borderRadius: "2rem",
    fontSize: "14px",
    fontWeight: "500",
    color: "#555",
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "1px solid #e0e0e0",
  },
  
  // Featured Post
  featuredSection: {
    marginBottom: "4rem",
    position: "relative",
  },
  featuredBadge: {
    display: "inline-block",
    backgroundColor: "#007abf",
    color: "#fff",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem 0.375rem 0 0",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  featuredPost: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: "3rem",
    backgroundColor: "#fff",
    borderRadius: "0 1rem 1rem 1rem",
    padding: "2.5rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    alignItems: "center",
  },
  featuredContent: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  featuredMeta: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "14px",
  },
  featuredCategory: {
    color: "#007abf",
    fontWeight: "600",
  },
  featuredDot: {
    color: "#ccc",
  },
  featuredDate: {
    color: "#888",
  },
  featuredTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#111",
    lineHeight: "1.3",
    marginTop: "0.5rem",
  },
  featuredSnippet: {
    fontSize: "17px",
    color: "#555",
    lineHeight: "1.7",
  },
  featuredButton: {
    display: "inline-block",
    backgroundColor: "#007abf",
    color: "#fff",
    padding: "0.875rem 2rem",
    borderRadius: "0.5rem",
    fontWeight: "600",
    textDecoration: "none",
    fontSize: "16px",
    transition: "all 0.2s ease",
    alignSelf: "flex-start",
    marginTop: "0.5rem",
  },
  featuredImage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  featuredImagePlaceholder: {
    width: "100%",
    height: "280px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "80px",
  },
  
  // Recent Posts
  postsSection: {
    marginBottom: "4rem",
  },
  sectionHeading: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#111",
    marginBottom: "2.5rem",
  },
  blogGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "2rem",
  },
  blogCard: {
    backgroundColor: "#fff",
    borderRadius: "0.75rem",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  blogCardHovered: {
    transform: "translateY(-8px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
  },
  cardImage: {
    position: "relative",
    width: "100%",
    height: "200px",
    overflow: "hidden",
  },
  cardImagePlaceholder: {
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "60px",
  },
  cardCategory: {
    position: "absolute",
    top: "1rem",
    left: "1rem",
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: "0.375rem 0.875rem",
    borderRadius: "0.375rem",
    fontSize: "12px",
    fontWeight: "600",
    color: "#007abf",
  },
  cardContent: {
    padding: "1.5rem",
  },
  cardMeta: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.75rem",
    fontSize: "13px",
  },
  cardDate: {
    color: "#888",
  },
  cardDot: {
    color: "#ccc",
  },
  cardReadTime: {
    color: "#888",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#111",
    marginBottom: "0.75rem",
    lineHeight: "1.4",
  },
  cardSnippet: {
    color: "#555",
    fontSize: "15px",
    lineHeight: "1.6",
    marginBottom: "1.25rem",
  },
  readMoreLink: {
    color: "#007abf",
    fontWeight: "600",
    textDecoration: "none",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
    transition: "gap 0.2s ease",
  },
  arrow: {
    transition: "transform 0.2s ease",
  },
  
  // Newsletter Section
  newsletterSection: {
    backgroundColor: "#007abf",
    borderRadius: "1rem",
    padding: "3rem",
    textAlign: "center",
    color: "#fff",
  },
  newsletterHeading: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "0.75rem",
  },
  newsletterText: {
    fontSize: "17px",
    marginBottom: "2rem",
    opacity: 0.95,
  },
  newsletterForm: {
    display: "flex",
    gap: "1rem",
    maxWidth: "500px",
    margin: "0 auto",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  newsletterInput: {
    flex: "1",
    minWidth: "250px",
    padding: "0.875rem 1.25rem",
    borderRadius: "0.5rem",
    border: "none",
    fontSize: "15px",
    outline: "none",
  },
  newsletterButton: {
    padding: "0.875rem 2rem",
    backgroundColor: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "0.5rem",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
};

export default Blog;