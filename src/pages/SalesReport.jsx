import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../styles/Sales.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const SalesReport = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reports/sales");
      const data = await res.json();
      setSalesData(data);
    } catch (error) {
      console.error("Error al obtener datos de ventas:", error);
    }
  };

  const chartData = {
    labels: salesData.map((sale) => new Date(sale.date).toLocaleDateString()),
    datasets: [
      {
        label: "Ventas ($)",
        data: salesData.map((sale) => sale.total),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75, 192, 192, 0.9)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Reporte de Ventas", font: { size: 18 } },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="sales-report-container">
      <h2 className="sales-report-title">Reporte de Ventas</h2>
      <div className="chart-wrapper">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SalesReport;
