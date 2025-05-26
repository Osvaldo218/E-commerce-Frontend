/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardar en localStorage si el carrito tiene productos
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  // ✅ Contador total de productos
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // ✅ Agregar producto al carrito (verifica si ya existe por _id)
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item._id === product._id);

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    Swal.fire({
      title: "🛒 Producto agregado",
      text: `${product.name} se agregó al carrito.`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      position: "bottom-end",
      toast: true,
    });
  };

  // ✅ Eliminar producto por _id
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));

    Swal.fire({
      title: "🗑️ Producto eliminado",
      text: "Se eliminó del carrito.",
      icon: "info",
      timer: 1500,
      showConfirmButton: false,
      position: "bottom-end",
      toast: true,
    });
  };

  // ✅ Vaciar carrito
  const clearCart = () => {
    setCart([]);
  };

  // ✅ Actualizar cantidad por _id
  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  // ✅ Total del carrito
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        totalPrice,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ✅ Hook personalizado
export const useCart = () => useContext(CartContext);
