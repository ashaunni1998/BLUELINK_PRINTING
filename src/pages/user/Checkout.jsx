// src/pages/user/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

import axios from "axios";
import { API_BASE_URL } from "../../config";
import CheckoutForm from "./CheckoutForm";
import Header from "./components/Header";
import Footer from "./components/Footer";
axios.defaults.withCredentials = true;
import { GET_ALL_COUPONS } from "../../admin/apiServices/couponApi";
import Swal from "sweetalert2";
import { useRef } from "react";
import AddressAutocomplete from "../../pages/user/components/AddressAutocomplete";

const Checkout = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [orderDetails, setOrderDetails] = useState(null);
const [couponCode, setCouponCode] = useState("");
const [discountAmount, setDiscountAmount] = useState(0);
const [couponError, setCouponError] = useState("");
const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);

 // ✅ New state for delivery method
  const [deliveryMethod, setDeliveryMethod] = useState("north"); // default




/* ---------- Paste this directly after:
     const [deliveryMethod, setDeliveryMethod] = useState("north");
   and REMOVE any older getDeliveryCost/computeTotals/calc functions ---------- */

/* helper: determine line weight in grams (prefers server-provided lineWeightGrams,
   then per-unit weight, then priceTiers, then fallback) */
function getLineWeightGrams(item) {
  const raw = item.raw || {};
  const product = item.productObj || {};
  const qty = Math.max(1, Number(item.qty ?? 1));

  // 1) explicit total grams for the cart line (recommended)
  if (typeof raw.lineWeightGrams === "number" && raw.lineWeightGrams >= 0) {
    return raw.lineWeightGrams;
  }

  // 2) per-unit weight fields
  const perUnit = Number(raw.weightGrams ?? product.weightGrams ?? 0);
  if (perUnit > 0) return perUnit * qty;

  // 3) if product.priceTiers includes weightGrams, compute per-unit
  if (Array.isArray(product.priceTiers) && product.priceTiers.length) {
    const tiers = product.priceTiers
      .map(t => ({ qty: Number(t.qty ?? 0), weightGrams: Number(t.weightGrams ?? 0) }))
      .filter(t => t.qty > 0 && t.weightGrams > 0)
      .sort((a, b) => a.qty - b.qty);
    if (tiers.length) {
      let chosen = tiers[0];
      for (const t of tiers) {
        if (qty >= t.qty) chosen = t;
        else break;
      }
      // assume chosen.weightGrams is total grams for that tier (if admin stored per-tier total),
      // compute per-unit by dividing by tier.qty
      const perUnitFromTier = chosen.weightGrams / chosen.qty;
      if (perUnitFromTier > 0) return perUnitFromTier * qty;
    }
  }

  // 4) fallback estimate (50 g per unit)
  return 50 * qty;
}

/* core weight -> price table (no fixed surcharges). region: "north","south","australia","pickup" */
function calculateShippingByWeight(region, totalWeightGrams) {
  totalWeightGrams = Number(totalWeightGrams || 0);
  const kg = totalWeightGrams / 1000;

  if (region === "pickup") return 0;

  if (region === "north") {
    if (totalWeightGrams <= 500) return 7;
    if (kg <= 3) return 11;
    if (kg <= 5) return 14;
    if (kg <= 15) return 58;
    return 58 ;
  }

  if (region === "south") {
    if (totalWeightGrams <= 500) return 9;
    if (kg <= 3) return 13;
    if (kg <= 5) return 29;
    if (kg <= 15) return 111;
    return 111 ;
  }

  if (region === "australia") {
    if (totalWeightGrams <= 500) return 23;
    if (kg <= 1) return 28;
    if (kg <= 2) return 40;
    if (kg <= 3) return 99;
    return 99 ;
  }

  return 0;
}

/* compute totals — uses only weight-based shipping (no hidden fixed surcharges).
   If you *must* use server-provided per-line shipping, combine it here (comment shows how). */
const computeTotals = () => {
  const subtotal = cart.reduce((acc, it) => acc + Number(it.lineTotal ?? it.price ?? 0), 0);

  // compute total cart weight (grams)
  let totalWeightGrams = 0;
  for (const it of cart) {
    const w = Number(getLineWeightGrams(it) || 0);
    totalWeightGrams += isFinite(w) ? w : 0;
  }

  // choose region key for table
  const country = selectedAddress?.country ?? newAddress?.country ?? "New Zealand";
  let regionKey = deliveryMethod; // north|south|pickup|international
  if (country === "Australia") regionKey = "australia";
  if (deliveryMethod === "pickup") regionKey = "pickup";

  // OPTIONAL: if backend provides server per-line shipping and you want to include it:
  // const serverShipping = cart.reduce((acc, it) => acc + Number(it.shippingPrice ?? it.raw?.shippingPrice ?? 0), 0);
  // In this version we ONLY use weight-based mapping:
  const serverShipping = 0;

  const weightBasedShipping = calculateShippingByWeight(regionKey, totalWeightGrams);

  // final shipping uses weightBasedShipping only (so NO other hidden fixed numbers)
  const totalShipping = Number(weightBasedShipping || 0) + Number(serverShipping || 0);

  const discount = Number(discountAmount || 0);
  const grandTotal = subtotal - discount + totalShipping;

  return {
    subtotal,
    totalWeightGrams,
    serverShipping,
    weightBasedShipping,
    totalShipping,
    discount,
    grandTotal,
    country,
    regionKey
  };
};


/* ---------- Also update the delivery method preview spans in UI to use this function: 
   Example (replace your preview code block for North radio label with this):
*/

