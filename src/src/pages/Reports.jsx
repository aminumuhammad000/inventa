import React from "react";
import "../styles/global-style.css";
import TodayIcon from '@mui/icons-material/Today';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TuneIcon from '@mui/icons-material/Tune';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const Reports = () => {
  // Placeholder handlers for demo; replace with real logic as needed
  const generateReport = (type) => {};
  const exportReport = (type) => {};
  const hideDateRangeSelector = () => {};
  const generateCustomReport = () => {};
  const printReport = () => {};
  const exportCurrentReport = () => {};
  const switchDetailTab = (tab) => {};

  return (
    <div className="app-container">
      {/* Sidebar Container */}
      <div id="sidebar-container"></div>
      {/* Main Content */}
      <main className="main-content" id="mainContent">
        {/* Header Container */}
        <div id="header-container"></div>
        {/* Content */}
        <div className="content">
          {/* Report Types */}
          <div className="report-types">
            <div className="report-card" onClick={() => generateReport('daily')}>
              <div className="report-icon">
                <TodayIcon />
              </div>
              <div className="report-content">
                <h3>Daily Report</h3>
                <p>Today's sales, purchases, and inventory movements</p>
              </div>
              <div className="report-actions">
                <button className="btn-icon" onClick={e => {e.stopPropagation(); exportReport('daily')}}>
                  <DownloadIcon />
                </button>
              </div>
            </div>
            <div className="report-card" onClick={() => generateReport('weekly')}>
              <div className="report-icon">
                <DateRangeIcon />
              </div>
              <div className="report-content">
                <h3>Weekly Report</h3>
                <p>Weekly summary of business performance</p>
              </div>
              <div className="report-actions">
                <button className="btn-icon" onClick={e => {e.stopPropagation(); exportReport('weekly')}}>
                  <DownloadIcon />
                </button>
              </div>
            </div>
            <div className="report-card" onClick={() => generateReport('monthly')}>
              <div className="report-icon">
                <CalendarMonthIcon />
              </div>
              <div className="report-content">
                <h3>Monthly Report</h3>
                <p>Monthly comprehensive business analysis</p>
              </div>
              <div className="report-actions">
                <button className="btn-icon" onClick={e => {e.stopPropagation(); exportReport('monthly')}}>
                  <DownloadIcon />
                </button>
              </div>
            </div>
            <div className="report-card" onClick={() => generateReport('custom')}>
              <div className="report-icon">
                <TuneIcon />
              </div>
              <div className="report-content">
                <h3>Custom Report</h3>
                <p>Generate report for custom date range</p>
              </div>
              <div className="report-actions">
                <button className="btn-icon" onClick={e => {e.stopPropagation(); exportReport('custom')}}>
                  <DownloadIcon />
                </button>
              </div>
            </div>
          </div>

          {/* Date Range Selector (hidden by default) */}
          <div className="date-range-selector" id="dateRangeSelector" style={{ display: 'none' }}>
            <div className="selector-content">
              <h3>Select Date Range</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input type="date" id="startDate" />
                </div>
                <div className="form-group">
                  <label htmlFor="endDate">End Date</label>
                  <input type="date" id="endDate" />
                </div>
              </div>
              <div className="selector-actions">
                <button className="btn-secondary" onClick={hideDateRangeSelector}>Cancel</button>
                <button className="btn-primary" onClick={generateCustomReport}>Generate Report</button>
              </div>
            </div>
          </div>

          {/* Report Content Area (hidden by default) */}
          <div className="report-content-area" id="reportContent" style={{ display: 'none' }}>
            <div className="report-header">
              <div className="report-title">
                <h2 id="reportTitle">Report Title</h2>
                <p id="reportPeriod">Report Period</p>
              </div>
              <div className="report-actions">
                <button className="btn-secondary" onClick={printReport}>
                  <PrintIcon />
                  Print
                </button>
                <button className="btn-primary" onClick={exportCurrentReport}>
                  <DownloadIcon />
                  Export
                </button>
              </div>
            </div>
            {/* Report Summary */}
            <div className="report-summary">
              <div className="summary-card">
                <div className="summary-icon">
                  <PointOfSaleIcon />
                </div>
                <div className="summary-content">
                  <h3 id="totalSales">₦0</h3>
                  <p>Total Sales</p>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">
                  <ShoppingCartIcon />
                </div>
                <div className="summary-content">
                  <h3 id="totalPurchases">₦0</h3>
                  <p>Total Purchases</p>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">
                  <AccountBalanceWalletIcon />
                </div>
                <div className="summary-content">
                  <h3 id="netProfit">₦0</h3>
                  <p>Net Profit</p>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">
                  <ReceiptIcon />
                </div>
                <div className="summary-content">
                  <h3 id="totalTransactions">0</h3>
                  <p>Total Transactions</p>
                </div>
              </div>
            </div>
            {/* Report Details */}
            <div className="report-details">
              <div className="details-tabs">
                <button className="detail-tab active" onClick={() => switchDetailTab('sales')}>
                  <PointOfSaleIcon />
                  Sales
                </button>
                <button className="detail-tab" onClick={() => switchDetailTab('purchases')}>
                  <ShoppingCartIcon />
                  Purchases
                </button>
                <button className="detail-tab" onClick={() => switchDetailTab('inventory')}>
                  <Inventory2Icon />
                  Inventory
                </button>
                <button className="detail-tab" onClick={() => switchDetailTab('credit')}>
                  <CreditCardIcon />
                  Credit Sales
                </button>
              </div>
              <div className="details-content">
                {/* Sales Details */}
                <div className="detail-panel active" id="sales-details">
                  <div className="table-container">
                    <table className="data-table" id="salesReportTable">
                      <thead>
                        <tr>
                          <th>Sale ID</th>
                          <th>Date</th>
                          <th>Customer</th>
                          <th>Items</th>
                          <th>Amount</th>
                          <th>Payment Method</th>
                        </tr>
                      </thead>
                      <tbody id="salesReportTableBody">
                        {/* Data will be loaded here */}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Purchases Details */}
                <div className="detail-panel" id="purchases-details">
                  <div className="table-container">
                    <table className="data-table" id="purchasesReportTable">
                      <thead>
                        <tr>
                          <th>Purchase ID</th>
                          <th>Date</th>
                          <th>Supplier</th>
                          <th>Items</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody id="purchasesReportTableBody">
                        {/* Data will be loaded here */}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Inventory Details */}
                <div className="detail-panel" id="inventory-details">
                  <div className="table-container">
                    <table className="data-table" id="inventoryReportTable">
                      <thead>
                        <tr>
                          <th>Item Name</th>
                          <th>Category</th>
                          <th>Starting Stock</th>
                          <th>Purchased</th>
                          <th>Sold</th>
                          <th>Ending Stock</th>
                        </tr>
                      </thead>
                      <tbody id="inventoryReportTableBody">
                        {/* Data will be loaded here */}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Credit Sales Details */}
                <div className="detail-panel" id="credit-details">
                  <div className="table-container">
                    <table className="data-table" id="creditReportTable">
                      <thead>
                        <tr>
                          <th>Credit Sale ID</th>
                          <th>Date</th>
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Paid</th>
                          <th>Outstanding</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody id="creditReportTableBody">
                        {/* Data will be loaded here */}
                      </tbody>
                    </table>
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

export default Reports;
