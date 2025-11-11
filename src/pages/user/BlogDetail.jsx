import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import './Home.css';

// Same blogPosts array used in Blog.jsx
const blogPosts = [
  {
    id: 1,
    title: "Top 5 Printing Tips for Small Businesses",
    date: "August 1, 2025",
    category: "Business Tips",
    readTime: "5 min read",
    author: "Blue Link Team",
    image: "📊",
    content: `
      Discover simple printing strategies that can save you money and boost your brand presence.
      From choosing the right paper to optimizing bulk orders, these tips will help you get the
      most out of your printing budget without compromising quality.
      
      ✅ Use bulk printing wisely  
      ✅ Keep your design clean and minimal  
      ✅ Choose the right paper stock  
      ✅ Use both sides of the paper effectively  
      ✅ Partner with a reliable printing company
    `,
  },
  {
    id: 2,
    title: "How to Design the Perfect Business Card",
    date: "August 3, 2025",
    category: "Design",
    readTime: "4 min read",
    author: "Blue Link Team",
    image: "💼",
    content: `
      Business cards still matter in 2025. A great business card can leave a lasting impression.
      
      ✨ Key elements of a perfect card:
      - Clear branding and logo
      - Legible typography
      - Strategic use of color
      - Premium paper choice
      - A unique, memorable design twist
    `,
  },
  {
    id: 3,
    title: "Choosing the Right Paper for Your Flyers",
    date: "August 5, 2025",
    category: "Materials",
    readTime: "6 min read",
    author: "Blue Link Team",
    image: "📄",
    content: `
      Matte or gloss? Thin or thick? Let's help you pick the right flyer paper for your campaign.
      
      📌 Paper Types:
      - **Glossy**: Vibrant colors, great for promotions
      - **Matte**: Elegant, easy to write on
      - **Recycled**: Eco-friendly and budget friendly
      
      Match your paper choice with your message for maximum impact.
    `,
  },
  {
    id: 4,
    title: "10 Business Card Design Examples",
    date: "September 20, 2025",
    category: "Design",
    readTime: "7 min read",
    author: "Blue Link Team",
    image: "🎨",
    content: `
      Blue Link's designers share 10 standout business cards from different industries
      with creative layouts and premium finishes.

      ⭐ Minimalist Modern  
      ⭐ Luxe Finishes  
      ⭐ Bold Typography  
      ...and more.
    `,
  },
  {
    id: 5,
    title: "Invites They Won't Ignore",
    date: "September 22, 2025",
    category: "Design",
    readTime: "5 min read",
    author: "Blue Link Team",
    image: "💌",
    content: `
      Master the art of creating paper invites that actually get a "yes" with these proven design strategies.

      💡 Use Bold Typography  
      💡 Personal Touch  
      💡 Play with Colors  
      ...and more.
    `,
  },
];

const BlogDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const post = blogPosts.find((p) => p.id === Number(id));
  const [readProgress, setReadProgress] = useState(0);

  // Calculate reading progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadProgress(Math.min(scrollPercentage, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!post) {
    return (
      <div className="responsive-container">
        <Header />
        <div style={styles.notFoundContainer}>
          <div style={styles.notFoundIcon}>📚</div>
          <h2 style={styles.notFoundTitle}>Blog Post Not Found</h2>
          <p style={styles.notFoundText}>The article you're looking for doesn't exist.</p>
          <Link to="/blog" style={styles.notFoundButton}>
            Browse All Articles
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Get related posts (exclude current post)
  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 2);

  // Decide back link based on where we came from
  const backLink = location.state?.from === "home" ? "/" : "/blog";
  const backText = location.state?.from === "home" ? "← Back to Home" : "← Back to Blog";

  return (
    <div className="responsive-container">
      <Header />
      
      {/* Reading Progress Bar */}
      <div style={styles.progressBar}>
        <div style={{...styles.progressFill, width: `${readProgress}%`}} />
      </div>

      {/* Breadcrumb Navigation */}
      <div style={styles.breadcrumbContainer}>
        <Link to="/blog" style={styles.breadcrumbLink}>Blog</Link>
        <span style={styles.breadcrumbSeparator}>/</span>
        <span style={styles.breadcrumbCurrent}>{post.category}</span>
      </div>

      {/* Article Header */}
      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <span style={styles.categoryBadge}>{post.category}</span>
          <h1 style={styles.articleTitle}>{post.title}</h1>
          
          <div style={styles.metaInfo}>
            <div style={styles.authorSection}>
              <div style={styles.authorAvatar}>👤</div>
              <div>
                <div style={styles.authorName}>{post.author}</div>
                <div style={styles.metaDetails}>
                  {post.date} • {post.readTime}
                </div>
              </div>
            </div>
            
            <div style={styles.shareButtons}>
              <button style={styles.shareButton} title="Share on Twitter">🐦</button>
              <button style={styles.shareButton} title="Share on Facebook">📘</button>
              <button style={styles.shareButton} title="Share on LinkedIn">💼</button>
              <button style={styles.shareButton} title="Copy Link">🔗</button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div style={styles.featuredImageContainer}>
        <div style={styles.featuredImage}>{post.image}</div>
      </div>

      {/* Article Content */}
      <div style={styles.contentContainer}>
        <article style={styles.articleContent}>
          {post.content.split("\n").map((line, index) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return null;
            
            // Check if line is a heading (starts with ##)
            if (trimmedLine.startsWith('##')) {
              return (
                <h2 key={index} style={styles.contentHeading}>
                  {trimmedLine.replace('##', '').trim()}
                </h2>
              );
            }
            
            // Check if line is bold (wrapped in **)
            if (trimmedLine.includes('**')) {
              const parts = trimmedLine.split('**');
              return (
                <p key={index} style={styles.paragraph}>
                  {parts.map((part, i) => 
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                  )}
                </p>
              );
            }
            
            return (
              <p key={index} style={styles.paragraph}>
                {trimmedLine}
              </p>
            );
          })}
        </article>

        {/* Tags Section */}
        <div style={styles.tagsSection}>
          <span style={styles.tagsLabel}>Tags:</span>
          <span style={styles.tag}>Printing</span>
          <span style={styles.tag}>{post.category}</span>
          <span style={styles.tag}>Business</span>
        </div>

        {/* Author Bio */}
        <div style={styles.authorBio}>
          <div style={styles.authorBioAvatar}>👤</div>
          <div style={styles.authorBioContent}>
            <h3 style={styles.authorBioName}>About {post.author}</h3>
            <p style={styles.authorBioText}>
              The Blue Link team brings together printing experts, designers, and business consultants 
              to deliver practical insights that help your business grow.
            </p>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div style={styles.newsletterCTA}>
          <h3 style={styles.ctaHeading}>💌 Never Miss an Update</h3>
          <p style={styles.ctaText}>
            Get expert printing tips and business insights delivered to your inbox
          </p>
          <div style={styles.ctaForm}>
            <input 
              type="email" 
              placeholder="Your email address" 
              style={styles.ctaInput}
            />
            <button style={styles.ctaButton}>Subscribe</button>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <div style={styles.relatedSection}>
          <h2 style={styles.relatedHeading}>Related Articles</h2>
          <div style={styles.relatedGrid}>
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                to={`/blog/${relatedPost.id}`}
                state={{ from: "blog" }}
                style={styles.relatedCard}
              >
                <div style={styles.relatedImage}>{relatedPost.image}</div>
                <div style={styles.relatedContent}>
                  <span style={styles.relatedCategory}>{relatedPost.category}</span>
                  <h3 style={styles.relatedTitle}>{relatedPost.title}</h3>
                  <div style={styles.relatedMeta}>
                    {relatedPost.date} • {relatedPost.readTime}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Back to Blog Button */}
      <div style={styles.backButtonContainer}>
        <Link to={backLink} style={styles.backButton}>
          {backText}
        </Link>
      </div>

      <Footer />
    </div>
  );
};

