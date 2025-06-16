import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./components/CheckoutForm";

const stripePromise = loadStripe("pk_test_51QzKH7ITGEX0lpDO5ediHfFGGPzIT3k4rXaKgDclTXg7huJNOdi4tW36xFBGiWUHaFW3LRq3rDtHz8iRgwg6ctI700oDtlyacW");

function App() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

export default App;
