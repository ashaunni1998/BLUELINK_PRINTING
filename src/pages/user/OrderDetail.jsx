import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { API_BASE_URL } from "../../config";

/* Money parsing helpers */
function parseMoneyToDollars(value) {
  if (value == null) return 0;
  const n = Number(value);
  if (!isFinite(n)) return 0;
  if (Number.isInteger(n) && Math.abs(n) >= 1000) return n / 100;
  return n;
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

  const items = (order?.orderItems || []).map(i => ({
    name: i.name || i.title || i.productName || i.product?.name || "Product",
    quantity: Number(i.quantity ?? i.qty ?? 1) || 1,
    lineTotal: parseMoneyToDollars(i.lineTotal ?? i.price ?? i.total ?? i.unitTotal),
    unitPrice: parseMoneyToDollars(i.unitPrice ?? i.pricePerUnit ?? i.priceUnit),
    image: resolveImage(i),
    size: readOption(i, "size"),
    paper: readOption(i, "paper"),
    finish: readOption(i, "finish"),
    corner: readOption(i, "corner"),
  }));

  const totalDollars = (() => {
    const serverTotal = parseMoneyToDollars(order?.totalPrice ?? order?.total ?? order?.amount);
    if (serverTotal > 0) return serverTotal;
    let sum = 0;
    for (const it of items) {
      if (it.lineTotal > 0) sum += it.lineTotal;
      else if (it.unitPrice > 0) sum += it.unitPrice * it.quantity;
    }
    return Math.round((sum + Number.EPSILON) * 100) / 100;
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
      <Header />
    <div
  style={{
    backgroundColor: "#f5f8f6",
    padding: "1.875rem 0 2.5rem",
    marginLeft: "6%",
    marginRight: "6%",
    textAlign: "center",
  }}
>
  <div
    style={{
      maxWidth: "75%",
      margin: "0 16% 0 13%",
      padding: "0 1rem",
      textAlign: "left",
    }}
  >

        <h1 style={{ fontSize: 28, marginBottom: 20 }}>Order Details</h1>

        {/* Order Info */}
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 6px 24px rgba(0,0,0,0.06)", marginBottom: 20 }}>
          <div style={{ padding: 20, borderBottom: "1px solid #f1f5f9", display:"flex", flexWrap:"wrap", gap:20 }}>
            <div><strong>Order ID</strong><div style={{ color:"#6b7280" }}>{order?._id}</div></div>
            <div><strong>Date</strong><div style={{ color:"#6b7280" }}>{new Date(order?.createdAt).toLocaleString()}</div></div>
            <div><strong>Status</strong><div style={{ color:"#6b7280" }}>{order?.status ?? "Pending"}</div></div>
          </div>

          {/* {order?.shippingAddress && (
            <div style={{ padding: 20 }}>
              <strong>Shipping Address</strong>
              <div style={{ color:"#6b7280", marginTop:8 }}>
                {order.shippingAddress.name}<br />
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </div>
            </div>
          )} */}
        </div>

        {/* Items */}
        <div style={{ background:"#fff", borderRadius:12, boxShadow:"0 6px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ padding:20, borderBottom:"1px solid #f1f5f9" }}>
            <h3 style={{ margin:0 }}>Products</h3>
          </div>

          <div style={{ padding:20 }}>
            {items.length === 0 ? <div>No items</div> : items.map((it, idx) => (
              <div key={idx} style={{ display:"flex", gap:16, alignItems:"center", padding:"12px 0", borderBottom: idx < items.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                <div style={{ width:86, height:86, borderRadius:8, overflow:"hidden", background:"#f9fafb", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {it.image ? <img src={it.image} alt={it.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <div style={{ color:"#9ca3af" }}>No image</div>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600 }}>{it.name}</div>
                  <div style={{ color:"#6b7280", marginTop:8, display:"flex", flexWrap:"wrap", gap:10 }}>
                    <div>Qty: {it.quantity}</div>
                    <div>Size: {it.size ?? "N/A"}</div>
                    <div>Paper: {it.paper ?? "N/A"}</div>
                    <div>Finish: {it.finish ?? "N/A"}</div>
                    <div>Corner: {it.corner ?? "N/A"}</div>
                  </div>
                </div>
                <div style={{ textAlign:"right", minWidth:100 }}>
                  <div style={{ fontWeight:700 }}>{fmtCurrencyNZD(it.lineTotal || (it.unitPrice * it.quantity))}</div>
                  {it.unitPrice ? <div style={{ fontSize:13, color:"#6b7280" }}>{fmtCurrencyNZD(it.unitPrice)} / unit</div> : null}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding:"14px 20px", borderTop:"1px solid #eef2f7", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontWeight:700 }}>Total</div>
            <div style={{ fontSize:20, fontWeight:800, color:"#0369a1" }}>{fmtCurrencyNZD(totalDollars)}</div>
          </div>
        </div>

        <div style={{ marginTop:24, textAlign:"center" }}>
          <Link to="/account?tab=orders">
            <button style={{ padding:"12px 20px", background:"#0369a1", color:"#fff", borderRadius:8, border:"none" }}>
              Back to Orders
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
    </div>
  );
}
