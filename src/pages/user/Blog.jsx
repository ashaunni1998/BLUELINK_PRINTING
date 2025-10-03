import React from 'react';
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
  },
  {
    id: 2,
    title: 'How to Design the Perfect Business Card',
    snippet: 'Business cards still matter in 2025. Here is how to make yours unforgettable...',
    date: 'August 3, 2025',
  },
  {
    id: 3,
    title: 'Choosing the Right Paper for Your Flyers',
    snippet: 'Matte or gloss? Thin or thick? Lets help you pick the right flyer paper...',
    date: 'August 5, 2025',
  },
];

const Blog = () => {
  return (
    <div className="responsive-container">
      <Header/>
      
      <div style={styles.container}>
        <h2 style={styles.heading}>📚 Blue Link Blog</h2>
        <p style={styles.subheading}>
          Get tips, inspiration, and updates about printing and promotions.
        </p>

        <div style={styles.blogGrid}>
          {blogPosts.map((post) => (
            <div
              key={post.id}
              style={styles.blogCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <h3 style={styles.blogTitle}>{post.title}</h3>
              <p style={styles.blogDate}>{post.date}</p>
              <p style={styles.blogSnippet}>{post.snippet}</p>
              <Link
                to={`/blog/${post.id}`}
                style={styles.readMoreLink}
              >
                Read More →
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    
    padding: "1.875rem 0 2.5rem",
    marginLeft: "6%",
    marginRight: "8%",
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
  blogGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.875rem",
    maxWidth: "75%",
    margin: "0 auto",
  },
  blogCard: {
    backgroundColor: "#fff",
    borderRadius: "0.375rem",
    padding: "1.5rem",
    boxShadow: "0 0.0625rem 0.375rem rgba(0,0,0,0.07)",
    transition: "transform 0.2s ease",
  },
  blogTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#111",
    marginBottom: "8px",
  },
  blogDate: {
    color: "#999",
    fontSize: "14px",
    marginBottom: "12px",
  },
  blogSnippet: {
    marginTop: "10px",
    color: "#555",
    fontSize: "16px",
    lineHeight: "1.6",
    marginBottom: "15px",
  },
  readMoreLink: {
    color: "#007abf",
    fontWeight: "600",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "15px",
  },
};

export default Blog;