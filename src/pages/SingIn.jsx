/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SingIn.css";

const Singin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSingUp = async () => {
    setMessage(""); 
    try {
      await axios.post("https://ecommerce-backend-eohg.onrender.com/api/auth/register", { name, email, password });
      setMessage("✅ Registro exitoso. Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/verify-email"), 1000);
    } catch (error) {
      setMessage("❌ Error al registrar usuario. Intenta de nuevo.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>🪪 Registro</h2>

        {message && <p className="message">{message}</p>}

        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="signup-btn" onClick={handleSingUp}>
          Registrarse
        </button>

        <button className="back-btn" onClick={() => navigate("/Login")}>
          ⬅ Volver al Login
        </button>
      </div>
    </div>
  );
};

export default Singin;
