import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useCart } from "../context/CartContext";
import "../styles/Products.css";

const Favorites = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const handleRemoveFavorite = (id) => {
    const updatedFavorites = favoriteProducts.filter(product => product._id !== id);
    setFavoriteProducts(updatedFavorites);
    localStorage.setItem(
      "favorites",
      JSON.stringify(updatedFavorites.map(p => p._id))
    );

    Swal.fire({
      title: "❤️ Favorito eliminado",
      text: "Se eliminó de tus favoritos.",
      icon: "info",
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "bottom-end",
    });
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      const saved = localStorage.getItem("favorites");
      const favoriteIds = saved ? JSON.parse(saved) : [];

      if (favoriteIds.length === 0) {
        setFavoriteProducts([]);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("https://ecommerce-backend-eohg.onrender.com/api/products");
        const allProducts = res.data;

        const filtered = allProducts.filter(product => favoriteIds.includes(product._id));
        setFavoriteProducts(filtered);
      } catch (err) {
        console.error("❌ Error cargando favoritos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="products-container">
      <h2 className="products-title-fav">❤️ Mis Favoritos</h2>

      {loading ? (
        <p className="loading-text">⏳ Cargando favoritos...</p>
      ) : favoriteProducts.length === 0 ? (
        <p className="no-products">⚠️ No tienes productos favoritos.</p>
      ) : (
        <div className="products-grid">
          {favoriteProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={product.image || "https://via.placeholder.com/150"}
                alt={product.name}
                className="product-image"
              />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">💲 {parseFloat(product.price).toFixed(2)}</p>
              <p className="product-stock">📦 Stock: {product.stock}</p>

              <button
                className="remove-favorite-btn"
                onClick={() => handleRemoveFavorite(product._id)}
              >
                🗑️
              </button>

              <button
                className="add-to-cart-btn"
                onClick={() => addToCart(product)}
              >
                🛒
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
