import React, { useEffect, useState, useContext } from 'react';
import CartContext from '../context/CartContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log("📡 Fetching products...");
      const res = await fetch("https://ecommerce-backend-eohg.onrender.com/api/products");
      const data = await res.json();
      console.log("✅ API Response:", data);

      setProducts(data.products || data);
    } catch (error) {
      console.log("%c❌ Error al obtener productos:", "color: black; font-weight: bold;", error);
    }
  };

  return (
    <div>
      <h2>Lista de Productos</h2>
      {products.length === 0 ? (
        <p>⚠️ No hay productos disponibles.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category ?? "Sin categoría"}</td>
                <td>
                  <button onClick={() => addToCart(product)}>Agregar al Carrito</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Products;
