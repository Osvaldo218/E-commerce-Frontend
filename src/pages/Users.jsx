import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null); // Usuario a eliminar
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Obtener la lista de usuarios desde el backend
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("https://ecommerce-backend-eohg.onrender.com/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal de confirmación para eliminar usuario
  const confirmDelete = (id) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  // Eliminar usuario
  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://ecommerce-backend-eohg.onrender.com/api/users/${userToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Actualizar la lista después de eliminar
      setUsers(users.filter((user) => user._id !== userToDelete));

      // Cerrar modal
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    }
  };

  // Abrir modal de edición
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role });
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Guardar cambios en el usuario
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://ecommerce-backend-eohg.onrender.com/api/users/${editingUser._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Actualizar la lista de usuarios
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      console.error("Error actualizando usuario:", error);
    }
  };

  return (
    <div className="users-container">
      <h2 className="users-title">Usuarios Registrados</h2>
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
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
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(user)}
                    >
                      Editar
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => confirmDelete(user._id)}
                    >
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
      )}

      {/* Modal de Edición */}
      {editingUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Usuario</h3>
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <label>Rol:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="admin">Admin</option>
              <option value="vendedor">Vendedor</option>
              <option value="cliente">Cliente</option>
            </select>

            <button className="save-btn" onClick={handleSave}>
              Guardar
            </button>
            <button className="close-btn" onClick={() => setEditingUser(null)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmar Eliminación</h3>
            <p>¿Estás seguro de que deseas eliminar este usuario?</p>
            <button className="confirm-btn" onClick={handleDelete}>Eliminar</button>
            <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
