// Cart.jsx - Fully Responsive Modern Redesign
import React, { useEffect, useState } from "react";
import { Trash2, ShoppingBag, ArrowLeft, CreditCard, Plus, Minus, ShoppingCart, Package, Truck, Shield, CheckCircle } from "lucide-react";

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
      const product = (raw.productId && typeof raw.productId === "object") ? raw.productId : null;
      const productIdStr = product?._id ? String(product._id) : (raw.productId ? String(raw.productId) : `unknown-${idx}`);

      const qty = Number(raw.quantity ?? raw.qty ?? 1) || 1;
      const options = raw.options || raw.meta || raw.customOptions || {};
      const designType = (options.designType || options.design || raw.designType || "single").toString().toLowerCase();

      const extractTiers = (p) => {
        if (!p || typeof p !== "object") return null;
        return p.priceTiers ?? p.price_tiers ?? p.tiers ?? p.pricing?.priceTiers ?? null;
      };
      const rawTiers = extractTiers(product);

      let allowedQtyOptions = [];
      if (Array.isArray(rawTiers) && rawTiers.length) {
        const qtys = rawTiers.map(t => Number(t.qty ?? t.quantity ?? t.minQty ?? 0)).filter(n => Number.isFinite(n));
        allowedQtyOptions = [...new Set(qtys)].sort((a,b)=>a-b);
      }
      if (!allowedQtyOptions.length) {
        const alt = raw.allowedQtys || raw.qtyOptions || [];
        if (Array.isArray(alt) && alt.length) {
          allowedQtyOptions = alt.map(x => Number(x)).filter(n => Number.isFinite(n));
        }
      }
      if (!allowedQtyOptions.length) allowedQtyOptions = [qty];

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

      const savedUnit = (raw.unitPrice !== undefined && raw.unitPrice !== null) ? Number(raw.unitPrice) : NaN;
      const savedShip = (raw.shippingPrice !== undefined && raw.shippingPrice !== null) ? Number(raw.shippingPrice) : NaN;

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

      const resolveImage = () => {
        if (raw.preparedPreview) return raw.preparedPreview;
        if (raw.uploadedUrl) return raw.uploadedUrl;
        if (raw.uploadUrl) return raw.uploadUrl;
        if (product) {
          if (Array.isArray(product.images) && product.images.length) {
            const first = product.images[0];
            if (typeof first === "string") return first;
            if (typeof first === "object") return first.url || first.path || first.src || "";
          }
          if (product.image) return typeof product.image === "string" ? product.image : product.image?.url || "";
        }
        if (Array.isArray(raw.images) && raw.images.length) {
          const f = raw.images[0];
          if (typeof f === "string") return f;
          if (typeof f === "object") return f.url || f.path || "";
        }
        if (raw.croppedImages?.front) return raw.croppedImages.front;
        if (raw.croppedImages?.back) return raw.croppedImages.back;
        return "";
      };

      const image = resolveImage();
      const name = product?.name ?? raw.productName ?? raw.name ?? raw.title ?? "(Product)";

      const readOption = (k) => {
        const val = raw[k] ?? options?.[k] ?? raw.meta?.[k] ?? raw.custom?.[k] ?? product?.[k] ?? null;
        if (val == null) return null;
        if (typeof val === "object") return val.name ?? val.label ?? val.value ?? JSON.stringify(val);
        return String(val);
      };

      return {
        raw,
        id: productIdStr,
        name,
        image,
        qty,
        allowedQtyOptions,
        unitPrice,
        shippingPrice,
        lineTotal,
        designType,
        product,
        selectedSize: readOption("size"),
        selectedPaper: readOption("paper"),
        selectedFinish: readOption("finish"),
        selectedCorner: readOption("corner"),
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
      console.debug("fetchCart raw payload:", payload);

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
        console.debug("fetchCart -> productMap keys:", Object.keys(productMap));
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
      console.warn("updateCartQty: cannot resolve productId or cartItemId", { cartItemIdOrProductId, item, cartId });
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

  const subtotal = items.reduce((s, it) => s + (Number(it.unitPrice || 0)), 0);
  const shippingTotal = items.reduce((s, it) => s + Number(it.shippingPrice || 0), 0);
  const total = subtotal + shippingTotal;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, marginBottom: 16 }}>
            <div style={{ width: 64, height: 64, border: '4px solid #e0e7ff', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
          <p style={{ color: '#4b5563', fontSize: 18, fontWeight: 500 }}>Loading your cart...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 40 }}>
      <Header />

      <div style={{ maxWidth: "65%", margin: '0 auto', padding: '20px 16px' }}>
        {/* Header Section */}
       

        {items.length === 0 ? (
          /* Empty Cart */
          <div style={{ background: 'white', borderRadius: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.1)',  textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', borderRadius: '50%', }}>
              <ShoppingCart style={{  color: '#6366f1' }} />
            </div>
            <h2 style={{  fontWeight: 'bold', color: '#111827',  }}>Your cart is empty</h2>
            <p style={{ color: '#6b7280',  maxWidth: 448, margin: '0 auto 40px' }}>
              Looks like you haven't added any items yet. Discover our amazing products and start shopping!
            </p>
            <a 
              href="/" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8,  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: 600, borderRadius: 16, textDecoration: 'none', boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)', }}
            >
              <ShoppingBag style={{ width: 20, height: 20 }} />
              <span>Start Shopping</span>
            </a>
          </div>
        ) : (
<div className="cart-grid">
            {/* Cart Items - Left Side */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {items.map((item, idx) => {
                const cartItemId = item.raw?._id ?? null;
                const keyId = cartItemId ? cartItemId : `${item.id}-${idx}`;
                const isUpdating = updatingMap[item.raw?._id ?? item.id];

                return (
                  <div 
                    key={keyId} 
                    style={{ background: 'white', borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.08)',  }}
                  >
                    <div style={{ display: 'flex',  }}>
                      {/* Product Image */}
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{  borderRadius: 12, overflow: 'hidden', background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Package style={{  color: '#9ca3af' }} />
                            </div>
                          )}
                        </div>
                        <div style={{ position: 'absolute', top: -8, right: -8, width: 24, height: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 'bold', boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)' }}>
                          {item.qty}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 8, marginBottom: 12 }}>
                          <h3 style={{ fontWeight: 'bold', color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {item.name}
                          </h3>
                          <button 
                            onClick={() => removeItem(item.id)}
                            style={{ flexShrink: 0, padding: 8, background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', borderRadius: 8 }}
                            title="Remove item"
                          >
                            <Trash2 style={{ width: 18, height: 18 }} />
                          </button>
                        </div>

                        {/* Options Grid */}
                        <div style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6,  }}>
                            <span style={{ color: '#6b7280' }}>Design:</span>
                            <span style={{ padding: '4px 8px', background: '#eff6ff', color: '#1e40af', borderRadius: 6, fontWeight: 600, textTransform: 'capitalize', fontSize: 11 }}>
                              {item.designType}
                            </span>
                          </div>
                          
                          {item.selectedSize && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, }}>
                              <span style={{ color: '#6b7280' }}>Size:</span>
                              <span style={{ fontWeight: 600, color: '#111827' }}>{item.selectedSize}</span>
                            </div>
                          )}
                          
                          {item.selectedPaper && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6,  }}>
                              <span style={{ color: '#6b7280' }}>Paper:</span>
                              <span style={{ fontWeight: 600, color: '#111827' }}>{item.selectedPaper}</span>
                            </div>
                          )}
                          
                          {item.selectedFinish && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6,  }}>
                              <span style={{ color: '#6b7280' }}>Finish:</span>
                              <span style={{ fontWeight: 600, color: '#111827' }}>{item.selectedFinish}</span>
                            </div>
                          )}
                          
                          {item.selectedCorner && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6,  }}>
                              <span style={{ color: '#6b7280' }}>Corner:</span>
                              <span style={{ fontWeight: 600, color: '#111827' }}>{item.selectedCorner}</span>
                            </div>
                          )}
                        </div>

                        {/* Bottom Row: Quantity & Price */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #f3f4f6', flexWrap: 'wrap', gap: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{  color: '#6b7280', fontWeight: 500 }}>Qty:</span>
                            <select
                              value={item.qty}
                              onChange={(e) => {
                                const newQty = e.target.value;
                                const cartItemIdToSend = item.raw?._id ?? item.id;
                                updateCartQty(cartItemIdToSend, newQty);
                              }}
                              disabled={isUpdating || !cartId}
                              style={{ padding: '6px 12px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#111827', cursor: 'pointer' }}
                            >
                              {item.allowedQtyOptions.map((q) => (
                                <option key={`${item.id}-qty-${q}`} value={q}>{q}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div style={{ textAlign: 'right' }}>
                            <div style={{  fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                              {currencySymbol(currency)}{formatMoney(item.unitPrice)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary - Right Side */}
            <div style={{ height: 'fit-content',  }}>
              <div style={{ background: 'white', borderRadius: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.1)',  }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle style={{ width: 20, height: 20, color: 'white' }} />
                  </div>
                  <h2 style={{  fontWeight: 'bold', color: '#111827', margin: 0 }}>Order Summary</h2>
                </div>
                
                <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{  color: '#6b7280' }}>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                    <span style={{  fontWeight: 600, color: '#111827' }}>
                      {currencySymbol(currency)}{formatMoney(subtotal)}
                    </span>
                  </div>
                  
                  {shippingTotal > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Truck style={{ width: 16, height: 16, color: '#6b7280' }} />
                        <span style={{ color: '#6b7280' }}>Shipping</span>
                      </div>
                      <span style={{  fontWeight: 600, color: '#111827' }}>
                        {currencySymbol(currency)}{formatMoney(shippingTotal)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderRadius: 16, marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{  fontWeight: 'bold', color: '#111827' }}>Total</span>
                    <span style={{ fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {currencySymbol(currency)}{formatMoney(total)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  <a 
                    href="/checkout" 
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: 'bold',  borderRadius: 16, textDecoration: 'none', boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)', }}
                  >
                    <CreditCard style={{ width: 20, height: 20 }} />
                    <span>Proceed to Checkout</span>
                  </a>
                  
                  <a 
                    href="/" 
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'white', color: '#4b5563', fontWeight: 600,  borderRadius: 16, textDecoration: 'none', border: '2px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',  }}
                  >
                    <ArrowLeft style={{ width: 20, height: 20 }} />
                    <span>Continue Shopping</span>
                  </a>
                </div>

                {/* Trust Badges
                <div style={{ paddingTop: 24, borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'grid', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 40, height: 40, background: '#d1fae5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Shield style={{ width: 20, height: 20, color: '#059669' }} />
                      </div>
                      <span style={{ fontSize: window.innerWidth < 640 ? 11 : 12, fontWeight: 600, color: '#374151', lineHeight: 1.3 }}>Secure Payment</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 40, height: 40, background: '#dbeafe', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Truck style={{ width: 20, height: 20, color: '#2563eb' }} />
                      </div>
                      <span style={{ fontSize: window.innerWidth < 640 ? 11 : 12, fontWeight: 600, color: '#374151', lineHeight: 1.3 }}>Fast Shipping</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 40, height: 40, background: '#e9d5ff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle style={{ width: 20, height: 20, color: '#9333ea' }} />
                      </div>
                      <span style={{ fontSize: window.innerWidth < 640 ? 11 : 12, fontWeight: 600, color: '#374151', lineHeight: 1.3 }}>Easy Returns</span>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}