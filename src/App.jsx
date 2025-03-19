import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CheckoutPage from "./pages/CheckoutPage";
import Login from "./pages/Login";
import Products from "./pages/Products";
import SalesReport from "./pages/SalesReport";
import Orders from "./pages/Orders";
import SingIn from "./pages/Singin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashBoard";
import Chatbot from "./components/Chatbot";
import { CartProvider } from "./context/CartContext";
import Cart from "./pages/Cart";
import { AuthProvider } from "./context/AuthContext";
import UserProfile from "./pages/userProfile";
import Users from "./pages/Users";

function App() {
  return (
    <AuthProvider>
    <CartProvider>
      <Router>
        <Navbar /> 
        <div className="app-container">
          <Routes>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/sales" element={<SalesReport />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/singin" element={<SingIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/perfil" element={<UserProfile />} />
          </Routes>
        </div>
        <Chatbot />
      </Router>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;
