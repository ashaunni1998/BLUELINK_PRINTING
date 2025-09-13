import React, { useState, useEffect, useContext } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // adjust path
import './Home.css';

const AccountPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const queryParams = new URLSearchParams(location.search);
  const normalizeTab = (tab) => {
    const mapping = {
      // orders: 'orderhistory',
      overview: 'overview',
      // address: 'address'
    };
    return mapping[tab?.toLowerCase()] || 'overview';
  };

  const defaultTab = normalizeTab(queryParams.get('tab'));
  const [activeSection, setActiveSection] = useState(defaultTab);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const newTab = new URLSearchParams(location.search).get('tab');
    if (newTab && normalizeTab(newTab) !== activeSection) {
      setActiveSection(normalizeTab(newTab));
    }
  }, [location]);

  const sections = {
    overview:
      'Welcome to your Blue Link Printing dashboard. From your account dashboard you can view your recent orders, manage your shipping and billing addresses, manage your order return, view your orders, and edit your password and account details.',
    // orderhistory: 'Here you can view and track your orders.',
    // address: 'Manage your shipping and billing addresses.'
  };

  const orders = [
    { id: 'ORD001', product: 'Business Cards', date: '2025-07-20', amount: '$49.99' },
    { id: 'ORD002', product: 'Flyers', date: '2025-07-25', amount: '$89.00' },
    { id: 'ORD003', product: 'Posters', date: '2025-08-01', amount: '$120.50' }
  ];

  const customerInfo = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8901',
    address: '123 Main Street, Springfield, IL 62704, USA'
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error('Logout request failed', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/sign-in');
    }
  };

  // Inline styles
  const layoutStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    flex: 1
  };

  const sidebarStyle = {
    backgroundColor: '#f9f9f9',
    width: isMobile ? '100%' : '240px',
    padding: isMobile ? '10px' : '20px',
    borderRight: isMobile ? 'none' : '1px solid #ddd',
    borderBottom: isMobile ? '1px solid #ddd' : 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    color: '#333',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    width: isMobile ? '100%' : 'auto',
    textAlign: 'center',
    transition: 'all 0.2s ease-in-out'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007BFF',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    boxShadow: '0 2px 6px rgba(0, 123, 255, 0.3)'
  };

  const logoutButtonStyle = {
    ...buttonStyle,
    fontWeight: 'bold'
  };

  const contentStyle = {
    flex: 1,
    padding: '30px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
  };

  const thTdStyle = {
    border: '1px solid #ccc',
    padding: '12px',
    textAlign: 'left'
  };

  const viewButtonStyle = {
    padding: '6px 12px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  return (
    <div className="responsive-container">
      <Header />
      <div style={layoutStyle}>
        {/* Sidebar */}
        <nav style={sidebarStyle}>
          {Object.keys(sections).map((key) => (
            <button
              key={key}
              style={activeSection === key ? activeButtonStyle : buttonStyle}
              onClick={() => setActiveSection(key)}
            >
              {key === 'overview' && 'Overview'}
              {/* {key === 'orderhistory' && 'Order History'}
              {key === 'address' && 'Address'} */}
            </button>
          ))}
          <button style={logoutButtonStyle} onClick={handleLogout}>
            Logout
          </button>
        </nav>

        {/* Content */}
        <main style={contentStyle}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', textTransform: 'capitalize' }}>
            {activeSection.replace('-', ' ')}
          </h2>
{/* {activeSection === 'orderhistory' ? (
  <div style={{ overflowX: 'auto' }}>
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thTdStyle}>Order ID</th>
          <th style={thTdStyle}>Product Name</th>
          <th style={thTdStyle}>Date</th>
          <th style={thTdStyle}>Amount</th>
          <th style={thTdStyle}>Action</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td style={thTdStyle}>{order.id}</td>
            <td style={thTdStyle}>{order.product}</td>
            <td style={thTdStyle}>{order.date}</td>
            <td style={thTdStyle}>{order.amount}</td>
            <td style={thTdStyle}>
              <Link to={`/orders/${order.id}`}>
                <button style={viewButtonStyle}>View</button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : activeSection === 'address' ? (

            <div style={{ fontSize: '16px', color: '#333', lineHeight: '1.8' }}>
              <p><strong>Name:</strong> {customerInfo.name}</p>
              <p><strong>Email:</strong> {customerInfo.email}</p>
              <p><strong>Phone:</strong> {customerInfo.phone}</p>
              <p><strong>Address:</strong> {customerInfo.address}</p>
            </div>
          ) : (
            <p style={{ color: '#555', fontSize: '16px' }}>{sections[activeSection]}</p>
          )} */}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AccountPage;
