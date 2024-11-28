import React, { useState } from "react";

export default function OrdersPage({ orders }) {
  const [orderList, setOrderList] = useState(orders); // Use state for real-time updates
  const [message, setMessage] = useState("");

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_status: newStatus }),
      });

      if (response.ok) {
        setMessage(`Order ${orderId} updated to status: ${newStatus}`);

        // Update the order list in state
        setOrderList((prevOrders) =>
          prevOrders.map((order) =>
            order.OrderID === orderId ? { ...order, order_status: newStatus } : order
          )
        );
      } else {
        const error = await response.json();
        setMessage(`Failed to update order ${orderId}: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setMessage(`An error occurred while updating order ${orderId}.`);
    }
  };

  const statuses = ["placed", "preparing", "ready", "pickup", "cancel", "undelivered", "diwali"];

  return (
    <div>
      <h1>Orders</h1>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer ID</th>
            <th>Order Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orderList.map((order) => (
            <tr key={order.OrderID}>
              <td>{order.OrderID}</td>
              <td>{order.customer_id}</td>
              <td>{order.order_status}</td>
              <td>
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => updateOrderStatus(order.OrderID, status)}
                    style={{
                      margin: "5px",
                      padding: "5px 10px",
                      backgroundColor: "#0070f3",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "5px",
                    }}
                  >
                    {status}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {message && <p style={{ marginTop: "20px", color: "green" }}>{message}</p>}
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch("http://localhost:8000/api/v1/orders");
    const orders = await res.json();

    return {
      props: {
        orders,
      },
    };
  } catch (error) {
    console.error("Failed to fetch orders:", error);

    return {
      props: {
        orders: [],
      },
    };
  }
}
