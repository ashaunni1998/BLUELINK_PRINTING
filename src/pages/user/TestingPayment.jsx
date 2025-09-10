import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const TestingPayment = ({ orderDetails, apiUrl }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Dynamic user billing inputs
  const [billing, setBilling] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!stripe || !elements) {
      setErrorMessage("Stripe has not loaded yet. Please try again.");
      setLoading(false);
      return;
    }

    try {
      // Call backend dynamically (default fallback)
      const res = await fetch(
        apiUrl || "https://kerala-digital-park-server.vercel.app/api/order/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ order: orderDetails }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.paymentIntent) {
        throw new Error(data.message || "Failed to create payment intent");
      }

      const clientSecret = data.paymentIntent.client_secret;

      // Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: billing.name || "Guest User",
            email: billing.email || "guest@example.com",
          },
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setSuccessMessage(`✅ Payment successful! ID: ${result.paymentIntent.id}`);
      }
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Testing Payment</h2>
      <p className="text-gray-600 mb-2">
        Amount: ${(orderDetails.amount / 100).toFixed(2)} {orderDetails.currency.toUpperCase()}
      </p>
      <p className="text-gray-500 mb-6">{orderDetails.description}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Billing Name */}
        <input
          type="text"
          name="name"
          value={billing.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />

        {/* Billing Email */}
        <input
          type="email"
          name="email"
          value={billing.email}
          onChange={handleChange}
          placeholder="Email Address"
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />

        {/* Card Input */}
        <div className="p-3 border border-gray-300 rounded-lg">
          <CardElement />
        </div>

        {/* Pay Button */}
        <button
          type="submit"
          disabled={!stripe || loading}
          className={`w-full py-3 rounded-lg font-semibold text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : `Pay $${(orderDetails.amount / 100).toFixed(2)}`}
        </button>
      </form>

      {/* Errors */}
      {errorMessage && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {errorMessage}
        </div>
      )}

      {/* Success */}
      {successMessage && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600">
          {successMessage}
        </div>
      )}

      {/* Test Card Info */}
      <div className="mt-6 text-xs text-gray-500">
        <p>💳 Use test card: <strong>4242 4242 4242 4242</strong> (any future date, any CVC)</p>
        <p>❌ Declined card: <strong>4000 0000 0000 0002</strong></p>
      </div>
    </div>
  );
};

export default TestingPayment;
