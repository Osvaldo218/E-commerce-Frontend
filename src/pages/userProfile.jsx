import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirige a la página de login
  };

  if (loading) return <p>🔄 Cargando...</p>;

  return (
    <div className="user-profile-container">
      <h2>👤 Perfil de Usuario</h2>
      {user ? (
        <div className="user-info">
          <p><strong>Nombre:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.role}</p>
          {/* <p><strong>Registrado el:</strong> {new Date(user.createdAt).toLocaleDateString()}</p> */}
          <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      ) : (
        <p>No hay usuario logueado.</p>
      )}
    </div>
  );
};

export default UserProfile;
