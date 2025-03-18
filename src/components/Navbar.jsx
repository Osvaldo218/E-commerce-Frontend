import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart, User, Home } from "lucide-react";
import "../styles/Navbar.css";

const Navbar = () => {
  const { cart } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/Login">🛍️ <span>Pointec</span></Link>
      </div>
      
      <ul className="navbar-links">
        <li><Link to="/dashboard"><Home size={20} /> Inicio</Link></li>
        <li><Link to="/admin/products">📦 Productos</Link></li>
        <li><Link to="/admin/orders">📜 Órdenes</Link></li>
        <li><Link to="/Perfil"><User size={20} /> Mi Cuenta</Link></li>
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
