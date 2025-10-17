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
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    background: #f9fafb;
  }

  .page-container {
    padding: 0;
    margin: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .responsive-container {
    padding: 0;
    margin: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  /* Header and Footer: let them be full-width */
  header {
    width: 100%;
    margin: 0;
    padding: 0;
  }

  footer {
    width: 100%;
    margin: 0;
    padding: 0;
    margin-top: auto;
  }

  .unified-cart-container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 1.5rem 1rem;
    width: 100%;
    box-sizing: border-box;
    min-height: calc(100vh - 200px);
  }

  @media (max-width: 1049px) {
    .unified-cart-container {
      padding: 1.5rem 1rem;
    }
  }

  @media (min-width: 1050px) and (max-width: 1199px) {
    .unified-cart-container {
      padding: 1.875rem 1.5rem;
    }
  }

  @media (min-width: 1200px) {
    .unified-cart-container {
      padding: 1.875rem 2.5rem;
    }
  }

  .cart-header {
    margin-bottom: 1.5rem;
  }

  .cart-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  .cart-subtitle {
    color: #6b7280;
    font-size: 0.9375rem;
  }

  .unified-cart-content {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 1rem;
    overflow: hidden;
  }

  .cart-item {
    padding: 1.25rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    gap: 1rem;
    flex-direction: column;
  }

  @media (min-width: 640px) {
    .cart-item {
      flex-direction: row;
      gap: 1.5rem;
      padding: 1.5rem;
    }
  }

  .cart-item:last-of-type {
    border-bottom: 2px solid #e5e7eb;
  }

  .item-image-wrapper {
    flex-shrink: 0;
    width: 100%;
    height: 180px;
    border-radius: 0.75rem;
    overflow: hidden;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (min-width: 640px) {
    .item-image-wrapper {
      width: 120px;
      height: 120px;
    }
  }

  .item-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .item-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .item-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }

  .item-price {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    white-space: nowrap;
  }

  .item-options {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .item-option {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .item-option strong {
    color: #374151;
    text-transform: capitalize;
  }

  .quantity-select {
    padding: 0.375rem 0.625rem;
    border-radius: 0.375rem;
    border: 1px solid #d1d5db;
    font-size: 0.875rem;
    background: white;
    cursor: pointer;
    color: #374151;
  }

  .quantity-select:focus {
    outline: none;
    border-color: #007abf;
    box-shadow: 0 0 0 3px rgba(0, 122, 191, 0.1);
  }

  .quantity-select:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .remove-btn {
    background: transparent;
    border: none;
    color: #ef4444;
    cursor: pointer;
    font-size: 0.875rem;
    padding: 0.25rem 0;
    text-decoration: underline;
    margin-top: 0.25rem;
    align-self: flex-start;
  }

  .remove-btn:hover {
    color: #dc2626;
  }

  .cart-summary {
    padding: 1.5rem 1.25rem;
    background: #f9fafb;
  }

  @media (min-width: 640px) {
    .cart-summary {
      padding: 2rem 1.5rem;
    }
  }

  .summary-rows {
    margin-bottom: 1.5rem;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    font-size: 0.9375rem;
  }

  .summary-row-label {
    color: #6b7280;
  }

  .summary-row-value {
    color: #374151;
    font-weight: 500;
  }

  .summary-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 2px solid #e5e7eb;
    margin-bottom: 1.5rem;
  }

  .summary-total-label {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
  }

  .summary-total-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  @media (min-width: 640px) {
    .action-buttons {
      flex-direction: row;
      gap: 1rem;
    }
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    border-radius: 0.75rem;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    border: none;
    flex: 1;
  }

  .btn-primary {
    background: #007abf;
    color: white;
  }

  .btn-primary:hover {
    background: #006599;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 122, 191, 0.3);
  }

  .btn-secondary {
    background: white;
    color: #374151;
    border: 2px solid #e5e7eb;
  }

  .btn-secondary:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  .trust-badges {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
    flex-wrap: wrap;
  }

  .trust-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .trust-badge-icon {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 1.5rem;
    background: white;
    border-radius: 1rem;
    border: 1px solid #e5e7eb;
  }

  .empty-icon {
    width: 5rem;
    height: 5rem;
    margin: 0 auto 1.5rem;
    background: #f3f4f6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .empty-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.75rem;
  }

  .empty-text {
    color: #6b7280;
    margin-bottom: 2rem;
    max-width: 28rem;
    margin-left: auto;
    margin-right: auto;
  }
`}</style>





      <div className="page-container">
        <div className="responsive-container">
          <Header />

          <div className="unified-cart-container">
            {items.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <ShoppingCart style={{ width: '2.5rem', height: '2.5rem', color: '#9ca3af' }} />
                </div>
                <h2 className="empty-title">Your cart is empty</h2>
                <p className="empty-text">
                  Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
                </p>
                <a href="/" className="btn btn-primary" style={{ display: 'inline-flex', flex: 'none' }}>
                  <ArrowLeft style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span>Continue Shopping</span>
                </a>
              </div>
            ) : (
              <>
                <div className="cart-header">
                  <h1 className="cart-title">Shopping Cart</h1>
                  <p className="cart-subtitle">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
                </div>

                <div className="unified-cart-content">
                  {/* Cart Items */}
                  {items.map((item, idx) => {
                    const cartItemId = item.raw?._id ?? null;
                    const keyId = cartItemId ? cartItemId : `${item.id}-${idx}`;
                    const uploadedImage =
                      (item?.images && item.images.length > 0 && item.images[0]) ||
                      (item?.userImage && item.userImage.length > 0 && item.userImage[0]) ||
                      (item?.raw?.images && item.raw.images.length > 0 && item.raw.images[0]) ||
                      item?.image ||
                      null;

                    return (
                      <div key={keyId} className="cart-item">
                        <div className="item-image-wrapper">
                          {uploadedImage ? (
                            <img
                              src={uploadedImage}
                              alt={item.name || "Product"}
                              className="item-image"
                            />
                          ) : (
                            <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.8125rem" }}>
                              No image
                            </div>
                          )}
                        </div>

                        <div className="item-details">
                          <div className="item-header">
                            <h3 className="item-name">{item.name}</h3>
                            <div className="item-price">
                              {currencySymbol(currency)}{formatMoney(item.unitPrice)}
                            </div>
                          </div>

                          <div className="item-options">
                            <div className="item-option">
                              <span>Design:</span>
                              <strong>{item.designType}</strong>
                            </div>

                            <div className="item-option">
                              <span>Qty:</span>
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

                            {item.size?.name && (
                              <div className="item-option">
                                <span>Size:</span>
                                <strong>{item.size.name}</strong>
                              </div>
                            )}

                            {item.paper?.name && (
                              <div className="item-option">
                                <span>Paper:</span>
                                <strong>{item.paper.name}</strong>
                              </div>
                            )}

                            {item.finish?.name && (
                              <div className="item-option">
                                <span>Finish:</span>
                                <strong>{item.finish.name}</strong>
                              </div>
                            )}

                            {item.corner?.name && (
                              <div className="item-option">
                                <span>Corner:</span>
                                <strong>{item.corner.name}</strong>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="remove-btn"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Order Summary */}
                  <div className="cart-summary">
                    <div className="summary-rows">
                      <div className="summary-row">
                        <span className="summary-row-label">Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                        <span className="summary-row-value">
                          {currencySymbol(currency)}{formatMoney(subtotal)}
                        </span>
                      </div>

                      {shippingTotal > 0 && (
                        <div className="summary-row">
                          <span className="summary-row-label">Shipping</span>
                          <span className="summary-row-value">
                            {currencySymbol(currency)}{formatMoney(shippingTotal)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="summary-total">
                      <span className="summary-total-label">Total</span>
                      <span className="summary-total-value">
                        {currencySymbol(currency)}{formatMoney(total)}
                      </span>
                    </div>

                    <div className="action-buttons">
                      <a href="/checkout" className="btn btn-primary">
                        <CreditCard style={{ width: '1.25rem', height: '1.25rem' }} />
                        <span>Proceed to Checkout</span>
                      </a>
                      <a href="/" className="btn btn-secondary">
                        <ArrowLeft style={{ width: '1.25rem', height: '1.25rem' }} />
                        <span>Continue Shopping</span>
                      </a>
                    </div>

                    <div className="trust-badges">
                      <div className="trust-badge">
                        <div className="trust-badge-icon" style={{ background: '#10b981' }}></div>
                        <span>Secure Checkout</span>
                      </div>
                      <div className="trust-badge">
                        <div className="trust-badge-icon" style={{ background: '#3b82f6' }}></div>
                        <span>Free Returns</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <Footer />
        </div>
      </div>
    </>
    
  );
}