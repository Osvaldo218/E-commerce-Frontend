import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaUsers } from "react-icons/fa";
import { ShoppingCart, User, Home } from "lucide-react";
import "../styles/Navbar.css";

const Navbar = () => {
  const { cartCount } = useCart();

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
        <li><Link to="/admin/users"><FaUsers size={20} /> Usuarios</Link></li>
        <li className="cart-icon">
          <Link to="/cart">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
