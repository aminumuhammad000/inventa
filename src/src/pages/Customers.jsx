import React from "react";
import "../styles/global-style.css";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import WarningIcon from '@mui/icons-material/Warning';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SearchIcon from '@mui/icons-material/Search';

const Customers = () => {
  // Placeholder handlers for demo; replace with real logic as needed
  const toggleAddCustomerForm = () => {};
  const exportCustomers = () => {};
  const closeAddCustomerForm = () => {};
  const saveCustomer = () => {};
  const closeEditCustomerForm = () => {};
  const updateCustomer = () => {};
  const searchCustomers = () => {};
  const filterCustomers = () => {};
  const closeCustomerDetailsModal = () => {};
  const switchCustomerTab = () => {};
  const recordPayment = () => {};
  const closeRecordPaymentModal = () => {};
  const savePayment = () => {};

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
            <button className="btn-primary" onClick={toggleAddCustomerForm}>
              <PersonAddIcon />
              Add Customer
            </button>
            <button className="btn-secondary" onClick={exportCustomers}>
              <DownloadIcon />
              Export Customers
            </button>
          </div>

          {/* Add Customer Form (Inline) */}
          <div className="add-customer-section" id="addCustomerSection" style={{ display: 'none' }}>
            <div className="form-card">
              <div className="form-header">
                <h3>Add New Customer</h3>
                <button className="btn-close" onClick={closeAddCustomerForm}>
                  <CloseIcon />
                </button>
              </div>
              <form id="addCustomerForm">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="customerName">Customer Name *</label>
                    <input type="text" id="customerName" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="customerPhone">Phone Number *</label>
                    <input type="tel" id="customerPhone" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="customerEmail">Email Address</label>
                    <input type="email" id="customerEmail" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="customerAddress">Address</label>
                    <input type="text" id="customerAddress" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="creditLimit">Credit Limit (₦)</label>
                    <input type="number" id="creditLimit" min="0" defaultValue="0" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="customerType">Customer Type</label>
                    <select id="customerType">
                      <option value="individual">Individual</option>
                      <option value="company">Company</option>
                      <option value="contractor">Contractor</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="customerNotes">Notes</label>
                  <textarea id="customerNotes" rows="3"></textarea>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={closeAddCustomerForm}>Cancel</button>
                  <button type="button" className="btn-primary" onClick={saveCustomer}>Save Customer</button>
                </div>
              </form>
            </div>
          </div>

          {/* Edit Customer Form (Inline) */}
          <div className="edit-customer-section" id="editCustomerSection" style={{ display: 'none' }}>
            <div className="form-card">
              <div className="form-header">
                <h3>Edit Customer</h3>
                <button className="btn-close" onClick={closeEditCustomerForm}>
                  <CloseIcon />
                </button>
              </div>
              <form id="editCustomerForm">
                <input type="hidden" id="editCustomerId" />
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="editCustomerName">Customer Name *</label>
                    <input type="text" id="editCustomerName" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editCustomerPhone">Phone Number *</label>
                    <input type="tel" id="editCustomerPhone" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="editCustomerEmail">Email Address</label>
                    <input type="email" id="editCustomerEmail" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editCustomerAddress">Address</label>
                    <input type="text" id="editCustomerAddress" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="editCreditLimit">Credit Limit (₦)</label>
                    <input type="number" id="editCreditLimit" min="0" defaultValue="0" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editCustomerType">Customer Type</label>
                    <select id="editCustomerType">
                      <option value="individual">Individual</option>
                      <option value="company">Company</option>
                      <option value="contractor">Contractor</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="editCustomerNotes">Notes</label>
                  <textarea id="editCustomerNotes" rows="3"></textarea>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={closeEditCustomerForm}>Cancel</button>
                  <button type="button" className="btn-primary" onClick={updateCustomer}>Update Customer</button>
                </div>
              </form>
            </div>
          </div>

          {/* Customer Stats */}
          <div className="customer-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <PeopleIcon />
              </div>
              <div className="stat-content">
                <div className="stat-value" id="totalCustomers">0</div>
                <div className="stat-label">Total Customers</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <CreditCardIcon />
              </div>
              <div className="stat-content">
                <div className="stat-value" id="creditCustomers">0</div>
                <div className="stat-label">Credit Customers</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <WarningIcon />
              </div>
              <div className="stat-content">
                <div className="stat-value" id="overdueCustomers">0</div>
                <div className="stat-label">Overdue Payments</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <AccountBalanceWalletIcon />
              </div>
              <div className="stat-content">
                <div className="stat-value" id="totalOutstanding">₦0</div>
                <div className="stat-label">Total Outstanding</div>
              </div>
            </div>
          </div>

          {/* Customer List */}
          <div className="customer-list">
            <div className="list-header">
              <h3>Customer List</h3>
              <div className="list-controls">
                <div className="search-box">
                  <SearchIcon />
                  <input type="text" id="customerSearch" placeholder="Search customers..." onKeyUp={searchCustomers} />
                </div>
                <select id="customerFilter" onChange={filterCustomers}>
                  <option value="all">All Customers</option>
                  <option value="credit">Credit Customers</option>
                  <option value="overdue">Overdue Payments</option>
                  <option value="active">Active</option>
                </select>
              </div>
            </div>
            <div className="customer-table-container">
              <table className="customer-table" id="customerTable">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Last Purchase</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="customerTableBody">
                  {/* Customer data will be loaded here */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      {/* Customer Details Modal */}
      <div className="modal" id="customerDetailsModal">
        <div className="modal-content large">
          <div className="modal-header">
            <h3 id="customerDetailsTitle">Customer Details</h3>
            <button className="modal-close" onClick={closeCustomerDetailsModal}>
              <CloseIcon />
            </button>
          </div>
          <div className="modal-body">
            <div className="customer-details-tabs">
              <button className="tab-button active" onClick={() => switchCustomerTab('profile')}>Profile</button>
              <button className="tab-button" onClick={() => switchCustomerTab('purchases')}>Purchase History</button>
              <button className="tab-button" onClick={() => switchCustomerTab('payments')}>Payment History</button>
              <button className="tab-button" onClick={() => switchCustomerTab('credit')}>Credit Summary</button>
            </div>
            <div className="tab-content">
              <div id="profileTab" className="tab-panel active">
                <div className="customer-profile">
                  <div className="profile-info">
                    <h4 id="profileName"></h4>
                    <p id="profilePhone"></p>
                    <p id="profileEmail"></p>
                    <p id="profileAddress"></p>
                  </div>
                  <div className="profile-stats">
                    <div className="stat-item">
                      <span className="stat-label">Outstanding</span>
                      <span className="stat-value" id="profileOutstanding"></span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Purchases</span>
                      <span className="stat-value" id="profileTotalPurchases"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div id="purchasesTab" className="tab-panel">
                <div className="purchase-history" id="purchaseHistory">
                  {/* Purchase history will be loaded here */}
                </div>
              </div>
              <div id="paymentsTab" className="tab-panel">
                <div className="payment-history" id="paymentHistory">
                  {/* Payment history will be loaded here */}
                </div>
              </div>
              <div id="creditTab" className="tab-panel">
                <div className="credit-summary" id="creditSummary">
                  {/* Credit summary will be loaded here */}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={closeCustomerDetailsModal}>Close</button>
            <button className="btn-primary" onClick={recordPayment}>Record Payment</button>
          </div>
        </div>
      </div>
      {/* Record Payment Modal */}
      <div className="modal" id="recordPaymentModal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Record Payment</h3>
            <button className="modal-close" onClick={closeRecordPaymentModal}>
              <CloseIcon />
            </button>
          </div>
          <div className="modal-body">
            <form id="recordPaymentForm">
              <div className="form-group">
                <label htmlFor="paymentAmount">Payment Amount (₦) *</label>
                <input type="number" id="paymentAmount" required min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label htmlFor="paymentMethod">Payment Method *</label>
                <select id="paymentMethod" required>
                  <option value="cash">Cash</option>
                  <option value="transfer">Bank Transfer</option>
                  <option value="check">Check</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="paymentDate">Payment Date *</label>
                <input type="date" id="paymentDate" required />
              </div>
              <div className="form-group">
                <label htmlFor="paymentNotes">Notes</label>
                <textarea id="paymentNotes" rows="3"></textarea>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={closeRecordPaymentModal}>Cancel</button>
            <button className="btn-primary" onClick={savePayment}>Record Payment</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
