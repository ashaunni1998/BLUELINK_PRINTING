import { useState, useEffect } from "react";
import { CreditCard, Check, AlertCircle, Shield, Clock, XCircle, CheckCircle } from "lucide-react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const CheckoutForm = ({ orderDetails, onPaymentSuccess, onPaymentError }) => {
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'error', 'processing', null

  const stripe = useStripe();
  const elements = useElements();

  // Non-card form state (for billing info)
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: ""
  });

  // Enhanced save payment result function
  const savePaymentResult = async (orderId, paymentIntent, billingDetails) => {

    try {
      const response = await fetch(`http://localhost:3000/api/order/${orderId}/pay`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          paymentResult: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            payment_method: paymentIntent.payment_method,
            update_time: new Date().toISOString(),
            email_address: billingDetails.email,
            billing_details: billingDetails,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to save payment result: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Error saving payment result:", err);
      throw err; // Re-throw to handle in calling function
    }
  };

  // Enhanced error handling function
  const handlePaymentError = (error, context = '') => {
    console.error(`Payment error${context ? ` (${context})` : ''}:`, error);
    
    let errorMessage = "An unexpected error occurred. Please try again.";
    
    // Handle different types of errors
    if (error.type === 'card_error') {
      errorMessage = error.message;
    } else if (error.type === 'validation_error') {
      errorMessage = error.message;
    } else if (error.type === 'api_connection_error') {
      errorMessage = "Network error. Please check your connection and try again.";
    } else if (error.type === 'api_error') {
      errorMessage = "Payment processing error. Please try again later.";
    } else if (error.type === 'authentication_error') {
      errorMessage = "Authentication error. Please refresh the page and try again.";
    } else if (error.type === 'rate_limit_error') {
      errorMessage = "Too many requests. Please wait a moment and try again.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    setPaymentError(errorMessage);
    setPaymentStatus('error');
    
    // Call parent callback if provided
    if (onPaymentError) {
      onPaymentError({
        error: errorMessage,
        originalError: error,
        context
      });
    }
  };

  // Enhanced success handling function
  const handlePaymentSuccess = async (paymentIntent, billingDetails) => {
    try {
      setPaymentStatus('processing');
      setPaymentSuccess("Payment successful! Saving order details...");

      // Save payment result to backend
      if (orderDetails.orderId) {
        // console.log(12122,orderDetails);
        
        await savePaymentResult(orderDetails.orderId, paymentIntent, billingDetails);
      }

      const successMessage = `Payment completed successfully! Transaction ID: ${paymentIntent.id}`;
      setPaymentSuccess(successMessage);
      setPaymentStatus('success');

      // Call parent callback if provided
      if (onPaymentSuccess) {
        onPaymentSuccess({
          paymentIntent,
          billingDetails,
          orderId: orderDetails.orderId,
          transactionId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency
        });
      }

      // Optional: Auto-redirect after success
      setTimeout(() => {
        // You could redirect to a success page here
        // window.location.href = '/payment-success';
      }, 3000);

    } catch (error) {
      console.error("Error in success handling:", error);
      setPaymentError("Payment succeeded but failed to save order details. Please contact support.");
      setPaymentStatus('error');
      
      if (onPaymentError) {
        onPaymentError({
          error: "Post-payment processing failed",
          originalError: error,
          context: "success_handling"
        });
      }
    }
  };

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

  useEffect(() => {
    // Simulate Stripe loading
    const timer = setTimeout(() => {
      setStripeLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Reset states when payment method changes
  useEffect(() => {
    setPaymentError("");
    setPaymentSuccess("");
    setPaymentStatus(null);
  }, [selectedPaymentMethod]);

  // Handle billing input changes
  const handleBillingInputChange = (field, value) => {
    setBillingDetails(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (paymentError) {
      setPaymentError("");
      setPaymentStatus(null);
    }
  };

  // Enhanced validation
  const validateBillingForm = () => {
    const errors = [];
    
    if (!billingDetails.name.trim()) {
      errors.push("Cardholder name is required");
    }
    
    if (!billingDetails.email) {
      errors.push("Email address is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingDetails.email)) {
      errors.push("Please enter a valid email address");
    }
    
    return errors.length > 0 ? errors.join(", ") : null;
  };

  // Handle CardElement events
  const handleCardChange = (event) => {
    if (event.error) {
      setPaymentError(event.error.message);
      setPaymentStatus('error');
    } else {
      setPaymentError("");
      setPaymentStatus(null);
    }
  };

  const handleCardReady = () => {
    setCardReady(true);
    console.log("CardElement is ready");
  };

  // Enhanced payment submission
  const handleSubmit = async () => {
    // Reset states
    setLoading(true);
    setPaymentSuccess("");
    setPaymentError("");
    setPaymentStatus('processing');

    try {
      // Basic validations
      if (!stripe || !elements) {
        throw new Error("Payment system not ready. Please refresh the page and try again.");
      }

      // Validate billing details for all payment methods
      const validationError = validateBillingForm();
      if (validationError) {
        throw new Error(validationError);
      }

      // Additional validation for card payments
      if (selectedPaymentMethod === "card" && !cardReady) {
        throw new Error("Card element not ready. Please wait and try again.");
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

      const response = await fetch("http://localhost:3000/api/order/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Payment Intent created:", data.paymentIntent);

      if (selectedPaymentMethod === "card") {

        await handleCardPayment(data.paymentIntent);
      } else {
        await handleRedirectPayment(data.paymentIntent);
      }

    } catch (error) {
      console.log(1234,error);
      
      handlePaymentError(error, 'payment_submission');
    } finally {
      setLoading(false);
    }
  };

  // Handle card payment flow
  const handleCardPayment = async (paymentIntent) => {
    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error("Card element not found. Please refresh and try again.");
      }

      setPaymentSuccess("Processing card payment...");

      const result = await stripe.confirmCardPayment(paymentIntent.client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingDetails.name,
            email: billingDetails.email,
          },
        },
      });

      if (result.error) {
        throw result.error;
      }

      if (result.paymentIntent.status === "succeeded") {
        await handlePaymentSuccess(result.paymentIntent, billingDetails);
      } else if (result.paymentIntent.status === "requires_action") {
        setPaymentSuccess("Payment requires additional authentication...");
        // Handle 3D Secure or other authentication
      } else {
        throw new Error(`Payment failed with status: ${result.paymentIntent.status}`);
      }

    } catch (error) {
      throw error; // Re-throw to be handled by main error handler
    }
  };

  // Handle redirect payment flow
  const handleRedirectPayment = async (paymentIntent) => {
    try {
      setPaymentSuccess(`Redirecting to ${getPaymentMethodName(selectedPaymentMethod)}...`);

      const result = await stripe.confirmPayment({
        elements,
        clientSecret: paymentIntent.client_secret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?session_id=${paymentIntent.id}`,
          payment_method_data: {
            billing_details: {
              name: billingDetails.name,
              email: billingDetails.email,
            },
          },
        },
        redirect: "if_required"
      });

      if (result.error) {
        throw result.error;
      }

      // If no redirect happened, payment succeeded
      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        await handlePaymentSuccess(result.paymentIntent, billingDetails);
      }

    } catch (error) {
      throw error;
    }
  };

  // Reset form function
  const resetForm = () => {
    setPaymentError("");
    setPaymentSuccess("");
    setPaymentStatus(null);
    setBillingDetails({ name: "", email: "" });
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

  // Loading state
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

  // Success state
  if (paymentStatus === 'success') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">{paymentSuccess}</p>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
            <div className="text-sm text-green-800">
              <p><strong>Amount:</strong> ${(orderDetails.amount / 100).toFixed(2)}</p>
              <p><strong>Payment Method:</strong> {getPaymentMethodName(selectedPaymentMethod)}</p>
              <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
            </div>
          </div>
          <button
            onClick={resetForm}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Make Another Payment
          </button>
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
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                selectedPaymentMethod === method.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedPaymentMethod === method.id}
                onChange={(e) => !loading && setSelectedPaymentMethod(e.target.value)}
                className="sr-only"
                disabled={loading}
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
                Cardholder Name *
              </label>
              <input
                type="text"
                value={billingDetails.name}
                onChange={(e) => handleBillingInputChange("name", e.target.value)}
                placeholder="John Doe"
                disabled={loading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={billingDetails.email}
                onChange={(e) => handleBillingInputChange("email", e.target.value)}
                placeholder="john@example.com"
                disabled={loading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        )}

        {/* Billing details for redirect payments */}
        {selectedPaymentMethod !== "card" && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Redirect Payment</p>
                  <p>You will be redirected to {getPaymentMethodName(selectedPaymentMethod)} to complete your payment securely.</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={billingDetails.name}
                onChange={(e) => handleBillingInputChange("name", e.target.value)}
                placeholder="John Doe"
                disabled={loading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={billingDetails.email}
                onChange={(e) => handleBillingInputChange("email", e.target.value)}
                placeholder="john@example.com"
                disabled={loading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        )}

        {/* Payment Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || (selectedPaymentMethod === "card" && !cardReady) || paymentStatus === 'success'}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
            loading || (selectedPaymentMethod === "card" && !cardReady) || paymentStatus === 'success'
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
          ) : paymentStatus === 'success' ? (
            "Payment Complete"
          ) : (
            selectedPaymentMethod === "card"
              ? `Pay $${(orderDetails.amount / 100).toFixed(2)}`
              : `Continue with ${getPaymentMethodName(selectedPaymentMethod)}`
          )}
        </button>

        {/* Success/Error Messages */}
        {paymentSuccess && paymentStatus !== 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              {paymentStatus === 'processing' ? (
                <Clock className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0 animate-spin" />
              ) : (
                <Check className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              )}
              <div className="text-sm text-green-800">
                <p className="font-medium">
                  {paymentStatus === 'processing' ? 'Processing...' : 'Success!'}
                </p>
                <p className="mt-1">{paymentSuccess}</p>
              </div>
            </div>
          </div>
        )}

        {paymentError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-red-800 flex-1">
                <p className="font-medium">Payment Failed</p>
                <p className="mt-1">{paymentError}</p>
                <button
                  onClick={() => {
                    setPaymentError("");
                    setPaymentStatus(null);
                  }}
                  className="mt-2 text-xs text-red-600 underline hover:no-underline"
                >
                  Dismiss
                </button>
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