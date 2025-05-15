import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Checkout from "../components/Checkout";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Checkout.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const confirmPayment = async () => {
      if (sessionId) {
        try {
          setLoading(true);
          // Verifica el estado del pago en el backend
          const { data } = await axios.post(
            "https://ecommerce-backend-eohg.onrender.com/api/payment/confirm-payment",
            { sessionId }
          );

          if (data.success) {
            // Guardar la venta en la base de datos
            const saleData = await axios.post("https://ecommerce-backend-eohg.onrender.com/api/sales/create", {
              userId: data.userId,
              products: data.products,
              totalAmount: data.amount,
              status: "Pagado",
            });

            // Establecer los detalles de la orden
            setOrderDetails(saleData.data);

            // Redirigir a la página de órdenes después del pago
            setTimeout(() => {
              navigate("/orders");
            }, 2000);
          } else {
            setError("Hubo un problema con el pago. Intenta nuevamente.");
          }
        } catch (err) {
          console.error("Error al confirmar pago:", err);
          setError("Error al procesar el pago.");
        } finally {
          setLoading(false);
        }
      }
    };

    confirmPayment();
  }, [sessionId, navigate]);

  return (
    <Elements stripe={stripePromise}>
      <div className="checkout-container">
        <h2 className="checkout-title">Finalizar compra 🛒</h2>
        <p className="checkout-subtitle">
          Revisa los detalles y procede con el pago de forma segura.
        </p>

        {loading ? (
          <p className="loading-message">🔄 Procesando pago...</p>
        ) : sessionId ? (
          error ? (
            <p className="error-message">❌ {error}</p>
          ) : orderDetails ? (
            <div className="order-summary">
              <h3>Gracias por tu compra!</h3>
              <p>Tu pedido ha sido procesado exitosamente.</p>
              <h4>Detalles del pedido:</h4>
              <ul>
                {orderDetails.products.map((product, index) => (
                  <li key={index}>
                    {product.name} - {product.quantity} x ${product.price}
                  </li>
                ))}
              </ul>
              <p>Total: ${orderDetails.totalAmount}</p>
              <p>Fecha de entrega estimada: {orderDetails.deliveryDate}</p>
            </div>
          ) : (
            <p className="success-message">✅ Pago exitoso. Redirigiendo a Mis Compras...</p>
          )
        ) : (
          <Checkout />
        )}
      </div>
    </Elements>
  );
};

export default CheckoutPage;
