import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart, User, Home } from "lucide-react"; // Importa íconos modernos
import "../styles/Navbar.css"; // Asegúrate de agregar los estilos

const Navbar = () => {
  const { cart } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🛍️ <span>PointShop</span></Link>
      </div>
      
      <ul className="navbar-links">
        <li><Link to="/dashboard"><Home size={20} /> Inicio</Link></li>
        <li><Link to="/admin/products">📦 Productos</Link></li>
        <li><Link to="/admin/orders">📜 Órdenes</Link></li>
        <li><Link to="/login"><User size={20} /> Mi Cuenta</Link></li>
        <li className="cart-icon">
          <Link to="/cart">
            <ShoppingCart size={22} />
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
