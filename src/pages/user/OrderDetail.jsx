import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { API_BASE_URL } from "../../config";

/* Money parsing helpers */
/* Money parsing helpers */
function parseMoneyToDollars(value) {
  if (value == null) return 0;
  const n = Number(value);
  if (!isFinite(n)) return 0;
  
  // ✅ Convert only if looks like cents (>= 1000)
  return n >= 1000 ? n / 100 : n;
}



function fmtCurrencyNZD(amount) {
  return new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(amount);
}

/* Helpers for product images & options */
const resolveImage = (item) => {
  if (!item) return "";
  if (item.preparedPreview) return item.preparedPreview;
  if (item.uploadedUrl) return item.uploadedUrl;
  if (item.image) return typeof item.image === "string" ? item.image : (item.image.url || item.image.path || "");
  if (item.images?.length) {
    const f = item.images[0];
    return typeof f === "string" ? f : (f?.url || f?.path || "");
  }
  if (item.croppedImages?.front) return item.croppedImages.front;
  if (item.raw && typeof item.raw === "object") {
    return item.raw.preparedPreview || item.raw.uploadedUrl || item.raw.image || "";
  }
  return "";
};

const readOption = (item, key) => {
  if (!item) return null;
  const v = item[key] ?? item.options?.[key] ?? item.raw?.[key] ?? item.custom?.[key] ?? item.selected?.[key];
  if (v == null) return null;
  if (typeof v === "object") return v.name ?? v.label ?? v.value ?? JSON.stringify(v);
  return String(v);
};

export default function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);


  const isWindow = typeof window !== "undefined";
const [windowWidth, setWindowWidth] = useState(isWindow ? window.innerWidth : 1440);

