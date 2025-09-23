// Cart.jsx
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { API_BASE_URL } from "../../config";

/**
 * Cart.jsx
 * - Uses product.priceTiers as canonical source of unit price / shipping / weight.
 * - Shows subtotal, total shipping (summary), total weight, total.
 * - Qty select lists only admin-defined tier qty values.
 * - Updates call PATCH /updateCartQuantity? (body: { cartId, productId, newQty })
 */

const currencySymbol = (s) => s ?? "$";

const formatMoney = (n) => {
  const num = Number(n || 0);
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function Cart() {
  const [items, setItems] = useState([]); // normalized items
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("$");

  // Given a product (possibly populated) and a requested qty, pick the best tier.
  // Behavior: exact match -> that tier; otherwise largest tier.qty <= qty; otherwise smallest tier.
  const pickTierForQty = (priceTiers = [], qty) => {
    if (!Array.isArray(priceTiers) || !priceTiers.length) return null;
    const sorted = [...priceTiers].map(t => ({ ...t, qty: Number(t.qty) })).sort((a,b) => a.qty - b.qty);
    const q = Number(qty);
    if (!Number.isFinite(q)) return sorted[0];

    const exact = sorted.find(t => t.qty === q);
    if (exact) return exact;
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i].qty <= q) return sorted[i];
    }
    return sorted[0];
  };

  // Normalize cart items returned by backend into a consistent shape used by UI.
  // Backend cart item 'i' expected fields: productId (maybe populated doc), quantity, images, options, unitPrice, shippingPrice, lineTotal
  const normalizeCart = (cartData) => {
    if (!cartData || !Array.isArray(cartData.items)) return [];
    const normalized = cartData.items.map((i) => {
      // product may be populated document or just objectid
      const product = (i.productId && typeof i.productId === "object") ? i.productId : null;
      const productId = product?._id ? String(product._id) : String(i.productId);
      const qty = Number(i.quantity || 1);
      const options = i.options || {};
      const designType = (options.designType || options.design || "single").toString().toLowerCase();

      // Find tier either from saved raw fields or from product.priceTiers
      let tierFromProduct = null;
      if (product && Array.isArray(product.priceTiers) && product.priceTiers.length) {
        tierFromProduct = pickTierForQty(product.priceTiers, qty);
      }

      // derive unitPrice, shippingPrice, weightGrams - priority:
      // 1) saved fields in cart item (unitPrice, shippingPrice, weightGrams if saved by backend)
      // 2) compute from tierFromProduct
      // 3) fallback to 0
      const savedUnit = Number(i.unitPrice ?? NaN);
      const savedShip = Number(i.shippingPrice ?? NaN);
      const savedWeight = Number(i.weightGrams ?? NaN);

      let unitPrice = Number.isFinite(savedUnit) ? savedUnit : 0;
      let shippingPrice = Number.isFinite(savedShip) ? savedShip : 0;
      let weightGrams = Number.isFinite(savedWeight) ? savedWeight : 0;
      let usedTierQty = null;

      if ((!Number.isFinite(savedUnit) || !Number.isFinite(savedShip) || !Number.isFinite(savedWeight)) && tierFromProduct) {
        usedTierQty = Number(tierFromProduct.qty);
        unitPrice = designType === "double" ? Number(tierFromProduct.priceDouble) : Number(tierFromProduct.priceSingle);
        shippingPrice = Number(tierFromProduct.shippingCharge || 0);
        weightGrams = Number(tierFromProduct.weightGrams || 0);
      }

      const lineTotal = Number((unitPrice * qty + shippingPrice).toFixed(2));

      // allowed qty options: take from product.priceTiers (admin-defined)
      const allowedQtyOptions = Array.isArray(product?.priceTiers) && product.priceTiers.length
        ? [...new Set(product.priceTiers.map(t => Number(t.qty)))].sort((a,b)=>a-b)
        : (Array.isArray(product?.allowedQuantities) ? product.allowedQuantities.map(n => Number(n)).sort((a,b)=>a-b) : [qty]);

      return {
        raw: i,
        id: productId,
        name: product?.name ?? i.rawName ?? "(Product unavailable)",
        desc: product?.description ?? "",
        image: Array.isArray(product?.images) && product.images.length ? product.images[0] : (i.images && i.images[0]) || "",
        qty,
        allowedQtyOptions,
        unitPrice,
        shippingPrice,
        weightGrams,
        lineTotal,
        designType,
        usedTierQty,
        product // keep full product for possible re-calculation
      };
    });

    return normalized;
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/getCart`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const payload = await res.json().catch(() => null);
      const cart = payload?.cartData ?? payload?.data ?? payload ?? null;
      if (!cart) {
        setItems([]);
        setCartId(null);
        setLoading(false);
        return;
      }
      setCartId(cart._id ?? null);
      // optionally read currency if backend returns it (common pattern)
      if (cart.currency) setCurrency(cart.currency);
      const normalized = normalizeCart(cart);
      setItems(normalized);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const updateCartQty = async (productId, newQty) => {
  console.log("Sending update:", { cartId, productId, newQty });

  // optimistic UI
  setItems(prev =>
    prev.map(it => it.id === productId ? { ...it, qty: Number(newQty) } : it)
  );

  try {
    const body = { 
      cartId: cartId || "", 
      productId, 
      quantity: Number(newQty)  // 👈 many backends expect "quantity" not "newQty"
    };

    const res = await fetch(`${API_BASE_URL}/updateCartQuantity`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("updateCartQuantity error:", json);
      await fetchCart(); // rollback if error
      return;
    }

    // 👇 refresh cart only if backend confirms update
    if (json.success || json.updated || json.cart) {
      await fetchCart();
    }
  } catch (err) {
    console.error("updateCartQty error:", err);
    await fetchCart();
  }
};


  const removeItem = async (productId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/removeCartItem?productId=${encodeURIComponent(productId)}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("removeCartItem failed:", json);
        return;
      }
      // update UI
      setItems(prev => prev.filter(it => it.id !== productId));
      await fetchCart();
    } catch (err) {
      console.error("removeItem error:", err);
      await fetchCart();
    }
  };

  // totals based on normalized items
  const subtotal = items.reduce((s, it) => s + (Number(it.unitPrice || 0) * Number(it.qty || 0)), 0);
  const shippingTotal = items.reduce((s, it) => s + Number(it.shippingPrice || 0), 0);
  const totalWeightGrams = items.reduce((s, it) => s + Number(it.weightGrams || 0), 0);
  const total = subtotal + shippingTotal;

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading cart…</div>;

  return (
    <div style={{ width: "100%",  padding: "0px 80px" }}>
      <Header />

      <main style={{ background: "#fff", padding: 20, borderRadius: 8 }}>
        <h1 style={{ fontSize: 22, marginBottom: 12 }}>🛒 Your Cart</h1>

        {items.length === 0 ? (
          <div style={{ padding: 20, color: "#6B7280" }}>Your cart is empty.</div>
        ) : (
          <>
            {items.map(item => (
              <div key={item.id} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "16px 0", borderBottom: "1px solid #EEE" }}>
                <div style={{ width: 120, height: 90, border: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={item.image || "https://via.placeholder.com/120x90"} alt={item.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }} />
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: 16 }}>{item.name}</h3>
                  <p style={{ margin: "6px 0 0", color: "#6B7280" }}>{item.desc}</p>

                  <div style={{ marginTop: 8, display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ color: "#374151", fontSize: 13 }}>Design:</div>
                      <div style={{ fontWeight: 700, textTransform: "capitalize" }}>{item.designType}</div>
                    </div>

                    <div>
                      <div style={{ color: "#374151", fontSize: 13 }}>Qty:</div>
                      <div style={{ marginTop: 6 }}>
                        <select
                          value={item.qty}
                          onChange={(e) => updateCartQty(item.id, e.target.value)}
                          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #D1D5DB" }}
                        >
                          {item.allowedQtyOptions.map(q => <option key={q} value={q}>{q}</option>)}
                        </select>
                      </div>
                    </div>

                    
                  </div>
                </div>

                <div style={{ textAlign: "right", minWidth: 120 }}>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{currencySymbol(currency)}{formatMoney(item.unitPrice * item.qty)}</div>
                  <button onClick={() => removeItem(item.id)} style={{ marginTop: 12, background: "transparent", border: "none", color: "#EF4444", cursor: "pointer", textDecoration: "underline" }}>Remove</button>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 20, borderTop: "1px solid #EEE", paddingTop: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#6B7280", marginBottom: 8 }}>
                <span>Subtotal</span>
                <span>{currencySymbol(currency)}{formatMoney(subtotal)}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", color: "#6B7280", marginBottom: 8 }}>
                <span>Shipping</span>
                <span>{currencySymbol(currency)}{formatMoney(shippingTotal)}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 18, marginTop: 12 }}>
                <span>Total</span>
                <span>{currencySymbol(currency)}{formatMoney(total)}</span>
              </div>

              <div style={{ marginTop: 8, color: "#6B7280" }}>
                <small>Total weight: {totalWeightGrams} g</small>
              </div>

              <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", gap: 12 }}>
                <a href="/"><button style={{ background: "#2563eb", color: "#fff", padding: "10px 16px", borderRadius: 8, border: "none" }}>← Continue Shopping</button></a>
                <a href="/checkout"><button style={{ background: "#06b6d4", color: "#fff", padding: "10px 16px", borderRadius: 8, border: "none", fontWeight: 700 }}>Proceed to Checkout</button></a>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
