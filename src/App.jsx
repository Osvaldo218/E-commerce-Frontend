import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CheckoutPage from "./pages/CheckoutPage";
import Login from "./pages/Login";
import Products from "./pages/Products";
import SalesReport from "./pages/SalesReport";
import Orders from "./pages/Orders";
import SignIn from "./pages/SingIn";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashBoard";
import Chatbot from "./components/Chatbot";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/sales" element={<SalesReport />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/singin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <Chatbot />
      </Router>
    </CartProvider>
  );
}

export default App;