// ----------------- END shipping helpers -----------------
  
  const [newAddress, setNewAddress] = useState({
  firstName: "",
  lastName: "",
  company: "",
  address: "",   // single combined field
  city: "",
  region: "",
  postalCode: "",
  phone: "",
  country: "New Zealand",
  addressType: "Home",
  isDefault: false,
});

const [addressError, setAddressError] = useState("");   // for error messages
// const [showNewAddressForm, setShowNewAddressForm] = useState(false); // toggle form

  // ✅ Fetch addresses (cookie auth)
 const fetchAddresses = async () => {
  try {
    console.log("📤 Sending GET /address/addresses with cookies");
    console.log("Fetching addresses from:", `${API_BASE_URL}/address/addresses`);
    const res = await axios.get(`${API_BASE_URL}/address/addresses`, {
      withCredentials: true,
    });

    // console.log("📥 Raw address API response:", res.data);
    setAddresses(res.data.addresses || []);
  } catch (err) {
    console.error("❌ Error fetching addresses:", err);
    Swal.fire("Error", "Failed to fetch addresses", "error");
  
  }
  
};

  useEffect(() => {
    fetchAddresses();
  }, []);

  // ✅ Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
    const totalPrice = savedCart.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
    setTotal(totalPrice);
  }, []);


useEffect(() => {
  const fetchServerCart = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/getCart`, { withCredentials: true });
      const payload = res.data ?? {};

      // common shapes: { cart: { items: [...] } } | { data: { items: [...] } } | { items: [...] }
      const cartObj = payload.cart ?? payload.data ?? payload;
      const itemsArr = Array.isArray(cartObj?.items)
        ? cartObj.items
        : (Array.isArray(payload?.data?.items) ? payload.data.items : []);

      // find productIds that are primitive (strings) so we can fetch product details
      const primitiveProductIds = itemsArr
        .filter(it => it.productId && typeof it.productId !== 'object')
        .map(it => String(it.productId))
        .filter(Boolean);

      const productMap = {};
      if (primitiveProductIds.length) {
        const uniqueIds = [...new Set(primitiveProductIds)];
        const fetches = uniqueIds.map(id =>
          axios.get(`${API_BASE_URL}/product/productDetails/${encodeURIComponent(id)}`, { withCredentials: true })
            .then(r => r.data?.data ?? r.data?.product ?? r.data ?? null)
            .catch(() => null)
        );
        const products = await Promise.all(fetches);
        for (let i = 0; i < uniqueIds.length; i++) {
          if (products[i]) productMap[uniqueIds[i]] = products[i];
        }
      }

      // map cart items into shape for checkout summary
      const mapped = itemsArr.map(it => {
        // prefer the product object if populated
        const productObj = (it.productId && typeof it.productId === 'object') ? it.productId
                         : (it.productId && productMap[String(it.productId)]) ? productMap[String(it.productId)]
                         : null;

        // name: prefer populated product name, else rawName/name, else fallback
        const name = productObj?.name ?? it.rawName ?? it.name ?? productObj?.subtitle ?? "Product";

        // price: prefer the cart snapshot unitPrice (tier price), fallback to lineTotal/price/product price
        const price = Number(it.unitPrice ?? it.lineTotal ?? it.price ?? productObj?.price ?? productObj?.basePrice ?? 0);

        // qty: prefer stored cart quantity fields
        const qty = Number(it.quantity ?? it.qty ?? it.quantityOrdered ?? 1);

        // product id (for order creation) — prefer product._id when available, else the primitive productId, else item._id
        const productId = productObj?._id ?? productObj?.id ?? it.productId ?? it._id ?? `unknown-${Math.random()}`;

        return {
          id: String(productId),
          name,
          qty,
          price,
          raw: it,
          productObj
        };
      });

      setCart(mapped);
      const totalPrice = mapped.reduce((acc, item) => acc + (Number(item.price || 0) * Number(item.qty || 0)), 0);
      setTotal(totalPrice);
    } catch (err) {
      console.error("Failed to fetch server cart for checkout:", err);
      // fallback: localStorage cart (you already have this)
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(savedCart);
      const totalPrice = savedCart.reduce((acc, item) => acc + (Number(item.price || 0) * Number(item.qty || 0)), 0);
      setTotal(totalPrice);
    }
  };

  fetchServerCart();
}, []);






const parseCouponDiscount = (coupon = {}, subtotal = 0) => {
  if (!coupon || subtotal == null) return 0;

  // detect percent-based coupon
  const isPercent =
    (typeof coupon.type === "string" && coupon.type.toLowerCase() === "percent") ||
    coupon.isPercent === true ||
    String(coupon.isPercent).toLowerCase() === "true";

  if (isPercent) {
    const pct = Number(coupon.discount ?? coupon.value ?? coupon.percent ?? 0);
    if (isNaN(pct) || pct <= 0) return 0;
    return (Number(subtotal) * pct) / 100;
  }

  // fixed-value coupon -> try several fields
  let amt = Number(
    coupon.discount ??
    coupon.value ??
    coupon.amount ??
    coupon.amountInCents ??
    coupon.fixedAmount ??
    0
  );

  if (isNaN(amt) || amt <= 0) return 0;

  // If amount looks like cents (big integer) — heuristic:
  // if amt > subtotal * 10 or amt >= 1000 => probably cents -> divide by 100
  // (covers 1000 => $10; also covers accidentally-stored-cents)
  if (amt >= 1000 || amt > subtotal * 10) {
    return amt / 100;
  }

  // Otherwise treat as already in dollars.
  return amt;
};

/**
 * Nice label for dropdown option (shows percent or fixed $$)
 */
const couponLabel = (c) => {
  if (!c) return "";
  const isPercent =
    (typeof c.type === "string" && c.type.toLowerCase() === "percent") ||
    c.isPercent === true ||
    String(c.isPercent).toLowerCase() === "true";

  if (isPercent) {
    const pct = Number(c.discount ?? c.value ?? c.percent ?? 0);
    return `${c.code} - ${Number(pct || 0)}% Off`;
  } else {
    // display fixed amount nicely; if stored in cents convert
    let amt = Number(c.discount ?? c.value ?? c.amount ?? c.amountInCents ?? 0);
    if (isNaN(amt)) amt = 0;
    if (amt >= 1000) amt = amt / 100;
    return `${c.code} - $${Number(amt).toFixed(2)} Off`;
  }
};

// ---- helper: split "48A Valley Road" → { streetNumber: "48A", street: "Valley Road" }
function splitStreetAddress(fullStreet) {
  if (!fullStreet || typeof fullStreet !== "string") {
    return { streetNumber: "", street: "" };
  }
  const trimmed = fullStreet.trim();

  // Match leading house/flat number (with optional letter, hyphen, or slash), then the rest
  const m = trimmed.match(/^(\d+[A-Za-z\-\/]*)\s+(.+)$/);
  if (m) {
    return { streetNumber: m[1], street: m[2] };
  }
  // If no leading number, send whole thing as street name, leave number empty
  return { streetNumber: "", street: trimmed };
}



// add these imports at top of the file if you have an AuthContext
// import { useContext } from "react";
// import { AuthContext } from "../../context/AuthContext"; // adjust path if needed

const handleAddAddress = async (e) => {
  e.preventDefault();

  // Try to read the logged-in user id from localStorage
  let userId = null;
  try {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    userId = stored?.userId || stored?.id || null;
  } catch (err) {
    userId = null;
  }

  // Build base payload (no user info) — backend may use session cookies
  const basePayload = {
    fullName: newAddress.fullName,
    phone: newAddress.phone,
    country: newAddress.country,
    address: newAddress.address,
    city: newAddress.city || "",
    region: newAddress.region || "",
    postalCode: newAddress.postalCode || "",
    landmark: newAddress.landmark || "",
    addressType: newAddress.addressType || "Home",
    isDefault: !!newAddress.isDefault,
  };

  // Helper to post and return response/error
  const postAddress = async (payload) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/address/add`, payload, { withCredentials: true });
      return { ok: true, data: res.data };
    } catch (err) {
      // Normalize axios error shape
      const resp = err?.response;
      const body = resp?.data ?? null;
      const status = resp?.status ?? null;
      return { ok: false, status, body, raw: err };
    }
  };

  // 1) Try posting base payload (no userId) — good when backend uses session
  console.log("Posting address payload (attempt 1, no user):", basePayload);
  let result = await postAddress(basePayload);

  // If success, finish
  if (result.ok) {
    console.log("Address saved (attempt 1):", result.data);
    // reset and fetch addresses
    setNewAddress({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      region: "",
      postalCode: "",
      landmark: "",
      addressType: "Home",
      isDefault: false,
      country: "New Zealand",
    });
    setAddressError("");
    setShowAddForm(false);
    fetchAddresses();
    Swal.fire("Success", "Address added successfully!", "success");
    return;
  }

  // Clear previous error display
  setAddressError("");

  // 2) If failed, inspect server body for hints
  console.warn("Attempt 1 failed:", result.status, result.body, result.raw?.message ?? result.raw);

  // If server tells that userId is required, try again with userId included
  const bodyMsg = JSON.stringify(result.body || "");
  if (userId && /userId|user id|userId.*required/i.test(bodyMsg)) {
    const payload2 = { ...basePayload, userId };
    console.log("Retrying with userId (attempt 2):", payload2);
    result = await postAddress(payload2);

    if (result.ok) {
      console.log("Address saved (attempt 2):", result.data);
      setNewAddress({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        region: "",
        postalCode: "",
        landmark: "",
        addressType: "Home",
        isDefault: false,
        country: "New Zealand",
      });
      setAddressError("");
      setShowAddForm(false);
      fetchAddresses();
      Swal.fire("Success", "Address added successfully!", "success");
      return;
    }

    console.warn("Attempt 2 failed:", result.status, result.body, result.raw?.message ?? result.raw);
  }

  // 3) Some backends expect an object like { user: userId } or { user: { _id: userId } }
  // If previous attempts failed and we do have userId, try a couple of common shapes:
  if (userId) {
    const tryShapes = [
      { ...basePayload, user: userId },
      { ...basePayload, user: { _id: userId } },
    ];

    for (let i = 0; i < tryShapes.length; i++) {
      console.log(`Retrying with alternate user shape (attempt ${3 + i}):`, tryShapes[i]);
      result = await postAddress(tryShapes[i]);
      if (result.ok) {
        console.log("Address saved (alternate shape):", result.data);
        setNewAddress({
          fullName: "",
          phone: "",
          address: "",
          city: "",
          region: "",
          postalCode: "",
          landmark: "",
          addressType: "Home",
          isDefault: false,
          country: "New Zealand",
        });
        setAddressError("");
        setShowAddForm(false);
        fetchAddresses();
        Swal.fire("Success", "Address added successfully!", "success");
        return;
      }
      console.warn(`Attempt ${3 + i} failed:`, result.status, result.body, result.raw?.message ?? result.raw);
    }
  }

  // 4) Still failed — show server error to user and log details
  const serverMessage =
    (result.body && (result.body.message || result.body.error || JSON.stringify(result.body))) ||
    "Failed to save address. See console for details.";
  setAddressError(serverMessage);
  console.error("Final address save error:", result);
  Swal.fire("Error", "Failed to add address (see error message)", "error");
};



  // ✅ Delete address
   // ✅ Delete address (with confirmation)
  const handleDeleteAddress = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This address will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/address/delete/${id}`, {
            withCredentials: true,
          });
          setAddresses(addresses.filter((addr) => addr._id !== id));
          if (selectedAddress?._id === id) setSelectedAddress(null);
          Swal.fire("Deleted!", "Address has been deleted.", "success");
        } catch (err) {
          console.error("Error deleting address:", err);
          Swal.fire("Error", "Atleast one address is required.", "error");
        }
      }
    });
  };


const handlePlaceOrder = async () => {
  if (!selectedAddress && deliveryMethod !== "pickup") {
    Swal.fire("Warning", "Please select a shipping address.", "warning");
    return;
  }

  const totals = computeTotals();

  Swal.fire({
    title: "Proceed to payment?",
    text: `You'll be taken to the secure payment page. Total: $${totals.grandTotal.toFixed(2)}`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#ccc",
    confirmButtonText: "Yes, Continue to Payment",
  }).then(async (result) => {
    if (!result.isConfirmed) return;

   try {
  // Build robust products payload from cart items (cart comes from your app state)
  const productsPayload = cart.map((item) => {
    // item may be normalized (from normalizeCart) but original data often lives in item.raw
    const raw = item.raw || {};
    const productObj = item.product || raw.product || raw.productId || null;

    const productId = String(
      (productObj && (productObj._id || productObj.id || productObj.productId)) ||
      raw.productId ||
      item.id ||
      ""
    );

    const quantity = Number(item.qty ?? item.quantity ?? raw.quantity ?? 1) || 1;

    // Options can be on many places depending on backend shape
    const optSource = raw.options || raw.option || raw.designOptions || item.options || {};
    // Also accept flattened properties saved on the raw item
    const size =
      (optSource.size && (optSource.size.name ?? optSource.size)) ||
      (raw.size && (raw.size.name ?? raw.size)) ||
      (item.selectedSize && (item.selectedSize.name ?? item.selectedSize)) ||
      null;
    const paper =
      (optSource.paper && (optSource.paper.name ?? optSource.paper)) ||
      (raw.paper && (raw.paper.name ?? raw.paper)) ||
      (item.selectedPaper && (item.selectedPaper.name ?? item.selectedPaper)) ||
      null;
    const finish =
      (optSource.finish && (optSource.finish.name ?? optSource.finish)) ||
      (raw.finish && (raw.finish.name ?? raw.finish)) ||
      null;
    const corner =
      (optSource.corner && (optSource.corner.name ?? optSource.corner)) ||
      (raw.corner && (raw.corner.name ?? raw.corner)) ||
      null;
    const designType =
      (optSource.designType || raw.designType || item.designType || "single") + "";

    // Collect images: look in common places where your upload code might store them
    // - order/cart raw item may have userImage (array), images (array), preparedPreview/uploadedUrl
    // Collect images
const images = [];
if (Array.isArray(raw.userImage) && raw.userImage.length) {
  images.push(...raw.userImage);
}
if (Array.isArray(raw.images) && raw.images.length) {
  images.push(...raw.images);
}
if (raw.preparedPreview) images.push(raw.preparedPreview);
if (raw.uploadedUrl) images.push(raw.uploadedUrl);
if (item.preparedPreview) images.push(item.preparedPreview);
if (item.uploadedUrl) images.push(item.uploadedUrl);


    // fallback to product image (product object may have images array)
    const productFirstImage =
      (productObj && (Array.isArray(productObj.images) ? productObj.images[0] : (productObj.image || null))) || null;
    if (!images.length && productFirstImage) images.push(productFirstImage);

    // Remove duplicates and empty strings
    const cleanedImages = [...new Set(images.filter(Boolean))];

    // Attach any other metadata helpful for backend: eg. price tier, selected tier qty
    const meta = {
      resolvedProductTitle: productObj && (productObj.name || productObj.title) || raw.name || item.name || null,
      tierQty: item.qty ?? item.quantity ?? raw.quantity ?? null,
      rawPreview: raw.preview || null,
    };

    return {
      productId,
      quantity,
      size,
      paper,
      finish,
      corner,
      designType,
      images: cleanedImages, // array of image URLs (may be empty)
      meta,
    };
  });

  const payload = {
    products: productsPayload,
    shipping: totals.totalShipping || 0,
    deliveryMethod,
    address: deliveryMethod === "pickup" ? null : selectedAddress,
    currency: "nzd",
  };

  console.debug("Create PaymentIntent payload:", payload);

  // Create PaymentIntent — server validates price and returns clientSecret and amount (cents)
  const payRes = await axios.post(`${API_BASE_URL}/order/create-payment-intent`, payload, {
    withCredentials: true,
  });

  const data = payRes.data?.data || payRes.data;
  if (!data) throw new Error("Invalid response from payment intent endpoint");

  const clientSecret = data.clientSecret || data.client_secret;
  const paymentIntentId = data.paymentIntentId || data.payment_intent_id;
  const amount = data.amount ?? Math.round(totals.grandTotal * 100);

  if (!clientSecret) throw new Error("Missing client secret from server");

  const orderId = data.orderId || data._id || null;

navigate("/checkout-form", {
  state: {
    orderDetails: {
      clientSecret,
      paymentIntentId,
      orderId,   // ✅ now included
      amount,
      currency: (data.currency || "NZD").toUpperCase(),
      products: productsPayload,
      shipping: totals.totalShipping,
      address: payload.address,
      preview: data.preview || null,
      description: `Order payment - preview`,
    },
  },
});

} catch (err) {
  console.error("Place order -> payment intent error:", err);
  Swal.fire("Error", err.response?.data?.message || err.message || "Failed to start payment", "error");
}


  });
};

  //     setOrderDetails({
  //       orderId: order._id,
  //       amount: payRes.data.paymentIntent.amount,
  //       clientSecret: payRes.data.paymentIntent.client_secret,
  //       description: `Order #${order._id}`,
  //     });
  //   } catch (err) {
  //     console.error("Checkout error:", err);
  //   }
  // };


  useEffect(() => {
  const fetchCoupons = async () => {
    try {
      const response= await GET_ALL_COUPONS();
      console.log("fetched coupons:",response);
      setAvailableCoupons(response.data || []); // assuming API returns { coupons: [...] }
    } catch (err) {
      console.error("Error fetching coupons:", err);
       Swal.fire("Error", "Failed to load coupons", "error");
    }
  };

  fetchCoupons();
}, []);

