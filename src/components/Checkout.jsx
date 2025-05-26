import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import "../styles/Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, totalPrice } = useCart();
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("❌ Debes adjuntar el comprobante de transferencia", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    if (!cart || cart.length === 0 || !totalPrice || totalPrice <= 0) {
      toast.error("❌ Carrito vacío o monto inválido", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    const formData = new FormData();
    formData.append("proof", file);
    formData.append("totalAmount", totalPrice);

    const orderItems = cart.map((item) => ({
      productId: item._id,
      quantity: item.quantity || 1,
    }));

    formData.append("items", JSON.stringify(orderItems));

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://ecommerce-backend-eohg.onrender.com/api/orders/transfer",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "❌ Error al registrar la orden", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "dark",
        });
        return;
      }

      toast.success("✅ Orden registrada. Esperando confirmación bancaria.", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });

      navigate("/orders");
    } catch (error) {
      console.error("❌ Error al enviar la orden:", error);
      toast.error("❌ Error al procesar la orden", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h2 className="checkout-title">🏦 Pago por Transferencia Bancaria</h2>

      <p className="instructions">
        Realiza la transferencia a la cuenta bancaria mostrada y sube el comprobante aquí.
      </p>

      <div className="bank-details">
        <p><strong>Banco:</strong> BANCO FICTICIO</p>
        <p><strong>Cuenta:</strong> 1234567890</p>
        <p><strong>CLABE:</strong> 012345678901234567</p>
        <p><strong>Nombre del beneficiario:</strong> Pointec S.A. de C.V.</p>
      </div>

      <div className="file-upload">
        <label>Comprobante de pago (imagen o PDF):</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
      </div>

      <button type="submit" className="checkout-button">
        Enviar comprobante y finalizar compra (${totalPrice?.toFixed(2)})
      </button>
    </form>
  );
};

export default Checkout;
