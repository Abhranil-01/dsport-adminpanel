import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";

import Layout from "./Layout/Layout.jsx";
import Admins from "./Components/Admins/Admins.jsx";
import Categories from "./Components/Categories/Categories.jsx";
import SubCategories from "./Components/SubCategories/SubCategories.jsx";
import Products from "./Components/Products/Products.jsx";
import Orders from "./Components/Orders/Orders.jsx";
import Reviews from "./Components/Reviews/Reviews.jsx";
import AdminLogin from "./Components/AdminLogin/AdminLogin.jsx";

import AdminAuthGuard from "./Guards/AdminAuthGuard.jsx";
import SuperAdminGuard from "./Guards/SuperAdminGuard.jsx";

import { Bounce, ToastContainer } from "react-toastify";
import Dashboard from "./Components/Dashboard/Dashboard.jsx";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="colored"
        transition={Bounce}
      />

      <BrowserRouter>
        <Routes>

          {/* 🔓 PUBLIC ROUTE */}
          <Route path="/login" element={<AdminLogin />} />

          {/* 🔐 ADMIN PROTECTED ROUTES */}
          <Route element={<AdminAuthGuard />}>
            <Route path="/" element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="categories" element={<Categories />} />
              <Route path="subCategories" element={<SubCategories />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="reviews" element={<Reviews />} />

              {/* 👑 SUPER ADMIN ONLY */}
              <Route element={<SuperAdminGuard />}>
                <Route path="admins" element={<Admins />} />
              </Route>

            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
