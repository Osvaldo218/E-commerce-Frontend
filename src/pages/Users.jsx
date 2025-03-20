import React, { useEffect, useState } from "react";
import "../styles/Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // Usuario en edición
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Error al obtener los usuarios");
      }
  
      const data = await response.json();
      console.log("Usuarios obtenidos:", data); // ✅ Verifica que los usuarios llegan correctamente
      setUsers(data);
    } catch (error) {
      console.error("❌ Error al obtener usuarios:", error);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);

  // Eliminar usuario
  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este usuario?")) {
      fetch(`http://localhost:5000/api/users/${id}`, { method: "DELETE" })
        .then(() => {
          setUsers(users.filter((user) => user.id !== id));
        })
        .catch((error) => console.error("Error eliminando usuario:", error));
    }
  };

  // Abrir modal para editar
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role });
  };

  // Actualizar valores del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Guardar cambios
  const handleSave = () => {
    fetch(`http://localhost:5000/api/users/${editingUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(() => {
        fetchUsers();
        setEditingUser(null);
      })
      .catch((error) => console.error("Error actualizando usuario:", error));
  };

  return (
    <div className="users-container">
      <h2 className="users-title">Usuarios Registrados</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="action-btn edit-btn" onClick={() => handleEdit(user)}>
                    Editar
                  </button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(user.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                No hay usuarios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal de Edición */}
      {editingUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Usuario</h3>
            <label>Nombre:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />

            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />

            <label>Rol:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="admin">Admin</option>
              <option value="vendedor">Vendedor</option>
              <option value="cliente">Cliente</option>
            </select>

            <button className="save-btn" onClick={handleSave}>Guardar</button>
            <button className="close-btn" onClick={() => setEditingUser(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
