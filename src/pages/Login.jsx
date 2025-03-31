import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react"; // Iconos modernos
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Evita recargar la página
    if (!email || !password) {
      setError("❌ Todos los campos son obligatorios.");
      return;
    }

    setError("");
    setIsLoading(true);
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      console.log("✅ Login exitoso", res.data);
    } catch (error) {
      console.error("❌ Error en login:", error.response?.data || error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>🔑 Iniciar Sesión</h2>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <Mail size={20} />
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <Lock size={20} />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="login-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="login-links">
          <button onClick={() => navigate("/forgot-password")}>¿Olvidaste tu contraseña?</button> |  
          <button onClick={() => navigate("/singin")}>Regístrate</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
