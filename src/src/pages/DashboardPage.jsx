import React, { useEffect, useState } from "react";
import Sidbar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/global-style.css";

// Sample/mock data functions
const getSampleInventoryData = () => ([
  { id: 1, name: "Cement", stock: 1247 },
  { id: 2, name: "Bricks", stock: 500 },
  { id: 3, name: "Iron Rods", stock: 300 },
]);
const getSampleSalesData = () => ([
  { id: 1, amount: 50000 },
  { id: 2, amount: 75000 },
]);
const getSampleCreditSalesData = () => ([
  { id: 1, amount: 30000 },
]);
const getSampleCustomers = () => ([
  { id: 1, name: "John Doe" },
  { id: 2, name: "Acme Corp" },
]);
const getSamplePayments = () => ([
  { id: 1, amount: 10000 },
]);
import Inventory2Icon from '@mui/icons-material/Inventory2';
import WarningIcon from '@mui/icons-material/Warning';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ErrorIcon from '@mui/icons-material/Error';


const Dashboard = () => {
  // State for dashboard data
  const [inventoryData, setInventoryData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [creditSalesData, setCreditSalesData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);

  // Load data from localStorage or use sample data
  useEffect(() => {
    // Inventory
    const savedInventory = localStorage.getItem('inventoryData');
    if (savedInventory) {
      setInventoryData(JSON.parse(savedInventory));
    } else {
      const sample = getSampleInventoryData();
      setInventoryData(sample);
      localStorage.setItem('inventoryData', JSON.stringify(sample));
    }
    // Sales
    const savedSales = localStorage.getItem('salesData');
    if (savedSales) {
      setSalesData(JSON.parse(savedSales));
    } else {
      const sample = getSampleSalesData();
      setSalesData(sample);
      localStorage.setItem('salesData', JSON.stringify(sample));
    }
    // Credit Sales
    const savedCreditSales = localStorage.getItem('creditSalesData');
    if (savedCreditSales) {
      setCreditSalesData(JSON.parse(savedCreditSales));
    } else {
      const sample = getSampleCreditSalesData();
      setCreditSalesData(sample);
      localStorage.setItem('creditSalesData', JSON.stringify(sample));
    }
    // Customers
    const savedCustomers = localStorage.getItem('customersData');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    } else {
      const sample = getSampleCustomers();
      setCustomers(sample);
      localStorage.setItem('customersData', JSON.stringify(sample));
    }
    // Payments
    const savedPayments = localStorage.getItem('paymentsData');
    if (savedPayments) {
      setPayments(JSON.parse(savedPayments));
    } else {
      const sample = getSamplePayments();
      setPayments(sample);
      localStorage.setItem('paymentsData', JSON.stringify(sample));
    }
  }, []);

  return (
    <div className="app-container">
      
      {/* Sidebar Container */}
      <Sidbar />
      <main className="main-content" id="mainContent">
        {/* Header Container */}
        <Header />
        {/* Content */}
        <div className="content">
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              {/* <div className="stat-icon">
                <i className="material-icons-round">inventory_2</i>
              </div> */}
              <div className="stat-content">
                <h3 className="stat-value">1,247</h3>
                <p className="stat-label">Items in Stock</p>
                <div className="stat-change positive">
                  {/* <i className="material-icons-round">trending_up</i> */}
                  {/* <span>+12%</span> */}
                </div>
              </div>
            </div>
            <div className="stat-card">
              {/* <div className="stat-icon">
                <i className="material-icons-round">warning</i>
              </div> */}
              <div className="stat-content">
                <h3 className="stat-value">23</h3>
                <p className="stat-label">Items Running Low</p>
                <div className="stat-change negative">
                  {/* <i className="material-icons-round">trending_down</i>
                  <span>-5%</span> */}
                </div>
              </div>
            </div>
            <div className="stat-card">
              {/* <div className="stat-icon">
                <i className="material-icons-round">point_of_sale</i>
              </div> */}
              <div className="stat-content">
                <h3 className="stat-value">₦45,230</h3>
                <p className="stat-label">Money Made Today</p>
                <div className="stat-change positive">
                  {/* <i className="material-icons-round">trending_up</i>
                  <span>+8%</span> */}
                </div>
              </div>
            </div>
            <div className="stat-card">
              {/* <div className="stat-icon">
                <i className="material-icons-round">account_balance_wallet</i>
              </div> */}
              <div className="stat-content">
                <h3 className="stat-value">₦12,450</h3>
                <p className="stat-label">Profit Made Today</p>
                {/* <div className="stat-change positive">
                  <i className="material-icons-round">trending_up</i>
                  <span>+15%</span>
                </div> */}
              </div>
            </div>
          </div>
          {/* Main Content Grid */}
          <div className="content-grid">
            {/* Stock Balance Overview */}
            <div className="content-card">
              <div className="card-header">
                <h2 className="card-title">
                  <Inventory2Icon />
                  What's in Your Shop
                </h2>
                <button className="card-action">
                  <MoreVertIcon />
                </button>
              </div>
              <div className="card-content">
                <div className="stock-list">
                  <div className="stock-item">
                    <div className="stock-info">
                      <h4>Cement (50kg)</h4>
                      <p>Construction Materials</p>
                    </div>
                    <div className="stock-balance">
                      <span className="balance-value">245</span>
                      <span className="balance-unit">bags</span>
                    </div>
                  </div>
                  <div className="stock-item">
                    <div className="stock-info">
                      <h4>Steel Rods (12mm)</h4>
                      <p>Construction Materials</p>
                    </div>
                    <div className="stock-balance">
                      <span className="balance-value">89</span>
                      <span className="balance-unit">pieces</span>
                    </div>
                  </div>
                  <div className="stock-item">
                    <div className="stock-info">
                      <h4>Sand (Truck Load)</h4>
                      <p>Construction Materials</p>
                    </div>
                    <div className="stock-balance">
                      <span className="balance-value">12</span>
                      <span className="balance-unit">loads</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Low Stock Alerts */}
            <div className="content-card">
              <div className="card-header">
                <h2 className="card-title">
                  <WarningIcon />
                  Items Running Out
                </h2>
                <button className="card-action">
                  <MoreVertIcon />
                </button>
              </div>
              <div className="card-content">
                <div className="alert-list">
                  <div className="alert-item critical">
                    <div className="alert-icon">
                      <ErrorIcon />
                    </div>
                    <div className="alert-content">
                      <h4>Paint (White)</h4>
                      <p>Only 5 gallons left - Need to buy more!</p>
                    </div>
                    <div className="alert-action">
                      <button className="btn-small">Buy More</button>
                    </div>
                  </div>
                  <div className="alert-item warning">
                    <div className="alert-icon">
                      <WarningIcon />
                    </div>
                    <div className="alert-content">
                      <h4>Nails (2 inches)</h4>
                      <p>Only 15 boxes left - Need to buy more!</p>
                    </div>
                    <div className="alert-action">
                      <button className="btn-small">Buy More</button>
                    </div>
                  </div>
                  <div className="alert-item warning">
                    <div className="alert-icon">
                      <WarningIcon />
                    </div>
                    <div className="alert-content">
                      <h4>PVC Pipes (4 inches)</h4>
                      <p>Only 8 pieces left - Need to buy more!</p>
                    </div>
                    <div className="alert-action">
                      <button className="btn-small">Buy More</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
