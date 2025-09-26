// src/pages/user/CheckoutForm.jsx
import { useState, useEffect } from "react";
import { Check, AlertCircle, Shield, Clock } from "lucide-react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

const CheckoutForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderDetails } = location.state || {}; // passed from checkout page
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [cardReady, setCardReady] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const [billingDetails, setBillingDetails] = useState({
    name: orderDetails?.orderData?.shippingName || orderDetails?.orderData?.fullName || "",
    email: ""
  });

  useEffect(() => {
    const timer = setTimeout(() => setStripeLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

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
        fontSize: '16px',
        color: '#424770',
        '::placeholder': { color: '#aab7c4' },
        padding: '12px',
      },
      invalid: { color: '#9e2146' },
    },
    hidePostalCode: true,
  };

  const handleBillingInputChange = (field, value) =>
    setBillingDetails(prev => ({ ...prev, [field]: value }));

  const validateBillingForm = () => {
    if (!billingDetails.name.trim()) return "Please enter the cardholder name";
    if (!billingDetails.email || !billingDetails.email.includes("@")) return "Please enter a valid email";
    return null;
  };

  const handleCardChange = (event) => {
    if (event.error) setPaymentError(event.error.message);
    else setPaymentError("");
  };
  const handleCardReady = () => { setCardReady(true); };

  // Helper to get orderId from orderDetails (support several shapes)
  const getOrderIdFromDetails = () => {
    if (!orderDetails) return null;
    return orderDetails.orderId
      || orderDetails._id
      || (orderDetails.orderData && (orderDetails.orderData._id || orderDetails.orderData.orderId))
      || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentError("");
    setPaymentSuccess("");

    const orderId = getOrderIdFromDetails();
    if (!orderId) {
      setPaymentError("Order information is missing. Please go back and try again.");
      return;
    }

    if (!stripe || !elements) {
      setPaymentError("Payment system is not ready. Please wait a moment and try again.");
      return;
    }

    const billingValidationError = validateBillingForm();
    if (billingValidationError) {
      setPaymentError(billingValidationError);
      return;
    }

    setLoading(true);

    try {
      // 1) ask backend for client secret
      const piResp = await fetch(`${API_BASE_URL}/order/create-payment-intent`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, selectedPaymentMethod }),
      });

      if (!piResp.ok) {
        const txt = await piResp.text().catch(() => null);
        throw new Error(txt || `Server error creating payment intent (${piResp.status})`);
      }

      const piData = await piResp.json();
      const clientSecret =
        piData.clientSecret ||
        piData.client_secret ||
        (piData.data && (piData.data.clientSecret || piData.data.client_secret)) ||
        (piData.data && piData.data.paymentIntent && piData.data.paymentIntent.client_secret);

      if (!clientSecret) throw new Error("Missing client secret from server response.");

      // 2) confirm card payment
      const cardEl = elements.getElement(CardElement);
      if (!cardEl) throw new Error("Card input is not ready.");

      const confirmResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardEl,
          billing_details: {
            name: billingDetails.name || "Customer",
            email: billingDetails.email || undefined,
          },
        },
      });

      if (confirmResult.error) {
        console.error("Stripe confirm error:", confirmResult.error);
        setPaymentError(confirmResult.error.message || "Payment failed during confirmation.");
        setLoading(false);
        return;
      }

      const paymentIntent = confirmResult.paymentIntent;
      if (!paymentIntent) throw new Error("Payment did not complete correctly.");

      // 3) persist payment on backend
      const saveResp = await fetch(`${API_BASE_URL}/order/${encodeURIComponent(orderId)}/pay`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentResult: paymentIntent }),
      });

      if (!saveResp.ok) {
        const txt = await saveResp.text().catch(() => null);
        console.error("Failed to save payment on server:", txt);
        setPaymentError("Payment succeeded but saving failed. Please contact support.");
        setLoading(false);
        return;
      }

      const saved = await saveResp.json();

      // 4) clear client cart
      try { localStorage.removeItem("cart"); } catch (err) { console.warn("Failed to clear cart:", err); }

      // 5) Navigate to your existing Order Confirmation page (you already have that component)
      // Prepare state for OrderConfirmation component
      const returnedOrder = saved.order || saved.data || saved;
      // Fallback to orderDetails.orderData if server didn't return whole order
      const orderForConfirmation = returnedOrder && (returnedOrder._id || returnedOrder.orderId)
        ? returnedOrder
        : (orderDetails.orderData || { orderItems: orderDetails.products || [], totalPrice: orderDetails.amount ? orderDetails.amount / 100 : orderDetails.totalPrice || 0 });

      const items = orderForConfirmation.orderItems || orderForConfirmation.items || (orderForConfirmation.products || []);
      const total =
        (orderForConfirmation.totalPrice ?? orderForConfirmation.total ?? orderForConfirmation.amount ?? orderDetails.amount ?? 0);

      navigate("/orderconfirmation", {
        state: {
          orderId: orderForConfirmation._id || orderForConfirmation.orderId || orderId,
          date: new Date().toLocaleString(),
          items,
          total,
        },
      });
    } catch (err) {
      console.error("Payment flow error:", err);
      setPaymentError(err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodName = (method) => {
    const methods = {
      card: "Credit/Debit Card",
      paypal: "PayPal",
      klarna: "Klarna",
      afterpay: "Afterpay",
      cashapp: "Cash App Pay"
    };
    return methods[method] || method;
  };

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: "💳", available: true, description: "Visa, Mastercard, American Express" },
    { id: "paypal", name: "PayPal", icon: "🅿️", available: true, description: "Pay with your PayPal account" },
    { id: "klarna", name: "Klarna", icon: "🛒", available: true, description: "Buy now, pay later" },
    { id: "afterpay", name: "Afterpay", icon: "💰", available: true, description: "4 interest-free payments" },
    { id: "cashapp", name: "Cash App Pay", icon: "💚", available: true, description: "Pay with Cash App" }
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

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Payment</h2>
        <div className="text-lg font-semibold text-blue-600">
          ${(orderDetails.amount / 100).toFixed(2)} USD
        </div>
        <p className="text-sm text-gray-600 mt-1">{orderDetails.description}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Select Payment Method</h3>
        <div className="space-y-2">
          {paymentMethods.filter(m => m.available).map((method) => (
            <label key={method.id} className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === method.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="radio" name="paymentMethod" value={method.id} checked={selectedPaymentMethod === method.id} onChange={(e) => setSelectedPaymentMethod(e.target.value)} className="sr-only" />
              <span className="text-xl mr-3">{method.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-800">{method.name}</div>
                <div className="text-xs text-gray-500">{method.description}</div>
              </div>
              {selectedPaymentMethod === method.id && <Check className="w-5 h-5 text-blue-600" />}
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
          {loading ? (<div className="flex items-center justify-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>Processing...</div>)
            : selectedPaymentMethod === "card" && !cardReady ? "Loading card form..." : (selectedPaymentMethod === "card" ? `Pay $${(orderDetails.amount / 100).toFixed(2)}` : `Continue with ${getPaymentMethodName(selectedPaymentMethod)}`)}
        </button>

        {paymentSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-green-800"><p className="font-medium">Payment Successful!</p><p className="mt-1">{paymentSuccess}</p></div>
            </div>
          </div>
        )}

        {paymentError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-red-800"><p className="font-medium">Payment Error</p><p className="mt-1">{paymentError}</p></div>
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
          <p>This is a demonstration. No real payments will be processed. Use test card numbers for different scenarios.</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
