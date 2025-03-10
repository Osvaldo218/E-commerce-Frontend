import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import SalesChart from "../components/SalesChart";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/sales")
      .then((res) => res.json())
      .then((data) => setSalesData(data));
  }, []);

  useEffect(() => {
    if (salesData.length > 0) {
      const ctx = document.getElementById("salesChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: salesData.map((s) => s.date),
          datasets: [
            {
              label: "Ventas",
              data: salesData.map((s) => s.total),
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
    }
  }, [salesData]);

  return (
    <div className="dashboard-container">
  <h2 className="dashboard-header">Dashboard de Administración</h2>
  <div className="stats-container">
    <div className="stat-card">
      <p className="stat-title">Ventas Totales</p>
      <p className="stat-value">$5000</p>
    </div>
  </div>
  <div className="chart-container">
    <canvas id="salesChart"></canvas>
  </div>
  <div className="dashboard-buttons">
    <button onClick={() => navigate("/admin/products")}>Gestionar Productos</button>
    <button onClick={() => navigate("/admin/sales")}>Ver Reportes</button>
  </div>
</div>
  );
};

export default AdminDashboard;
