import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL || "https://ecommerce-backend-eohg.onrender.com";

// Obtener productos desde el backend
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API}/api/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Lanzar el error para manejarlo en el componente
  }
};
