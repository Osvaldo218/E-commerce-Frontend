import axios from "axios";

// Usar la URL base del backend desde las variables de entorno
const API = import.meta.env.VITE_BACKEND_URL || "https://ecommerce-backend-eohg.onrender.com";

// Función para iniciar sesión
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      `${API}/api/auth/login`, 
      { email, password }, 
      { withCredentials: true }
    );
    return response.data; // Contendrá el token y la información del usuario
  } catch (error) {
    console.error("Error al hacer login:", error);
    throw error;
  }
};

// Función para obtener productos
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API}/api/products`, { withCredentials: true });
    return response.data; // Devuelve los productos
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    throw error;
  }
};

// Función para crear un nuevo producto (requiere autenticación)
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(
      `${API}/api/products`, 
      productData, 
      { withCredentials: true }
    );
    return response.data; // Devuelve el producto creado
  } catch (error) {
    console.error("Error creando producto:", error);
    throw error;
  }
};

// Función para obtener el historial de ventas (requiere autenticación)
export const fetchSalesHistory = async () => {
  try {
    const response = await axios.get(`${API}/api/sales/history`, { withCredentials: true });
    return response.data; // Devuelve el historial de ventas
  } catch (error) {
    console.error("Error obteniendo historial de ventas:", error);
    throw error;
  }
};

// Función para actualizar perfil de usuario
export const updateProfile = async (userData) => {
  try {
    const response = await axios.put(
      `${API}/api/auth/user`, 
      userData, 
      { withCredentials: true }
    );
    return response.data; // Devuelve el usuario actualizado
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    throw error;
  }
};

// Función para obtener el usuario autenticado
export const getAuthenticatedUser = async () => {
  try {
    const response = await axios.get(`${API}/api/auth/user`, { withCredentials: true });
    return response.data; // Devuelve los datos del usuario autenticado
  } catch (error) {
    console.error("Error obteniendo el usuario:", error);
    throw error;
  }
};

// Función para cerrar sesión
export const logoutUser = async () => {
  try {
    const response = await axios.post(`${API}/api/auth/logout`, {}, { withCredentials: true });
    return response.data; // Mensaje de cierre de sesión exitoso
  } catch (error) {
    console.error("Error cerrando sesión:", error);
    throw error;
  }
};
