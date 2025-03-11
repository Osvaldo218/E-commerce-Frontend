import React, { useContext } from "react";
import CartContext from "../context/CartContext";
import "./Cart.css";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  return (
    <div className="cart-container">
      <h2>🛒 Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul>
            {cart.map((product) => (
              <li key={product._id}>
                <img src={product.image} alt={product.name} />
                <div>
                  <h4>{product.name}</h4>
                  <p>${product.price} x {product.quantity}</p>
                  <button onClick={() => removeFromCart(product._id)}>❌ Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
          <h3>Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0)}</h3>
          <button onClick={clearCart}>🗑 Vaciar Carrito</button>
        </>
      )}
    </div>
  );
};

export default Cart;