useEffect(() => {
  const fetchCoupons = async () => {
    // ...
  };
  fetchCoupons();
}, []);

// <<--- ADD THE COUNTRY → SHIPPING SYNC HERE --->
useEffect(() => {
  const country = selectedAddress?.country ?? newAddress.country ?? "New Zealand";
  if (country === "Australia") {
    // Australia: use the single Australia shipping option
    setDeliveryMethod("international");
  } else {
    // NZ or other: default back to NZ mapping if previously set to "international"
    setDeliveryMethod(prev => (prev === "international" ? "north" : (prev || "north")));
  }
}, [selectedAddress?.country, newAddress.country]);
const handleApplyCoupon = async () => {
  if (!couponCode) {
    setCouponError("Please select a coupon.");
    Swal.fire("Warning", "Please select a coupon.", "warning");
    return;
  }

  // find coupon case-insensitively
  const coupon = availableCoupons.find(
    (c) => String(c.code).trim().toUpperCase() === String(couponCode).trim().toUpperCase()
  );

  if (!coupon) {
    setCouponError("Invalid coupon.");
    setDiscountAmount(0);
    setAppliedCoupon(null);
    Swal.fire("Error", "Invalid coupon code.", "error");
    return;
  }

  // compute discount in DOLLARS (subtotal stored in `total`)
  const subtotalD = Number(total || 0);
  const computedDiscount = parseCouponDiscount(coupon, subtotalD);

  // If coupon has a minimum amount requirement, validate it here (best-effort)
  const minAmount = Number(coupon.minPrice ?? coupon.minAmount ?? coupon.minAmountNZD ?? 0);
  if (minAmount > 0 && subtotalD < minAmount) {
    const msg = `Coupon requires a minimum order of $${Number(minAmount).toFixed(2)}`;
    setCouponError(msg);
    setDiscountAmount(0);
    setAppliedCoupon(null);
    Swal.fire("Warning", msg, "warning");
    return;
  }

  // Cap discount to not exceed subtotal
  const discountFinal = Math.min(computedDiscount, subtotalD);

  setDiscountAmount(discountFinal);
  setAppliedCoupon(coupon.code ?? coupon._id);
  setCouponError("");
  Swal.fire("Success", `Coupon ${coupon.code} applied! Discount: $${discountFinal.toFixed(2)}`, "success");
};
  return (
    // <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
     <div className="responsive-container">
      <style>
        {`
          @media (max-width: 768px) {
            .checkout-grid {
              display: block !important;
            }
            .checkout-card {
              margin-bottom: 20px !important;
            }
            .place-order-btn {
              width: 100% !important;
            }
          }
        `}
      </style>

      <Header />
      {/* <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" ,color:"#007bff",fontFamily:"monospace"}}>
        Checkout
      </h2> */}
<div className="checkout-wrapper" 
  style={{ 
    maxWidth: "65%",   // 👈 adjust this to match your marked lines
    margin: "0 auto",     // center horizontally
    padding: "20px"       // keep some breathing space
  }}
  >  
   <div
        className="checkout-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1px",
        }}
      >

