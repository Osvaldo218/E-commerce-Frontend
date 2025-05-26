import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../stripe";
import Checkout from "../components/Checkout";

const CheckoutPage = () => (
  <Elements stripe={stripePromise}>
    <Checkout />
  </Elements>
);

export default CheckoutPage;
