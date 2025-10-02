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

// REPLACE normalizeCart with this version (full function)
const normalizeCart = (cartData) => {
  if (!cartData || !Array.isArray(cartData.items)) return [];

  return cartData.items.map((i, idx) => {
    const raw = i || {};
    // product may be populated object or id string
    const productObj = (raw.productId && typeof raw.productId === "object") ? raw.productId : raw.product || null;
    const productIdStr = productObj?._id ? String(productObj._id) : (raw.productId ? String(raw.productId) : `unknown-${idx}`);

    const qty = Number(raw.quantity ?? raw.qty ?? 1) || 1;

    // Prefer options object (normalized) but fall back to top-level fields
    const options = raw.options || raw.option || raw.designOptions || {};
    const designType = (options.designType || raw.designType || raw.design || "single").toString().toLowerCase();

    // size/paper/finish/corner can be object or primitive — normalize to primitive or {name,...}
    const normalizeChoice = (val) => {
      if (!val && val !== 0) return null;
      if (typeof val === "object") return val;
      return { name: String(val) };
    };

    const size = normalizeChoice(options.size ?? raw.size ?? raw.selectedSize);
    const paper = normalizeChoice(options.paper ?? raw.paper ?? raw.selectedPaper);
    const finish = normalizeChoice(options.finish ?? raw.finish);
    const corner = normalizeChoice(options.corner ?? raw.corner);

    // Price tiers: find on product object first
    const rawTiers = (productObj && (productObj.priceTiers || productObj.price_tiers || productObj.tiers || productObj.pricing?.priceTiers)) || null;

    // choose tier (reuse helper)
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

    // Saved snapshot prices on cart item (if any)
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

    // Normalize image: prefer custom user images, fallback to product images
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
      // expose normalized options up-front for consumers
      size,
      paper,
      finish,
      corner,
      options: { ...options, size, paper, finish, corner }
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
      <div className="responsive-container" >
    <div className="page-container"> 
      <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          <p className="text-gray-600">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <a href="/" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
{items.map((item, idx) => {
  const cartItemId = item.raw?._id ?? null;
  const keyId = cartItemId ? cartItemId : `${item.id}-${idx}`;

  return (
    <div key={keyId} className="cart-item" style={{ display:'flex', gap:20, alignItems:'center', padding:'18px 0', borderBottom:'1px solid #eee' }}>
      {/* left: image */}
      <div style={{
        width: 100, height:100, borderRadius:8, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center',
        background: item.image ? '#fff' : '#F3F4F6'
      }}>
        {item.image ? (
          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign:'center', color:'#9CA3AF', fontSize:13 }}>No image</div>
        )}
      </div>

      {/* middle: details */}
      <div style={{ flex:1, minWidth: 220 }}>
        <h3 style={{ margin:'0 0 6px', fontSize:16, fontWeight:600 }}>{item.name}</h3>

        <div style={{ display:'flex', gap:18, flexWrap:'wrap', color:'#374151', fontSize:14 }}>
          <div><span style={{color:'#6B7280'}}>Design:</span> <strong style={{textTransform:'capitalize'}}>{item.designType}</strong></div>

          <div>
            <span style={{ color: '#6B7280' }}>Qty:</span>{' '}
            <select
              value={item.qty}
              onChange={(e) => {
                const newQty = e.target.value;
                const cartItemIdToSend = item.raw?._id ?? item.id;
                updateCartQty(cartItemIdToSend, newQty);
              }}
              disabled={!!updatingMap[item.raw?._id ?? item.id] || !cartId}
              style={{ marginLeft: 6, padding: '6px 10px', borderRadius: 6, border: '1px solid #D1D5DB' }}
            >
              {item.allowedQtyOptions.map((q) => (
                <option key={`${item.id}-qty-${q}`} value={q}>{q}</option>
              ))}
            </select>
          </div>

          {/* options shown only if present */}
          {item.selectedSize && <div>Size: <strong>{item.selectedSize}</strong></div>}
          {item.selectedPaper && <div>Paper: <strong>{item.selectedPaper}</strong></div>}
          {item.selectedFinish && <div>Finish: <strong>{item.selectedFinish}</strong></div>}
          {item.selectedCorner && <div>Corner: <strong>{item.selectedCorner}</strong></div>}
        </div>
      </div>

      {/* right: price + actions */}
      <div style={{ textAlign: 'right', minWidth:120 }}>
        <div style={{ fontWeight:700, fontSize:18, color:'#111827' }}>
          {currencySymbol(currency)}{formatMoney(item.unitPrice)}
        </div>
        <button onClick={() => removeItem(item.id)} style={{ marginTop:10, background:'transparent', border:'none', color:'#EF4444', cursor:'pointer', textDecoration:'underline', fontSize:14 }}>
          Remove
        </button>
      </div>
    </div>
  );
})}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.length} items)</span>
                    <span>{currencySymbol(currency)}{formatMoney(subtotal)}</span>
                  </div>
                  
                  {shippingTotal > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>{currencySymbol(currency)}{formatMoney(shippingTotal)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span>{currencySymbol(currency)}{formatMoney(total)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                 <a 
  href="/checkout" 
  className="w-full text-white font-semibold py-4 px-6 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
  style={{ backgroundColor: "#007abf" }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#006599"} // darker hover
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#007abf"}
>
  <CreditCard className="w-5 h-5" />
  <span>Proceed to Checkout</span>
</a>

                  
                  <a 
                    href="/" 
                    className="w-full bg-white text-gray-700 font-semibold py-4 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Continue Shopping</span>
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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
    
  );
}
