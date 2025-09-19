import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import API_BASE_URL from '../../config';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [cartId, setCartId] = useState(null); // ✅ save cartId from backend
  const [loading, setLoading] = useState(true);

  // ✅ Fetch cart from backend (cookie auth)
  const fetchCart = async () => {
    try {
      const res = await fetch('https://kerala-digital-park-server.vercel.app/api/getCart', {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include", // send login cookie
      });

      const data = await res.json();
      if (res.ok && data.cartData) {
        setCartId(data.cartData._id); // ✅ store cartId

        // backend returns: { cartData: { _id, items: [{ productId, quantity, product }] } }
        setItems(
          (data.cartData.items || []).map(i => ({
            id: i.productId,                       // raw productId
            name: i.product?.name ?? "(Product unavailable)",
            desc: i.product?.description ?? "This product is no longer available",
            price: i.product?.price || 0,
            qty: i.quantity,
            image: Array.isArray(i.product?.images) ? i.product.images[0] : i.product?.images,
          }))
        );
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Update quantity (now via query params to match backend)
  const handleQtyChange = async (id, value) => {
    const qty = Math.max(1, Number.isNaN(parseInt(value)) ? 1 : parseInt(value));
    setItems(prev => prev.map(item => (item.id === id ? { ...item, qty } : item)));
    try {
      const res = await fetch(
        `https://kerala-digital-park-server.vercel.app/api/updateCartItem?cartId=${encodeURIComponent(cartId ?? '')}&productId=${encodeURIComponent(id)}&newQty=${encodeURIComponent(qty)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.error("Update failed:", data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Remove item (now via query params to match backend)
  const handleRemove = async (id) => {
    try {
      const res = await fetch(
        `https://kerala-digital-park-server.vercel.app/api/removeCartItem?cartId=${encodeURIComponent(cartId ?? '')}&productId=${encodeURIComponent(id)}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: "include"
        }
      );

      const data = await res.json();
      if (res.ok) {
        setItems(prev => prev.filter(item => item.id !== id));
      } else {
        console.error("Failed to remove:", data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = items.length > 0 ? 50 : 0;
  const total = subtotal + shipping;

  if (loading) return <p style={{ textAlign: 'center' }}>Loading cart...</p>;

  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      <div style={{ width: '90%', margin: '0 auto' }}>
        <Header />
        <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', padding: '2.5rem 1rem' }}>
          <div style={{ maxWidth: '64rem', margin: '0 auto', backgroundColor: '#fff', borderRadius: '1rem', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937' }}>🛒 Your Cart</h2>

            {items.length === 0 ? (
              <p style={{ marginTop: "20px", color: "#666" }}>Your cart is empty.</p>
            ) : (
              items.map(item => (
                <div key={item.id} style={{ display: 'flex', flexDirection: 'row', gap: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                  <img src={item.image || "https://via.placeholder.com/100"} alt={item.name} style={{ width: '7rem', height: '7rem', objectFit: 'cover', borderRadius: '0.375rem', border: '1px solid #E5E7EB' }} />
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{item.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{item.desc}</p>

                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <label style={{ fontSize: '0.875rem', color: '#4B5563' }}>Qty:</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={item.qty} 
                        onChange={e => handleQtyChange(item.id, parseInt(e.target.value))} 
                        style={{ width: '4rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', fontSize: '0.875rem' }} 
                      />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '100px' }}>
                    <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1F2937' }}>₹{(item.qty * item.price).toFixed(2)}</p>
                    <button onClick={() => handleRemove(item.id)} style={{ fontSize: '0.875rem', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', marginTop: '0.5rem' }}>Remove</button>
                  </div>
                </div>
              ))
            )}

            {/* Summary */}
            {items.length > 0 && (
              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6B7280' }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {/* <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6B7280' }}>
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div> */}
                {/* <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '1.125rem', color: '#1F2937', borderTop: '1px solid #E5E7EB', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div> */}
              </div>
            )}

            {/* Buttons */}
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <a href="/"><button style={{ backgroundColor: '#2563EB', color: '#fff', padding: '0.5rem 1.5rem', borderRadius: '0.375rem', fontSize: '0.875rem', cursor: 'pointer', border: 'none' }}>← Continue Shopping</button></a>
              {items.length > 0 && (
               <a href="/checkout">
  <button onClick={() => localStorage.setItem("cart", JSON.stringify(items))}>
    Proceed to Checkout
  </button>
</a>

              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Cart;
