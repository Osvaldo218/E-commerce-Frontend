import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/VerifyEmail.css";

const VerifyEmail = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const res = await axios.post("https://ecommerce-backend-eohg.onrender.com/api/auth/verify-email", {
        email,
        code,
      });

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Error verificando el correo");
    }
  };

  return (
    <div className="verify-container">
      <h2>Verificar Correo</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Correo electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Código de verificación:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        <button type="submit">Verificar</button>
      </form>

      {message && <p className="message-success">{message}</p>}
      {error && <p className="message-error">{error}</p>}
    </div>
  );
};

export default VerifyEmail;
