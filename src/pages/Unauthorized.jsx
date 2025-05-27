import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Unauthorized.css";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <h1>🚫 Acceso Denegado</h1>
      <p>No tienes permiso para ver esta página.</p>
      <button onClick={() => navigate("/admin/products")}>Ir a productos</button>
    </div>
  );
};

export default Unauthorized;
