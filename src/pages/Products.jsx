import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import CartContext from "../context/CartContext";
import "../styles/Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
  });

  const { addToCart } = useContext(CartContext);

  // ✅ Función para obtener productos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:5000/api/products");

      if (!Array.isArray(res.data)) {
        throw new Error("La API no devolvió una lista de productos válida.");
      }

      console.log("📦 Productos recibidos:", res.data);
      setProducts(res.data);
    } catch (err) {
      console.error("❌ Error al obtener productos:", err);
      setError("No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("✅ Componente Products montado");
    fetchProducts();

    return () => {
      console.log("❌ Componente Products desmontado");
    };
  }, []);

  // ✅ Agregar un producto y refrescar la lista
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      console.log("➕ Agregando producto:", newProduct);
      const res = await axios.post("http://localhost:5000/api/products", newProduct);

      if (!res.data || !res.data._id) {
        throw new Error("Error en la respuesta del servidor al agregar producto.");
      }

      setNewProduct({ name: "", price: "", stock: "", image: "" });
      alert("Producto agregado correctamente");

      // ✅ Recargar productos después de agregar uno
      fetchProducts();
    } catch (error) {
      console.error("❌ Error al agregar producto", error);
      setError("Error al agregar producto");
    }
  };

  return (
    <div className="products-container">
      <h2 className="products-title">Lista de Productos</h2>

      {/* Botón para actualizar productos manualmente */}
      <button onClick={fetchProducts} className="refresh-button">🔄 Actualizar Productos</button>

      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p className="loading-text">⏳ Cargando productos...</p>
      ) : products.length === 0 ? (
        <p className="no-products">⚠️ No hay productos disponibles.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.image || "https://via.placeholder.com/150"} alt={product.name} className="product-image" />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">
                💲 {isNaN(product.price) ? "N/A" : parseFloat(product.price).toFixed(2)}
              </p>
              <p className="product-stock">
                📦 Stock: {isNaN(product.stock) ? "N/A" : product.stock}
              </p>
              <button onClick={() => addToCart(product)}>🛒 Agregar al Carrito</button>
            </div>
          ))}
        </div>
      )}

      {/* Formulario para agregar productos */}
      <form className="product-form" onSubmit={handleAddProduct}>
        <input
          type="text"
          placeholder="Nombre del producto"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Precio"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="URL de la imagen"
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          required
        />
        <button type="submit">✅ Agregar Producto</button>
      </form>
    </div>
  );
};

export default Products;
