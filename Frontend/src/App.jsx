import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import "./css/style.css";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Ecommerce pages
import ShopHome from "./pages/ecommerce/Home";
import ProductDetail from "./pages/ecommerce/ProductDetail";
import CartPage from "./pages/ecommerce/CartPage";
import CheckoutPage from "./pages/ecommerce/CheckoutPage";
import LoginPage from "./pages/ecommerce/LoginPage";
import RegisterPage from "./pages/ecommerce/RegisterPage";
import ProfilePage from "./pages/ecommerce/ProfilePage";
import AboutPage from "./pages/ecommerce/AboutPage";
import ContactPage from "./pages/ecommerce/ContactPage";
import FAQPage from "./pages/ecommerce/FAQPage";
import TrackOrderPage from "./pages/ecommerce/TrackOrderPage";
import StorePage from "./pages/ecommerce/StorePage";
import MyOrdersPage from "./pages/ecommerce/MyOrdersPage";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminReports from "./pages/admin/AdminReports";
import AdminReviews from "./pages/admin/AdminReviews";

import ProtectedRoute from "./ProtectedRoute";
import FloatingSupport from "./components/ecommerce/FloatingSupport";

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]);

  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      <Routes>
        {/*Ecommerce Routes*/}
        <Route path="/" element={<ShopHome />} />
        <Route path="/shop" element={<Navigate to="/" />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
        <Route path="/orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/customers" element={<ProtectedRoute adminOnly><AdminCustomers /></ProtectedRoute>} />
        <Route path="/admin/staff" element={<ProtectedRoute adminOnly><AdminStaff /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute adminOnly><AdminSettings /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute adminOnly><AdminReports /></ProtectedRoute>} />
        <Route path="/admin/reviews" element={<ProtectedRoute adminOnly><AdminReviews /></ProtectedRoute>} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {!isAdminPath && <FloatingSupport />}
    </>
  );
}

export default App;