const styles = {
  // Progress Bar
  progressBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    backgroundColor: '#e9ecef',
    zIndex: 1000,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007abf',
    transition: 'width 0.2s ease',
  },

  // Breadcrumb
  breadcrumbContainer: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 2rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '14px',
  },
  breadcrumbLink: {
    color: '#007abf',
    textDecoration: 'none',
    fontWeight: '500',
  },
  breadcrumbSeparator: {
    color: '#ccc',
  },
  breadcrumbCurrent: {
    color: '#888',
  },

  // Hero Section
  heroSection: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 2rem',
  },
  heroContent: {
    textAlign: 'center',
  },
  categoryBadge: {
    display: 'inline-block',
    backgroundColor: '#007abf',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '2rem',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '1.5rem',
    letterSpacing: '0.05em',
  },
  articleTitle: {
    fontSize: '48px',
    fontWeight: '800',
    color: '#111',
    lineHeight: '1.2',
    marginBottom: '2rem',
    letterSpacing: '-0.02em',
  },
  metaInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e9ecef',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  authorSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  authorAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  authorName: {
    fontWeight: '600',
    color: '#111',
    fontSize: '15px',
  },
  metaDetails: {
    color: '#888',
    fontSize: '14px',
    marginTop: '0.25rem',
  },
  shareButtons: {
    display: 'flex',
    gap: '0.5rem',
  },
  shareButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '1px solid #e9ecef',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },

  // Featured Image
  featuredImageContainer: {
    maxWidth: '1100px',
    margin: '0 auto 3rem',
    padding: '0 2rem',
  },
  featuredImage: {
    width: '100%',
    height: '450px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '120px',
  },

  // Article Content
  contentContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 2rem 3rem',
  },
  articleContent: {
    fontSize: '18px',
    lineHeight: '1.8',
    color: '#333',
    marginBottom: '3rem',
  },
  paragraph: {
    marginBottom: '1.5rem',
  },
  contentHeading: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111',
    marginTop: '2.5rem',
    marginBottom: '1rem',
    lineHeight: '1.3',
  },

  // Tags
  tagsSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '2rem 0',
    borderTop: '1px solid #e9ecef',
    borderBottom: '1px solid #e9ecef',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  tagsLabel: {
    fontWeight: '600',
    color: '#555',
    fontSize: '15px',
  },
  tag: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '2rem',
    fontSize: '14px',
    color: '#555',
    fontWeight: '500',
  },

  // Author Bio
  authorBio: {
    display: 'flex',
    gap: '1.5rem',
    padding: '2rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '0.75rem',
    marginBottom: '3rem',
  },
  authorBioAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    flexShrink: 0,
  },
  authorBioContent: {
    flex: 1,
  },
  authorBioName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '0.5rem',
  },
  authorBioText: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#555',
  },

  // Newsletter CTA
  newsletterCTA: {
    backgroundColor: '#007abf',
    borderRadius: '1rem',
    padding: '2.5rem',
    textAlign: 'center',
    color: '#fff',
    marginBottom: '3rem',
  },
  ctaHeading: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '0.75rem',
  },
  ctaText: {
    fontSize: '17px',
    marginBottom: '1.5rem',
    opacity: 0.95,
  },
  ctaForm: {
    display: 'flex',
    gap: '1rem',
    maxWidth: '500px',
    margin: '0 auto',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ctaInput: {
    flex: '1',
    minWidth: '250px',
    padding: '0.875rem 1.25rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontSize: '15px',
    outline: 'none',
  },
  ctaButton: {
    padding: '0.875rem 2rem',
    backgroundColor: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
  },

  // Related Articles
  relatedSection: {
    maxWidth: '1200px',
    margin: '0 auto 3rem',
    padding: '3rem 2rem',
    backgroundColor: '#f8f9fa',
  },
  relatedHeading: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  relatedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  relatedCard: {
    backgroundColor: '#fff',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    textDecoration: 'none',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    display: 'block',
  },
  relatedImage: {
    width: '100%',
    height: '180px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '60px',
  },
  relatedContent: {
    padding: '1.5rem',
  },
  relatedCategory: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#007abf',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  relatedTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111',
    marginTop: '0.5rem',
    marginBottom: '0.75rem',
    lineHeight: '1.4',
  },
  relatedMeta: {
    fontSize: '13px',
    color: '#888',
  },

  // Back Button
  backButtonContainer: {
    maxWidth: '900px',
    margin: '0 auto 3rem',
    padding: '0 2rem',
    textAlign: 'center',
  },
  backButton: {
    display: 'inline-block',
    padding: '0.875rem 2rem',
    backgroundColor: '#007abf',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '16px',
    transition: 'background-color 0.2s ease',
  },

  // Not Found
  notFoundContainer: {
    padding: '4rem 2rem',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto',
  },
  notFoundIcon: {
    fontSize: '80px',
    marginBottom: '1.5rem',
  },
  notFoundTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '1rem',
  },
  notFoundText: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '2rem',
  },
  notFoundButton: {
    display: 'inline-block',
    padding: '0.875rem 2rem',
    backgroundColor: '#007abf',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '16px',
  },
};

export default BlogDetail;