import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("⚠️ No autorizado. Inicia sesión.");
        setLoading(false);
        Swal.fire({
        title: "⚠️ No autorizado",
        text: "Inicia sesión.",
        icon: "warning",
        timer: 3000,
        showConfirmButton: false,
        position: "bottom-end",
        toast: true,
      });
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
      Swal.fire({
          title: "✅ Pedidos cargados",
          text: "Los pedidos se cargaron correctamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          position: "bottom-end",
          toast: true,
        });
    } catch (error) {
      setError(error.message);
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

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No autorizado. Inicia sesión.");
      Swal.fire({
        title: "⚠️ No autorizado",
        text: "Inicia sesión.",
        icon: "warning",
        timer: 3000,
        showConfirmButton: false,
        position: "bottom-end",
        toast: true,
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
      Swal.fire({
        title: "✅ Estado actualizado",
        text: "El estado del pedido ha sido actualizado.",
        icon: "success",
        timer: 2500,
        showConfirmButton: false,
        position: "bottom-end",
        toast: true,
      });
    } catch (error) {
      setError(error.message);
      Swal.fire({
        title: "❌ Error",
        text: "Error al actualizar estado del pedido",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
        position: "bottom-end",
        toast: true,
      });
    }
  };

  if (loading) return <p>Cargando pedidos...</p>;
  if (error) return <p className="error">{error}</p>;
  if (orders.length === 0) return <p>📭 No hay pedidos disponibles.</p>;

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
