import React from "react";
import { useParams, Link ,useLocation} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import './Home.css';

// Same blogPosts array used in Blog.jsx
const blogPosts = [
  {
    id: 1,
    title: "Top 5 Printing Tips for Small Businesses",
    date: "August 1, 2025",
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
    content: `
      Blue Link’s designers share 10 standout business cards from different industries
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

  if (!post) {
    return (
      <div className="responsive-container">
        <Header />
        <div style={styles.notFoundContainer}>
          <h2 style={styles.notFoundTitle}>Blog Post Not Found</h2>
          
        </div>
        <Footer />
      </div>
    );
  }
  // ✅ Decide back link based on where we came from
  const backLink = location.state?.from === "home" ? "/" : "/blog";
  const backText = location.state?.from === "home" ? "← Back to Home" : "← Back to Blog";
  return (
    <div className="responsive-container">
      <Header />
      
      <div style={styles.outerContainer}>
        <div style={styles.contentCard}>
        
          
          <h1 style={styles.title}>{post.title}</h1>
          <p style={styles.date}>{post.date}</p>
          
          <div style={styles.content}>
            {post.content.split("\n").map((line, index) => (
              line.trim() && <p key={index} style={styles.paragraph}>{line.trim()}</p>
            ))}
          </div>

 <Link to={backLink} style={styles.backLink}>
            {backText}
          </Link>        </div>
      </div>
      
      <Footer />
    </div>
  );
};

const styles = {
  outerContainer: {
    // backgroundColor: "#f5f8f6",
    padding: "1.875rem 0 2.5rem",
    marginLeft: "5%",
    marginRight: "6%",
  },
  contentCard: {
    maxWidth: "75%",
    margin: "0 auto",
    padding: "2rem 2.5rem",
    backgroundColor: "#fff",
    borderRadius: "0.375rem",
    // boxShadow: "0 0.0625rem 0.375rem rgba(0,0,0,0.07)",
  },
  backLinkTop: {
    color: "#007abf",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "15px",
    display: "inline-block",
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "12px",
    color: "#111",
    lineHeight: "1.3",
  },
  date: {
    fontSize: "15px",
    color: "#999",
    marginBottom: "30px",
  },
  content: {
    fontSize: "17px",
    color: "#555",
    marginBottom: "30px",
    lineHeight: "1.7",
  },
  paragraph: {
    marginBottom: "1rem",
  },
  backLink: {
    color: "#007abf",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "15px",
    display: "inline-block",
    marginTop: "20px",
  },
  notFoundContainer: {
    backgroundColor: "#f5f8f6",
    padding: "3rem 2rem",
    marginLeft: "6%",
    marginRight: "6%",
    textAlign: "center",
  },
  notFoundTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#111",
    marginBottom: "20px",
  },
};

export default BlogDetail;