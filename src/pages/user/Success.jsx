// src/pages/user/Success.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { API_BASE_URL } from "../../config";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const maybeOrderId = location.state?.order?._id || location.state?.order?.orderId || params.orderId;
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState("");

  useEffect(() => {
    // If we already have order from state, trust it; otherwise fetch from server by id
    const fetchOrder = async (id) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE_URL}/api/order/${id}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Failed to fetch order");
        }
        const data = await res.json();
        const fetched = data.order || data.data || data;
        setOrder(fetched);
      } catch (err) {
        console.error("Fetch order failed:", err);
        setError(err.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    if (!order) {
      if (!maybeOrderId) {
        setError("Order id not available. Navigate to orders page.");
        setLoading(false);
        return;
      }
      fetchOrder(maybeOrderId);
    }
  }, [maybeOrderId, order]);

  const handleViewOrder = () => {
    const id = order?._id || order?.orderId || maybeOrderId;
    if (!id) return navigate("/orders");
    navigate(`/order/${id}`, { state: { order } });
  };

  return (
    <>
      <Header />
      <div style={{ padding: 20 }}>
        <h2>Order Payment Result</h2>

        {loading && <p>Loading order status...</p>}

        {error && (
          <div style={{ color: "red", marginBottom: 12 }}>
            {error}
            <div style={{ marginTop: 8 }}>
              <button onClick={() => navigate("/checkout")}>Back to Checkout</button>
            </div>
          </div>
        )}

        {!loading && !error && order && (
          <div>
            <h3>
              {order.isPaid ? "Payment Successful ✅" : "Payment Pending / Failed ⚠️"}
            </h3>

            <div style={{ marginTop: 12 }}>
              <strong>Order ID:</strong> {order._id || order.orderId}
            </div>
            <div>
              <strong>Status:</strong> {order.status || (order.isPaid ? "Processing" : "Pending")}
            </div>
            <div>
              <strong>Paid:</strong> {order.isPaid ? "Yes" : "No"}
            </div>
            {order.paidAt && (
              <div>
                <strong>Paid At:</strong> {new Date(order.paidAt).toLocaleString()}
              </div>
            )}

            <hr />

            <div>
              <h4>Items</h4>
              <ul>
                {(order.orderItems || order.items || []).map((it, idx) => (
                  <li key={it._id || it.product || idx}>
                    {it.name || it.productName || it.title || "Item"} — Qty: {it.qty || it.quantity || it.count || 1} — ₹{it.price || it.unitPrice || "0"}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: 12 }}>
              <strong>Total:</strong> ₹{order.totalPrice ?? order.total ?? order.amount ?? "0"}
            </div>

            <div style={{ marginTop: 16 }}>
              <button onClick={handleViewOrder}>View Order Details</button>
              <button onClick={() => navigate("/")} style={{ marginLeft: 8 }}>
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Success;
