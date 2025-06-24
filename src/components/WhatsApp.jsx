import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import "../styles/WhatsApp.css";

const WhatsApp = () => {
  const phoneNumber = "525588051557";

  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  return (
    <div className="whatsapp-float" onClick={handleClick} title="Chatea por WhatsApp">
      <FaWhatsapp size={32} />
    </div>
  );
};

export default WhatsApp;
