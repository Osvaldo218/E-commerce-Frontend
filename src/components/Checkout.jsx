import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useCart } from "../context/CartContext";
import "../styles/Checkout.css";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51QzKH7ITGEX0lpDO5ediHfFGGPzIT3k4rXaKgDclTXg7huJNOdi4tW36xFBGiWUHaFW3LRq3rDtHz8iRgwg6ctI700oDtlyacW");

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { cart, totalPrice } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const [shippingOption, setShippingOption] = useState("domicilio");
  const [shippingAddress, setShippingAddress] = useState("");

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

    if (!stripe || !elements) return;

    if (!cart || cart.length === 0 || !totalPrice || totalPrice <= 0) {
      showToast("error", "❌ Carrito vacío o monto inválido");
      return;
    }

    if (shippingOption === "domicilio" && shippingAddress.trim() === "") {
      showToast("error", "📭 Debes ingresar una dirección de envío");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("error", "⚠️ No estás autenticado. Inicia sesión.");
      return;
    }

    setLoading(true);

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      showToast("error", error.message);
      setLoading(false);
      return;
    }

    const body = {
      paymentMethodId: paymentMethod.id,
      totalAmount: totalPrice,
      shippingOption,
      shippingAddress: shippingOption === "domicilio" ? shippingAddress : "Recoger en almacén",
      items: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      })),
    };

    try {
      const response = await fetch("https://ecommerce-backend-eohg.onrender.com/api/orders/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast("error", data.message || "❌ Error al registrar la orden");
        setLoading(false);
        return;
      }

      showToast("success", "✅ Pago y orden registrados correctamente");
      navigate("/orders");
    } catch (err) {
      console.error("❌ Error al enviar la orden:", err);
      showToast("error", "❌ Error al procesar la orden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h2 className="checkout-title">💳 Pago con Tarjeta</h2>
      <p className="instructions">Ingresa los datos de tu tarjeta para realizar el pago seguro.</p>

      <div className="shipping-section">
        <h3>📦 Método de entrega</h3>
        <div className="shipping-option-group">
          <label>
            <input
              type="radio"
              name="shippingOption"
              value="domicilio"
              checked={shippingOption === "domicilio"}
              onChange={() => setShippingOption("domicilio")}
            />
            Envío a domicilio
          </label>
          <label>
            <input
              type="radio"
              name="shippingOption"
              value="almacen"
              checked={shippingOption === "almacen"}
              onChange={() => setShippingOption("almacen")}
            />
            Recoger en almacén
          </label>
        </div>

        {shippingOption === "domicilio" && (
          <>
            <label htmlFor="address">Dirección:</label>
            <input
              type="text"
              id="address"
              placeholder="Calle, número, colonia, ciudad..."
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              required
            />
          </>
        )}
      </div>

      <div className="card-element-container" style={{
        padding: "10px", border: "1px solid #ccc",
        borderRadius: "4px", marginBottom: "20px"
      }}>
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      <button type="submit" className="checkout-button" disabled={!stripe || loading}>
        {loading ? "Procesando..." : `Pagar $${totalPrice?.toFixed(2)}`}
      </button>
    </form>
  );
};

const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Checkout;
