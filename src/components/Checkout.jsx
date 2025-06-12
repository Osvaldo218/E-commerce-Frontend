import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useCart } from "../context/CartContext";
import "../styles/Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, totalPrice } = useCart();
  const [file, setFile] = useState(null);

  const showToast = (icon, title) => {
    Swal.fire({
      icon,
      title,
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      showToast("error", "❌ Debes adjuntar el comprobante de transferencia");
      return;
    }

    if (!cart || cart.length === 0 || !totalPrice || totalPrice <= 0) {
      showToast("error", "❌ Carrito vacío o monto inválido");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("error", "⚠️ No estás autenticado. Inicia sesión.");
      return;
    }

    const formData = new FormData();
    formData.append("proof", file);
    formData.append("totalAmount", totalPrice.toString());
    formData.append("items", JSON.stringify(cart.map((item) => ({
      productId: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
    }))));

    // 👇 DEPURACIÓN: verifica que estás enviando todo correctamente
    console.log("📦 ENVIANDO A BACKEND:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      const response = await fetch(
        "https://ecommerce-backend-eohg.onrender.com/api/orders/transfer",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // No pongas 'Content-Type' aquí cuando usas FormData
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Respuesta inválida:", data);
        showToast("error", data.message || "❌ Error al registrar la orden");
        return;
      }

      showToast("success", "✅ Orden registrada. Esperando confirmación bancaria.");
      navigate("/orders");
    } catch (error) {
      console.error("❌ Error al enviar la orden:", error);
      showToast("error", "❌ Error al procesar la orden");
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
          name="proof"
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
