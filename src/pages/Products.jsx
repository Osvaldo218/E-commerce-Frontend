import React, { useEffect, useState } from "react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      if (!res.ok) throw new Error("Error en la respuesta del servidor");
      
      const data = await res.json();
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener productos", error);
      setError("No se pudieron cargar los productos");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Lista de Productos</h2>

      {loading && <p>Cargando productos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table border="1">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>
                    {new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    }).format(product.price)}
                  </td>
                  <td>{product.category || "Sin categoría"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No hay productos disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Products;
