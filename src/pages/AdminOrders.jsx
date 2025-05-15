import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No autorizado. Inicia sesión.");
        setLoading(false);
        return;
      }

      const response = await fetch("https://ecommerce-backend-eohg.onrender.com/api/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en la petición");
      }

      const data = await response.json();

      const filteredOrders = data.filter(
        (order) =>
          order._id &&
          typeof order.totalPrice === "number" &&
          order.orderStatus !== undefined
      );

      setOrders(filteredOrders);

      // Notificación exitosa
      toast.success("✅ Pedidos cargados correctamente", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } catch (error) {
      setError(error.message);
      toast.error("❌ Error al cargar pedidos", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No autorizado. Inicia sesión.");
      toast.error("⚠️ No autorizado. Inicia sesión.", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

      const response = await fetch(`https://ecommerce-backend-eohg.onrender.com/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: status }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el estado del pedido");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: status } : order
        )
      );

      // Notificación éxito al actualizar estado
      toast.success("✅ Estado del pedido actualizado", {
        position: "bottom-right",
        autoClose: 2500,
        theme: "dark",
      });
    } catch (error) {
      setError(error.message);
      toast.error("❌ Error al actualizar estado del pedido", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  if (loading) return <p>Cargando pedidos...</p>;
  if (error) return <p className="error">{error}</p>;
  if (orders.length === 0) return <p>No hay pedidos disponibles.</p>;

  return (
    <>
      <h2>📚 Pedidos de Clientes</h2>
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <p>🆔 Orden ID: {order._id}</p>
          <p>👤 Cliente: {order.user?.name || "Desconocido"}</p>
          <p>💰 Total: ${typeof order.totalPrice === "number" ? order.totalPrice.toFixed(2) : "0.00"}</p>
          <p>📅 Fecha: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Sin fecha"}</p>
          <p>🚀 Estado: {order.orderStatus || "Desconocido"}</p>

          <select
            value={order.orderStatus || "Pendiente"}
            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Enviado">Enviado</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      ))}
    </>
  );
};

export default AdminOrders;
