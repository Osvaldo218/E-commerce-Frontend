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
        const token = localStorage.getItem("token"); // Obtener token si es necesario
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
  }, []);

  if (loading) return <p>Cargando pedidos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="orders-container">
      <h2>📦 Mis Pedidos</h2>

      {orders.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <h3>Pedido #{order.id}</h3>
              <p>Estado: <strong>{order.status}</strong></p>
              <p>Fecha: {new Date(order.createdAt).toLocaleDateString()}</p>
              <ul>
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.name} - {item.quantity} x ${item.price}
                  </li>
                ))}
              </ul>
              <h4>Total: ${order.total}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
