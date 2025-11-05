// src/pages/user/CheckoutForm.jsx
import { useState, useEffect } from "react";
import { Check, AlertCircle, Shield, Clock } from "lucide-react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

const CheckoutForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderDetails } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [cardReady, setCardReady] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    // Simulate Stripe loading for demo UI — if you depend on Stripe ready, you can remove.
    const timer = setTimeout(() => setStripeLoaded(true), 600);
    return () => clearTimeout(timer);
  }, []);

  // Safety: if no orderDetails, show a friendly message
  if (!orderDetails) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-orange-600" />
          <h2 className="text-xl font-semibold mb-2">Order Details Missing</h2>
          <p className="text-gray-600">Please go back and place your order first.</p>
        </div>
      </div>
    );
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": { color: "#aab7c4" },
        padding: "12px",
      },
      invalid: { color: "#9e2146" },
    },
    hidePostalCode: true,
  };

  const handleBillingInputChange = (field, value) =>
    setBillingDetails((prev) => ({ ...prev, [field]: value }));

  const validateBillingForm = () => {
    if (!billingDetails.name.trim()) return "Please enter the cardholder name";
    if (!billingDetails.email || !billingDetails.email.includes("@"))
      return "Please enter a valid email";
    return null;
  };

  const handleCardChange = (event) => {
    if (event.error) setPaymentError(event.error.message);
    else setPaymentError("");
  };

  const handleCardReady = () => {
    setCardReady(true);
    // console.log("CardElement is ready");
  };

  // Heuristic helpers
  const toMajor = (v) => {
    if (v == null) return 0;
    const n = Number(v);
    if (!isFinite(n)) return 0;
    // if large integer -> probably cents
    if (Number.isInteger(n) && Math.abs(n) >= 1000) return n / 100;
    return n;
  };

  // Compute authoritative amount in cents
  const resolveAmountCents = () => {
    // 1) prefer server preview totalMajor
    const preview = orderDetails.preview || null;
    if (preview && (typeof preview.totalMajor === "number" || typeof preview.total === "number")) {
      const major = typeof preview.totalMajor === "number" ? preview.totalMajor : Number(preview.total);
      if (!Number.isNaN(major)) return Math.round(Number(major) * 100);
    }

    // 2) If server provided amount numeric, try using it (may be cents or major)
    if (typeof orderDetails.amount !== "undefined" && orderDetails.amount !== null) {
      const raw = Number(orderDetails.amount);
      if (Number.isFinite(raw)) {
        // if large number treat as cents
        if (raw >= 1000) return Math.round(raw);
        return Math.round(raw * 100);
      }
    }

    // 3) Fallback: compute from products + shipping + any preview.discount (no client state dependency)
    const products = Array.isArray(orderDetails.products)
      ? orderDetails.products
      : Array.isArray(orderDetails.preview?.items)
      ? orderDetails.preview.items
      : [];

    let subtotalMajor = 0;
    for (const p of products) {
      const qty = Number(p.quantity ?? p.qty ?? p.qtyOrdered ?? 1) || 1;
      // try various unit price fields
      let unit = Number(p.unitPrice ?? p.price ?? p.unit_price ?? p.amount ?? 0) || 0;
      // heuristics: if unit looks like cents convert
      if (unit >= 1000) unit = unit / 100;
      subtotalMajor += unit * qty;
    }

    // shipping: prefer preview.shipping else orderDetails.shipping else 0
    let shippingMajor = 0;
    if (typeof orderDetails.shipping === "number") shippingMajor = toMajor(orderDetails.shipping);
    else if (preview && typeof preview.shipping === "number") shippingMajor = toMajor(preview.shipping);

    // discount: prefer preview.discount or orderDetails.discount (major units)
    const discountMajor = toMajor(preview?.discount ?? orderDetails.discount ?? 0);

    const grandMajor = Math.max(0, subtotalMajor + shippingMajor - discountMajor);
    return Math.round(grandMajor * 100);
  };

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    setLoading(true);
    setPaymentError("");
    setPaymentSuccess("");

    try {
      if (!orderDetails) throw new Error("Order details missing.");

      // Resolve amount
      const amountCents = resolveAmountCents();
      if (!Number.isFinite(amountCents) || amountCents <= 0) {
        throw new Error("Computed invalid payment amount. Please check order details.");
      }
      console.debug("Resolved amountCents:", amountCents);

      // Ensure Stripe is ready
      if (!stripe || !elements) throw new Error("Payment system not ready. Please try again later.");

      if (selectedPaymentMethod === "card") {
        const validationMsg = validateBillingForm();
        if (validationMsg) throw new Error(validationMsg);
        if (!cardReady) throw new Error("Card input not ready. Please wait a moment and try again.");
      }

      // Use provided client secret when present; otherwise ask server to create PaymentIntent
      let clientSecret = orderDetails.clientSecret;
      if (!clientSecret) {
        // Request server to create a payment intent (your backend has /order/create-payment-intent)
        const resp = await fetch(`${API_BASE_URL}/order/create-payment-intent`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amountCents,
            currency: (orderDetails.currency || "nzd").toLowerCase(),
            products: orderDetails.products || [],
            shipping: orderDetails.shipping || orderDetails.preview?.shipping || 0,
            selectedPaymentMethod,
          }),
        });

        if (!resp.ok) {
          const txt = await resp.text().catch(() => "");
          throw new Error(`Failed to create payment intent: ${resp.status} ${txt}`);
        }
        const json = await resp.json().catch(() => null);
        clientSecret = json?.data?.clientSecret ?? json?.client_secret ?? json?.clientSecret ?? json?.client_secret;
        if (!clientSecret) throw new Error("Server did not return a client secret.");
      }

      // CARD flow
      if (selectedPaymentMethod === "card") {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) throw new Error("Card element not found. Please refresh the page.");

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: billingDetails.name,
              email: billingDetails.email,
            },
          },
        });

        if (result.error) {
          console.error("Payment failed:", result.error);
          setPaymentError(result.error.message || "Payment failed.");
          navigate("/failure", { state: { orderDetails, error: result.error.message } });
          setLoading(false);
          return;
        }

        const pi = result.paymentIntent;
        if (!pi) throw new Error("Payment returned no PaymentIntent.");

        // Build payload expected by backend confirmPaymentAndCreateOrder
        const confirmPayload = {
          paymentIntent: pi,
          products: (orderDetails.products || []).map((p) => ({
            productId: p.productId ?? p.id ?? p._id ?? p.product,
            quantity: Number(p.quantity ?? p.qty ?? 1),
          })),
          billingDetails,
          shipping: orderDetails.shipping ?? orderDetails.preview?.shipping ?? 0,
          address: orderDetails.address ?? null,
        };

        // POST to your backend confirm endpoint (server verifies PaymentIntent then creates/finalizes order)
        const confirmUrl = `${API_BASE_URL}/order/confirm-payment`;
        const finalizeResp = await fetch(confirmUrl, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(confirmPayload),
        });

        const finalizeBody = await finalizeResp.json().catch(() => null);

        if (!finalizeResp.ok) {
          // try to present helpful server error
          const serverMsg = finalizeBody?.message || finalizeBody?.error || `${finalizeResp.status} ${finalizeResp.statusText}`;
          console.error("confirm-payment failed:", serverMsg, finalizeBody);
          throw new Error(`confirm-payment failed: ${serverMsg}`);
        }

        // success — backend should return the created/finalized order
        const createdOrder = finalizeBody?.data ?? finalizeBody?.order ?? finalizeBody;
        setPaymentSuccess("Payment successful and order created.");
        navigate("/orderconfirmation", { state: { order: createdOrder } });
        setLoading(false);
        return;
      }

      // NON-CARD flows (redirects) - use Stripe's confirmPayment
      const confirmResult = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
          payment_method_data: {
            billing_details: {
              name: billingDetails.name,
              email: billingDetails.email,
            },
          },
        },
      });

      if (confirmResult.error) {
        setPaymentError(confirmResult.error.message || "Redirect payment initiation failed.");
        navigate("/failure", { state: { orderDetails, error: confirmResult.error.message } });
        setLoading(false);
        return;
      }

      // redirect started successfully
      setPaymentSuccess("Redirecting to complete payment...");
      setLoading(false);
    } catch (err) {
      console.error("handleSubmit error:", err);
      setPaymentError(err.message || "Payment error, please try again.");
      try {
        navigate("/failure", { state: { orderDetails, error: err.message } });
      } catch (e) {
        /* ignore navigation errors */
      }
      setLoading(false);
    }
  };

  const getPaymentMethodName = (method) => {
    const methods = {
      card: "Credit/Debit Card",
      paypal: "PayPal",
      klarna: "Klarna",
      afterpay: "Afterpay",
      cashapp: "Cash App Pay",
    };
    return methods[method] || method;
  };

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: "💳", available: true, description: "Visa, Mastercard, American Express" },
    { id: "paypal", name: "PayPal", icon: "🅿️", available: true, description: "Pay with your PayPal account" },
    { id: "klarna", name: "Klarna", icon: "🛒", available: true, description: "Buy now, pay later" },
    { id: "afterpay", name: "Afterpay", icon: "💰", available: true, description: "4 interest-free payments" },
    { id: "cashapp", name: "Cash App Pay", icon: "💚", available: true, description: "Pay with Cash App" },
  ];

  if (!stripeLoaded) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold mb-2">Loading Payment Form</h2>
          <p className="text-gray-600">Initializing secure payment...</p>
        </div>
      </div>
    );
  }

  // For display on button: prefer preview.totalMajor then orderDetails.amount
  const amountMajorForDisplay =
    Number(orderDetails?.preview?.totalMajor ?? orderDetails?.preview?.total ?? NaN) ||
    (typeof orderDetails?.amount === "number" ? (orderDetails.amount >= 1000 ? orderDetails.amount / 100 : orderDetails.amount) : 0);

  const currencyDisplay = (orderDetails?.currency || "NZD").toUpperCase();

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Payment</h2>
        <div className="text-lg font-semibold text-blue-600">
          {new Intl.NumberFormat("en-NZ", { style: "currency", currency: currencyDisplay }).format(amountMajorForDisplay)}
        </div>
        <p className="text-sm text-gray-600 mt-1">{orderDetails.description || "Order payment - preview"}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Select Payment Method</h3>
        <div className="space-y-2">
          {paymentMethods.filter((m) => m.available).map((method) => (
            <label
              key={method.id}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === method.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedPaymentMethod === method.id}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <span className="text-xl mr-3">{method.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-800">{method.name}</div>
                <div className="text-xs text-gray-500">{method.description}</div>
              </div>
              {selectedPaymentMethod === method.id && <Check className="w-5 h-5 text-blue-600" /> }
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {selectedPaymentMethod === "card" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Information</label>
              <div className="p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                <CardElement options={cardElementOptions} onChange={handleCardChange} onReady={handleCardReady} />
              </div>
              <p className="text-xs text-gray-500 mt-1">Use 4242 4242 4242 4242 for success, 4000 0000 0000 0002 for decline</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input type="text" value={billingDetails.name} onChange={(e) => handleBillingInputChange("name", e.target.value)} placeholder="John Doe" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" value={billingDetails.email} onChange={(e) => handleBillingInputChange("email", e.target.value)} placeholder="john@example.com" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
        )}

        {selectedPaymentMethod !== "card" && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Redirect Payment</p>
                <p>You will be redirected to {getPaymentMethodName(selectedPaymentMethod)} to complete your payment securely.</p>
              </div>
            </div>
          </div>
        )}

        <button type="button" onClick={handleSubmit} disabled={loading || (selectedPaymentMethod === "card" && !cardReady)} className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${loading || (selectedPaymentMethod === "card" && !cardReady) ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"}`}>
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </div>
          ) : selectedPaymentMethod === "card" && !cardReady ? (
            "Loading card form..."
          ) : selectedPaymentMethod === "card" ? (
            `Pay ${new Intl.NumberFormat("en-NZ", { style: "currency", currency: currencyDisplay }).format(amountMajorForDisplay)}`
          ) : (
            `Continue with ${getPaymentMethodName(selectedPaymentMethod)}`
          )}
        </button>

        {paymentSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <p className="font-medium">Payment Successful!</p>
                <p className="mt-1">{paymentSuccess}</p>
              </div>
            </div>
          </div>
        )}

        {paymentError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-medium">Payment Error</p>
                <p className="mt-1">{paymentError}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center text-sm text-gray-600">
          <Shield className="w-4 h-4 mr-2 text-gray-500" />
          <span>Your payment information is secure and encrypted. We use Stripe for safe payment processing.</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="text-xs text-yellow-800">
          <p className="font-medium mb-1">Demo Mode</p>
          <p>This is a demonstration. No real payments will be processed. Use test card numbers for scenarios.</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
