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
    snippet: 'Business cards still matter in 2025. Here’s how to make yours unforgettable...',
    date: 'August 3, 2025',
  },
  {
    id: 3,
    title: 'Choosing the Right Paper for Your Flyers',
    snippet: 'Matte or gloss? Thin or thick? Let’s help you pick the right flyer paper...',
    date: 'August 5, 2025',
  },
];

const Blog = () => {
  return (
    <div className="responsive-container">
              <Header/>
      <div style={{ width: '90%', maxWidth: '1200px', margin: '0 auto', padding: '40px 0' }}>
        <h2 style={{ textAlign: 'center' }}>📚 Blue Link Blog</h2>
        <p style={{ textAlign: 'center', marginBottom: '40px', color: '#666' }}>
          Get tips, inspiration, and updates about printing and promotions.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {blogPosts.map((post) => (
            <div
              key={post.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                backgroundColor: '#fff',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <h3>{post.title}</h3>
              <p style={{ color: '#999', fontSize: '14px' }}>{post.date}</p>
              <p style={{ marginTop: '10px', color: '#444' }}>{post.snippet}</p>
              <Link
                to={`/blog/${post.id}`}
                style={{ color: '#007BFF', fontWeight: 'bold', textDecoration: 'none', marginTop: '10px', display: 'inline-block' }}
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

export default Blog;
