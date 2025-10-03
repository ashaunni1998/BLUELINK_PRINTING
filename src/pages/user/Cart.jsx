// Cart.jsx
import React, { useEffect, useState } from "react";
import { Trash2, ShoppingBag, ArrowLeft, CreditCard, Plus, Minus, ShoppingCart } from "lucide-react";

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
  const [updatingMap, setUpdatingMap] = useState({});

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

  const normalizeCart = (cartData) => {
    if (!cartData || !Array.isArray(cartData.items)) return [];

    return cartData.items.map((i, idx) => {
      const raw = i || {};
      const productObj = (raw.productId && typeof raw.productId === "object") ? raw.productId : raw.product || null;
      const productIdStr = productObj?._id ? String(productObj._id) : (raw.productId ? String(raw.productId) : `unknown-${idx}`);

      const qty = Number(raw.quantity ?? raw.qty ?? 1) || 1;

      const options = raw.options || raw.option || raw.designOptions || {};
      const designType = (options.designType || raw.designType || raw.design || "single").toString().toLowerCase();

      const normalizeChoice = (val) => {
        if (!val && val !== 0) return null;
        if (typeof val === "object") return val;
        return { name: String(val) };
      };

      const size = normalizeChoice(options.size ?? raw.size ?? raw.selectedSize);
      const paper = normalizeChoice(options.paper ?? raw.paper ?? raw.selectedPaper);
      const finish = normalizeChoice(options.finish ?? raw.finish);
      const corner = normalizeChoice(options.corner ?? raw.corner);

      const rawTiers = (productObj && (productObj.priceTiers || productObj.price_tiers || productObj.tiers || productObj.pricing?.priceTiers)) || null;

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

      const tier = rawTiers ? pickTierFromArr(rawTiers, qty) : null;

      const savedUnit = (raw.unitPrice !== undefined && raw.unitPrice !== null) ? Number(raw.unitPrice) : NaN;
      const savedShip = (raw.shippingPrice !== undefined && raw.shippingPrice !== null) ? Number(raw.shippingPrice) : NaN;

      let unitPrice = Number.isFinite(savedUnit) ? savedUnit : NaN;
      let shippingPrice = Number.isFinite(savedShip) ? savedShip : NaN;

      if ((!Number.isFinite(unitPrice) || !Number.isFinite(shippingPrice)) && tier) {
        unitPrice = Number(tier.priceSingle ?? tier.price ?? 0);
        shippingPrice = Number(tier.shippingCharge ?? tier.shippingPrice ?? 0);
      }

      if (!Number.isFinite(unitPrice) && productObj) unitPrice = Number(productObj.basePrice ?? productObj.price ?? 0);
      if (!Number.isFinite(shippingPrice) && productObj) shippingPrice = Number(productObj.shippingCharge ?? productObj.shippingPrice ?? 0);

      if (!Number.isFinite(unitPrice)) unitPrice = 0;
      if (!Number.isFinite(shippingPrice)) shippingPrice = 0;

      const lineTotal = Number((unitPrice + shippingPrice).toFixed(2));

      const image =
        (Array.isArray(raw.userImage) && raw.userImage.length && raw.userImage[0]) ||
        (raw.preparedPreview) ||
        (raw.uploadedUrl) ||
        ((Array.isArray(raw.images) && raw.images.length && raw.images[0]) ? raw.images[0] : null) ||
        ((Array.isArray(productObj?.images) && productObj.images.length && productObj.images[0]) ? productObj.images[0] : productObj?.image ?? "");

      const name = productObj?.name ?? raw.rawName ?? raw.name ?? "(Product unavailable)";

      return {
        raw,
        id: productIdStr,
        name,
        image,
        qty,
        allowedQtyOptions: (Array.isArray(productObj?.priceTiers) ? productObj.priceTiers.map(t => Number(t.qty ?? t.quantity ?? t.minQty ?? 0)).filter(Boolean) : [qty]),
        unitPrice,
        shippingPrice,
        lineTotal,
        designType,
        product: productObj,
        size,
        paper,
        finish,
        corner,
        options: { ...options, size, paper, finish, corner }
      };
    });
  };

  const fetchProductById = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/product/productDetails/${encodeURIComponent(id)}`, { credentials: "include" });
      if (!res.ok) {
        console.warn("fetchProductById failed", id, res.status);
        return null;
      }
      const payload = await res.json().catch(() => null);
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

      const candidate = payload?.cart ?? payload?.cartData ?? payload?.data ?? payload ?? null;
      const candidateAlt = payload?.data?.cart ?? payload?.data ?? null;
      const cart = Array.isArray(candidate?.items) ? candidate : (Array.isArray(candidateAlt?.items) ? candidateAlt : null);

      if (!cart || !Array.isArray(cart.items)) {
        const maybeId = candidate?._id ?? candidate?.id ?? candidate?.cartId ?? payload?.cart?._id ?? payload?.data?._id ?? null;
        setCartId(maybeId ? String(maybeId) : null);
        setItems([]);
        setLoading(false);
        return;
      }

      const resolvedCartId = cart._id ?? cart.id ?? cart.cartId ?? payload?.cart?._id ?? payload?.data?._id ?? null;
      if (resolvedCartId) setCartId(String(resolvedCartId));

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
      }

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

  const updateCartQty = async (cartItemIdOrProductId, newQty) => {
    const item = items.find(it =>
      String(it.raw?._id) === String(cartItemIdOrProductId) ||
      String(it.id) === String(cartItemIdOrProductId) ||
      String(it.raw?.productId) === String(cartItemIdOrProductId)
    );

    const productIdFromItem = item?.product?._id || item?.raw?.productId || item?.id || null;
    const cartItemIdFromItem = item?.raw?._id ?? null;
    const cartIdToSend = cartId || (item?.raw && (item.raw.cartId || item.raw.cart?._id || item.raw.cart?.id)) || "";

    if (!productIdFromItem && !cartItemIdFromItem) {
      await fetchCart();
      return;
    }

    setItems(prev => prev.map(it =>
      (String(it.raw?._id) === String(cartItemIdOrProductId) ||
       String(it.id) === String(cartItemIdOrProductId) ||
       String(it.raw?.productId) === String(cartItemIdOrProductId))
        ? { ...it, qty: Number(newQty) }
        : it
    ));
    setUpdatingMap(m => ({ ...m, [cartItemIdOrProductId]: true }));

    const body = { newQty: Number(newQty) };
    if (cartItemIdFromItem) body.cartItemId = String(cartItemIdFromItem);
    if (productIdFromItem) body.productId = String(productIdFromItem);
    if (cartIdToSend) body.cartId = String(cartIdToSend);

    try {
      const res = await fetch(`${API_BASE_URL}/updateCartQuantity`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      let json = null;
      try { json = await res.json(); } catch (e) { /* ignore */ }

      if (!res.ok) {
        await fetchCart();
        return;
      }

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

  const removeItem = async (productId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/removeCartItem?productId=${encodeURIComponent(productId)}`,
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

  const subtotal = items.reduce((s, it) => s + (Number(it.unitPrice || 0) ), 0);
  const shippingTotal = items.reduce(
    (s, it) => s + Number(it.shippingPrice || 0),
    0
  );
  const total = subtotal + shippingTotal;

  if (loading)
    return <div style={{ padding: 40, textAlign: "center" }}>Loading cart…</div>;

  return (
    <>
      <style>{`
        .cart-container {
          width: 60%;
          padding: 1rem;
          box-sizing: border-box;
        }

        /* Mobile: full width with side padding */
        @media (max-width: 768px) {
          .cart-container {
            max-width: 100%;
            margin: 0 auto;
            padding: 1rem;
          }
        }

        /* Tablet and up: aligned layout */
        @media (min-width: 769px) {
          .cart-container {
            max-width: 75%;
            margin: 0 25% 0 17%;
            padding: 2rem 1rem;
          }
        }

        .cart-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .cart-grid {
            grid-template-columns: 2fr 1fr;
          }
        }

        .cart-item-card {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          padding: 1rem;
          border-bottom: 1px solid #eee;
          background: white;
          border-radius: 0.5rem;
          margin-bottom: 0.5rem;
        }

        @media (max-width: 640px) {
          .cart-item-card {
            flex-direction: column;
            gap: 0.75rem;
          }
        }

        .cart-item-image {
          width: 80px;
          height: 80px;
          border-radius: 0.5rem;
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (min-width: 641px) {
          .cart-item-image {
            width: 100px;
            height: 100px;
          }
        }

        .cart-item-details {
          flex: 1;
          min-width: 0;
        }

        .cart-item-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: #374151;
          margin-top: 0.5rem;
        }

        @media (max-width: 640px) {
          .cart-item-options {
            gap: 0.5rem;
            font-size: 0.8125rem;
          }
        }

        .cart-item-price {
          text-align: right;
          min-width: 100px;
        }

        @media (max-width: 640px) {
          .cart-item-price {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }
        }

        .header-section {
          margin-bottom: 2rem;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .summary-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          padding: 1.5rem;
        }

        @media (min-width: 1024px) {
          .summary-card {
            position: sticky;
            top: 2rem;
          }
        }

        .btn-primary {
          width: 100%;
          background-color: #007abf;
          color: white;
          font-weight: 600;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s;
          text-decoration: none;
        }

        .btn-primary:hover {
          background-color: #006599;
          transform: scale(1.02);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .btn-secondary {
          width: 100%;
          background: white;
          color: #374151;
          font-weight: 600;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          border: 2px solid #e5e7eb;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s;
          text-decoration: none;
        }

        .btn-secondary:hover {
          border-color: #d1d5db;
          background: #f9fafb;
        }

        .empty-cart {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          padding: 3rem 1.5rem;
          text-align: center;
        }

        .quantity-select {
          margin-left: 0.375rem;
          padding: 0.375rem 0.625rem;
          border-radius: 0.375rem;
          border: 1px solid #d1d5db;
          font-size: 0.875rem;
        }
      `}</style>

      <div className="responsive-container">
        <div className="page-container"> 
          <Header />

          <div className="cart-container">
            {/* <div className="header-section">
              <div className="header-title">
                <div style={{ padding: '0.5rem', background: 'linear-gradient(to right, #4f46e5, #7c3aed)', borderRadius: '0.5rem' }}>
                  <ShoppingBag style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </div>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Shopping Cart</h1>
              </div>
              <p style={{ color: '#6b7280', margin: 0 }}>
                {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div> */}

            {items.length === 0 ? (
              <div className="empty-cart">
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '5rem', height: '5rem', background: '#f3f4f6', borderRadius: '50%', marginBottom: '1.5rem' }}>
                  <ShoppingCart style={{ width: '2.5rem', height: '2.5rem', color: '#9ca3af' }} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Your cart is empty</h2>
                <p style={{ color: '#6b7280', marginBottom: '2rem', maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}>
                  Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
                </p>
                <a href="/" className="btn-primary" style={{ display: 'inline-flex', width: 'auto', padding: '0.75rem 1.5rem' }}>
                  <ArrowLeft style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span>Continue Shopping</span>
                </a>
              </div>
            ) : (
              <div className="cart-grid">
                <div>
                  {items.map((item, idx) => {
                    const cartItemId = item.raw?._id ?? null;
                    const keyId = cartItemId ? cartItemId : `${item.id}-${idx}`;

                    return (
                     <div key={keyId} className="cart-item-card">
  {/*
    Resolve uploadedImage from multiple possible shapes:
    - item.images (preferred)
    - item.userImage (alternate)
    - item.raw.images (maybe nested from API)
    - item.image (existing product image fallback)
  */}
  {(() => {
    const uploadedImage =
  (item?.images && item.images.length > 0 && item.images[0]) ||
  (item?.userImage && item.userImage.length > 0 && item.userImage[0]) ||
  (item?.raw?.images && item.raw.images.length > 0 && item.raw.images[0]) ||
  item?.image ||
  null;

    return (
      <>
        <div
          className="cart-item-image"
          style={{ background: uploadedImage ? "#fff" : "#f3f4f6" }}
        >
          {uploadedImage ? (
            // Use an <img> so objectFit works — keep sizing consistent with your original styles
            <img
              src={uploadedImage}
              alt={item.name || item.product?.name || "Product"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.8125rem" }}>
              No image
            </div>
          )}
        </div>

        <div className="cart-item-details">
          <h3 style={{ margin: "0 0 0.375rem", fontSize: "1rem", fontWeight: "600" }}>
            {item.name}
          </h3>

          <div className="cart-item-options">
           <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
  <div>
    <span style={{ color: "#6b7280" }}>Design:</span>{" "}
    <strong style={{ textTransform: "capitalize" }}>{item.designType}</strong>
  </div>

  <div>
    <span style={{ color: "#6b7280" }}>Qty:</span>
    <select
      value={item.qty}
      onChange={(e) => {
        const newQty = e.target.value;
        const cartItemIdToSend = item.raw?._id ?? item.id;
        updateCartQty(cartItemIdToSend, newQty);
      }}
      disabled={!!updatingMap[item.raw?._id ?? item.id] || !cartId}
      className="quantity-select"
    >
      {item.allowedQtyOptions.map((q) => (
        <option key={`${item.id}-qty-${q}`} value={q}>
          {q}
        </option>
      ))}
    </select>
  </div>
</div>


            {item.selectedSize && (
              <div>
                <span style={{ color: "#6b7280" }}>Size:</span> <strong>{item.selectedSize}</strong>
              </div>
            )}
            {item.selectedPaper && (
              <div>
                <span style={{ color: "#6b7280" }}>Paper:</span> <strong>{item.selectedPaper}</strong>
              </div>
            )}
            {item.selectedFinish && (
              <div>
                <span style={{ color: "#6b7280" }}>Finish:</span> <strong>{item.selectedFinish}</strong>
              </div>
            )}
            {item.selectedCorner && (
              <div>
                <span style={{ color: "#6b7280" }}>Corner:</span> <strong>{item.selectedCorner}</strong>
              </div>
            )}
          </div>
        </div>

        <div className="cart-item-price">
          <div style={{ fontWeight: "700", fontSize: "1.125rem", color: "#111827", marginBottom: "0.5rem" }}>
            {currencySymbol(currency)}
            {formatMoney(item.unitPrice)}
          </div>
          <button
            onClick={() => removeItem(item.id)}
            style={{
              background: "transparent",
              border: "none",
              color: "#ef4444",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "0.875rem",
            }}
          >
            Remove
          </button>
        </div>
      </>
    );
  })()}
</div>

                    );
                  })}
                </div>

                <div>
                  <div className="summary-card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>Order Summary</h2>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', marginBottom: '1rem' }}>
                        <span>Subtotal ({items.length} items)</span>
                        <span>{currencySymbol(currency)}{formatMoney(subtotal)}</span>
                      </div>
                      
                      {shippingTotal > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', marginBottom: '1rem' }}>
                          <span>Shipping</span>
                          <span>{currencySymbol(currency)}{formatMoney(shippingTotal)}</span>
                        </div>
                      )}
                      
                      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                          <span>Total</span>
                          <span>{currencySymbol(currency)}{formatMoney(total)}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <a href="/checkout" className="btn-primary">
                        <CreditCard style={{ width: '1.25rem', height: '1.25rem' }} />
                        <span>Proceed to Checkout</span>
                      </a>
                      
                      <a href="/" className="btn-secondary">
                        <ArrowLeft style={{ width: '1.25rem', height: '1.25rem' }} />
                        <span>Continue Shopping</span>
                      </a>
                    </div>

                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontSize: '0.875rem', color: '#6b7280', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <div style={{ width: '0.5rem', height: '0.5rem', background: '#10b981', borderRadius: '50%' }}></div>
                          <span>Secure Checkout</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <div style={{ width: '0.5rem', height: '0.5rem', background: '#3b82f6', borderRadius: '50%' }}></div>
                          <span>Free Returns</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
}