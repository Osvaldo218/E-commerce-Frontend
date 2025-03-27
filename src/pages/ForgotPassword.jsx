/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    setMessage(""); 
    try {
      await axios.post("https://ecommerce-backend-eohg.onrender.com/api/auth/forgot-password", { email });
      setMessage("✅ Revisa tu correo para restablecer tu contraseña.");
    } catch (error) {
      setMessage("❌ No se encontró una cuenta con este correo.");
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>🔐 Recuperar Contraseña</h2>

        {message && <p className="message">{message}</p>}

        <input
          type="email"
          placeholder="Ingresa tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="reset-btn" onClick={handleResetPassword}>
          Enviar Enlace de Recuperación
        </button>

        <button className="back-btn" onClick={() => navigate("/Login")}>
          ⬅ Volver al Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
