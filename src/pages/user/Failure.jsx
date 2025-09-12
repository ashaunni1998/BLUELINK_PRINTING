import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const Failure = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderDetails, error } = location.state || {};

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
      <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-red-700 mb-2">Payment Failed</h2>
      <p className="text-gray-600 mb-4">
        {error || "Unfortunately, your payment could not be processed."}
      </p>

      {orderDetails && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Order ID:</span> {orderDetails.orderId}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Amount:</span> ${(orderDetails.amount / 100).toFixed(2)} USD
          </p>
        </div>
      )}

      <button
        onClick={() => navigate("/checkout", { state: { orderDetails } })}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
      >
        Try Again
      </button>
    </div>
  );
};

export default Failure;
