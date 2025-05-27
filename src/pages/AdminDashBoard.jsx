import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificación del token y rol
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

    fetch("https://ecommerce-backend-eohg.onrender.com/api/sales", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No autorizado");
        return res.json();
      })
      .then((data) => setSalesData(data))
      .catch((err) => {
        console.error("❌ Error al cargar ventas:", err);
        navigate("/unauthorized");
      });
  }, [navigate]);

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
          <p className="stat-value">
            ${salesData.reduce((acc, curr) => acc + curr.total, 0)}
          </p>
        </div>
      </div>
      <div className="chart-container">
        <canvas id="salesChart"></canvas>
      </div>
      <div className="dashboard-buttons">
        <button onClick={() => navigate("/admin/products")}>Gestionar Productos</button>
        <button onClick={() => navigate("/admin/sales")}>Ver Ventas</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
