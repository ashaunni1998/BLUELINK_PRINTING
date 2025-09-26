// Cart.jsx
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { API_BASE_URL } from "../../config";

const currencySymbol = (s) => s ?? "$";

const formatMoney = (n) => {
  const num = Number(n || 0);
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function Cart() {
  const [items, setItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("$");

  const pickTierForQty = (priceTiers = [], qty) => {
    if (!Array.isArray(priceTiers) || !priceTiers.length) return null;
    const sorted = [...priceTiers]
      .map((t) => ({ ...t, qty: Number(t.qty) }))
      .filter((t) => Number.isFinite(t.qty))
      .sort((a, b) => a.qty - b.qty);

    if (!sorted.length) return null;

    const q = Number(qty) || 0;
    const exact = sorted.find((t) => t.qty === q);
    if (exact) return exact;

    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i].qty <= q) return sorted[i];
    }

    return sorted[0];
  };

// REPLACE normalizeCart with this version
const normalizeCart = (cartData) => {
  if (!cartData || !Array.isArray(cartData.items)) return [];

  return cartData.items.map((i, idx) => {
    const raw = i;
    // product may be a populated object or just an id string
    const product = (i.productId && typeof i.productId === "object") ? i.productId : null;
    const productIdStr = product?._id ? String(product._id) : (i.productId ? String(i.productId) : `unknown-${idx}`);

    const qty = Number(i.quantity ?? 1) || 1;
    const options = i.options || {};
    const designType = (options.designType || options.design || "single").toString().toLowerCase();

    // Helper: find price tiers on the product under common field names
    const extractTiers = (p) => {
      if (!p || typeof p !== "object") return null;
      return p.priceTiers ?? p.price_tiers ?? p.tiers ?? p.pricing?.priceTiers ?? null;
    };
    const rawTiers = extractTiers(product);

    // Build allowedQtyOptions from product.priceTiers (qty / quantity / minQty)
    let allowedQtyOptions = [];
    if (Array.isArray(rawTiers) && rawTiers.length) {
      const qtys = rawTiers.map(t => Number(t.qty ?? t.quantity ?? t.minQty ?? null)).filter(n => Number.isFinite(n));
      allowedQtyOptions = [...new Set(qtys)].sort((a,b)=>a-b);
    }

    // fallback to any allowed list on item
    if (!allowedQtyOptions.length) {
      const itemCandidates = [ raw.allowedQtys, raw.allowedQuantities, raw.qtyOptions, raw.qty_list, raw.allowedQtyOptions ];
      for (const cand of itemCandidates) {
        if (Array.isArray(cand) && cand.length) {
          const v = cand.map(x => Number(x)).filter(n => Number.isFinite(n));
          if (v.length) { allowedQtyOptions = [...new Set(v)].sort((a,b)=>a-b); break; }
        }
      }
    }

    if (!allowedQtyOptions.length) allowedQtyOptions = [qty];

    // helper to pick a tier from an array (makes qty field tolerant)
    const pickTierFromArr = (arr = [], q) => {
      if (!Array.isArray(arr) || !arr.length) return null;
      const sorted = arr.map(t => ({ ...t, _qty: Number(t.qty ?? t.quantity ?? t.minQty ?? 0) }))
                        .filter(t => Number.isFinite(t._qty))
                        .sort((a,b)=>a._qty-b._qty);
      if (!sorted.length) return null;
      const exact = sorted.find(t => t._qty === Number(q));
      if (exact) return exact;
      for (let i = sorted.length - 1; i >= 0; i--) {
        if (sorted[i]._qty <= Number(q)) return sorted[i];
      }
      return sorted[0];
    };

    const tierFromProduct = rawTiers ? pickTierFromArr(rawTiers, qty) : null;

    // snapshot values stored on cart item
    const savedUnit = (i.unitPrice !== undefined && i.unitPrice !== null) ? Number(i.unitPrice) : NaN;
    const savedShip = (i.shippingPrice !== undefined && i.shippingPrice !== null) ? Number(i.shippingPrice) : NaN;

    let unitPrice = Number.isFinite(savedUnit) ? savedUnit : NaN;
    let shippingPrice = Number.isFinite(savedShip) ? savedShip : NaN;

    if ((!Number.isFinite(unitPrice) || !Number.isFinite(shippingPrice)) && tierFromProduct) {
      unitPrice = designType === "double"
        ? Number(tierFromProduct.priceDouble ?? tierFromProduct.priceSingle ?? tierFromProduct.price ?? 0)
        : Number(tierFromProduct.priceSingle ?? tierFromProduct.price ?? 0);
      shippingPrice = Number(tierFromProduct.shippingCharge ?? tierFromProduct.shippingPrice ?? 0);
    }

    if (!Number.isFinite(unitPrice) && product) unitPrice = Number(product.basePrice ?? product.price ?? 0);
    if (!Number.isFinite(shippingPrice) && product) shippingPrice = Number(product.shippingCharge ?? product.shippingPrice ?? 0);

    if (!Number.isFinite(unitPrice)) unitPrice = 0;
    if (!Number.isFinite(shippingPrice)) shippingPrice = 0;

    const lineTotal = Number((unitPrice + shippingPrice).toFixed(2));
    const image = (Array.isArray(product?.images) && product.images.length) ? product.images[0] : (raw.images && raw.images[0]) || "";
    const name = product?.name ?? raw.rawName ?? raw.name ?? "(Product unavailable)";

    return {
      raw,
      id: productIdStr,
      name,
      // desc: product?.description ?? raw.description ?? "",
      image,
      qty,
      allowedQtyOptions,
      unitPrice,
      shippingPrice,
      lineTotal,
      designType,
      product
    };
  });
};



