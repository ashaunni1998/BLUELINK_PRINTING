import { useState, useEffect } from "react";
import {  Check, AlertCircle, Shield, Clock } from "lucide-react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
// import axios from "axios"; // Use fetch instead
import { useLocation } from "react-router-dom";

const CheckoutForm = () => {
    const location = useLocation();
  const { orderDetails } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [cardReady, setCardReady] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  // Non-card form state (for billing info)
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: ""
  });

    useEffect(() => {

    // Simulate Stripe loading
    const timer = setTimeout(() => {
      setStripeLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  // ✅ Add safety check for orderDetails
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

  // Card element options
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '12px',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };


  // Handle billing input changes
  const handleBillingInputChange = (field, value) => {
    setBillingDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate billing form
  const validateBillingForm = () => {
    if (!billingDetails.name.trim()) {
      return "Please enter the cardholder name";
    }
    if (!billingDetails.email || !billingDetails.email.includes("@")) {
      return "Please enter a valid email";
    }
    return null;
  };

  // Handle CardElement events
  const handleCardChange = (event) => {
    if (event.error) {
      setPaymentError(event.error.message);
    } else {
      setPaymentError("");
    }
  };

  const handleCardReady = () => {
    setCardReady(true);
    console.log("CardElement is ready");
  };

  // Handle payment submission
  const handleSubmit = async () => {
    setLoading(true);
    setPaymentSuccess("");
    setPaymentError("");

    try {
      if (!stripe || !elements) {
        console.error("Stripe or Elements not loaded");
        setPaymentError("Payment system not ready. Please try again.");
        setLoading(false);
        return;
      }

      // Validate billing details for card payments
      if (selectedPaymentMethod === "card") {
        const validation = validateBillingForm();
        if (validation) {
          setPaymentError(validation);
          setLoading(false);
          return;
        }

        // Check if CardElement is ready
        if (!cardReady) {
          setPaymentError("Card element not ready. Please wait and try again.");
          setLoading(false);
          return;
        }
      }

      // Create payment intent
      console.log("Creating payment intent for:", {
        amount: orderDetails.amount,
        paymentMethod: selectedPaymentMethod,
        orderId: orderDetails.orderId
      });

      const paymentData = {
        order: { ...orderDetails },
        selectedPaymentMethod,
        billingDetails
      };

      const response = await fetch("https://kerala-digital-park-server.vercel.app/api/order/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log("Payment Intent created:", data.paymentIntent);

      if (selectedPaymentMethod === "card") {
        // Get the CardElement
        const cardElement = elements.getElement(CardElement);
        console.log("CardElement:", cardElement);

        if (!cardElement) {
          console.error("CardElement not found.");
          setPaymentError("Card element not found. Please refresh and try again.");
          setLoading(false);
          return;
        }

        // Confirm card payment
        const result = await stripe.confirmCardPayment(data.paymentIntent.client_secret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: billingDetails.name,
              email: billingDetails.email,
            },
          },
        });

        if (result.error) {
          console.error("Payment failed:", result.error.message);
          setPaymentError(result.error.message);
        } else if (result.paymentIntent.status === "succeeded") {
          console.log("Payment successful:", result.paymentIntent);
          setPaymentSuccess(`Payment successful! Payment ID: ${result.paymentIntent.id}`);
        }
      } else {
        const result = await stripe.confirmPayment({
          elements,
          clientSecret: data.paymentIntent.client_secret,
          confirmParams: {
            return_url: "https://yourdomain.com/payment-success", // update to your frontend success page
            payment_method_data: {
              billing_details: {
                name: billingDetails.name,
                email: billingDetails.email,
              },
            },
          },
        });

        if (result.error) {
          console.error("Payment failed:", result.error.message);
          setPaymentError(result.error.message);
        } else {
          // The user is being redirected → don't show success immediately
          setPaymentSuccess(`${selectedPaymentMethod} payment initiated. Redirecting...`);
        }
        // setPaymentSuccess(`${selectedPaymentMethod} payment initiated successfully!`);
      }

    } catch (err) {
      console.error("Payment error:", err);
      setPaymentError(err.message || "Something went wrong. Please try again.");
    }

    setLoading(false);
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

      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Select Payment Method</h3>
        <div className="space-y-2">
          {paymentMethods.filter(method => method.available).map((method) => (
            <label
              key={method.id}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === method.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
                }`}
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
              {selectedPaymentMethod === method.id && (
                <Check className="w-5 h-5 text-blue-600" />
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* Card Details - Only show for card payments */}
        {selectedPaymentMethod === "card" && (
          <div className="space-y-4">
            {/* Stripe CardElement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Information
              </label>
              <div className="p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                <CardElement
                  options={cardElementOptions}
                  onChange={handleCardChange}
                  onReady={handleCardReady}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use 4242 4242 4242 4242 for success, 4000 0000 0000 0002 for decline
              </p>
            </div>

            {/* Billing Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                value={billingDetails.name}
                onChange={(e) => handleBillingInputChange("name", e.target.value)}
                placeholder="John Doe"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={billingDetails.email}
                onChange={(e) => handleBillingInputChange("email", e.target.value)}
                placeholder="john@example.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Info for redirect payments */}
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

        {/* Payment Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || (selectedPaymentMethod === "card" && !cardReady)}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${loading || (selectedPaymentMethod === "card" && !cardReady)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : selectedPaymentMethod === "card" && !cardReady ? (
            "Loading card form..."
          ) : (
            selectedPaymentMethod === "card"
              ? `Pay $${(orderDetails.amount / 100).toFixed(2)}`
              : `Continue with ${getPaymentMethodName(selectedPaymentMethod)}`
          )}
        </button>

        {/* Success/Error Messages */}
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

      {/* Security Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center text-sm text-gray-600">
          <Shield className="w-4 h-4 mr-2 text-gray-500" />
          <span>Your payment information is secure and encrypted. We use Stripe for safe payment processing.</span>
        </div>
      </div>

      {/* Demo Info */}
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