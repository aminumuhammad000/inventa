import React, { useEffect } from "react";

const Dashboard = () => {
  useEffect(() => {
    (async function() {
      if (window.SidebarComponent) {
        window.sidebarComponent = await window.SidebarComponent.loadSidebar('sidebar-container');
      }
      if (window.HeaderComponent) {
        window.headerComponent = await window.HeaderComponent.loadHeader('header-container');
      }
    })();
  }, []);

  return (
    <div className="app-container">
   
      {/* Main Content */}
      <main className="main-content" id="mainContent">
        {/* Header Container */}
        <div id="header-container"></div>
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
                  <i className="material-icons-round">inventory_2</i>
                  What's in Your Shop
                </h2>
                <button className="card-action">
                  <i className="material-icons-round">more_vert</i>
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
                  <i className="material-icons-round">warning</i>
                  Items Running Out
                </h2>
                <button className="card-action">
                  <i className="material-icons-round">more_vert</i>
                </button>
              </div>
              <div className="card-content">
                <div className="alert-list">
                  <div className="alert-item critical">
                    <div className="alert-icon">
                      <i className="material-icons-round">error</i>
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
                      <i className="material-icons-round">warning</i>
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
                      <i className="material-icons-round">warning</i>
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
