import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Checkout from "../components/Checkout";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/Checkout.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id"); // Obtener el session_id de la URL
  const navigate = useNavigate();

  React.useEffect(() => {
    if (sessionId) {
      // Redirigir a la página de órdenes después del pago
      setTimeout(() => {
        navigate("/admin/orders");
      }, 2000);
    }
  }, [sessionId, navigate]);

  return (
    <Elements stripe={stripePromise}>
      <div className="checkout-container">
        <h2 className="checkout-title">Finalizar compra 🛒</h2>
        <p className="checkout-subtitle">
          Revisa los detalles y procede con el pago de forma segura.
        </p>
        {sessionId ? (
          <p className="success-message">✅ Pago exitoso. Redirigiendo a Mis Compras...</p>
        ) : (
          <Checkout />
        )}
      </div>
    </Elements>
  );
};

export default CheckoutPage;
