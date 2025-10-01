import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";

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
import Signup from "./pages/Signup";
import Storefront from "./pages/Storefront";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      {/* Global Navigation */}
        <Header />
      {/* Route Mapping */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/product-details" element={<ProductDetails />} />
        <Route path="/shop-settings" element={<ShopSettings />} />
        <Route path="/credit" element={<Credit />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/storefront" element={<Storefront />} />
      </Routes>
    </Router>
  );
}

export default App;