{/* ---------- Address Section (replace existing address card) ---------- */}
<div
  className="checkout-card"
  style={{
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: "12px",
    padding: "20px",
    width:"90%",
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "15px",
      alignItems: "center",
      
    }}
  >
    <h3 style={{ fontSize: "18px", fontWeight: "600" }}>
      Shipping Address
    </h3>
    <button
      onClick={() => setShowAddForm(!showAddForm)}
      style={{
        padding: "6px 12px",
        fontSize: "14px",
        background: "#007bff",
        color: "#fff",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
      }}
    >
      {showAddForm ? "Cancel" : "Add New"}
    </button>
  </div>

{/* ---------- Address Section (form + saved addresses) ---------- */}
<div style={{ marginBottom: 28 }}>
  {showAddForm && (
    <form
      onSubmit={handleAddAddress}
      aria-label="Add new address"
      className="addr-form-pro"
      style={{ marginBottom: 20 }} // spacing before saved address list
    >
      <div className="addr-card-pro" role="group" aria-labelledby="addr-title">
        <div className="addr-header-pro">
          <div>
            <h4 id="addr-title" className="addr-title-pro">Add New Address</h4>
            <p className="addr-sub-pro">Provide a delivery address for this order</p>
          </div>

          <div className="country-wrap-pro">
            <select
              id="country-select"
              name="country"
              value={newAddress.country}
              onChange={(e) => {
                const val = e.target.value;
                setNewAddress({ ...newAddress, country: val });
                setDeliveryMethod(val === "Australia" ? "australia" : "north");
              }}
              className="select-pro"
              aria-label="Country"
            >
              <option value="New Zealand">New Zealand</option>
              <option value="Australia">Australia</option>
            </select>
          </div>
        </div>

        <div className="grid-pro">
          {/* Full name */}
          <div className="field-pro">
            <label htmlFor="fullName" className="label-pro">Full name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Ajal Jerry"
              value={newAddress.fullName}
              onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
              required
              className="input-pro"
              aria-required="true"
            />
          </div>

          {/* Phone */}
          <div className="field-pro">
            <label htmlFor="phone" className="label-pro">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="022 123 4567"
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              required
              className="input-pro"
              aria-required="true"
            />
          </div>

          {/* Address with single label + styled box */}
          <div className="field-pro fullwidth">
            <label htmlFor="address" className="label-pro">Address</label>

            {/*
              address-shell-pro: single outer border only.
              We intentionally remove any border from the internal AddressAutocomplete input
              to avoid a double-border effect.
            */}
            <div className="address-shell-pro" aria-hidden="false">
              <AddressAutocomplete
                newAddress={newAddress}
                setNewAddress={setNewAddress}
                countryBias={newAddress.country === "Australia" ? "au" : "nz"}
              />
            </div>
          </div>

          {/* City */}
          <div className="field-pro">
            <label htmlFor="city" className="label-pro">City</label>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="Auckland"
              value={newAddress.city || ""}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              required
              className="input-pro"
            />
          </div>

          {/* Region */}
          <div className="field-pro">
            <label htmlFor="region" className="label-pro">Region</label>
            <select
              id="region"
              name="region"
              value={newAddress.region || ""}
              onChange={(e) => setNewAddress({ ...newAddress, region: e.target.value })}
              required
              className="select-pro"
            >
              <option value="">Select region</option>
              {(newAddress.country === "New Zealand"
                ? [
                    "Auckland","Wellington","Canterbury","Otago","Waikato","Bay of Plenty",
                    "Northland","Hawke's Bay","Manawatu-Wanganui","Taranaki","Southland",
                    "Tasman","Nelson","West Coast","Marlborough","Gisborne"
                  ]
                : [
                    "New South Wales","Victoria","Queensland","Western Australia","South Australia",
                    "Tasmania","Australian Capital Territory","Northern Territory"
                  ]
              ).map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Postal code */}
          <div className="field-pro">
            <label htmlFor="postalCode" className="label-pro">Postal code</label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              placeholder="3126"
              value={newAddress.postalCode || ""}
              onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
              className="input-pro"
            />
          </div>

          {/* Address type */}
          <div className="field-pro">
            <label htmlFor="addrType" className="label-pro">Address type</label>
            <select
              id="addrType"
              name="addressType"
              value={newAddress.addressType || "Home"}
              onChange={(e) => setNewAddress({ ...newAddress, addressType: e.target.value })}
              className="select-pro"
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="actions-pro">
          <button
            type="button"
            onClick={() => {
              setShowAddForm(false);
              setAddressError("");
            }}
            className="btn-muted-pro"
          >
            Cancel
          </button>

          <button type="submit" className="btn-primary-pro">
            Save address
          </button>
        </div>

        {addressError && (
          <div className="error-pro" role="alert">{addressError}</div>
        )}
      </div>

      {/* Inline style block — move to CSS file if preferred */}
      <style>{`
        /* Card */
        .addr-card-pro {
          background: #fff;
          border-radius: 12px;
          padding: 22px;
          border: 1px solid rgba(15, 23, 42, 0.06);
          box-shadow: 0 10px 30px rgba(16,24,40,0.06);
          max-width: 980px;
        }
        .addr-header-pro { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:14px; }
        .addr-title-pro { margin:0; font-size:18px; font-weight:700; color:#0b1220; }
        .addr-sub-pro { margin:6px 0 0 0; color:#5b6b75; font-size:13px; }
        .country-wrap-pro { min-width:160px; }

        /* Grid */
        .grid-pro { display:grid; grid-template-columns: repeat(2, 1fr); gap:14px; margin-top:8px; align-items:start; }
        .field-pro { display:flex; flex-direction:column; }
        .field-pro.fullwidth { grid-column: 1 / -1; }
        .label-pro { font-size:13px; color:#4b5963; margin-bottom:8px; font-weight:600; }

        /* Inputs */
        .input-pro, .select-pro {
          height:48px;
          padding: 12px 14px;
          border-radius:10px;
          border: 1px solid rgba(15,23,42,0.06);
          background: linear-gradient(180deg,#ffffff,#fbfdff);
          font-size:15px;
          color:#0b1220;
        }
        .input-pro::placeholder { color:#9aa6b2; }
        .input-pro:focus, .select-pro:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 6px 20px rgba(37,99,235,0.12);
          transform: translateY(-1px);
        }

        /* Address box: single outer border */
        .address-shell-pro {
          border-radius: 10px;
          padding: 8px;
          border: 1px solid rgba(15,23,42,0.04);
          background: linear-gradient(180deg,#ffffff,#fcfdff);
        }
        /* remove inner border of the autocomplete input so there's no double border */
        .address-shell-pro label { display:none !important; }
        .address-shell-pro input {
          width:100% !important;
          height:48px !important;
          padding: 12px 14px !important;
          border-radius:8px !important;
          border: none !important;
          box-shadow: none !important;
          font-size:15px !important;
          background: transparent !important;
        }
        .address-shell-pro ul#address-suggestions {
          margin-top:8px;
          border-radius:10px;
          overflow:hidden;
          box-shadow: 0 10px 30px rgba(16,24,40,0.08);
          border: 1px solid rgba(15,23,42,0.06);
          background: #fff;
        }
        .address-shell-pro li { padding: 10px 12px; cursor: pointer; }

        /* Actions */
        .actions-pro { display:flex; justify-content:flex-end; gap:12px; margin-top:18px; align-items:center; }
        .btn-muted-pro { padding:10px 16px; border-radius:10px; background: #fff; border: 1px solid rgba(15,23,42,0.06); color:#0b1220; font-weight:600; cursor:pointer; }
        .btn-primary-pro { padding:10px 18px; border-radius:10px; background: linear-gradient(180deg,#1f6feb,#144bb5); color:#fff; border:none; font-weight:800; box-shadow: 0 12px 30px rgba(31,111,235,0.18); cursor:pointer; }
        .error-pro { margin-top:12px; color:#b91c1c; font-size:13px; }

        /* Responsive */
        @media (max-width:820px) {
          .grid-pro { grid-template-columns: 1fr; }
          .country-wrap-pro { min-width: 140px; }
        }
      `}</style>
    </form>
  )}

  {/* ---------- Saved addresses list ---------- */}
  <div style={{ marginTop: 18 }}>
    {addresses.length > 0 ? (
      <div style={{ display: "grid", gap: 12 }}>
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="saved-address-card"
            style={{
              background: "#f8fbff",
              borderRadius: 10,
              border: "1px solid rgba(37,99,235,0.12)",
              padding: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 6
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <input
                type="radio"
                name="selectedAddress"
                checked={selectedAddress?._id === addr._id}
                onChange={() => setSelectedAddress(addr)}
                style={{ marginTop: 6 }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{addr.fullName}</div>
                <div style={{ color: "#374151", marginTop: 6 }}>
                  {/* Compose an address line from available fields */}
                  {[
                    addr.address || "",
                    addr.city || "",
                    addr.region || "",
                    addr.postalCode || ""
                  ].filter(Boolean).join(" • ")}
                </div>
                <div style={{ color: "#475569", marginTop: 8, fontSize: 13 }}>
                  {addr.phone ? addr.phone + " • " : ""}{addr.addressType || "Home"}{addr.country ? " • " + addr.country : ""}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <button
                onClick={() => handleDeleteAddress(addr._id)}
                style={{ background: "none", border: "none", color: "#e11d48", cursor: "pointer", fontWeight: 600 }}
              >
                Delete
              </button>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{addr.isDefault ? "Default" : ""}</div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div style={{ color: "#6b7280" }}>No saved addresses. Please add one.</div>
    )}
  </div>
</div>
{/* ---------- End Address Section ---------- */}


</div>




{/* ---------- Order Summary (dynamic totals) ---------- */}
<div
  className="checkout-card"
  style={{
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: "12px",
    padding: "20px",
    width:"90%"
  }}
>
  <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px", }}>
    Order Summary
  </h3>

  <div>
    {cart.map((item) => (
      <div
        key={item.id + "-" + (item.raw?._id || "")}
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid #eee",
          padding: "8px 0",
          color: "#444",  
        }}
      >
        <span>{item.name} × {item.qty}</span>
        <span>${Number(item.lineTotal ?? (item.price ) ?? 0).toFixed(2)}</span>
      </div>
    ))}
  </div>

  {/* Coupon + Apply */}
  <div style={{ marginTop: "15px" }}>
    <select
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value)}
      style={{
        width: "70%",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        marginRight: "10px",
      }}
    >
      <option value="">Select a coupon</option>
      {availableCoupons.length > 0 ? (
  availableCoupons.map((coupon) => (
    <option key={coupon._id || coupon.code} value={coupon.code}>
      {couponLabel(coupon)}
    </option>
  ))
) : (
  <option disabled>No coupons available</option>
)}
    </select>

    <button
      type="button"
      onClick={handleApplyCoupon}
      disabled={!couponCode}
      style={{
        padding: "10px 16px",
        background: couponCode ? "#007bff" : "#ccc",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: couponCode ? "pointer" : "not-allowed",
      }}
    >
      Apply
    </button>

    {couponError && <p style={{ color: "red", marginTop: "6px" }}>{couponError}</p>}
    {appliedCoupon && <p style={{ color: "green", marginTop: "6px" }}>Coupon <strong>{appliedCoupon}</strong> applied!</p>}
  </div>

