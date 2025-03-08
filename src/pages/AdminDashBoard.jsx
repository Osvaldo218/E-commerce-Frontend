import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import SalesChart from "../components/SalesChart";

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
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-3xl font-bold text-gray-700 mb-6">Dashboard de Administración</h2>
        <div className="w-full h-64">
          <canvas id="salesChart"></canvas>
        </div>
        <button
          onClick={() => navigate("/admin/products")}
          className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Gestionar Productos
        </button>
        <SalesChart />
      </div>
    </div>
  );
};

export default AdminDashboard;
