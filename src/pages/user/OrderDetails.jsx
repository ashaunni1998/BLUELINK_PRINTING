import { useLocation, useNavigate } from "react-router-dom";

export default function OrderDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) return <p>No order found</p>;

  return (
    <div>
      <h1>Order #{order._id}</h1>
      <p>Product: {order.productName}</p>

      <button
        onClick={() =>
          navigate(`/customer-requirement/${order._id}/${order.productId}`) // ✅ go to requirement page
        }
        className="bg-purple-600 text-white px-6 py-2 rounded"
      >
        Add Requirements
      </button>
    </div>
  );
}
