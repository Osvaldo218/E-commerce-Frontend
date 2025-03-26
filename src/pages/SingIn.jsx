import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SingIn.css";

const SingIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setMessage(""); 
    try {
      await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
      setMessage("✅ Registro exitoso. Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/Login"), 1000);
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
        <button className="signup-btn" onClick={handleSignUp}>
          Registrarse
        </button>

        <button className="back-btn" onClick={() => navigate("/Login")}>
          ⬅ Volver al Login
        </button>
      </div>
    </div>
  );
};

export default SingIn;
