import React, { useEffect, useState } from "react";
import "../styles/DashboardPage.css"

import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningIcon from "@mui/icons-material/Warning";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ErrorIcon from "@mui/icons-material/Error";

const Dashboard = () => {
  // State for dashboard data
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [someProducts, setSomeProducts] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  // Load data from SQLite (via IPC)
  useEffect(() => {
    const loadData = async () => {
      try {
        // Total products
        const total = await window.api.getTotalProducts();
        setTotalProducts(total);

        // Low stock count
        const lowCount = await window.api.countLowStock(5);
        setLowStockCount(lowCount);

        // Some products (latest 3)
        const some = await window.api.getSomeProducts(3);
        setSomeProducts(some);

        // Low stock products (<= 5)
        const lowItems = await window.api.getLowStock(5);
        setLowStockItems(lowItems);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadData();
  }, []);

  return (
    <>
      <main>
        <div className="content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-content">
                <h3 className="stat-value">{totalProducts}</h3>
                <p className="stat-label">Items in Stock</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <h3 className="stat-value">{lowStockCount}</h3>
                <p className="stat-label">Items Running Low</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <h3 className="stat-value">₦45,230</h3>
                <p className="stat-label">Money Made Today</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <h3 className="stat-value">₦12,450</h3>
                <p className="stat-label">Profit Made Today</p>
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
              </div>
              <div className="card-content">
                <div className="stock-list">
                  {someProducts.map((p) => (
                    <div className="stock-item" key={p.id}>
                      <div className="stock-info">
                        <h4>{p.name}</h4>
                        <p>{p.category || "Uncategorized"}</p>
                      </div>
                      <div className="stock-balance">
                        <span className="balance-value">{p.quantity}</span>
                        <span className="balance-unit">units</span>
                      </div>
                    </div>
                  ))}
                  {someProducts.length === 0 && <p>No products yet</p>}
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
              </div>
              <div className="card-content">
                <div className="alert-list">
                  {lowStockItems.map((p) => (
                    <div className="alert-item warning" key={p.id}>
                      <div className="alert-icon">
                        <ErrorIcon />
                      </div>
                      <div className="alert-content">
                        <h4>{p.name}</h4>
                        <p>Only {p.quantity} left - Need to buy more!</p>
                      </div>
                      <div className="alert-action">
                        <button className="btn-small">Buy More</button>
                      </div>
                    </div>
                  ))}
                  {lowStockItems.length === 0 && <p>No low stock items 🎉</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
