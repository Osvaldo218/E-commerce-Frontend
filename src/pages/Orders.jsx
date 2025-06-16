/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../context/useAuth";
import "../styles/Orders.css";
import Swal from "sweetalert2";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("🚫 No estás autenticado. Inicia sesión para ver tus pedidos.");
          Swal.fire({
            title: "🚫 No autenticado",
            text: "Inicia sesión para continuar.",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
            position: "bottom-end",
            toast: true,
          });
          setLoading(false);
          return;
        }

        const { data } = await axios.get("https://ecommerce-backend-eohg.onrender.com/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filtrar pedidos reales que tengan al menos un producto
        const validOrders = data.filter(order =>
          Array.isArray(order.items) && order.items.length > 0 && typeof order.total === "number"
        );

      } catch (err) {
        console.error("❌ Error al obtener pedidos:", err);
        setError("❌ Error al cargar pedidos. Intenta nuevamente.");
        Swal.fire({
          title: "❌ Error",
          text: "No se pudieron cargar los pedidos.",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          position: "bottom-end",
          toast: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Cargando pedidos...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="orders-container">
      <h2>📦 Mis Pedidos</h2>

      {orders.length === 0 ? (
        <p>📭 No tienes pedidos aún.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <h3>Pedido #{order._id}</h3>
              <p>Estado: <strong>{order.status || "Desconocido"}</strong></p>
              <p>
                Fecha:{" "}
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }) : "Sin fecha"}
              </p>
              <ul>
                {order.items.map((item) => (
                  <li key={item._id || item.name}>
                    {item.name} - {item.quantity} x ${item.price?.toFixed?.(2) || "0.00"}
                  </li>
                ))}
              </ul>
              <h4>Total: ${order.total.toFixed(2)}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
