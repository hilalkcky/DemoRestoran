import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Tables from "./Tables";
import Orders from "./Orders";
import Products from "./Products";
import Rezervasyon from "./Rezervasyon";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import UserAdd from "./UserAdd";

function App() {

  // 🔐 İlk admini garanti altına al
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users"));

    if (!users || users.length === 0) {
      const defaultAdmin = [
        { username: "admin", password: "1234", role: "admin" }
      ];
      localStorage.setItem("users", JSON.stringify(defaultAdmin));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/masalar"
          element={
            <ProtectedRoute>
              <Tables />
            </ProtectedRoute>
          }
        />

        <Route
          path="/siparis"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/urunler"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/kullanici-ekle"
          element={
            <ProtectedRoute>
              <UserAdd />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rezervasyon"
          element={
            <ProtectedRoute>
              <Rezervasyon />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
