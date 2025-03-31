/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2"; // Importa Chart.js para gráficos
import { useAuth } from "../context/useAuth";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Sales = () => {
  const { user } = useAuth(); // Obtener usuario logueado
  const [sales, setSales] = useState([]); // Estado para ventas
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [salesStats, setSalesStats] = useState({});
  const [filter, setFilter] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    // Fetch ventas
    const fetchSales = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("https://ecommerce-backend-eohg.onrender.com/api/sales", {
          headers: { Authorization: `Bearer ${token}` },
          params: filter,
        });
        setSales(data);
      } catch (err) {
        console.error("Error al obtener ventas:", err);
        setError("Error al cargar ventas. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch estadísticas de ventas
    const fetchSalesStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("https://ecommerce-backend-eohg.onrender.com/api/sales/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSalesStats(data);
      } catch (err) {
        console.error("Error al obtener estadísticas de ventas:", err);
      }
    };

    fetchSales();
    fetchSalesStats();
  }, [filter]);

  // Definir datos para gráfico de ventas
  const salesChartData = {
    labels: sales.map((sale) => new Date(sale.date).toLocaleDateString()),
    datasets: [
      {
        label: "Ventas Totales ($)",
        data: sales.map((sale) => sale.totalAmount),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
      },
    ],
  };

  // Filtrado de fechas
  const handleDateChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  if (loading) return <p>Cargando ventas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="sales-container">
      <h2 className="sales-header">📊 Estadísticas de Ventas</h2>

      <div className="filters">
        <input
          type="date"
          name="startDate"
          value={filter.startDate}
          onChange={handleDateChange}
          placeholder="Fecha de inicio"
        />
        <input
          type="date"
          name="endDate"
          value={filter.endDate}
          onChange={handleDateChange}
          placeholder="Fecha de fin"
        />
        <button onClick={() => setFilter({ startDate: "", endDate: "" })}>Resetear Filtros</button>
      </div>

      <div className="sales-stats">
        <div>
          <h3>Total de Ventas</h3>
          <p>${salesStats.totalSales}</p>
        </div>
        <div>
          <h3>Total de Pedidos</h3>
          <p>{salesStats.totalOrders}</p>
        </div>
      </div>

      <div className="sales-chart">
        <h3>Ventas Totales por Fecha</h3>
        <Line data={salesChartData} />
      </div>

      <div className="sales-list">
        <h3>Ventas Registradas</h3>

        {sales.length === 0 ? (
          <p>No hay ventas registradas en el periodo seleccionado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Monto Total</th>
                <th>Estado</th>
                <th>Productos</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale._id}>
                  <td>{new Date(sale.date).toLocaleDateString()}</td>
                  <td>${sale.totalAmount}</td>
                  <td>{sale.status}</td>
                  <td>
                    {sale.products.map((product) => (
                      <div key={product.productId}>{product.name} x {product.quantity}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Sales;
