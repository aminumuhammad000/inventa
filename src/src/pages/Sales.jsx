import React, { useEffect } from "react";
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import UndoIcon from '@mui/icons-material/Undo';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import EmailIcon from '@mui/icons-material/Email';

const Sales = () => {
  useEffect(() => {
    // Load sidebar and header components after DOM is ready
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
      <div id="sidebar-container"></div>
      <main className="main-content" id="mainContent">
        <div id="header-container"></div>
        <div className="content">
          <div className="tabs-container">
            <div className="tabs">
              <button className="tab-button active" onClick={() => window.switchSaleType('normal')} id="normalSaleBtn">
                <PointOfSaleIcon />
                <span>Normal Sell</span>
              </button>
              <button className="tab-button" onClick={() => window.switchSaleType('credit')} id="creditSaleBtn">
                <CreditCardIcon />
                <span>Sell on Credit</span>
              </button>
              <button className="tab-button" onClick={() => window.switchSaleType('return')} id="returnSaleBtn">
                <UndoIcon />
                <span>Return Sells</span>
              </button>
            </div>
          </div>

          <div className="record-sale-section" id="recordSaleSection" style={{display: 'block'}}>
            <div className="form-card">
              <div className="form-header">
                <h3 id="saleTypeTitle">Select Products to Sell</h3>
                <div className="header-actions">
                  <div className="search-box">
                    <input type="text" id="productSearch" placeholder="Search products..." onKeyUp={() => window.filterProducts()} />
                    <SearchIcon />
                  </div>
                  <div className="filter-actions">
                    <select id="brandFilter" onChange={() => window.filterProducts()}>
                      <option value="all">All Brands</option>
                      <option value="Dangote">Dangote</option>
                      <option value="Lafarge">Lafarge</option>
                      <option value="Steel Works">Steel Works</option>
                      <option value="Dulux">Dulux</option>
                      <option value="Berger">Berger</option>
                      <option value="Premium Sand">Premium Sand</option>
                      <option value="Hardware Pro">Hardware Pro</option>
                      <option value="AquaFlow">AquaFlow</option>
                    </select>
                  </div>
                  <div className="cart-info">
                    <span className="cart-count" id="cartCount">0</span>
                    <button className="mark-sold-btn" onClick={() => window.openCartModal()} id="markSoldBtn" disabled>
                      <ShoppingCartIcon />
                      <span id="markSoldText">Mark as Sold</span>
                    </button>
                    <button className="btn-secondary" onClick={() => window.showInvoiceModalDirectly()} title="Generate Invoice from Recent Sale">
                      <ReceiptLongIcon />
                      <span>Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-content">
                <div className="products-table-container">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Unit</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Sales Qty</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody id="productsTableBody">
                      {/* Products will be loaded here */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="sale-details-section" id="saleDetailsSection" style={{display: 'none'}}>
            <div className="form-card">
              <div className="form-header">
                <h3>Sale Details</h3>
                <button className="btn-close" onClick={() => window.closeSaleDetailsForm()}>
                  <CloseIcon />
                </button>
              </div>
              <div className="sale-details-content">
                <div className="details-section">
                  <h4>Sale Information</h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>Sale ID:</label>
                      <span id="detailsSaleId">-</span>
                    </div>
                    <div className="detail-item">
                      <label>Date:</label>
                      <span id="detailsSaleDate">-</span>
                    </div>
                    <div className="detail-item">
                      <label>Time:</label>
                      <span id="detailsSaleTime">-</span>
                    </div>
                    <div className="detail-item">
                      <label>Customer:</label>
                      <span id="detailsCustomer">-</span>
                    </div>
                    <div className="detail-item">
                      <label>Cashier:</label>
                      <span id="detailsCashier">-</span>
                    </div>
                    <div className="detail-item">
                      <label>Payment Method:</label>
                      <span id="detailsPaymentMethod">-</span>
                    </div>
                    <div className="detail-item">
                      <label>Subtotal:</label>
                      <span id="detailsSubtotal">-</span>
                    </div>
                    <div className="detail-item">
                      <label>Discount:</label>
                      <span id="detailsDiscount">-</span>
                    </div>
                    <div className="detail-item">
                      <label>Total Amount:</label>
                      <span id="detailsTotalAmount">-</span>
                    </div>
                    <div className="detail-item">
                      <label>Status:</label>
                      <span id="detailsStatus">-</span>
                    </div>
                  </div>
                </div>
                <div className="details-section">
                  <h4>Items Sold</h4>
                  <div className="items-table-container">
                    <table className="items-table" id="detailsItemsTable">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody id="detailsItemsTableBody">
                        {/* Items will be loaded here */}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="details-section">
                  <h4>Sale Summary</h4>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <label>Total Items:</label>
                      <span id="detailsTotalItems">-</span>
                    </div>
                    <div className="summary-item">
                      <label>Total Quantity:</label>
                      <span id="detailsTotalQuantity">-</span>
                    </div>
                    <div className="summary-item">
                      <label>Discount Applied:</label>
                      <span id="detailsDiscountApplied">-</span>
                    </div>
                    <div className="summary-item">
                      <label>Final Total:</label>
                      <span id="detailsFinalTotal">-</span>
                    </div>
                  </div>
                </div>
                <div className="details-actions">
                  <button type="button" className="btn-secondary" onClick={() => window.closeSaleDetailsForm()}>Close</button>
                  <button type="button" className="btn-primary" onClick={() => window.printReceiptFromDetails()}>Print Receipt</button>
                  <button type="button" className="btn-primary" onClick={() => window.showReceiptFromDetails()}>View Receipt</button>
                </div>
              </div>
            </div>
          </div>

          <div className="return-details-section" id="returnDetailsSection" style={{display: 'none'}}>
            <div className="form-card">
              <div className="form-header">
                <h3>Return Details</h3>
                <button className="btn-close" onClick={() => window.closeReturnDetailsForm()}>
                  <CloseIcon />
                </button>
              </div>
              <div className="return-details-content">
                <div className="details-section">
                  <h4>Return Information</h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>Return ID:</label>
                      <span id="detailsReturnId">-</span>
                    </div>
                    <div className="detail-item">
                      <label>Original Sale ID:</label>
                      <span id="detailsOriginalSaleId">-</span>
                    </div>
                    <div className="detail-item">
                      <label>Return Date:</label>
                      <span id="detailsReturnDate">-</span>
                    </div>
                    <div className="detail-item">
                      <label>Return Time:</label>
                      <span id="detailsReturnTime">-</span>
                    </div>
                    <div className="detail-item">
                      <label>Processed By:</label>
                      <span id="detailsProcessedBy">-</span>
                    </div>
                    <div className="detail-item">
                      <label>Refund Method:</label>
                      <span id="detailsRefundMethod">-</span>
                    </div>
                    <div className="detail-item">
                      <label>Refund Amount:</label>
                      <span id="detailsRefundAmount">-</span>
                    </div>
                    <div className="detail-item">
                      <label>Status:</label>
                      <span id="detailsReturnStatus">-</span>
                    </div>
                  </div>
                </div>
                <div className="details-section">
                  <h4>Return Reason</h4>
                  <div className="reason-display">
                    <span id="detailsReturnReason">-</span>
                  </div>
                </div>
                <div className="details-section">
                  <h4>Items Returned</h4>
                  <div className="items-table-container">
                    <table className="items-table" id="detailsReturnItemsTable">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody id="detailsReturnItemsTableBody">
                        {/* Items will be loaded here */}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="details-section">
                  <h4>Return Summary</h4>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <label>Total Items:</label>
                      <span id="detailsReturnTotalItems">-</span>
                    </div>
                    <div className="summary-item">
                      <label>Total Quantity:</label>
                      <span id="detailsReturnTotalQuantity">-</span>
                    </div>
                    <div className="summary-item">
                      <label>Refund Amount:</label>
                      <span id="detailsReturnRefundTotal">-</span>
                    </div>
                    <div className="summary-item">
                      <label>Processing Status:</label>
                      <span id="detailsReturnProcessingStatus">-</span>
                    </div>
                  </div>
                </div>
                <div className="details-actions">
                  <button type="button" className="btn-secondary" onClick={() => window.closeReturnDetailsForm()}>Close</button>
                  <button type="button" className="btn-primary" onClick={() => window.printReturnReceiptFromDetails()}>Print Return Receipt</button>
                </div>
              </div>
            </div>
          </div>

          <div id="addReturnModal" className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Add Return</h3>
                <button className="modal-close" onClick={() => window.closeAddReturnModal()}>
                  <CloseIcon />
                </button>
              </div>
              <div className="modal-body">
                <form id="addReturnForm">
                  <div className="form-group">
                    <label htmlFor="returnDate">Return Date:</label>
                    <input type="date" id="returnDate" required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="saleIdInput">Sale ID:</label>
                      <input type="text" id="saleIdInput" placeholder="Enter Sale ID" onChange={() => window.loadSaleDetails()} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="productIdInput">Product ID:</label>
                      <input type="text" id="productIdInput" placeholder="Enter Product ID" onChange={() => window.loadProductDetails()} />
                    </div>
                  </div>
                  <div className="form-group" id="saleDetailsSection" style={{display: 'none'}}>
                    <label>Sale Details:</label>
                    <div className="sale-details-card" id="saleDetailsCard">
                      {/* Sale details will be loaded here */}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="returnReason">Return Reason:</label>
                    <select id="returnReason" required>
                      <option value="">Select Reason</option>
                      <option value="defective">Defective Product</option>
                      <option value="wrong-size">Wrong Size</option>
                      <option value="not-satisfied">Not Satisfied</option>
                      <option value="damaged">Damaged in Transit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="returnQuantity">Return Quantity:</label>
                    <input type="number" id="returnQuantity" placeholder="Enter quantity" min="1" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="returnNotes">Notes:</label>
                    <textarea id="returnNotes" rows="3" placeholder="Additional notes about the return"></textarea>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={() => window.closeAddReturnModal()}>Cancel</button>
                    <button type="button" className="btn-primary" onClick={() => window.processAddReturn()}>Add Return</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="modal" id="receiptModal">
            <div className="modal-content large">
              <div className="modal-header">
                <h3>Sales Receipt</h3>
                <div className="modal-actions">
                  <button className="btn-secondary" onClick={() => window.printReceipt()}>
                    <PrintIcon />
                    Print
                  </button>
                  <button className="btn-secondary" onClick={() => window.downloadReceipt()}>
                    <DownloadIcon />
                    Download PDF
                  </button>
                  <button className="btn-primary" onClick={() => window.generateInvoice()}>
                    <ReceiptLongIcon />
                    Generate Invoice
                  </button>
                  <button className="btn-secondary" onClick={() => window.shareInvoice()}>
                    <ShareIcon />
                    Share
                  </button>
                  <button className="modal-close" onClick={() => window.closeReceiptModal()}>
                    <CloseIcon />
                  </button>
                </div>
              </div>
              <div className="modal-body">
                <div className="receipt" id="receiptContent">
                  {/* Receipt content will be generated here */}
                </div>
              </div>
            </div>
          </div>

          <div className="modal" id="invoiceModal">
            <div className="modal-content large">
              <div className="modal-header">
                <h3>Invoice Generator</h3>
                <div className="modal-actions">
                  <button className="btn-secondary" onClick={() => window.printInvoice()}>
                    <PrintIcon />
                    Print Invoice
                  </button>
                  <button className="btn-secondary" onClick={() => window.downloadInvoice()}>
                    <DownloadIcon />
                    Download PDF
                  </button>
                  <button className="btn-primary" onClick={() => window.shareInvoiceLink()}>
                    <ShareIcon />
                    Share Invoice
                  </button>
                  <button className="btn-secondary" onClick={() => window.emailInvoice()}>
                    <EmailIcon />
                    Email Invoice
                  </button>
                  <button className="modal-close" onClick={() => window.closeInvoiceModal()}>
                    <CloseIcon />
                  </button>
                </div>
              </div>
              <div className="modal-body">
                <div className="invoice-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="invoiceNumber">Invoice Number:</label>
                      <input type="text" id="invoiceNumber" readOnly />
                    </div>
                    <div className="form-group">
                      <label htmlFor="invoiceDate">Invoice Date:</label>
                      <input type="date" id="invoiceDate" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="dueDate">Due Date:</label>
                      <input type="date" id="dueDate" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="paymentTerms">Payment Terms:</label>
                      <select id="paymentTerms">
                        <option value="net15">Net 15</option>
                        <option value="net30" selected>Net 30</option>
                        <option value="net45">Net 45</option>
                        <option value="net60">Net 60</option>
                        <option value="due_on_receipt">Due on Receipt</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="customerEmail">Customer Email (for sharing):</label>
                    <input type="email" id="customerEmail" placeholder="customer@example.com" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="invoiceNotes">Notes:</label>
                    <textarea id="invoiceNotes" rows="3" placeholder="Additional notes for the invoice"></textarea>
                  </div>
                </div>
                <div className="invoice-preview" id="invoicePreview">
                  {/* Invoice preview will be generated here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sales;
