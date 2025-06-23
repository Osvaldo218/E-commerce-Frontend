import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../styles/Orders.css";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://ecommerce-backend-eohg.onrender.com/api/orders/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("No se pudieron cargar los pedidos.");
        }

        const data = await res.json();
        setOrders(data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "❌ Error",
          text: error.message || "No se pudieron cargar los pedidos.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Cargando órdenes...</p>;

  if (!orders.length)
    return <p>No tienes órdenes registradas todavía.</p>;

  return (
    <div className="orders-container">
      <div className="order">
        <h2>📚 Mis Pedidos</h2>
      </div>
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <h3>🆔 Orden {order._id.slice(-6).toLowerCase()}</h3>
            <span className={`status status-${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          </div>
          <p>
            <strong>📅 Fecha:</strong> {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>💰 Total:</strong> ${order.totalAmount.toFixed(2)}
          </p>
          <div className="order-items">
            <strong>📚 Productos:</strong>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} x {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserOrders;
