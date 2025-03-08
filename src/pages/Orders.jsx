import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, currentPage]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders?page=${currentPage}&status=${statusFilter}`
      );
      const data = await res.json();
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error al obtener órdenes", error);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (error) {
      console.error("Error al actualizar estado", error);
    }
  };

  return (
    <div>
      <h2>Gestión de Órdenes</h2>

      <label>Filtrar por estado:</label>
      <select onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">Todos</option>
        <option value="Pendiente">Pendiente</option>
        <option value="Enviado">Enviado</option>
        <option value="Completado">Completado</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.customerName}</td>
              <td>${order.total}</td>
              <td>{order.status}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Enviado">Enviado</option>
                  <option value="Completado">Completado</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Orders;
