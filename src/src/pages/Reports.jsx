import React, { useState } from "react";
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
import "../js/reports.js";
const Reports = () => {
  // Placeholder handlers for demo; replace with real logic as needed
  const generateReport = (type) => {};
  // Removed duplicate exportReport declaration
  const hideDateRangeSelector = () => {};
  const generateCustomReport = () => {};
  // Removed duplicate printReport declaration
  const exportCurrentReport = () => {};
  // Removed duplicate switchDetailTab declaration

  // --- Shop Info for Print Header ---
  function getShopInfo() {
    try {
      return JSON.parse(localStorage.getItem('shopSettings')) || {};
    } catch {
      return {};
    }
  }
  const shopInfo = getShopInfo();

  // --- Data State ---
  const [salesData, setSalesData] = useState(() => loadData('salesData', getSampleSalesData));
  const [inventoryData, setInventoryData] = useState(() => loadData('inventoryData', getSampleInventoryData));
  const [creditSalesData, setCreditSalesData] = useState(() => loadData('creditSalesData', getSampleCreditSalesData));

  
  // --- UI State ---

  const [reportType, setReportType] = useState(null); // 'daily', 'weekly', 'monthly', 'custom'
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [showDateRange, setShowDateRange] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [activeTab, setActiveTab] = useState('sales');

  // --- Data Loaders ---
  function loadData(key, getSample) {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
      const sample = getSample();
      localStorage.setItem(key, JSON.stringify(sample));
      return sample;
    } catch {
      return getSample();
    }
  }

  // --- Sample Data ---
  function getSampleSalesData() {
    const today = new Date().toISOString().split('T')[0];
    return [
      {
        id: 1001,
        saleDate: today,
        customerName: 'ABC Construction',
        totalAmount: 25000,
        profit: 5000,
        paymentMethod: 'Cash',
        items: [
          { itemId: 1, quantity: 5, unitPrice: 4000, totalPrice: 20000 },
          { itemId: 2, quantity: 2, unitPrice: 3000, totalPrice: 5000 }
        ]
      },
      {
        id: 1002,
        saleDate: today,
        customerName: 'XYZ Builders',
        totalAmount: 20230,
        profit: 4030,
        paymentMethod: 'POS',
        items: [
          { itemId: 3, quantity: 1, unitPrice: 18000, totalPrice: 18000 },
          { itemId: 4, quantity: 1, unitPrice: 3000, totalPrice: 3000 }
        ]
      }
    ];
  }
  function getSampleInventoryData() {
    return [
      {
        id: 1,
        name: 'Cement (50kg)',
        sku: 'CEM-50KG-001',
        category_name: 'Construction Materials',
        current_stock: 245,
        unit: 'bags',
        cost_price: 3500.00,
        selling_price: 4000.00,
        min_stock_level: 50
      },
      {
        id: 2,
        name: 'Steel Rods (12mm)',
        sku: 'STEEL-12MM-001',
        category_name: 'Construction Materials',
        current_stock: 89,
        unit: 'pieces',
        cost_price: 2500.00,
        selling_price: 3000.00,
        min_stock_level: 20
      }
    ];
  }
  function getSampleCreditSalesData() {
    return [
      {
        id: 2001,
        customerId: 1,
        saleDate: new Date().toISOString().split('T')[0],
        totalAmount: 75000,
        paidAmount: 25000,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'partial',
        items: [
          { itemId: 1, quantity: 15, unitPrice: 4000, totalPrice: 60000 },
          { itemId: 2, quantity: 5, unitPrice: 3000, totalPrice: 15000 }
        ],
        notes: 'Monthly construction materials',
        createdAt: new Date().toISOString()
      }
    ];
  }

  // --- Report Generation Handler ---
  function handleGenerateReport(type) {
    if (type === 'custom') {
      setShowDateRange(true);
      setReportType('custom');
      return;
    }
    setReportType(type);
    setShowDateRange(false);
    setTimeout(() => {
      setReportData(generateReportData(type));
    }, 500);
  }

  function handleCustomReport() {
    if (!customRange.start || !customRange.end) return;
    setShowDateRange(false);
    setReportType('custom');
    setTimeout(() => {
      setReportData(generateReportData('custom', customRange.start, customRange.end));
    }, 500);
  }

  // --- Report Data Generator ---
  function generateReportData(type, start, end) {
    const today = new Date().toISOString().split('T')[0];
    let period = '';
    let sales = [];
    if (type === 'daily') {
      sales = salesData.filter(s => s.saleDate === today);
      period = today;
    } else if (type === 'weekly') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      sales = salesData.filter(s => s.saleDate >= weekAgo);
      period = `${weekAgo} to ${today}`;
    } else if (type === 'monthly') {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      sales = salesData.filter(s => s.saleDate >= monthAgo);
      period = `${monthAgo} to ${today}`;
    } else if (type === 'custom') {
      sales = salesData.filter(s => s.saleDate >= start && s.saleDate <= end);
      period = `${start} to ${end}`;
    } else {
      sales = salesData;
      period = today;
    }
    // Summary
    const totalSales = sales.reduce((sum, s) => sum + Number(s.totalAmount), 0);
    const totalTransactions = sales.length;
    const totalPurchases = 0; // Placeholder for purchases
    const netProfit = sales.reduce((sum, s) => sum + Number(s.profit || 0), 0);
    return {
      type,
      period,
      sales,
      inventory: inventoryData,
      credit: creditSalesData,
      summary: {
        totalSales,
        totalPurchases,
        netProfit,
        totalTransactions
      }
    };
  }

  // --- Tab Switch Handler ---
  function switchDetailTab(tab) {
    setActiveTab(tab);
  }

  // --- Date Range Handlers ---
  function handleDateChange(e) {
    setCustomRange({ ...customRange, [e.target.name]: e.target.value });
  }

  // --- Export/Print Handlers (to be implemented) ---
  function exportReport(type) {
    // TODO: Implement export logic
    alert(`Exporting ${type} report...`);
  }
  function printReport() {
    window.print();
  }


  // --- Print Layout ---
  const PrintHeader = () => (
    <div className="print-header" style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #eee', marginBottom: 24, paddingBottom: 16, background: '#fff' }}>
      {shopInfo.logo && (
        <img src={shopInfo.logo} alt="Shop Logo" style={{ height: 64, width: 64, objectFit: 'contain', marginRight: 24, borderRadius: 8, border: '1px solid #eee', background: '#fafafa' }} />
      )}
      <div style={{ flex: 1 }}>
        <h1 style={{ margin: 0, fontSize: 28, color: '#222', letterSpacing: 1 }}>{shopInfo.name || 'Shop Name'}</h1>
        <div style={{ fontSize: 16, color: '#555', margin: '4px 0' }}>{shopInfo.address || 'Shop Address'}</div>
        <div style={{ fontSize: 14, color: '#888' }}>{shopInfo.phone || ''} {shopInfo.email ? `| ${shopInfo.email}` : ''}</div>
      </div>
      <div style={{ textAlign: 'right', minWidth: 120 }}>
        <div style={{ fontSize: 16, color: '#333' }}>Date: {new Date().toLocaleDateString()}<br/>Time: {new Date().toLocaleTimeString()}</div>
        <div style={{ fontSize: 16, color: '#333', marginTop: 8 }}>{reportType ? reportType.charAt(0).toUpperCase() + reportType.slice(1) + ' Report' : 'Report'}</div>
      </div>
    </div>
  );

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
            <div className="report-card" onClick={() => handleGenerateReport('daily')}>
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
            <div className="report-card" onClick={() => handleGenerateReport('weekly')}>
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
            <div className="report-card" onClick={() => handleGenerateReport('monthly')}>
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
            <div className="report-card" onClick={() => handleGenerateReport('custom')}>
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
          {showDateRange && (
            <div className="date-range-selector">
              <div className="selector-content">
                <h3>Select Date Range</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <input type="date" id="startDate" name="start" value={customRange.start} onChange={handleDateChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input type="date" id="endDate" name="end" value={customRange.end} onChange={handleDateChange} />
                  </div>
                </div>
                <div className="selector-actions">
                  <button className="btn-secondary" onClick={() => setShowDateRange(false)}>Cancel</button>
                  <button className="btn-primary" onClick={handleCustomReport}>Generate Report</button>
                </div>
              </div>
            </div>
          )}

          {/* Report Content Area (hidden by default) */}
          {reportData && (
            <div className="report-content-area print-area">
              {/* Print Header: Always visible in print, visible above report in screen */}
              <PrintHeader />
              <div className="report-header no-print">
                <div className="report-title">
                  <h2>{reportType ? reportType.charAt(0).toUpperCase() + reportType.slice(1) + ' Report' : 'Report'}</h2>
                  <p>{reportData.period}</p>
                </div>
                <div className="report-actions">
                  <button className="btn-secondary" onClick={printReport}>
                    <PrintIcon />
                    Print
                  </button>
                  <button className="btn-primary" onClick={() => exportReport(reportType)}>
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
                    <h3>₦{reportData.summary.totalSales.toLocaleString()}</h3>
                    <p>Total Sales</p>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon">
                    <ShoppingCartIcon />
                  </div>
                  <div className="summary-content">
                    <h3>₦{reportData.summary.totalPurchases.toLocaleString()}</h3>
                    <p>Total Purchases</p>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon">
                    <AccountBalanceWalletIcon />
                  </div>
                  <div className="summary-content">
                    <h3>₦{reportData.summary.netProfit.toLocaleString()}</h3>
                    <p>Net Profit</p>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon">
                    <ReceiptIcon />
                  </div>
                  <div className="summary-content">
                    <h3>{reportData.summary.totalTransactions}</h3>
                    <p>Total Transactions</p>
                  </div>
                </div>
              </div>
              {/* Report Details */}
              <div className="report-details">
                <div className="details-tabs no-print">
                  <button className={`detail-tab${activeTab === 'sales' ? ' active' : ''}`} onClick={() => switchDetailTab('sales')}>
                    <PointOfSaleIcon />
                    Sales
                  </button>
                  <button className={`detail-tab${activeTab === 'purchases' ? ' active' : ''}`} onClick={() => switchDetailTab('purchases')}>
                    <ShoppingCartIcon />
                    Purchases
                  </button>
                  <button className={`detail-tab${activeTab === 'inventory' ? ' active' : ''}`} onClick={() => switchDetailTab('inventory')}>
                    <Inventory2Icon />
                    Inventory
                  </button>
                  <button className={`detail-tab${activeTab === 'credit' ? ' active' : ''}`} onClick={() => switchDetailTab('credit')}>
                    <CreditCardIcon />
                    Credit Sales
                  </button>
                </div>
                <div className="details-content">
                  {/* Sales Details */}
                  {activeTab === 'sales' && (
                    <div className="detail-panel">
                      <div className="table-container">
                        <table className="data-table">
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
                          <tbody>
                            {reportData.sales.length === 0 ? (
                              <tr><td colSpan="6">No sales data</td></tr>
                            ) : reportData.sales.map(sale => (
                              <tr key={sale.id}>
                                <td>{sale.id}</td>
                                <td>{sale.saleDate}</td>
                                <td>{sale.customerName}</td>
                                <td>{sale.items.length}</td>
                                <td>₦{Number(sale.totalAmount).toLocaleString()}</td>
                                <td>{sale.paymentMethod || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {/* Purchases Details (placeholder) */}
                  {activeTab === 'purchases' && (
                    <div className="detail-panel">
                      <div className="table-container">
                        <table className="data-table">
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
                          <tbody>
                            <tr><td colSpan="6">No purchases data</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {/* Inventory Details */}
                  {activeTab === 'inventory' && (
                    <div className="detail-panel">
                      <div className="table-container">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Item Name</th>
                              <th>Category</th>
                              <th>Current Stock</th>
                              <th>Unit</th>
                              <th>Cost Price</th>
                              <th>Selling Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.inventory.length === 0 ? (
                              <tr><td colSpan="6">No inventory data</td></tr>
                            ) : reportData.inventory.map(item => (
                              <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.category_name}</td>
                                <td>{item.current_stock}</td>
                                <td>{item.unit}</td>
                                <td>₦{Number(item.cost_price).toLocaleString()}</td>
                                <td>₦{Number(item.selling_price).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {/* Credit Sales Details */}
                  {activeTab === 'credit' && (
                    <div className="detail-panel">
                      <div className="table-container">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Credit Sale ID</th>
                              <th>Date</th>
                              <th>Amount</th>
                              <th>Paid</th>
                              <th>Outstanding</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.credit.length === 0 ? (
                              <tr><td colSpan="6">No credit sales data</td></tr>
                            ) : reportData.credit.map(cs => (
                              <tr key={cs.id}>
                                <td>{cs.id}</td>
                                <td>{cs.saleDate}</td>
                                <td>₦{Number(cs.totalAmount).toLocaleString()}</td>
                                <td>₦{Number(cs.paidAmount).toLocaleString()}</td>
                                <td>₦{Number(cs.totalAmount - cs.paidAmount).toLocaleString()}</td>
                                <td>{cs.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Reports;
