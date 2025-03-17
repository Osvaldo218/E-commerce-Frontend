import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders");
        setOrders(response.data);
      } catch (err) {
        setError("Error al cargar los pedidos.");
        console.error("Error al obtener los pedidos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { orderStatus: status });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: status } : order
        )
      );
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
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
