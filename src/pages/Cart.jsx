import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/Cart.css";
import { Trash2, ShoppingCart, Minus, Plus } from "lucide-react";

const Cart = () => {
  const { cart, removeFromCart, clearCart, updateQuantity, totalPrice } = useCart();

  return (
    <div className="cart-container">
      <h2 className="cart-title">
        <ShoppingCart size={28} /> Carrito de Compras
      </h2>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Tu carrito está vacío 😢</p>
          <Link to="/admin/products" className="cart-btn">Ir a comprar 🛒</Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />

                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>${item.price.toFixed(2)} x {item.quantity}</p>

                  <div className="cart-item-actions">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="qty-btn">
                      <Minus size={12} />
                    </button>
                    <span className="cart-item-quantity"> </span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="qty-btn">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <button onClick={() => removeFromCart(item.id)} className="cart-remove-btn">
                  <Trash2 size={24} />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3> <span style={{ color: "black" }}>Total: ${totalPrice.toFixed(2)}</span> </h3>
            <button onClick={clearCart} className="clear-cart-btn">Vaciar Carrito</button>
            <Link to="/checkout" className="checkout-btn">Ir a Pagar</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
