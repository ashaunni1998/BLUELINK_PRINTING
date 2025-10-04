// src/pages/user/OrderConfirmation.jsx
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { API_BASE_URL } from "../../config";

/* Heuristic to convert many money shapes to dollars */
function parseMoneyToDollars(value) {
  if (value == null) return 0;
  const n = Number(value);
  if (!isFinite(n)) return 0;
  // if integer and large -> cents
  if (Number.isInteger(n) && Math.abs(n) >= 1000) return n / 100;
  return n;
}
function fmtCurrencyNZD(amount) {
  return new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(amount);
}

/* Helpers to robustly read images and options */
const resolveImage = (item) => {
  if (!item) return "";
  if (item.preparedPreview) return item.preparedPreview;
  if (item.uploadedUrl) return item.uploadedUrl;
  if (item.image) return typeof item.image === "string" ? item.image : (item.image.url || item.image.path || "");
  if (item.images && Array.isArray(item.images) && item.images.length) {
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

export default function OrderConfirmation() {
  const location = useLocation();
  const state = location.state || {};
  const [order, setOrder] = useState(state.order || null);
  const [loading, setLoading] = useState(false);
  const orderIdFromState = state.orderId || state.order?._id || null;

  useEffect(() => {
    // If route state includes full order object, keep it. Otherwise try fetch by orderId.
    if (!order && orderIdFromState) {
      (async () => {
        try {
          setLoading(true);
          const res = await fetch(`${API_BASE_URL}/order/${encodeURIComponent(orderIdFromState)}`, { credentials: "include" });
          if (!res.ok) {
            console.warn("OrderConfirmation fetch failed", res.status);
            setLoading(false);
            return;
          }
          const payload = await res.json().catch(() => null);
          const orderObj = payload?.order ?? payload?.data ?? payload;
          setOrder(orderObj || null);
        } catch (err) {
          console.error("OrderConfirmation error", err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [order, orderIdFromState]);

  const items = (order?.orderItems || state.items || state.products || []).map(i => {
    // normalize shapes: item might be product doc or cart item
    const itemObj = i || {};
    return {
      name: itemObj.name || itemObj.title || itemObj.productName || itemObj.product?.name || "Product",
      quantity: Number(itemObj.quantity ?? itemObj.qty ?? 1) || 1,
      // price may be stored as total for qty or per-unit – prefer `lineTotal`/`priceForQty` if present
      lineTotal: parseMoneyToDollars(itemObj.lineTotal ?? itemObj.price ?? itemObj.total ?? itemObj.unitTotal),
      unitPrice: parseMoneyToDollars(itemObj.unitPrice ?? itemObj.pricePerUnit ?? itemObj.priceUnit),
      image: resolveImage(itemObj),
      size: readOption(itemObj, "size"),
      paper: readOption(itemObj, "paper"),
      finish: readOption(itemObj, "finish"),
      corner: readOption(itemObj, "corner"),
    };
  });

  // compute safe total (prefer server total on order object)
  const totalDollars = (() => {
    const serverTotal = parseMoneyToDollars(order?.totalPrice ?? order?.total ?? order?.amount ?? state.total);
    if (serverTotal > 0) return serverTotal;
    // else sum lineTotal if present, else unitPrice*qty
    let sum = 0;
    for (const it of items) {
      if (it.lineTotal && it.lineTotal > 0) sum += it.lineTotal;
      else if (it.unitPrice && it.unitPrice > 0) sum += (it.unitPrice * (it.quantity || 1));
    }
    return Math.round((sum + Number.EPSILON) * 100) / 100;
  })();

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading order…</div>;

  return (
    <div className="responsive-container">
      <style>{`
        @media (max-width: 1023px) {
          .order-confirmation-wrapper {
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
        }

        .order-confirmation-wrapper {
          max-width: 65%;
          margin: 2.5rem 20% 2.5rem 17%;
          padding: 0 1.25rem;
        }

        @media (max-width: 1023px) {
          .order-confirmation-wrapper {
            max-width: 100%;
            margin: 2rem auto;
          }
        }

        @media (max-width: 767px) {
          .order-confirmation-wrapper {
            padding: 0 1rem;
            margin: 1.5rem auto;
          }
        }

        .order-title {
          font-size: 28px;
          margin: 8px 0;
        }

        @media (max-width: 767px) {
          .order-title {
            font-size: 24px;
          }
        }

        .order-subtitle {
          color: #6b7280;
          font-size: 16px;
        }

        @media (max-width: 767px) {
          .order-subtitle {
            font-size: 14px;
          }
        }

        .order-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.06);
          overflow: hidden;
        }

        @media (max-width: 767px) {
          .order-card {
            border-radius: 8px;
          }
        }

        .order-header {
          padding: 20px;
          border-bottom: 1px solid #f1f5f9;
        }

        @media (max-width: 767px) {
          .order-header {
            padding: 16px;
          }
        }

        .order-header-grid {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        @media (max-width: 767px) {
          .order-header-grid {
            gap: 16px;
            flex-direction: column;
          }
        }

        .order-body {
          padding: 20px;
        }

        @media (max-width: 767px) {
          .order-body {
            padding: 16px;
          }
        }

        .item-row {
          display: flex;
          gap: 16px;
          align-items: center;
          padding: 12px 0;
        }

        @media (max-width: 767px) {
          .item-row {
            gap: 12px;
            flex-direction: column;
            align-items: flex-start;
            padding: 16px 0;
          }
        }

        .item-image-container {
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

        @media (max-width: 767px) {
          .item-image-container {
            width: 100%;
            height: auto;
            aspect-ratio: 4/3;
          }
        }

        .item-details {
          flex: 1;
        }

        @media (max-width: 767px) {
          .item-details {
            width: 100%;
          }
        }

        .item-name {
          font-size: 16px;
          font-weight: 600;
        }

        @media (max-width: 767px) {
          .item-name {
            font-size: 15px;
          }
        }

        .item-options {
          color: #6b7280;
          margin-top: 8px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          font-size: 14px;
        }

        @media (max-width: 767px) {
          .item-options {
            font-size: 13px;
            gap: 8px;
          }
        }

        .item-price-container {
          text-align: right;
          min-width: 120px;
        }

        @media (max-width: 767px) {
          .item-price-container {
            text-align: left;
            width: 100%;
            min-width: auto;
          }
        }

        .item-price {
          font-weight: 700;
          font-size: 16px;
        }

        @media (max-width: 767px) {
          .item-price {
            font-size: 15px;
          }
        }

        .item-unit-price {
          color: #6b7280;
          font-size: 13px;
        }

        @media (max-width: 767px) {
          .item-unit-price {
            font-size: 12px;
          }
        }

        .order-total {
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid #eef2f7;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .total-label {
          font-weight: 700;
          font-size: 16px;
        }

        @media (max-width: 767px) {
          .total-label {
            font-size: 15px;
          }
        }

        .total-amount {
          font-size: 20px;
          font-weight: 800;
          color: #0369a1;
        }

        @media (max-width: 767px) {
          .total-amount {
            font-size: 18px;
          }
        }

        .action-buttons {
          margin-top: 24px;
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 767px) {
          .action-buttons {
            flex-direction: column;
            gap: 10px;
          }
        }

        .btn-primary {
          padding: 12px 20px;
          background: #0369a1;
          color: #fff;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 15px;
        }

        @media (max-width: 767px) {
          .btn-primary {
            width: 100%;
            padding: 14px 20px;
          }
        }

        .btn-secondary {
          padding: 12px 20px;
          background: transparent;
          color: #0369a1;
          border: 2px solid #e6f2fb;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
        }

        @media (max-width: 767px) {
          .btn-secondary {
            width: 100%;
            padding: 14px 20px;
          }
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        @media (max-width: 767px) {
          .empty-state {
            padding: 40px 16px;
          }
        }

        .icon-container {
          width: 80px;
          height: 80px;
          border-radius: 40px;
          margin: 0 auto 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
        }

        @media (max-width: 767px) {
          .icon-container {
            width: 64px;
            height: 64px;
            font-size: 28px;
          }
        }
      `}</style>

      <Header />
      
      <div className="order-confirmation-wrapper">
        {order || state.orderId ? (
          <>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div className="icon-container" style={{ background: "#e6fffa", color: "#047857" }}>✓</div>
              <h1 className="order-title">Order Confirmed!</h1>
              <p className="order-subtitle">Thanks – we received your order and will begin processing it.</p>
            </div>

            <div className="order-card">
              <div className="order-header">
                <div className="order-header-grid">
                  <div><strong>Order ID</strong><div style={{ color:"#6b7280" }}>{order?._id ?? state.orderId}</div></div>
                  <div><strong>Date</strong><div style={{ color:"#6b7280" }}>{new Date(order?.createdAt || state.date || Date.now()).toLocaleString()}</div></div>
                  <div><strong>Status</strong><div style={{ color:"#6b7280" }}>{order?.status ?? "Pending"}</div></div>
                </div>
              </div>

              <div className="order-body">
                <h3 style={{ marginTop:0 }}>Order Summary</h3>
                <div>
                  {items.length === 0 ? <div style={{ color:"#6b7280" }}>No items available</div> : items.map((it, idx) => (
                    <div key={idx} className="item-row" style={{ borderBottom: idx < items.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                      <div className="item-image-container">
                        {(() => {
                          let imageUrl = null;

                          // ✅ Prefer user uploaded images
                          if (it?.userImage && Array.isArray(it.userImage) && it.userImage.length) {
                            imageUrl = it.userImage[0];
                          } else if (it?.images && Array.isArray(it.images) && it.images.length) {
                            imageUrl = it.images[0];
                          } else if (it?.image) {
                            imageUrl = it.image;
                          } else if (it?.product?.image) {
                            imageUrl = it.product.image;
                          }

                          return imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={it.name || "Product"}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <div style={{ color: "#9ca3af" }}>No image</div>
                          );
                        })()}
                      </div>

                      <div className="item-details">
                        <div className="item-name">{it.name}</div>
                        <div className="item-options">
                          <div>Qty: {it.quantity}</div>
                          <div>Size: {it.size ?? "N/A"}</div>
                          <div>Paper: {it.paper ?? "N/A"}</div>
                          <div>Finish: {it.finish ?? "N/A"}</div>
                          <div>Corner: {it.corner ?? "N/A"}</div>
                        </div>
                      </div>

                      <div className="item-price-container">
                        <div className="item-price">{fmtCurrencyNZD(it.lineTotal && it.lineTotal>0 ? it.lineTotal : (it.unitPrice * it.quantity))}</div>
                        {it.unitPrice ? <div className="item-unit-price">{fmtCurrencyNZD(it.unitPrice)} / unit</div> : null}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-total">
                  <div className="total-label">Total</div>
                  <div className="total-amount">{fmtCurrencyNZD(totalDollars)}</div>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <Link to="/account?tab=orders"><button className="btn-primary">View Orders</button></Link>
              <Link to="/"><button className="btn-secondary">Continue Shopping</button></Link>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="icon-container" style={{ background: "#fef3f2", color: "#b91c1c" }}>!</div>
            <h2>Order Information Missing</h2>
            <p style={{ color:"#6b7280" }}>We couldn't find order details. If you navigated here directly, open "My orders" to find your order.</p>
            <div style={{ marginTop:20 }}>
              <Link to="/account?tab=orders"><button className="btn-primary">View Your Orders</button></Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}