import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import "../styles/Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "", image: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchUserRole();
    fetchProducts();
  }, []);

  const fetchUserRole = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.get("https://ecommerce-backend-eohg.onrender.com/api/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserRole(response.data.role);
    } catch (error) {
      console.error("❌ Error al obtener el rol del usuario:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("https://ecommerce-backend-eohg.onrender.com/api/products");

      if (!Array.isArray(res.data)) {
        throw new Error("La API no devolvió una lista de productos válida.");
      }

      setProducts(res.data);
    } catch (err) {
      console.error("❌ Error al obtener productos:", err);
      setError("No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  ); 

  const startEditing = (product) => {
    setEditingProduct({ ...product });
  };

  const handleSaveEdit = async () => {
    try {
      if (!editingProduct) return;

      console.log("Producto a guardar:", editingProduct);  // Depuración: ver producto antes de enviar

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ Token no disponible");
        return;
      }

      const response = await axios.put(
        `https://ecommerce-backend-eohg.onrender.com/api/products/${editingProduct._id}`,
        {
          name: editingProduct.name,
          price: Number(editingProduct.price),
          stock: Number(editingProduct.stock),
          image: editingProduct.image,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        console.log("✅ Producto actualizado:", response.data);
        fetchProducts();
        setEditingProduct(null);
      } else {
        console.error("❌ Respuesta inesperada:", response);
        alert("❌ No se pudo actualizar el producto");
      }
    } catch (error) {
      console.error("❌ Error al actualizar producto:", error.response ? error.response.data : error.message);
      alert("❌ Error al actualizar producto");
    }
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://ecommerce-backend-eohg.onrender.com/api/products/${productToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchProducts();
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("❌ Error eliminando producto:", error.response ? error.response.data : error.message);
    }
  };

  const handleAddProduct = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://ecommerce-backend-eohg.onrender.com/api/products",
        {
          name: newProduct.name,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock),
          image: newProduct.image,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchProducts();
      setShowAddModal(false);
      setNewProduct({ name: "", price: "", stock: "", image: "" });
    } catch (error) {
      console.error("❌ Error al agregar producto:", error);
    }
  };

  return (
    <div className="products-container">
      <h2 className="products-title">Lista de Productos</h2>
      <input
        type="text"
        className="search-bar"
        placeholder="🔍 Buscar producto..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={fetchProducts} className="refresh-button">🔄 Actualizar</button>

      {userRole === "admin" && (
        <button className="add-product-btn" onClick={() => setShowAddModal(true)}>➕ Agregar</button>
      )}

      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p className="loading-text">⏳ Cargando productos...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="no-products">⚠️ No hay productos disponibles.</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.image || "https://via.placeholder.com/150"} alt={product.name} className="product-image" />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">💲 {parseFloat(product.price).toFixed(2)}</p>
              <p className="product-stock">📦 Stock: {product.stock}</p>
              <button onClick={() => addToCart(product)}>🛒 Agregar al Carrito</button>

              {userRole === "admin" && (
                <div class="button-container">
                  <button className="edit-btn" onClick={() => startEditing(product)}>✏️ Editar</button>
                  <button className="delete-btn" onClick={() => confirmDelete(product)}>🗑️ Eliminar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ✅ Modal de Edición */}
      {editingProduct && (
        <div className="modal">
          <div className="modal-content">
            <h3>✏️ Editar Producto</h3>
            <label>Nombre:</label>
            <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />

            <label>Precio:</label>
            <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} />

            <label>Stock:</label>
            <input type="number" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })} />

            <label>Imagen URL:</label>
            <input type="text" value={editingProduct.image} onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })} />

            <button className="save-btn" onClick={handleSaveEdit}>Guardar</button>
            <button className="close-btn" onClick={() => setEditingProduct(null)}>Cancelar</button>
          </div>
        </div>
      )}

        {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>➕ Agregar Nuevo Producto</h3>
            
            <label>Nombre:</label>
            <input 
              type="text" 
              value={newProduct.name} 
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} 
            />

            <label>Precio:</label>
            <input 
              type="number" 
              value={newProduct.price} 
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} 
            />

            <label>Stock:</label>
            <input 
              type="number" 
              value={newProduct.stock} 
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} 
            />

            {/* Ahora se pide la URL de la imagen en lugar de seleccionar un archivo */}
            <label>URL de la Imagen:</label>
            <input 
              type="text" 
              value={newProduct.image} 
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} 
            />

            {/* Botones de guardar y cancelar */}
            <button className="save-btn" onClick={handleAddProduct}>Guardar</button>
            <button className="close-btn" onClick={() => setShowAddModal(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* ✅ Modal para Confirmar Eliminación */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>🗑️ Confirmar Eliminación</h3>
            <p>¿Seguro que quieres eliminar <strong>{productToDelete?.name}</strong>?</p>
            <button onClick={handleDelete}>✅ Eliminar</button>
            <button onClick={() => setShowDeleteModal(false)}>❌ Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