useEffect(() => {
  if (!isWindow) return;
  const onResize = () => {
    setWindowWidth(window.innerWidth);
  };
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}, [isWindow]);



  /* Fetch order details */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/order/${encodeURIComponent(orderId)}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load order");
        const payload = await res.json();
        setOrder(payload?.order ?? payload?.data ?? payload);
      } catch (err) {
        console.error("OrderDetail error", err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

const items = (order?.orderItems || []).map(i => {
  const quantity = Number(i.quantity ?? i.qty ?? 1) || 1;
  
  // Get raw values WITHOUT parsing yet
  const rawLineTotal = i.lineTotal ?? i.line_total ?? i.total ?? i.unitTotal ?? i.priceForQty ?? i.subtotal ?? i.amount ?? null;
  const rawUnitPrice = i.unitPrice ?? i.pricePerUnit ?? i.price_unit ?? i.price ?? i.basePrice ?? i.product?.price ?? null;
  
  // Calculate final values - keep as RAW cents values
  let lineTotal = 0;
  let unitPrice = 0;
  
  if (rawLineTotal != null && rawLineTotal > 0) {
    lineTotal = rawLineTotal;
    unitPrice = quantity > 0 ? rawLineTotal / quantity : 0;
  } else if (rawUnitPrice != null && rawUnitPrice > 0) {
    unitPrice = rawUnitPrice;
    lineTotal = rawUnitPrice * quantity;
  }

  return {
    name: i.name || i.title || i.productName || i.product?.name || "Product",
    quantity,
    lineTotal: lineTotal,  // Keep as cents
    unitPrice: unitPrice,  // Keep as cents
    image: resolveImage(i),
    size: readOption(i, "size"),
    paper: readOption(i, "paper"),
    finish: readOption(i, "finish"),
    corner: readOption(i, "corner"),
  };
});

const totalDollars = (() => {
  // First try to get the server total
  const rawServerTotal = order?.totalPrice ?? order?.total ?? order?.amount;
  if (rawServerTotal != null) {
    return parseMoneyToDollars(rawServerTotal);
  }
  
  // If no server total, sum up the items (they're already in cents)
  let sumInCents = 0;
  for (const it of items) {
    sumInCents += (it.lineTotal || 0);
  }
  
  // Convert the sum from cents to dollars
  return parseMoneyToDollars(sumInCents);
})();

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading order…</div>;

  if (!order) {
    return (
      <div>
        <Header />
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ width:80, height:80, borderRadius:40, margin:"0 auto 12px", background:"#fef3f2", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, color:"#b91c1c" }}>!</div>
          <h2>Order Not Found</h2>
          <p style={{ color:"#6b7280" }}>We couldn't find any order with this ID.</p>
          <div style={{ marginTop:20 }}>
            <Link to="/account?tab=orders">
              <button style={{ padding:"10px 18px", background:"#0369a1", color:"#fff", borderRadius:8, border:"none" }}>
                View Your Orders
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
    <style>{`
  .order-detail-wrapper {
    background-color: #f5f8f6;
    max-width: 1440px;
    margin: 0 auto;
    width: 100%;
    padding-top: 1.875rem;
    padding-bottom: 2.5rem;
    padding-left: ${windowWidth < 1050 ? "1rem" : windowWidth < 1200 ? "1.5rem" : "2.5rem"};
    padding-right: ${windowWidth < 1050 ? "1rem" : windowWidth < 1200 ? "1.5rem" : "2.5rem"};
  }

  .order-detail-container {
    max-width: 100%;
    margin: 0 auto;
    padding: 0;
  }

  .order-title {
    font-size: 28px;
    margin-bottom: 20px;
  }

  .order-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 24px rgba(0,0,0,0.06);
    margin-bottom: 20px;
  }

  .order-info-header {
    padding: 20px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .order-info-item {
    flex: 1;
    min-width: 150px;
  }

  .order-info-label {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .order-info-value {
    color: #6b7280;
    word-break: break-word;
  }

  .products-header {
    padding: 20px;
    border-bottom: 1px solid #f1f5f9;
  }

  .products-header h3 {
    margin: 0;
  }

  .products-list {
    padding: 20px;
  }

  .product-item {
    display: flex;
    gap: 16px;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f3f4f6;
  }

  .product-item:last-child {
    border-bottom: none;
  }

  .product-image {
    width: 86px;
    height: 86px;
    border-radius: 8px;
    overflow: hidden;
    background: #f9fafb;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product-details {
    flex: 1;
    min-width: 0;
  }

  .product-name {
    font-weight: 600;
    margin-bottom: 8px;
  }

  .product-options {
    color: #6b7280;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    font-size: 14px;
  }

  .product-pricing {
    text-align: right;
    min-width: 100px;
  }

  .product-line-total {
    font-weight: 700;
    margin-bottom: 4px;
  }

  .product-unit-price {
    font-size: 13px;
    color: #6b7280;
  }

  .order-total-row {
    padding: 14px 20px;
    border-top: 1px solid #eef2f7;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .order-total-label {
    font-weight: 700;
  }

  .order-total-amount {
    font-size: 20px;
    font-weight: 800;
    color: #0369a1;
  }

  .back-button-container {
    margin-top: 24px;
    text-align: center;
  }

  .back-button {
    padding: 12px 20px;
    background: #0369a1;
    color: #fff;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    display: inline-block;
    transition: background 0.2s;
  }

  .back-button:hover {
    background: #025a8a;
  }

  /* Mobile Responsive Styles */
  @media (max-width: 768px) {
    .order-title {
      font-size: 24px;
      margin-bottom: 16px;
    }

    .order-info-header {
      padding: 16px;
      gap: 16px;
    }

    .order-info-item {
      min-width: 120px;
    }

    .products-header {
      padding: 16px;
    }

    .products-list {
      padding: 16px;
    }

    .product-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      padding: 16px 0;
    }

    .product-image {
      width: 100%;
      height: 160px;
    }

    .product-pricing {
      width: 100%;
      text-align: left;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .order-total-row {
      padding: 16px;
    }

    .order-total-amount {
      font-size: 18px;
    }

    .back-button-container {
      margin-top: 20px;
    }

    .back-button {
      width: 100%;
      max-width: 300px;
    }
  }

  @media (max-width: 480px) {
    .order-info-header {
      flex-direction: column;
      gap: 12px;
    }

    .order-info-item {
      min-width: 100%;
    }

    .product-options {
      flex-direction: column;
      gap: 4px;
    }

    .order-total-row {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
    }
  }
`}</style>

     
      <Header />
        <div className="order-detail-container">
      <div className="order-detail-wrapper">
          <h1 className="order-title">Order Details</h1>

          {/* Order Info */}
          <div className="order-card">
            <div className="order-info-header">
              <div className="order-info-item">
                <div className="order-info-label">Order ID</div>
                <div className="order-info-value">{order?._id}</div>
              </div>
              <div className="order-info-item">
                <div className="order-info-label">Date</div>
                <div className="order-info-value">{new Date(order?.createdAt).toLocaleString()}</div>
              </div>
              <div className="order-info-item">
                <div className="order-info-label">Status</div>
                <div className="order-info-value">{order?.status ?? "Pending"}</div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="order-card">
            <div className="products-header">
              <h3>Products</h3>
            </div>

            <div className="products-list">
              {items.length === 0 ? (
                <div>No items</div>
              ) : (
                items.map((it, idx) => (
                  <div key={idx} className="product-item">
                    <div className="product-image">
                      {it.image ? (
                        <img src={it.image} alt={it.name} />
                      ) : (
                        <div style={{ color: "#9ca3af" }}>No image</div>
                      )}
                    </div>
                    
                    <div className="product-details">
                      <div className="product-name">{it.name}</div>
                     <div className="product-options">
  <div>Qty: {it.quantity}</div>
  {it.size && it.size !== "N/A" && <div>Size: {it.size}</div>}
  {it.paper && it.paper !== "N/A" && <div>Paper: {it.paper}</div>}
  {it.finish && it.finish !== "N/A" && <div>Finish: {it.finish}</div>}
  {it.corner && it.corner !== "N/A" && <div>Corner: {it.corner}</div>}
</div>
                    </div>
 <div className="product-pricing">
  <div className="product-line-total">
    {fmtCurrencyNZD(parseMoneyToDollars(it.lineTotal))}
  </div>
</div>
                  </div>
                ))
              )}
            </div>

            <div className="order-total-row">
              <div className="order-total-label">Total</div>
              <div className="order-total-amount">{fmtCurrencyNZD(totalDollars)}</div>
            </div>
          </div>

          <div className="back-button-container">
            <Link to="/account?tab=orders">
              <button className="back-button">
                Back to Orders
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
      
    </div>
  );
}