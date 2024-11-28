import { useRouter } from "next/router";
import { useState } from "react";

export default function UpdateOrder() {
  const router = useRouter();
  const { orderId } = router.query;

  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  const updateOrderStatus = async (newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_status: newStatus,
        }),
      });

      if (response.ok) {
        setMessage(`Order status updated to: ${newStatus}`);
      } else {
        const error = await response.json();
        setMessage(`Failed to update status: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setMessage("An error occurred while updating the order.");
    }
  };

  const statuses = ["placed", "preparing", "ready", "pickup", "cancel", "undelivered"];

  return (
    <div>
      <h1>Update Order Status</h1>
      <p>Order ID: {orderId}</p>
      <div>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => updateOrderStatus(status)}
            style={{
              margin: "5px",
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            {status}
          </button>
        ))}
      </div>
      {message && <p style={{ marginTop: "20px", color: "green" }}>{message}</p>}
    </div>
  );
}
