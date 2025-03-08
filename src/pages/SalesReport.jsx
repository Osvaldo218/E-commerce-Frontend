import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const SalesReport = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    const res = await fetch("http://localhost:5000/api/reports/sales");
    const data = await res.json();
    setSalesData(data);
  };

  const chartData = {
    labels: salesData.map((sale) => sale.date),
    datasets: [
      {
        label: "Ventas ($)",
        data: salesData.map((sale) => sale.total),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Reporte de Ventas</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default SalesReport;
