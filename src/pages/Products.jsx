import React, { useEffect, useState } from "react";
import axios from "axios";
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

  useEffect(() => {
    let isMounted = true; // Evita actualizar el estado si el componente se desmonta

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/products");
        if (isMounted) {
          setProducts(res.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError("Error al obtener productos");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false; // Limpieza para evitar actualizaciones en componentes desmontados
    };
  }, []); // Solo se ejecuta una vez al montar

  // Agregar producto
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/products", newProduct);
      setProducts((prevProducts) => [...prevProducts, res.data]); // Mantener productos actuales
      setNewProduct({ name: "", price: "", stock: "", image: "" });
      alert("Producto agregado correctamente");
    } catch (error) {
      setError("Error al agregar producto");
    }
  };

  return (
    <div className="products-container">
      <h2 className="products-title">Lista de Productos</h2>

      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p className="loading-text">Cargando productos...</p>
      ) : products.length === 0 ? (
        <p className="no-products">No hay productos disponibles.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">💲{product.price.toFixed(2)}</p>
              <p className="product-stock">📦 Stock: {product.stock}</p>
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
        <button type="submit">Agregar Producto</button>
      </form>
    </div>
  );
};

export default Products;
