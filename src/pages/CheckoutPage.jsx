import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Checkout from "../components/Checkout";
import "../styles/Checkout.css";

const stripePromise = loadStripe("pk_test_51HqG...");

const CheckoutPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <div className="checkout-container">
        <h2 className="checkout-title">Finalizar compra 🛒</h2>
        <p className="checkout-subtitle">
          Revisa los detalles y procede con el pago de forma segura.
        </p>
        <Checkout />
      </div>
    </Elements>
  );
};

export default CheckoutPage;
