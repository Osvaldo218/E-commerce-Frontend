import { useEffect, useState } from "react";
import axios from "axios";

const UsersList = () => {
  const [users, setUsers] = useState([]); // ✅ Inicializa como array vacío
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ Usa autenticación si es necesaria
        const { data } = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Error: La API no devolvió un array", data);
          setError("No se pudieron cargar los usuarios.");
        }
      } catch (err) {
        console.error("Error al obtener usuarios:", err);
        setError("No se pudieron cargar los usuarios.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Usuarios Registrados</h2>
      {users.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id}>{user.name} - {user.email}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UsersList;
