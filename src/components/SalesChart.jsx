import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const SalesChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch("https://ecommerce-backend-eohg.onrender.com/api/reports/sales")
      .then((res) => res.json())
      .then((data) => {
        const labels = data.map((item) => item._id);
        const sales = data.map((item) => item.totalSales);

        setChartData({
          labels,
          datasets: [
            {
              label: "Ventas Totales",
              data: sales,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 2,
            },
          ],
        });
      })
      .catch((error) => console.error("Error cargando datos:", error));
  }, []);

  return (
    <div>
      <h2>Ventas Totales por Fecha</h2>
      {chartData ? <Line data={chartData} /> : <p>Cargando datos...</p>}
    </div>
  );
};

export default SalesChart;