<div style={{ marginTop: "20px" }}>
  <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "10px" }}>
    Delivery Method
  </h3>

  <div style={{ border: "1px solid #ddd", borderRadius: "6px" }}>
    {((selectedAddress?.country ?? newAddress.country ?? "New Zealand") === "Australia") ? (
      // Australia: show only Australia shipping option (single)
      <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", cursor: "pointer", background: deliveryMethod === "international" ? "#f0f7ff" : "#fff" }}>
        <div>
    <input
      type="radio"
      checked={deliveryMethod === "international"}
      onChange={() => setDeliveryMethod("international")}
    />
    <span>Australia Standard Shipping</span>
    <div style={{ fontSize: "12px", color: "#666" }}>Estimated transit time</div>
  </div>
  {(() => {
    const t = computeTotals();
    const previewShipping = calculateShippingByWeight("australia", t.totalWeightGrams);
    return <span>{new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(previewShipping)}</span>;
  })()}
        
      </label>
    ) : (
      // New Zealand (or default): show North, South, Pickup
      <>
        <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderBottom: "1px solid #eee", background: deliveryMethod === "north" ? "#f0f7ff" : "#fff", cursor: "pointer" }}>
          <div>
            <input type="radio" checked={deliveryMethod === "north"} onChange={() => setDeliveryMethod("north")} style={{ marginRight: "10px" }} />
            <span>North Island Standard Shipping</span>
            <div style={{ fontSize: "12px", color: "#666" }}>3-5 business days</div>
          </div>
{(() => {
  const t = computeTotals();
  const previewShipping = calculateShippingByWeight("north", t.totalWeightGrams);
  return <span>{new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(previewShipping)}</span>;
})()}
      </label>

        <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderBottom: "1px solid #eee", background: deliveryMethod === "south" ? "#f0f7ff" : "#fff", cursor: "pointer" }}>
          <div>
            <input type="radio" checked={deliveryMethod === "south"} onChange={() => setDeliveryMethod("south")} style={{ marginRight: "10px" }} />
            <span>South Island Standard Shipping</span>
            <div style={{ fontSize: "12px", color: "#666" }}>3-5 business days</div>
          </div>
          {(() => {
  const t = computeTotals();
  const previewShipping = calculateShippingByWeight("south", t.totalWeightGrams);
  return <span>{new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(previewShipping)}</span>;
})()}

        </label>

        <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: deliveryMethod === "pickup" ? "#f0f7ff" : "#fff", cursor: "pointer" }}>
          <div>
            <input type="radio" checked={deliveryMethod === "pickup"} onChange={() => setDeliveryMethod("pickup")} style={{ marginRight: "10px" }} />
            <span>Store Pickup</span>
            <div style={{ fontSize: "12px", color: "#666" }}>242 Grey Street, Hamilton</div>
          </div>
          <span>Free</span>
        </label>
      </>
    )}
  </div>
