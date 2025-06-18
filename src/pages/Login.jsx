/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("❌ Todos los campos son obligatorios.");
      return;
    }

    setError("");
    setIsLoading(true);
    
    try {
      const { data } = await axios.post("https://ecommerce-backend-eohg.onrender.com/api/auth/login", { email, password });
       localStorage.setItem("token", data.token);
       navigate("/admin/products");
     } catch (error) {
       setError(<span style={{ color: "black" }}>❌ Error en login. Verifica tu email y contraseña.</span>);
     } finally {
       setIsLoading(false);
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
          <button onClick={() => navigate("/about-us")}>¿Quiénes somos?</button> |  
          <button onClick={() => navigate("/singin")}>Regístrate</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
