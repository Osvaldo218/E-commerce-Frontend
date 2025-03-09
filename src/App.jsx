import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CheckoutPage from "./pages/CheckoutPage";
import Login from './pages/Login';
import Products from "./pages/Products";
import SalesReport from "./pages/SalesReport";
import Orders from "./pages/Orders";
import SignIn from "./pages/Singin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashBoard";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/dashboard" element={<AdminDashboard />}/>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/sales" element={<SalesReport />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/singin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
          <Chatbot />
      </div>
    </Router>
  );
}

export default App;
