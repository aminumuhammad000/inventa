import React, { useEffect, useState } from "react";
import "../styles/global-style.css";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TodayIcon from '@mui/icons-material/Today';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
<<<<<<< HEAD
=======

>>>>>>> 577b63f7c2227cf90c4943c5c6b15caf40512929

const Credit = () => {
  // Inject modal styles once
  useEffect(() => {
    if (!document.getElementById('credit-modal-style')) {
      const modalStyle = document.createElement('style');
      modalStyle.id = 'credit-modal-style';
      modalStyle.innerHTML = `
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-popup {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
  padding: 32px 24px 24px 24px;
  min-width: 320px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}
`;
      document.head.appendChild(modalStyle);
    }
  }, []);
  // State for credit sales, customers, payments, inventory
  const [creditSales, setCreditSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [inventory, setInventory] = useState([]);
  // Form state
  const [newSale, setNewSale] = useState({ customerId: '', saleDate: '', totalAmount: '' });
  const [newPayment, setNewPayment] = useState({ customerId: '', amount: '', paymentDate: '' });
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', creditLimit: '' });
  // Modal/form visibility state
  const [showNewSale, setShowNewSale] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = (key, fallback) => {
      try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
      } catch {
        return fallback;
      }
    };
    setCreditSales(loadData('creditSalesData', []));
    setCustomers(loadData('customersData', []));
    setPayments(loadData('paymentsData', []));
    setInventory(loadData('inventoryData', []));
  }, []);

  // Table render helpers
  const getCustomerName = (id) => {
    const c = customers.find(c => c.id === id);
    return c ? c.name : 'Unknown Customer';
  };
  const getCreditSaleStatus = (sale) => {
    const outstanding = parseFloat(sale.totalAmount) - parseFloat(sale.paidAmount);
    if (outstanding <= 0) return { text: 'Completed', class: 'completed' };
    const due = new Date(sale.dueDate);
    if (due < new Date()) return { text: 'Overdue', class: 'overdue' };
    return { text: 'Pending', class: 'pending' };
  };

  // Placeholder handlers for demo
  const toggleNewSaleForm = () => {
    setNewSale({ customerId: '', saleDate: '', totalAmount: '' });
    setShowNewSale(v => !v);
  };
  const togglePaymentForm = () => {
    setNewPayment({ customerId: '', amount: '', paymentDate: '' });
    setShowPayment(v => !v);
  };
  const toggleCustomerForm = () => {
    setNewCustomer({ name: '', phone: '', email: '', creditLimit: '' });
    setShowCustomer(v => !v);
  };
  // Export sales as CSV
  const exportSaleHistory = () => {
    if (!creditSales.length) {
      alert('No sales to export.');
      return;
    }
    // Prepare CSV header and rows
    const header = ['Sale ID', 'Date', 'Customer', 'Product Image', 'Total Amount', 'Paid Amount', 'Payment Method', 'Status'];
    const rows = creditSales.map(sale => {
      const status = getCreditSaleStatus(sale).text;
      const productImg = sale.items && sale.items.length > 0 && sale.items[0].image
        ? sale.items[0].image
        : '';
      const paymentMethod = sale.paymentMethod || 'Credit';
      return [
        `#${sale.id}`,
        sale.saleDate,
        getCustomerName(sale.customerId),
        productImg,
        parseFloat(sale.totalAmount).toFixed(2),
        parseFloat(sale.paidAmount).toFixed(2),
        paymentMethod,
        status
      ];
    });
    const csvContent = [header, ...rows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'credit_sales_history.csv';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };
  const closeNewSaleForm = () => setShowNewSale(false);
  const saveSale = () => {
    if (!newSale.customerId || !newSale.saleDate || !newSale.totalAmount) {
      alert('Please fill all fields.');
      return;
    }
    const id = Date.now();
    const sale = {
      id,
      customerId: newSale.customerId,
      saleDate: newSale.saleDate,
      totalAmount: newSale.totalAmount,
      paidAmount: 0,
      dueDate: newSale.saleDate,
      items: [],
      paymentMethod: 'Credit',
    };
    const updated = [...creditSales, sale];
    setCreditSales(updated);
    localStorage.setItem('creditSalesData', JSON.stringify(updated));
    setShowNewSale(false);
  };
  const closePaymentForm = () => setShowPayment(false);
  const savePayment = () => {
    if (!newPayment.customerId || !newPayment.amount || !newPayment.paymentDate) {
      alert('Please fill all fields.');
      return;
    }
    const id = Date.now();
    const payment = {
      id,
      customerId: newPayment.customerId,
      creditSaleId: '', // Could be selected in a more advanced form
      paymentDate: newPayment.paymentDate,
      amount: newPayment.amount,
      paymentMethod: 'Cash',
    };
    const updated = [...payments, payment];
    setPayments(updated);
    localStorage.setItem('paymentsData', JSON.stringify(updated));
    setShowPayment(false);
  };
  const closeCustomerForm = () => setShowCustomer(false);
  const saveCustomer = () => {
    if (!newCustomer.name) {
      alert('Name is required.');
      return;
    }
    const id = Date.now();
    const customer = {
      id,
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email,
      creditLimit: newCustomer.creditLimit,
    };
    const updated = [...customers, customer];
    setCustomers(updated);
    localStorage.setItem('customersData', JSON.stringify(updated));
    setShowCustomer(false);
  };
  const closeCreditSaleDetailsForm = () => {};
  const recordPaymentFromDetails = () => {};

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
          {/* Actions */}
          <div className="actions-bar">
            <button className="btn-secondary" onClick={exportSaleHistory}>
              <DownloadIcon />
              Export History
            </button>
          </div>
          {/* Modal Popups for forms */}
          {showNewSale && (
            <div className="modal-overlay">
              <div className="modal-popup">
                <button className="btn-icon" onClick={closeNewSaleForm} style={{ float: 'right' }}><CloseIcon /></button>
                <h3>New Sale</h3>
                <form onSubmit={e => { e.preventDefault(); saveSale(); }}>
                  <div className="form-group">
                    <label>Customer</label>
                    <select value={newSale.customerId} onChange={e => setNewSale(s => ({ ...s, customerId: e.target.value }))} required>
                      <option value="">Select customer</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Sale Date</label>
                    <input type="date" value={newSale.saleDate} onChange={e => setNewSale(s => ({ ...s, saleDate: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Total Amount</label>
                    <input type="number" min="0" step="0.01" value={newSale.totalAmount} onChange={e => setNewSale(s => ({ ...s, totalAmount: e.target.value }))} required />
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: 16 }}>Save Sale</button>
                </form>
              </div>
            </div>
          )}
          {showPayment && (
            <div className="modal-overlay">
              <div className="modal-popup">
                <button className="btn-icon" onClick={closePaymentForm} style={{ float: 'right' }}><CloseIcon /></button>
                <h3>Record Payment</h3>
                <form onSubmit={e => { e.preventDefault(); savePayment(); }}>
                  <div className="form-group">
                    <label>Customer</label>
                    <select value={newPayment.customerId} onChange={e => setNewPayment(s => ({ ...s, customerId: e.target.value }))} required>
                      <option value="">Select customer</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Amount</label>
                    <input type="number" min="0" step="0.01" value={newPayment.amount} onChange={e => setNewPayment(s => ({ ...s, amount: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Payment Date</label>
                    <input type="date" value={newPayment.paymentDate} onChange={e => setNewPayment(s => ({ ...s, paymentDate: e.target.value }))} required />
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: 16 }}>Save Payment</button>
                </form>
              </div>
            </div>
          )}
          {showCustomer && (
            <div className="modal-overlay">
              <div className="modal-popup">
                <button className="btn-icon" onClick={closeCustomerForm} style={{ float: 'right' }}><CloseIcon /></button>
                <h3>Add Customer</h3>
                <form onSubmit={e => { e.preventDefault(); saveCustomer(); }}>
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" value={newCustomer.name} onChange={e => setNewCustomer(s => ({ ...s, name: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" value={newCustomer.phone} onChange={e => setNewCustomer(s => ({ ...s, phone: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={newCustomer.email} onChange={e => setNewCustomer(s => ({ ...s, email: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Credit Limit</label>
                    <input type="number" min="0" step="0.01" value={newCustomer.creditLimit} onChange={e => setNewCustomer(s => ({ ...s, creditLimit: e.target.value }))} />
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: 16 }}>Save Customer</button>
                </form>
              </div>
            </div>
          )}
          {/* Credit Sales Table - Full Screen */}
          <div className="table-container" style={{ marginTop: 32, width: '100%' }}>
            <h3>Credit Sales</h3>
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Sale ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Product Image</th>
                  <th>Total Amount</th>
                  <th>Paid Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {creditSales.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center' }}>No sales</td></tr>
                ) : creditSales.map(sale => {
                  const status = getCreditSaleStatus(sale);
                  // Mock product image (use a placeholder or from sale.items[0])
                  const productImg = sale.items && sale.items.length > 0 && sale.items[0].image
                    ? sale.items[0].image
                    : 'https://via.placeholder.com/40x40?text=Img';
                  // Payment method (from sale or fallback)
                  const paymentMethod = sale.paymentMethod || 'Credit';
                  return (
                    <tr key={sale.id}>
                      <td>#{sale.id}</td>
                      <td>{sale.saleDate}</td>
                      <td>{getCustomerName(sale.customerId)}</td>
                      <td><img src={productImg} alt="Product" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} /></td>
                      <td>₦{parseFloat(sale.totalAmount).toFixed(2)}</td>
                      <td>₦{parseFloat(sale.paidAmount).toFixed(2)}</td>
                      <td>{paymentMethod}</td>
                      <td><span className={`status-badge ${status.class}`}>{status.text}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Payments Table */}
          <div className="table-container" style={{ marginTop: 32 }}>
            <h3>Payments</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Customer</th>
                  <th>Credit Sale ID</th>
                  <th>Payment Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center' }}>No payments</td></tr>
                ) : payments.map(payment => {
                  const customer = customers.find(c => c.id === payment.customerId);
                  return (
                    <tr key={payment.id}>
                      <td>#{payment.id}</td>
                      <td>{customer ? customer.name : 'Unknown Customer'}</td>
                      <td>#{payment.creditSaleId}</td>
                      <td>{payment.paymentDate}</td>
                      <td>₦{parseFloat(payment.amount).toFixed(2)}</td>
                      <td>{payment.paymentMethod}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Credit;