</div>

{/* ---------- Totals (computed) — REPLACE THIS BLOCK ---------- */}
<div style={{ marginTop: 16 }}>
  {(() => {
    const t = computeTotals();

    // use Intl for nicer currency formatting
    const fmt = (v) =>
      new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(v);

    return (
      <div
        style={{
          background: "#fbfcff",
          border: "1px solid #eef2ff",
          padding: 14,
          borderRadius: 10,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Order summary</h4>
          <span style={{ fontSize: 12, color: "#6b7280" }}>{t.treatAsNZ ? t.country : t.country}</span>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
            <span style={{ color: "#374151" }}>Subtotal</span>
            <span style={{ fontWeight: 600 }}>{fmt(t.subtotal)}</span>
          </div>


          

          <div style={{ height: 1, background: "#e6eefc", margin: "10px 0", borderRadius: 1 }} />

          {/* Total shipping line */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
            <span style={{ color: "#374151", fontWeight: 600 }}>Shipping</span>
            <span style={{ fontWeight: 600 }}>{fmt(t.totalShipping)}</span>
          </div>

          {/* Discount */}
          {t.discount > 0 ? (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
              <div>
                <span style={{ color: "#059669", fontWeight: 600 }}>Discount</span>
                <div style={{ fontSize: 12, color: "#055e3b" }}>{appliedCoupon ? `Coupon: ${appliedCoupon}` : ""}</div>
              </div>
              <span style={{ color: "#059669", fontWeight: 700 }}>- {fmt(t.discount)}</span>
            </div>
          ) : null}

          <div style={{ height: 1, background: "#e6eefc", margin: "10px 0", borderRadius: 1 }} />

          {/* Grand total */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 6 }}>
            <div>
              <div style={{ fontSize: 14, color: "#374151" }}>Total</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{t.treatAsNZ ? "Includes regional surcharges" : "Final amount"}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{fmt(t.grandTotal)}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>NZD</div>
            </div>
          </div>

          {/* Small helper text */}
          <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
            {deliveryMethod === "pickup"
              ? "You selected Store Pickup — no shipping will be charged."
              : "Shipping is estimated. Final shipping will be confirmed at order processing."}
          </div>
        </div>
      </div>
    );
  })()}
</div>
{/* ---------- End Totals (computed) ---------- */}
</div>
{/* ---------- End Order Summary ---------- */}

     
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    gap: 12,
    flexWrap: "wrap",

    // THIS ADDS SPACE BELOW THE BUTTON / SUMMARY CARD
    marginBottom: 48,    // <-- increase/decrease this value to control spacing
  }}
