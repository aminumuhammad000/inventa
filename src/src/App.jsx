import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import "./App.css";

// Pages
// import Home from "./pages/Home";
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
import Dashboard from "./pages/DashboardPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/product-details" element={<ProductDetails />} />
        <Route path="/shop-settings" element={<ShopSettings />} />
        <Route path="/credit" element={<Credit />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/login" element={<Login />} />
        <Route path="/storefront" element={<Storefront />} />
      </Routes>
    </Router>
  );
}

export default App;
