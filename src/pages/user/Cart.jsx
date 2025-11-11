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

         console.log("🔍 Cart Item Debug:", {
      index: idx,
      raw: raw,
      options: raw.options,
      previewUrl_in_options: raw.options?.previewUrl,
      previewUrl_in_raw: raw.previewUrl,
      preparedPreview: raw.preparedPreview,
      uploadedUrl: raw.uploadedUrl,
      images: raw.images,
      userImage: raw.userImage
    });
    
    
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
  (options.previewUrl) ||  // ✅ Prioritize previewUrl from options
  (raw.previewUrl) ||      // ✅ Check raw.previewUrl
  (raw.preparedPreview) ||
  (raw.uploadedUrl) ||
  (Array.isArray(raw.userImage) && raw.userImage.length && raw.userImage[0]) ||
  ((Array.isArray(raw.images) && raw.images.length && raw.images[0]) ? raw.images[0] : null) ||
  ((Array.isArray(productObj?.images) && productObj.images.length && productObj.images[0]) ? productObj.images[0] : productObj?.image ?? "");

      const name = productObj?.name ?? raw.rawName ?? raw.name ?? "(Product unavailable)";

      return {
        raw,
       id: raw._id || `${productIdStr}-${idx}-${Date.now()}`,  // ✅ REPLACE WITH THIS
  productId: productIdStr,
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



  const preprocessImageForCart = (imageUrl, maxWidth = 800, maxHeight = 800) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate scaled dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    
    img.onerror = () => {
      resolve(imageUrl); // Fallback to original
    };
    
    img.src = imageUrl;
  });
};

