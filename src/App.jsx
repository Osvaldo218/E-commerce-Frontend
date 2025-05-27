import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CheckoutPage from "./pages/CheckoutPage";
import Login from "./pages/Login";
import Products from "./pages/Products";
import SalesReport from "./pages/SalesReport";
import AdminOrders from "./pages/AdminOrders";
import Orders from "./pages/Orders";
import Singin from "./pages/Singin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashBoard";
import Chatbot from "./components/Chatbot";
import { CartProvider } from "./context/CartContext";
import Cart from "./pages/Cart";
import { AuthProvider } from "./context/AuthContext";
import UserProfile from "./pages/userProfile";
import VerifyEmail from "./pages/VerifyEmail";
import Users from "./pages/Users";
import AboutUs from "./pages/AboutUs";
import Favorites from "./pages/Favorites";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <AuthProvider>
    <CartProvider>
      <Router>
        <Navbar /> 
        <div className="app-container">
          <Routes>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/sales" element={<SalesReport />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/singin" element={<Singin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/perfil" element={<UserProfile />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
        </div>
        <Chatbot />
      </Router>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;
