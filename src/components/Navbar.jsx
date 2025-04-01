import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaUsers, FaBars, FaTimes } from "react-icons/fa";
import { ShoppingCart, User, Home } from "lucide-react";
import "../styles/Navbar.css";

const Navbar = () => {
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/Login">🛍️ <span>Pointec</span></Link>
      </div>

      {/* Ícono del menú hamburguesa */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
      </div>

      {/* Menú de navegación */}
      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}><Home size={20} /> Inicio</Link></li>
        <li><Link to="/admin/products" onClick={() => setMenuOpen(false)}>📦 Productos</Link></li>
        <li><Link to="/admin/orders" onClick={() => setMenuOpen(false)}>📜 Órdenes</Link></li>
        <li><Link to="/Perfil" onClick={() => setMenuOpen(false)}><User size={20} /> Mi Cuenta</Link></li>
        <li><Link to="/admin/users" onClick={() => setMenuOpen(false)}><FaUsers size={20} /> Usuarios</Link></li>
        <li className="cart-icon">
          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
