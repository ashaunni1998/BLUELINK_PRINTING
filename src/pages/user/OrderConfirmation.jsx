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
      // price may be stored as total for qty or per-unit — prefer `lineTotal`/`priceForQty` if present
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
      <Header />
      <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
        {order || state.orderId ? (
          <>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ width:80, height:80, borderRadius:40, margin:"0 auto 12px", background:"#e6fffa", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, color:"#047857" }}>✓</div>
              <h1 style={{ fontSize:28, margin: "8px 0" }}>Order Confirmed!</h1>
              <p style={{ color:"#6b7280" }}>Thanks — we received your order and will begin processing it.</p>
            </div>

            <div style={{ background:"#fff", borderRadius:12, boxShadow:"0 6px 24px rgba(0,0,0,0.06)", overflow:"hidden" }}>
              <div style={{ padding:20, borderBottom:"1px solid #f1f5f9" }}>
                <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
                  <div><strong>Order ID</strong><div style={{ color:"#6b7280" }}>{order?._id ?? state.orderId}</div></div>
                  <div><strong>Date</strong><div style={{ color:"#6b7280" }}>{new Date(order?.createdAt || state.date || Date.now()).toLocaleString()}</div></div>
                  <div><strong>Status</strong><div style={{ color:"#6b7280" }}>{order?.status ?? "Pending"}</div></div>
                </div>
              </div>

              <div style={{ padding:20 }}>
                <h3 style={{ marginTop:0 }}>Order Summary</h3>
                <div>
                  {items.length === 0 ? <div style={{ color:"#6b7280" }}>No items available</div> : items.map((it, idx) => (
                    <div key={idx} style={{ display:"flex", gap:16, alignItems:"center", padding:"12px 0", borderBottom: idx < items.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                      <div style={{ width:86, height:86, borderRadius:8, overflow:"hidden", background:"#f9fafb", display:"flex", alignItems:"center", justifyContent:"center" }}>
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

                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:16, fontWeight:600 }}>{it.name}</div>
                        <div style={{ color:"#6b7280", marginTop:8, display:"flex", gap:12, flexWrap:"wrap" }}>
                          <div>Qty: {it.quantity}</div>
                          <div>Size: {it.size ?? "N/A"}</div>
                          <div>Paper: {it.paper ?? "N/A"}</div>
                          <div>Finish: {it.finish ?? "N/A"}</div>
                          <div>Corner: {it.corner ?? "N/A"}</div>
                        </div>
                      </div>

                      <div style={{ textAlign:"right", minWidth:120 }}>
                        <div style={{ fontWeight:700, fontSize:16 }}>{fmtCurrencyNZD(it.lineTotal && it.lineTotal>0 ? it.lineTotal : (it.unitPrice * it.quantity))}</div>
                        {it.unitPrice ? <div style={{ color:"#6b7280", fontSize:13 }}>{fmtCurrencyNZD(it.unitPrice)} / unit</div> : null}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 18, paddingTop: 14, borderTop:"1px solid #eef2f7", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ fontWeight:700 }}>Total</div>
                  <div style={{ fontSize:20, fontWeight:800, color:"#0369a1" }}>{fmtCurrencyNZD(totalDollars)}</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop:24, display:"flex", gap:12, justifyContent:"center" }}>
              <Link to="/account?tab=orders"><button style={{ padding:"12px 20px", background:"#0369a1", color:"#fff", borderRadius:8, border:"none" }}>View Orders</button></Link>
              <Link to="/"><button style={{ padding:"12px 20px", background:"transparent", color:"#0369a1", border:"2px solid #e6f2fb", borderRadius:8 }}>Continue Shopping</button></Link>
            </div>
          </>
        ) : (
          <div style={{ textAlign:"center", padding:"60px 20px" }}>
            <div style={{ width:80, height:80, borderRadius:40, margin:"0 auto 12px", background:"#fef3f2", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, color:"#b91c1c" }}>!</div>
            <h2>Order Information Missing</h2>
            <p style={{ color:"#6b7280" }}>We couldn't find order details. If you navigated here directly, open "My orders" to find your order.</p>
            <div style={{ marginTop:20 }}>
              <Link to="/account?tab=orders"><button style={{ padding:"10px 18px", background:"#0369a1", color:"#fff", borderRadius:8, border:"none" }}>View Your Orders</button></Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
