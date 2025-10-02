import React, { useEffect } from "react";
import {
  HashRouter,
  BrowserRouter,
  Routes,
  Route,
  Outlet
} from "react-router-dom";
import "./App.css";
import "./styles/global-style.css";

// Pages
import Home from "./pages/Home";
import DashboardPage from "./pages/DashboardPage";
import Customers from "./pages/Customers";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import ProductDetails from "./pages/ProductDetails";
import ShopSettings from "./pages/ShopSettings";
import Credit from "./pages/Credit";
import ProfileSettings from "./pages/ProfileSettings";
import Sales from "./pages/Sales";
import Storefront from "./pages/Storefront";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// Layout wrapper for all main pages
function MainLayout() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function App() {
  const Router = window.location.protocol === "file:" ? HashRouter : BrowserRouter;

  // Session check and redirect logic
  useEffect(() => {
    const sessionStr = localStorage.getItem("userSession");
    let isValid = false;

    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session.expiresAt && Date.now() < session.expiresAt) {
          isValid = true;
        } else {
          // Expired, clear session
          localStorage.removeItem("userSession");
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("currentUser");
        }
      } catch (e) {
        // Invalid session, clear
        localStorage.removeItem("userSession");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
      }
    }

    const path = window.location.pathname;
    if (isValid && (path === "/" || path === "/login")) {
      window.location.replace("/dashboard");
    } else if (!isValid && path !== "/login" && path !== "/") {
      window.location.replace("/login");
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes under MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/product-details" element={<ProductDetails />} />
          <Route path="/shop-settings" element={<ShopSettings />} />
          <Route path="/credit" element={<Credit />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/storefront" element={<Storefront />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
