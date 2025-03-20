import React, { useEffect, useState } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("❌ No hay token almacenado");
        setError("No autorizado. Inicia sesión.");
        setLoading(false);
        return;
      }

      const response = await fetch("  ", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Se envía el token en la cabecera
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.message || "Error en la petición"}`);
      }

      const data = await response.json();
      console.log("📌 Órdenes obtenidas:", data); // ✅ Depuración
      setOrders(data);
    } catch (error) {
      console.error("❌ Error en fetchOrders:", error);
      setError(error.message);
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

      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
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
    } catch (error) {
      console.error("❌ Error al actualizar estado del pedido:", error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>📦 Pedidos de Clientes</h2>

      {loading ? (
        <p>Cargando pedidos...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : orders.length === 0 ? (
        <p>No hay pedidos disponibles.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <p>🆔 Orden ID: {order._id}</p>
            <p>👤 Cliente: {order.user?.name || "Desconocido"}</p>
            <p>💰 Total: ${order.totalPrice.toFixed(2)}</p>
            <p>📅 Fecha: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>🚀 Estado: {order.orderStatus}</p>

            <select
              value={order.orderStatus}
              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Enviado">Enviado</option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
