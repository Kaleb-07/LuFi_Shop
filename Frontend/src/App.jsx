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

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]);

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
        {/* Redirect root to the shop context since it's an ecommerce only project now */}
        <Route path="/" element={<Navigate to="/shop" />} />

        {/*Ecommerce Routes*/}
        <Route path="/shop" element={<ShopHome />} />
        <Route path="/shop/store" element={<StorePage />} />
        <Route path="/shop/product/:id" element={<ProductDetail />} />
        <Route path="/shop/cart" element={<CartPage />} />
        <Route path="/shop/checkout" element={<CheckoutPage />} />
        <Route path="/shop/login" element={<LoginPage />} />
        <Route path="/shop/register" element={<RegisterPage />} />
        <Route path="/shop/profile" element={<ProfilePage />} />
        <Route path="/shop/about" element={<AboutPage />} />
        <Route path="/shop/contact" element={<ContactPage />} />
        <Route path="/shop/faq" element={<FAQPage />} />
        <Route path="/shop/track-order" element={<TrackOrderPage />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/shop" />} />
      </Routes>
    </>
  );
}

export default App;