const removeItem = async (itemId) => {
  try {
    // Find the item by its _id
    const item = items.find(
      (it) =>
        String(it.raw?._id) === String(itemId) ||
        String(it.id) === String(itemId)
    );

    if (!item) {
      console.error("❌ Item not found");
      return;
    }

    // Use the item's _id from the cart
    const itemIdToRemove =
  item?.raw?._id || item?.id || item?.raw?.productId || item?.productId;

    const cartIdToSend = cartId;

    console.log("🗑️ Removing item:", { 
      itemId: itemIdToRemove, 
      cartId: cartIdToSend 
    });

    if (!itemIdToRemove || !cartIdToSend) {
      console.error("❌ Missing item _id or cartId");
      return;
    }

    // Send request with item's _id
    const url = `${API_BASE_URL}/removeCartItem?productId=${encodeURIComponent(
      itemIdToRemove
    )}&cartId=${encodeURIComponent(
      cartIdToSend
    )}`;

    console.log("🔗 DELETE URL:", url);

    const res = await fetch(url, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Remove failed:", res.status, errorText);
      await fetchCart();
      return;
    }

    console.log("✅ Item removed successfully");

    // Remove from local state using the item's _id
    setItems((prev) => prev.filter((it) => 
      String(it.raw?._id) !== String(itemIdToRemove)
    ));
    
    // Refresh cart from backend
    await fetchCart();
    
  } catch (err) {
    console.error("❌ removeItem error:", err);
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
   





 <div style={{ backgroundColor: "#e6f2ff", width: "100%", minHeight: "100vh" }}>
 
        <div className="responsive-container">
          <Header/>
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
  const itemId = item.raw?._id;
  const keyId = itemId ? itemId : `${item.id}-${idx}`;
  const uploadedImage =
    item?.raw?.previewUrl ||
    item?.raw?.preparedPreview ||
    item?.raw?.uploadedUrl ||
    (item?.raw?.userImage && item.raw.userImage.length > 0 && item.raw.userImage[0]) ||
    (item?.raw?.images && item.raw.images.length > 0 && item.raw.images[0]) ||
    (item?.images && item.images.length > 0 && item.images[0]) ||
    item?.image ||
    null;

  const getFileType = (url) => {
    if (!url) return 'unknown';
    const ext = url.split('.').pop().toLowerCase().split('?')[0];
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (ext === 'ai') return 'ai';
    if (ext === 'psd') return 'psd';
    if (ext === 'indd') return 'indd';
    return 'other';
  };

  const fileType = getFileType(uploadedImage);
  const fileName = uploadedImage ? uploadedImage.split('/').pop().split('?')[0] : '';

  return (
    <div key={keyId} className="professional-cart-card">
      <div className="product-image-wrapper">
        {!uploadedImage ? (
          <div className="product-no-image">
            <ShoppingCart size={24} />
            <span>No Preview</span>
          </div>
        ) : fileType === 'image' ? (
          <img
            src={uploadedImage}
            alt={item.name || "Product"}
            className="product-image"
          />
        ) : fileType === 'pdf' ? (
          <div className="design-file-card pdf-card">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2zm3 6h4v2h-4V8zm0 4h4v2h-4v-2zm0 4h4v2h-4v-2z"/>
            </svg>
            <span className="file-type-label">PDF</span>
            <span className="file-name">{fileName.length > 12 ? fileName.substring(0, 12) + '...' : fileName}</span>
          </div>
        ) : fileType === 'ai' ? (
          <div className="design-file-card ai-card">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2zm3 8v4h4v-4h-4z"/>
            </svg>
            <span className="file-type-label">AI</span>
            <span className="file-name">{fileName.length > 12 ? fileName.substring(0, 12) + '...' : fileName}</span>
          </div>
        ) : fileType === 'psd' ? (
          <div className="design-file-card psd-card">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2zm2 8h6v2H9v-2zm0 4h6v2H9v-2z"/>
            </svg>
            <span className="file-type-label">PSD</span>
            <span className="file-name">{fileName.length > 12 ? fileName.substring(0, 12) + '...' : fileName}</span>
          </div>
        ) : fileType === 'indd' ? (
          <div className="design-file-card indd-card">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2zm1 4v12h8V6H8z"/>
            </svg>
            <span className="file-type-label">INDD</span>
            <span className="file-name">{fileName.length > 12 ? fileName.substring(0, 12) + '...' : fileName}</span>
          </div>
        ) : (
          <div className="design-file-card other-card">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="file-type-label">FILE</span>
            <span className="file-name">{fileName.length > 12 ? fileName.substring(0, 12) + '...' : fileName}</span>
          </div>
        )}
      </div>

      <div className="product-details-section">
        <div className="title-price-row">
          <h3 className="product-title">{item.name}</h3>
          <div className="product-price">
            {currencySymbol(currency)}{formatMoney(item.unitPrice)}
          </div>
        </div>

        <div className="specs-grid">
          <div className="spec-item">
            <span className="spec-label">Design:</span>
            <span className="spec-value">{item.designType}</span>
          </div>
          {item.size?.name && (
            <div className="spec-item">
              <span className="spec-label">Size:</span>
              <span className="spec-value">{item.size.name}</span>
            </div>
          )}
          {item.paper?.name && (
            <div className="spec-item">
              <span className="spec-label">Paper:</span>
              <span className="spec-value">{item.paper.name}</span>
            </div>
          )}
          {item.finish?.name && (
            <div className="spec-item">
              <span className="spec-label">Finish:</span>
              <span className="spec-value">{item.finish.name}</span>
            </div>
          )}
          {item.corner?.name && (
            <div className="spec-item">
              <span className="spec-label">Corner:</span>
              <span className="spec-value">{item.corner.name}</span>
            </div>
          )}
        </div>

        <div className="actions-row">
          <div className="qty-wrapper">
            <span className="qty-label">Qty:</span>
            <select
              value={item.qty}
              onChange={(e) => {
                const newQty = e.target.value;
                const cartItemIdToSend = item.raw?._id ?? item.id;
                updateCartQty(cartItemIdToSend, newQty);
              }}
              disabled={!!updatingMap[item.raw?._id ?? item.id] || !cartId}
              className="qty-select"
            >
              {item.allowedQtyOptions.map((q) => (
                <option key={`${item.id}-qty-${q}`} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              console.log("🗑 Remove clicked:", {
                rawId: item.raw?._id,
                id: item.id,
                productId: item.productId,
              });
              removeItem(item.raw?._id || item.id || item.productId);
            }}
            className="remove-button"
          >
            <Trash2 size={16} />
            <span>Remove</span>
          </button>
        </div>
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

                      {/* {shippingTotal > 0 && (
                        <div className="summary-row">
                          <span className="summary-row-label">Shipping</span>
                          <span className="summary-row-value">
                            {currencySymbol(currency)}{formatMoney(shippingTotal)}
                          </span>
                        </div>
                      )} */}
                    </div>

                    <div className="summary-total">
                      <span className="summary-total-label">Total</span>
                      <span className="summary-total-value">
                        {currencySymbol(currency)}{formatMoney(subtotal)}
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
    background: transparent;
    border: none;
    border-radius: 0;
    overflow: visible;
    padding: 0;
  }

  .professional-cart-card {
    background: white;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 16px;
    align-items: start;
  }

  .professional-cart-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #d1d5db;
  }

  .professional-cart-card:last-of-type {
    margin-bottom: 0;
  }

  .product-image-wrapper {
    width: 80px;
    height: 80px;
    margin: 0;
    border-radius: 8px;
    overflow: hidden;
    background: #f9fafb;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e5e7eb;
    flex-shrink: 0;
  }

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    padding: 0;
  }

  .product-no-image {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: #9ca3af;
    font-size: 10px;
    text-align: center;
  }

  .product-no-image svg {
    width: 24px;
    height: 24px;
  }

  .product-details-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
  }

  .title-price-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f3f4f6;
  }

  .product-title {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    line-height: 1.4;
    margin: 0;
    flex: 1;
  }

  .product-price {
    font-size: 18px;
    font-weight: 700;
    color: #007abf;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .specs-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f3f4f6;
  }

  .spec-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .spec-label {
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    min-width: 60px;
  }

  .spec-value {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    text-transform: capitalize;
  }

  .actions-row {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .qty-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 12px;
  }

  .qty-label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
  }

  .qty-select {
    flex: 1;
    max-width: 120px;
    padding: 6px 28px 6px 10px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: white;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
  }

  .qty-select:hover {
    border-color: #007abf;
    background-color: #f9fafb;
  }

  .qty-select:focus {
    outline: none;
    border-color: #007abf;
    box-shadow: 0 0 0 3px rgba(0, 122, 191, 0.1);
  }

  .qty-select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f3f4f6;
  }

  .remove-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 6px;
    padding: 8px 12px;
    background: transparent;
    border: 1px solid #fecaca;
    border-radius: 8px;
    color: #dc2626;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .remove-button:hover {
    background: #fef2f2;
    border-color: #dc2626;
    transform: translateY(-1px);
  }

  .remove-button:active {
    transform: translateY(0);
  }

  @media (min-width: 768px) {
    .professional-cart-card {
      padding: 20px;
      grid-template-columns: 100px 1fr;
      gap: 20px;
    }

    .product-image-wrapper {
      width: 100px;
      height: 100px;
    }

    .product-title {
      font-size: 18px;
    }

    .product-price {
      font-size: 20px;
    }

    .specs-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .spec-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .spec-label {
      min-width: auto;
    }

    .actions-row {
      flex-direction: row;
      justify-content: flex-start;
      gap: 16px;
    }

    .qty-wrapper {
      width: auto;
    }

    .remove-button {
      width: auto;
    }
  }

  @media (min-width: 1024px) {
    .professional-cart-card {
      grid-template-columns: 120px 1fr;
      gap: 24px;
      padding: 24px;
    }

    .product-image-wrapper {
      width: 120px;
      height: 120px;
    }

    .product-title {
      font-size: 20px;
    }

    .product-price {
      font-size: 24px;
    }

    .specs-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
  }

  .cart-summary {
    padding: 1.5rem 1.25rem;
    background: #f9fafb;
    border-radius: 12px;
    margin-top: 16px;
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

  .pdf-preview-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f9fafb;
  border-radius: 8px;
  overflow: hidden;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  border: none;
  pointer-events: none;
}

.file-type-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(239, 68, 68, 0.95);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 3px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pdf-badge {
  background: rgba(239, 68, 68, 0.95);
}

.design-file-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px;
  border-radius: 8px;
  text-align: center;
}

.pdf-card {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.ai-card {
  background: linear-gradient(135deg, #ff9a00 0%, #ff6a00 100%);
  color: white;
}

.psd-card {
  background: linear-gradient(135deg, #001d34 0%, #0077b5 100%);
  color: white;
}

.indd-card {
  background: linear-gradient(135deg, #ff3366 0%, #d9006b 100%);
  color: white;
}

.other-card {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
}

.file-type-label {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: 2px;
}

.file-name {
  font-size: 8px;
  font-weight: 500;
  opacity: 0.9;
  line-height: 1.2;
  word-break: break-all;
  max-width: 100%;
}

@media (min-width: 768px) {
  .file-type-label {
    font-size: 13px;
  }

  .file-name {
    font-size: 9px;
  }
}

@media (min-width: 1024px) {
  .file-type-label {
    font-size: 14px;
  }

  .file-name {
    font-size: 10px;
  }
}
  
`}</style>
    </>
    
  );
}