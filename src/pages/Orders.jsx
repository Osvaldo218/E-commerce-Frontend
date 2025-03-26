/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Si tienes autenticación
import "../styles/Orders.css"; // Asegúrate de tener estilos

const Orders = () => {
  const { user } = useAuth(); // Obtener usuario logueado
  const [orders, setOrders] = useState([]); // Estado para pedidos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        // Si no hay token, redirigir al login
        if (!token) {
          setError("No estás autenticado. Inicia sesión para ver tus pedidos.");
          setLoading(false);
          return;
        }

        const { data } = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Pedidos recibidos:", data); // 🔍 Verificar en consola
        setOrders(data);
      } catch (err) {
        console.error("Error al obtener pedidos:", err);
        setError("Error al cargar pedidos. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // Solo se ejecuta una vez, al montar el componente

  if (loading) return <p>Cargando pedidos...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="orders-container">
      <h2>📦 Mis Pedidos</h2>

      {orders.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <h3>Pedido #{order._id}</h3>
              <p>Estado: <strong>{order.status}</strong></p>
              <p>
                Fecha:{" "}
                {new Date(order.createdAt).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <ul>
                {order.items && order.items.map((item) => (
                  <li key={item._id}>
                    {item.name} - {item.quantity} x ${item.price}
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
