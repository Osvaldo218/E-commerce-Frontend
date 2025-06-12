import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/AboutUs.css";

const AboutUs = () => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="about-container">
      <h2 className="about-title">¿Quiénes Somos?</h2>
      <p className="about-text">
        En <strong>Pointec</strong>, somos una plataforma de comercio electrónico comprometida con
        la innovación, la tecnología y la excelencia en el servicio. Nacimos con la visión de
        ofrecer una experiencia de compra moderna, rápida y segura, conectando a clientes con
        productos de calidad a través de una interfaz intuitiva y confiable.
      </p>
      <p className="about-text">
        Nuestro objetivo es facilitar el acceso a una amplia gama de productos, brindando
        herramientas tecnológicas inteligentes que mejoren la experiencia de compra tanto para
        usuarios como para administradores. Con un enfoque centrado en el cliente, nos esforzamos
        por crear soluciones que no solo simplifican procesos, sino que también generan confianza
        y satisfacción.
      </p>
      <p className="about-text">
        Somos más que una tienda en línea: somos una comunidad impulsada por la tecnología y la
        pasión por el comercio digital.
      </p>
      <button className="back-to-login-button" onClick={handleGoToLogin}>
        <FaArrowLeft style={{ marginRight: "8px" }} />
        
      </button>
    </div>
  );
};

export default AboutUs;
