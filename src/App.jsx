import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Hompage from "./components/home/Hompage";
import Login from "./components/auth/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import Dashboard from "./components/dashboard/Dashboard";
import Products from "./components/products/Products";
import Suppliers from "./components/suppliers/suppliers";

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Hompage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suppliers"
          element={
            <ProtectedRoute>
              <Suppliers />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