// helper used by fetchCart (robust)
const fetchProductById = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/product/productDetails/${encodeURIComponent(id)}`, { credentials: "include" });
    if (!res.ok) {
      console.warn("fetchProductById failed", id, res.status);
      return null;
    }
    const payload = await res.json().catch(() => null);
    // your product endpoint returns { message, data: { ...product... } }
    return payload?.data ?? payload?.product ?? payload ?? null;
  } catch (err) {
    console.error("fetchProductById error", id, err);
    return null;
  }
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
    console.debug("fetchCart raw payload:", payload);

    // try common wrappers for cart object
    const candidate = payload?.cart ?? payload?.cartData ?? payload?.data ?? payload ?? null;
    const candidateAlt = payload?.data?.cart ?? payload?.data ?? null;
    const cart = Array.isArray(candidate?.items) ? candidate : (Array.isArray(candidateAlt?.items) ? candidateAlt : null);

    if (!cart || !Array.isArray(cart.items)) {
      const maybeId = candidate?._id ?? candidate?.id ?? candidate?.cartId ?? payload?.cart?._id ?? payload?.data?._id ?? null;
      console.warn("fetchCart: could not resolve cart.items; payload:", payload);
      setCartId(maybeId ? String(maybeId) : null);
      setItems([]);
      setLoading(false);
      return;
    }

    // store cartId if present
    const resolvedCartId = cart._id ?? cart.id ?? cart.cartId ?? payload?.cart?._id ?? payload?.data?._id ?? null;
    if (resolvedCartId) setCartId(String(resolvedCartId));

    // find productIds that are primitive and fetch product details
    const missingProductIds = cart.items
      .filter(it => it.productId && typeof it.productId !== "object")
      .map(it => String(it.productId))
      .filter(Boolean);

    let productMap = {};
    if (missingProductIds.length) {
      const uniqueIds = [...new Set(missingProductIds)];
      const fetches = uniqueIds.map(id => fetchProductById(id).then(p => ({ id, p })));
      const results = await Promise.all(fetches);
      for (const r of results) {
        if (r?.p) productMap[String(r.id)] = r.p;
      }
      console.debug("fetchCart -> productMap keys:", Object.keys(productMap));
    }

    // inject fetched product objects into items so normalizeCart can use them
    const cartWithProducts = {
      ...cart,
      items: cart.items.map(it => {
        if (it.productId && typeof it.productId !== "object") {
          const idStr = String(it.productId);
          const fetched = productMap[idStr] ?? null;
          return fetched ? { ...it, productId: fetched } : it;
        }
        return it;
      })
    };

    const normalized = normalizeCart(cartWithProducts);
    setItems(normalized);
  } catch (err) {
    console.error("fetchCart error:", err);
    setItems([]);
    setCartId(null);
  } finally {
    setLoading(false);
  }
};


// REPLACE updateCartQty with this
const updateCartQty = async (cartItemIdOrProductId, newQty) => {
  // find UI item to resolve productId and cartItemId
  const item = items.find(it =>
    String(it.raw?._id) === String(cartItemIdOrProductId) ||
    String(it.id) === String(cartItemIdOrProductId) ||
    String(it.raw?.productId) === String(cartItemIdOrProductId)
  );

  const productIdFromItem = item?.product?._id || item?.raw?.productId || item?.id || null;
  const cartItemIdFromItem = item?.raw?._id ?? null;
  const cartIdToSend = cartId || (item?.raw && (item.raw.cartId || item.raw.cart?._id || item.raw.cart?.id)) || "";

  if (!productIdFromItem && !cartItemIdFromItem) {
    console.warn("updateCartQty: cannot resolve productId or cartItemId", { cartItemIdOrProductId, item, cartId });
    await fetchCart();
    return;
  }

  // optimistic UI update
  setItems(prev => prev.map(it =>
    (String(it.raw?._id) === String(cartItemIdOrProductId) ||
     String(it.id) === String(cartItemIdOrProductId) ||
     String(it.raw?.productId) === String(cartItemIdOrProductId))
      ? { ...it, qty: Number(newQty) }
      : it
  ));
  setUpdatingMap(m => ({ ...m, [cartItemIdOrProductId]: true }));

  // Build body: include cartItemId (most reliable), productId and cartId as fallbacks
  const body = { newQty: Number(newQty) };
  if (cartItemIdFromItem) body.cartItemId = String(cartItemIdFromItem);
  if (productIdFromItem) body.productId = String(productIdFromItem);
  if (cartIdToSend) body.cartId = String(cartIdToSend);

  console.debug("updateCartQty sending body:", body);

  try {
    const res = await fetch(`${API_BASE_URL}/updateCartQuantity`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    let json = null;
    try { json = await res.json(); } catch (e) { /* ignore */ }
    console.debug("updateCartQty response:", res.status, json);

    if (!res.ok) {
      console.error("updateCartQty server error:", json);
      await fetchCart(); // revert
      return;
    }

    // success -> refresh authoritative cart
    await fetchCart();
  } catch (err) {
    console.error("updateCartQty error:", err);
    await fetchCart();
  } finally {
    setUpdatingMap(m => {
      const copy = { ...m };
      delete copy[cartItemIdOrProductId];
      return copy;
    });
  }
};


  useEffect(() => {
    fetchCart();
  }, []);
const [updatingMap, setUpdatingMap] = useState({});



  const removeItem = async (productId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/removeCartItem?productId=${encodeURIComponent(
          productId
        )}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) {
        return;
      }
      setItems((prev) => prev.filter((it) => it.id !== productId));
      await fetchCart();
    } catch (err) {
      console.error("removeItem error:", err);
      await fetchCart();
    }
  };

  // FIXED: do not multiply by qty, since unitPrice is tier price
  const subtotal = items.reduce((s, it) => s + (Number(it.unitPrice || 0) ), 0);
  const shippingTotal = items.reduce(
    (s, it) => s + Number(it.shippingPrice || 0),
    0
  );
  const total = subtotal + shippingTotal;

  if (loading)
    return <div style={{ padding: 40, textAlign: "center" }}>Loading cart…</div>;

  return (
      <div className="responsive-container">
    <div className="page-container"> 
      <Header />

      <main style={{ background: "#fff", padding: 20, borderRadius: 8,maxWidth:"80%",margin:"20px auto" }}>
        <h1 style={{ fontSize: 22, marginBottom: 12 }}>🛒 Your Cart</h1>

        {items.length === 0 ? (
          <div style={{ padding: 20, color: "#6B7280" }}>
            Your cart is empty.
          </div>
        ) : (
          <>
{items.map((item, idx) => {
  const cartItemId = item.raw?._id ?? null;
  const keyId = cartItemId ? cartItemId : `${item.id}-${idx}`;

  return (
    <div
  
      className="cart-item"
    >
      {/* Image */}
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: 8,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F9FAFB",
        }}
      >
        <img
          src={item.image || "https://via.placeholder.com/100"}
          alt={item.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Details */}
      <div>
        <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 600 }}>
          {item.name}
        </h3>

        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            fontSize: 14,
            color: "#374151",
          }}
        >
          <div>
            <span style={{ color: "#6B7280" }}>Design:</span>{" "}
            <strong style={{ textTransform: "capitalize" }}>
              {item.designType}
            </strong>
          </div>

          <div>
            <span style={{ color: "#6B7280" }}>Qty:</span>{" "}
            <select
              value={item.qty}
              onChange={(e) => {
                const newQty = e.target.value;
                const cartItemId = item.raw?._id ?? item.id;
                updateCartQty(cartItemId, newQty);
              }}
              disabled={!!updatingMap[item.raw?._id ?? item.id] || !cartId}
              style={{
                marginLeft: 6,
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid #D1D5DB",
              }}
            >
              {item.allowedQtyOptions.map((q) => (
                <option key={`${item.id}-qty-${q}`} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Price + Remove */}
      <div style={{ textAlign: "right" }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>
          {currencySymbol(currency)}
          {formatMoney(item.unitPrice)}
        </div>
        <button
          onClick={() => removeItem(item.id)}
          style={{
            marginTop: 10,
            background: "transparent",
            border: "none",
            color: "#EF4444",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: 14,
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
})}




            <div
              style={{
                marginTop: 20,
                borderTop: "1px solid #EEE",
                paddingTop: 20,
              }}
            >
              

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                  fontSize: 18,
                  marginTop: 12,
                }}
              >
                <span>Total</span>
                <span>
                  {currencySymbol(currency)}
                  {formatMoney(subtotal)}
                </span>
              </div>

              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <a href="/">
                  <button
                    style={{
                      background: "#2563eb",
                      color: "#fff",
                      padding: "10px 16px",
                      borderRadius: 8,
                      border: "none",
                    }}
                  >
                    ← Continue Shopping
                  </button>
                </a>
                <a href="/checkout">
                  <button
                    style={{
                      background: "#06b6d4",
                      color: "#fff",
                      padding: "10px 16px",
                      borderRadius: 8,
                      border: "none",
                      fontWeight: 700,
                    }}
                  >
                    Proceed to Checkout
                  </button>
                </a>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
    </div>
    
  );
}
