/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../context/useAuth";
import "../styles/Orders.css";
import { toast } from "react-toastify"; 

const Orders = () => {
  const { user } = useAuth(); // Obtener usuario logueado
  const [orders, setOrders] = useState([]); // Estado para pedidos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("🚫 No estás autenticado. Inicia sesión para ver tus pedidos.");
          toast.error("No estás autenticado. Inicia sesión para continuar.", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
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

        setOrders(validOrders);
        toast.success("✅ Pedidos cargados correctamente.", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

      } catch (err) {
        console.error("❌ Error al obtener pedidos:", err);
        setError("❌ Error al cargar pedidos. Intenta nuevamente.");
        toast.error("❌ No se pudieron cargar los pedidos.");
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
        <p>No tienes pedidos aún.</p>
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