>
  {/* left small note / terms */}
  <div style={{ flex: "1 1 220px", minWidth: 220, color: "#6b7280", fontSize: 13 }}>
    By placing your order you agree to our{" "}
    <a href="/terms" style={{ color: "#2563eb", textDecoration: "underline" }}>
      Terms & Conditions
    </a>.
  </div>

  {/* right: CTA */}
  <div style={{ flex: "0 0 auto"}}>
    <button
      onClick={handlePlaceOrder}
      style={{
        padding: "12px 20px",
        background: "#2563eb",
        color: "#fff",
        fontWeight: 700,
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        boxShadow: "0 6px 18px rgba(37,99,235,0.18)",
        minWidth: 160,
        
        // small extra spacing immediately under the button on very narrow screens:
        marginBottom: 6,
       
      }}
      className="place-order-inline-btn"
    >
      Place order
    </button>
  </div>
</div>
</div>
</div>
{/* responsive tweak (keeps everything in same file) */}
<style>
{`
  @media (max-width: 520px) {
    .place-order-inline-btn {
      width: 100% !important;
      min-width: 0 !important;
    }
  }
`}
</style>
{/* ---------- End inline CTA ---------- */}
{/* ---------- End inline CTA ---------- */}
      <Footer />
    </div>
    
  );
};



export default Checkout;
