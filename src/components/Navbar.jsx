import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaUsers, FaBars, FaTimes } from "react-icons/fa";
import { ShoppingCart, User, Home, Heart } from "lucide-react";
import { useLocation } from 'react-router-dom';
import "../styles/Navbar.css";

const Navbar = (onSearch) => {
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/Login">🛍️ <span>Pointec</span></Link>
      </div>

      {location.pathname === '/products' && (
        <input
          type="text"
          className="search-bar"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={handleSearch}
        />
      )}

      {/* Ícono del menú hamburguesa */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
      </div>

      {/* Menú de navegación */}
      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}><Home size={20} /> Inicio</Link></li>
        <li><Link to="/admin/products" onClick={() => setMenuOpen(false)}>📦 Productos</Link></li>
        <li><Link to="/orders" onClick={() => setMenuOpen(false)}>📜 Pedidos</Link></li>
        <li><Link to="/user/orders" onClick={() => setMenuOpen(false)}>📚 Mis Pedidos</Link></li>
        <li><Link to="/Perfil" onClick={() => setMenuOpen(false)}><User size={20} /> Mi Cuenta</Link></li>
        <li><Link to="/admin/users" onClick={() => setMenuOpen(false)}><FaUsers size={20} /> Usuarios</Link></li>
        <li><Link to="/favorites" onClick={() => setMenuOpen(false)}> ♥️ Favoritos</Link></li>
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
