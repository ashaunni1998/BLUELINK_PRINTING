// src/pages/user/OrderConfirmation.jsx
import React from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId, date, items = [], total = 0 } = location.state || {};

  return (
    <div className="responsive-container">
      <Header />
      
      <div style={{
        maxWidth: '800px',
        margin: '40px auto',
        padding: '0 20px'
      }}>
        
        {orderId ? (
          <div>
            {/* Success Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#d4edda',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '36px',
                color: '#155724'
              }}>
                ✓
              </div>
              
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#1a1a1a',
                margin: '0 0 12px 0'
              }}>
                Order Confirmed!
              </h1>
              
              <p style={{
                fontSize: '18px',
                color: '#666',
                margin: '0 0 8px 0'
              }}>
                Thank you for your order. We'll get started on it right away.
              </p>
              
              <p style={{
                fontSize: '14px',
                color: '#888',
                margin: 0
              }}>
                A confirmation email has been sent to your registered email address.
              </p>
            </div>

            {/* Order Details Card */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              marginBottom: '32px'
            }}>
              {/* Card Header */}
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '24px',
                borderBottom: '1px solid #e9ecef'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: '0 0 16px 0'
                }}>
                  Order Details
                </h2>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px'
                }}>
                  <div>
                    <label style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6c757d',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      marginBottom: '4px'
                    }}>
                      Order ID
                    </label>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      fontFamily: 'monospace'
                    }}>
                      {orderId}
                    </span>
                  </div>
                  
                  <div>
                    <label style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6c757d',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      marginBottom: '4px'
                    }}>
                      Order Date
                    </label>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#1a1a1a'
                    }}>
                      {date}
                    </span>
                  </div>
                  
                  <div>
                    <label style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6c757d',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      marginBottom: '4px'
                    }}>
                      Status
                    </label>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#28a745',
                      backgroundColor: '#d4edda',
                      padding: '4px 8px',
                      borderRadius: '12px'
                    }}>
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ padding: '24px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: '0 0 20px 0'
                }}>
                  Order Summary
                </h3>

                {/* Mobile-First Item List */}
                <div style={{
                  display: 'block'
                }}>
                  {items.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 0',
                        borderBottom: i < items.length - 1 ? '1px solid #f1f3f4' : 'none'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '500',
                          color: '#1a1a1a',
                          marginBottom: '4px'
                        }}>
                          {item.name}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#6c757d'
                        }}>
                          Quantity: {item.quantity}
                        </div>
                      </div>
                      
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        textAlign: 'right'
                      }}>
                        ${item.price}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Section */}
                <div style={{
                  marginTop: '24px',
                  paddingTop: '20px',
                  borderTop: '2px solid #e9ecef'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#1a1a1a'
                    }}>
                      Total
                    </span>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#007BFF'
                    }}>
                      ${total}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'center',
              marginBottom: '40px'
            }}>
              <Link to="/account?tab=orders" style={{ textDecoration: 'none', width: '100%', maxWidth: '320px' }}>
                <button style={{
                  width: '100%',
                  padding: '16px 24px',
                  backgroundColor: '#007BFF',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)'
                }}>
                  Track Your Orders
                </button>
              </Link>
              
              <Link to="/" style={{ textDecoration: 'none', width: '100%', maxWidth: '320px' }}>
                <button style={{
                  width: '100%',
                  padding: '16px 24px',
                  backgroundColor: 'transparent',
                  color: '#007BFF',
                  border: '2px solid #007BFF',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  Continue Shopping
                </button>
              </Link>
            </div>

            {/* Help Section */}
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: '0 0 12px 0'
              }}>
                Need Help?
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6c757d',
                margin: '0 0 16px 0',
                lineHeight: '1.5'
              }}>
                If you have any questions about your order, don't hesitate to contact our customer support team.
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                flexWrap: 'wrap'
              }}>
                <a
                  href="mailto:support@bluelinkprinting.com"
                  style={{
                    fontSize: '14px',
                    color: '#007BFF',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  Email Support
                </a>
                <span style={{ color: '#dee2e6' }}>•</span>
                <a
                  href="tel:+1234567890"
                  style={{
                    fontSize: '14px',
                    color: '#007BFF',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  Call Us
                </a>
              </div>
            </div>

          </div>
        ) : (
          /* Error State */
          <div style={{
            textAlign: 'center',
            padding: '60px 20px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#f8d7da',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '36px',
              color: '#721c24'
            }}>
              !
            </div>
            
            <h2 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#1a1a1a',
              margin: '0 0 16px 0'
            }}>
              Order Information Missing
            </h2>
            
            <p style={{
              fontSize: '16px',
              color: '#6c757d',
              margin: '0 0 32px 0'
            }}>
              We couldn't find your order details. This might happen if you navigated here directly.
            </p>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'center'
            }}>
              <Link to="/account?tab=orders" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '16px 24px',
                  backgroundColor: '#007BFF',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  View Your Orders
                </button>
              </Link>
              
              <Link to="/" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '16px 24px',
                  backgroundColor: 'transparent',
                  color: '#6c757d',
                  border: '2px solid #dee2e6',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  Return to Home
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* CSS for hover effects and responsive behavior */}
      <style>
        {`
          .responsive-container button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          }
          
          .responsive-container a[href^="mailto:"]:hover,
          .responsive-container a[href^="tel:"]:hover {
            text-decoration: underline;
          }
          
          @media (max-width: 768px) {
            .responsive-container {
              padding: 0 16px;
            }
          }
          
          @media (min-width: 768px) {
            .order-items-table {
              display: table !important;
            }
            .order-items-mobile {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default OrderConfirmation;