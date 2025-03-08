import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Checkout from "../components/Checkout";

const stripePromise = loadStripe("pk_test_51HqG..."); // Clave pública de Stripe

const CheckoutPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <h2>Finalizar compra</h2>
      <Checkout />
    </Elements>
  );
};

export default CheckoutPage;
