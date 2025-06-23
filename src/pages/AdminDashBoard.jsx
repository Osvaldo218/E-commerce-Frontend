import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = JSON.parse(atob(token.split(".")[1]));
    if (decoded.role !== "admin") {
      navigate("/unauthorized");
      return;
    }

    fetch("https://ecommerce-backend-eohg.onrender.com/api/orders/totalsales", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No autorizado");
        return res.json();
      })
      .then((data) => {
        setTotalSales(data.totalSales);
        setTotalOrders(data.totalOrders);
        const ctx = document.getElementById("salesChart").getContext("2d");
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Ventas Totales"],
            datasets: [
              {
                label: "Monto en MXN",
                data: [data.totalSales],
                backgroundColor: "#4CAF50",
                borderRadius: 5,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      })
      .catch((err) => {
        console.error("❌ Error al cargar ventas:", err);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <p>Cargando datos del dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-header">Dashboard de Administración</h2>
      <div className="stats-container">
        <div className="stat-card">
          <p className="stat-title">Total de Ventas</p>
          <p className="stat-value">${totalSales.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-title">Total de Órdenes</p>
          <p className="stat-value">{totalOrders}</p>
        </div>
      </div>
      <div className="chart-container">
        <canvas id="salesChart"></canvas>
      </div>
      <div className="dashboard-buttons">
        <button onClick={() => navigate("/admin/products")}>Gestionar Productos</button>
        <button onClick={() => navigate("/orders")}>Ver Órdenes</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
