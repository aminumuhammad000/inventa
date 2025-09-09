// Sales Management Module
console.log('Sales module loaded');

// Global variables
let salesData = [];
let customers = [];
let inventoryData = [];
let returnsData = [];

// Initialize sales page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing sales...');
    
    // Check authentication
    checkAuthentication();
    
    // Initialize sidebar
    initializeSidebar();
    
    // Initialize sales data
    initializeSales();
    
    // Set default date
    document.getElementById('saleDate').value = new Date().toISOString().split('T')[0];
});

// Check authentication
function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = localStorage.getItem('currentUser');
    
    if (!isLoggedIn || !currentUser) {
        console.log('User not authenticated, redirecting to login...');
        window.location.href = 'login.html';
        return;
    }
    
    console.log('User authenticated:', currentUser);
    updateUserInfo(currentUser);
}

// Update user info in header
function updateUserInfo(email) {
    const userAvatar = document.querySelector('.user-avatar');
    const userName = document.querySelector('.user-name');
    
    if (userAvatar && userName) {
        const initials = email.split('@')[0].substring(0, 2).toUpperCase();
        userAvatar.textContent = initials;
        userName.textContent = email.split('@')[0];
    }
}

// Initialize sidebar functionality
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('sidebar-collapsed');
    }
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleSidebar);
    }
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('sidebar-collapsed');
    
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
}

// Initialize sales data
async function initializeSales() {
    try {
        // Load sales data
        await loadSalesData();
        
        // Load customers
        await loadCustomers();
        
        // Load inventory
        await loadInventoryData();
        
        // Load returns data
        await loadReturnsData();
        
        // Render sales table
        renderSalesTable();
        
        // Render returns table
        renderReturnsTable();
        
        // Update stats
        updateSalesStats();
        
        // Populate dropdowns
        populateDropdowns();
        
    } catch (error) {
        console.error('Error initializing sales:', error);
        showToast('Failed to load sales data', 'error');
    }
}

// Load sales data from localStorage
async function loadSalesData() {
    try {
        const savedData = localStorage.getItem('salesData');
        if (savedData) {
            salesData = JSON.parse(savedData);
        } else {
            salesData = getSampleSalesData();
            localStorage.setItem('salesData', JSON.stringify(salesData));
        }
        console.log('Loaded sales data:', salesData.length, 'sales');
        
    } catch (error) {
        console.error('Error loading sales data:', error);
        salesData = getSampleSalesData();
    }
}

// Load customers from localStorage
async function loadCustomers() {
    try {
        const savedData = localStorage.getItem('customersData');
        if (savedData) {
            customers = JSON.parse(savedData);
        } else {
            customers = getSampleCustomers();
            localStorage.setItem('customersData', JSON.stringify(customers));
        }
        console.log('Loaded customers:', customers.length);
        
    } catch (error) {
        console.error('Error loading customers:', error);
        customers = getSampleCustomers();
    }
}

// Load inventory data from localStorage
async function loadInventoryData() {
    try {
        const savedData = localStorage.getItem('inventoryData');
        if (savedData) {
            inventoryData = JSON.parse(savedData);
        } else {
            inventoryData = getSampleInventoryData();
            localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
        }
        console.log('Loaded inventory data:', inventoryData.length, 'items');
        
    } catch (error) {
        console.error('Error loading inventory data:', error);
        inventoryData = getSampleInventoryData();
    }
}

// Load returns data
async function loadReturnsData() {
    try {
        const savedData = localStorage.getItem('returnsData');
        if (savedData) {
            returnsData = JSON.parse(savedData);
        } else {
            returnsData = getSampleReturnsData();
            localStorage.setItem('returnsData', JSON.stringify(returnsData));
        }
        console.log('Loaded returns data:', returnsData.length, 'returns');
        
    } catch (error) {
        console.error('Error loading returns data:', error);
        returnsData = getSampleReturnsData();
    }
}

// Render sales table
function renderSalesTable() {
    const tbody = document.getElementById('salesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    salesData.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${sale.id}</td>
            <td>${sale.date}</td>
            <td>${sale.customer || 'Walk-in Customer'}</td>
            <td>${sale.items.length} items</td>
            <td>₦${parseFloat(sale.totalAmount).toFixed(2)}</td>
            <td>
                <span class="payment-method ${sale.paymentMethod}">${sale.paymentMethod}</span>
            </td>
            <td>
                <span class="status-badge ${sale.status}">${sale.status}</span>
            </td>
            <td>
                <button class="btn-icon" onclick="viewSaleDetails(${sale.id})" title="View Details">
                    <i class="material-icons-round">visibility</i>
                </button>
                <button class="btn-icon" onclick="showReceipt(salesData.find(s => s.id == ${sale.id}))" title="View Receipt">
                    <i class="material-icons-round">receipt</i>
                </button>
                <button class="btn-icon" onclick="printReceipt(${sale.id})" title="Print Receipt">
                    <i class="material-icons-round">print</i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update sales stats
function updateSalesStats() {
    const today = new Date().toISOString().split('T')[0];
    const todaySales = salesData.filter(sale => sale.date === today);
    
    const totalSales = todaySales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount), 0);
    const totalTransactions = todaySales.length;
    const averageSale = totalTransactions > 0 ? totalSales / totalTransactions : 0;
    const totalItemsSold = todaySales.reduce((sum, sale) => {
        return sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);
    
    document.getElementById('todaySales').textContent = `₦${totalSales.toFixed(2)}`;
    document.getElementById('todayTransactions').textContent = totalTransactions;
    document.getElementById('averageSale').textContent = `₦${averageSale.toFixed(2)}`;
    document.getElementById('itemsSold').textContent = totalItemsSold;
}

// Populate dropdowns
function populateDropdowns() {
    // Populate customer dropdown
    const customerSelect = document.getElementById('customer');
    if (customerSelect) {
        customerSelect.innerHTML = '<option value="">Walk-in Customer</option>';
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = customer.name;
            customerSelect.appendChild(option);
        });
    }
    
    // Populate item dropdowns
    const itemSelects = document.querySelectorAll('.item-select');
    itemSelects.forEach(select => {
        select.innerHTML = '<option value="">Select Item</option>';
        inventoryData.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.name} (₦${parseFloat(item.selling_price).toFixed(2)})`;
            option.dataset.price = item.selling_price;
            select.appendChild(option);
        });
    });
}

// Modal functions
function openRecordSaleModal() {
    document.getElementById('recordSaleModal').classList.add('show');
    populateDropdowns();
    updateSaleSummary();
}

function openReturnModal() {
    document.getElementById('returnModal').classList.add('show');
    populateDropdowns();
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Add item row for sale
function addItemRow() {
    const container = document.getElementById('saleItems');
    const newRow = document.createElement('div');
    newRow.className = 'item-row';
    newRow.innerHTML = `
        <select class="item-select" required onchange="updateItemPrice(this)">
            <option value="">Select Item</option>
        </select>
        <input type="number" class="quantity-input" placeholder="Quantity" min="1" required onchange="updateSaleSummary()">
        <input type="number" class="price-input" placeholder="Unit Price" step="0.01" min="0" required onchange="updateSaleSummary()">
        <button type="button" class="btn-remove" onclick="removeItemRow(this)">
            <i class="material-icons-round">remove</i>
        </button>
    `;
    container.appendChild(newRow);
    populateDropdowns();
}

// Add item row for return
function addReturnItemRow() {
    const container = document.getElementById('returnItems');
    const newRow = document.createElement('div');
    newRow.className = 'item-row';
    newRow.innerHTML = `
        <select class="item-select" required>
            <option value="">Select Item</option>
        </select>
        <input type="number" class="quantity-input" placeholder="Return Qty" min="1" required onchange="updateReturnSummary()">
        <input type="number" class="price-input" placeholder="Unit Price" step="0.01" min="0" required onchange="updateReturnSummary()">
        <button type="button" class="btn-remove" onclick="removeItemRow(this)">
            <i class="material-icons-round">remove</i>
        </button>
    `;
    container.appendChild(newRow);
    populateDropdowns();
}

// Remove item row
function removeItemRow(button) {
    button.parentElement.remove();
    updateSaleSummary();
}

// Update item price when item is selected
function updateItemPrice(select) {
    const priceInput = select.parentElement.querySelector('.price-input');
    const selectedOption = select.options[select.selectedIndex];
    if (selectedOption.dataset.price) {
        priceInput.value = selectedOption.dataset.price;
        updateSaleSummary();
    }
}

// Update sale summary
function updateSaleSummary() {
    const itemRows = document.querySelectorAll('#saleItems .item-row');
    let subtotal = 0;
    
    itemRows.forEach(row => {
        const quantity = parseFloat(row.querySelector('.quantity-input').value) || 0;
        const price = parseFloat(row.querySelector('.price-input').value) || 0;
        subtotal += quantity * price;
    });
    
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;
    
    document.getElementById('subtotal').textContent = `₦${subtotal.toFixed(2)}`;
    document.getElementById('discountAmount').textContent = `₦${discountAmount.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `₦${total.toFixed(2)}`;
}

// Update return summary
function updateReturnSummary() {
    const itemRows = document.querySelectorAll('#returnItems .item-row');
    let refundAmount = 0;
    
    itemRows.forEach(row => {
        const quantity = parseFloat(row.querySelector('.quantity-input').value) || 0;
        const price = parseFloat(row.querySelector('.price-input').value) || 0;
        refundAmount += quantity * price;
    });
    
    document.getElementById('refundAmount').textContent = `₦${refundAmount.toFixed(2)}`;
}

// Save sale
async function saveSale() {
    try {
        const saleDate = document.getElementById('saleDate').value;
        const customerId = document.getElementById('customer').value;
        const paymentMethod = document.getElementById('paymentMethod').value;
        const discount = parseFloat(document.getElementById('discount').value) || 0;
        const notes = document.getElementById('notes').value;
        
        if (!saleDate) {
            showToast('Please select a sale date', 'error');
            return;
        }
        
        // Get sale items
        const itemRows = document.querySelectorAll('#saleItems .item-row');
        const saleItems = [];
        let subtotal = 0;
        
        for (let row of itemRows) {
            const itemSelect = row.querySelector('.item-select');
            const quantityInput = row.querySelector('.quantity-input');
            const priceInput = row.querySelector('.price-input');
            
            if (itemSelect.value && quantityInput.value && priceInput.value) {
                const quantity = parseInt(quantityInput.value);
                const unitPrice = parseFloat(priceInput.value);
                const totalPrice = quantity * unitPrice;
                
                saleItems.push({
                    itemId: itemSelect.value,
                    quantity: quantity,
                    unitPrice: unitPrice,
                    totalPrice: totalPrice
                });
                
                subtotal += totalPrice;
            }
        }
        
        if (saleItems.length === 0) {
            showToast('Please add at least one item', 'error');
            return;
        }
        
        const discountAmount = (subtotal * discount) / 100;
        const totalAmount = subtotal - discountAmount;
        
        // Create sale object
        const sale = {
            id: Date.now(),
            date: saleDate,
            customer: customerId ? customers.find(c => c.id == customerId)?.name : 'Walk-in Customer',
            items: saleItems,
            subtotal: subtotal,
            discount: discountAmount,
            totalAmount: totalAmount,
            paymentMethod: paymentMethod,
            status: 'completed',
            notes: notes,
            createdAt: new Date().toISOString()
        };
        
        // Save sale
        salesData.unshift(sale);
        localStorage.setItem('salesData', JSON.stringify(salesData));
        
        // Update inventory stock
        for (let item of saleItems) {
            const itemIndex = inventoryData.findIndex(i => i.id == item.itemId);
            if (itemIndex !== -1) {
                inventoryData[itemIndex].current_stock -= item.quantity;
            }
        }
        localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
        
        showToast('Sale recorded successfully!', 'success');
        closeModal('recordSaleModal');
        
        // Reload data
        await loadSalesData();
        renderSalesTable();
        updateSalesStats();
        
    } catch (error) {
        console.error('Error saving sale:', error);
        showToast('Failed to record sale', 'error');
    }
}

// Process return
async function processReturn() {
    try {
        const saleId = document.getElementById('returnSaleId').value;
        const reason = document.getElementById('returnReason').value;
        
        if (!saleId || !reason) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Find original sale
        const originalSale = salesData.find(s => s.id == saleId);
        if (!originalSale) {
            showToast('Sale not found', 'error');
            return;
        }
        
        // Get return items
        const itemRows = document.querySelectorAll('#returnItems .item-row');
        const returnItems = [];
        let refundAmount = 0;
        
        for (let row of itemRows) {
            const itemSelect = row.querySelector('.item-select');
            const quantityInput = row.querySelector('.quantity-input');
            const priceInput = row.querySelector('.price-input');
            
            if (itemSelect.value && quantityInput.value && priceInput.value) {
                const quantity = parseInt(quantityInput.value);
                const unitPrice = parseFloat(priceInput.value);
                const totalPrice = quantity * unitPrice;
                
                returnItems.push({
                    itemId: itemSelect.value,
                    quantity: quantity,
                    unitPrice: unitPrice,
                    totalPrice: totalPrice
                });
                
                refundAmount += totalPrice;
            }
        }
        
        if (returnItems.length === 0) {
            showToast('Please add at least one return item', 'error');
            return;
        }
        
        // Create return record
        const returnRecord = {
            id: Date.now(),
            originalSaleId: saleId,
            date: new Date().toISOString().split('T')[0],
            items: returnItems,
            refundAmount: refundAmount,
            reason: reason,
            status: 'processed',
            createdAt: new Date().toISOString()
        };
        
        // Save return record
        returnsData.unshift(returnRecord);
        localStorage.setItem('returnsData', JSON.stringify(returnsData));
        
        // Update inventory stock (add back returned items)
        for (let item of returnItems) {
            const itemIndex = inventoryData.findIndex(i => i.id == item.itemId);
            if (itemIndex !== -1) {
                inventoryData[itemIndex].current_stock += item.quantity;
            }
        }
        localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
        
        showToast('Return processed successfully!', 'success');
        closeModal('returnModal');
        
        // Reload data
        await loadInventoryData();
        await loadReturnsData();
        renderReturnsTable();
        
    } catch (error) {
        console.error('Error processing return:', error);
        showToast('Failed to process return', 'error');
    }
}

// Export sales
async function exportSales() {
    try {
        const csvContent = generateSalesCSV();
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sales_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        showToast('Sales exported successfully!', 'success');
        
    } catch (error) {
        console.error('Error exporting sales:', error);
        showToast('Failed to export sales', 'error');
    }
}

// Generate CSV content
function generateSalesCSV() {
    const headers = ['Sale ID', 'Date', 'Customer', 'Items Count', 'Total Amount', 'Payment Method', 'Status'];
    const rows = salesData.map(sale => [
        sale.id,
        sale.date,
        sale.customer,
        sale.items.length,
        parseFloat(sale.totalAmount).toFixed(2),
        sale.paymentMethod,
        sale.status
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

// Filter sales
function filterSales() {
    const dateRange = document.getElementById('dateRangeFilter').value;
    const paymentMethod = document.getElementById('paymentFilter').value;
    
    let filteredData = [...salesData];
    
    // Filter by date range
    if (dateRange !== 'custom') {
        const today = new Date();
        let startDate;
        
        switch (dateRange) {
            case 'today':
                startDate = new Date(today);
                break;
            case 'week':
                startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
        }
        
        if (startDate) {
            filteredData = filteredData.filter(sale => new Date(sale.date) >= startDate);
        }
    }
    
    // Filter by payment method
    if (paymentMethod) {
        filteredData = filteredData.filter(sale => sale.paymentMethod === paymentMethod);
    }
    
    renderFilteredSalesTable(filteredData);
}

// Search sales
function searchSales() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        renderSalesTable();
        return;
    }
    
    const filteredData = salesData.filter(sale =>
        sale.id.toString().includes(searchTerm) ||
        sale.customer.toLowerCase().includes(searchTerm) ||
        sale.paymentMethod.toLowerCase().includes(searchTerm)
    );
    
    renderFilteredSalesTable(filteredData);
}

// Render filtered sales table
function renderFilteredSalesTable(data) {
    const tbody = document.getElementById('salesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${sale.id}</td>
            <td>${sale.date}</td>
            <td>${sale.customer || 'Walk-in Customer'}</td>
            <td>${sale.items.length} items</td>
            <td>₦${parseFloat(sale.totalAmount).toFixed(2)}</td>
            <td>
                <span class="payment-method ${sale.paymentMethod}">${sale.paymentMethod}</span>
            </td>
            <td>
                <span class="status-badge ${sale.status}">${sale.status}</span>
            </td>
            <td>
                <button class="btn-icon" onclick="viewSaleDetails(${sale.id})" title="View Details">
                    <i class="material-icons-round">visibility</i>
                </button>
                <button class="btn-icon" onclick="showReceipt(salesData.find(s => s.id == ${sale.id}))" title="View Receipt">
                    <i class="material-icons-round">receipt</i>
                </button>
                <button class="btn-icon" onclick="printReceipt(${sale.id})" title="Print Receipt">
                    <i class="material-icons-round">print</i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render returns table
function renderReturnsTable() {
    const tbody = document.getElementById('returnsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    returnsData.forEach(returnRecord => {
        const originalSale = salesData.find(s => s.id == returnRecord.originalSaleId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${returnRecord.id}</td>
            <td>#${returnRecord.originalSaleId}</td>
            <td>${returnRecord.date}</td>
            <td>${returnRecord.items.length} items</td>
            <td>₦${parseFloat(returnRecord.refundAmount).toFixed(2)}</td>
            <td>${returnRecord.reason}</td>
            <td>
                <span class="status-badge ${returnRecord.status}">${returnRecord.status}</span>
            </td>
            <td>
                <button class="btn-icon" onclick="viewReturnDetails(${returnRecord.id})" title="View Details">
                    <i class="material-icons-round">visibility</i>
                </button>
                <button class="btn-icon" onclick="printReturnReceipt(${returnRecord.id})" title="Print Return Receipt">
                    <i class="material-icons-round">print</i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Search returns
function searchReturns() {
    const searchTerm = document.getElementById('returnSearchInput').value.toLowerCase();
    
    if (!searchTerm) {
        renderReturnsTable();
        return;
    }
    
    const filteredData = returnsData.filter(returnRecord =>
        returnRecord.id.toString().includes(searchTerm) ||
        returnRecord.originalSaleId.toString().includes(searchTerm) ||
        returnRecord.reason.toLowerCase().includes(searchTerm)
    );
    
    renderFilteredReturnsTable(filteredData);
}

// Filter returns
function filterReturns() {
    const dateRange = document.getElementById('returnDateFilter').value;
    
    let filteredData = [...returnsData];
    
    // Filter by date range
    if (dateRange !== 'all') {
        const today = new Date();
        let startDate;
        
        switch (dateRange) {
            case 'today':
                startDate = new Date(today);
                break;
            case 'week':
                startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
        }
        
        if (startDate) {
            filteredData = filteredData.filter(returnRecord => new Date(returnRecord.date) >= startDate);
        }
    }
    
    renderFilteredReturnsTable(filteredData);
}

// Render filtered returns table
function renderFilteredReturnsTable(data) {
    const tbody = document.getElementById('returnsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.forEach(returnRecord => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${returnRecord.id}</td>
            <td>#${returnRecord.originalSaleId}</td>
            <td>${returnRecord.date}</td>
            <td>${returnRecord.items.length} items</td>
            <td>₦${parseFloat(returnRecord.refundAmount).toFixed(2)}</td>
            <td>${returnRecord.reason}</td>
            <td>
                <span class="status-badge ${returnRecord.status}">${returnRecord.status}</span>
            </td>
            <td>
                <button class="btn-icon" onclick="viewReturnDetails(${returnRecord.id})" title="View Details">
                    <i class="material-icons-round">visibility</i>
                </button>
                <button class="btn-icon" onclick="printReturnReceipt(${returnRecord.id})" title="Print Return Receipt">
                    <i class="material-icons-round">print</i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// View return details
function viewReturnDetails(returnId) {
    showToast('Return details functionality coming soon!', 'info');
}

// Print return receipt
function printReturnReceipt(returnId) {
    showToast('Return receipt printing coming soon!', 'info');
}

// View sale details (placeholder)
function viewSaleDetails(saleId) {
    showToast('Sale details functionality coming soon!', 'info');
}

// Receipt generation functions
function generateReceipt(saleData) {
    const shopInfo = JSON.parse(localStorage.getItem('shopSettings') || '{}');
    const currentUser = localStorage.getItem('currentUser') || 'Cashier';
    
    const receiptHTML = `
        <div class="receipt-header">
            <div class="shop-logo">
                ${shopInfo.logo ? `<img src="${shopInfo.logo}" alt="Shop Logo" style="max-width: 80px; max-height: 80px;">` : '<div class="logo-placeholder">🏗️</div>'}
            </div>
            <div class="shop-info">
                <h2>${shopInfo.shopName || 'ABC Construction Supplies'}</h2>
                <p>${shopInfo.address || '123 Construction Street, Lagos'}</p>
                <p>Phone: ${shopInfo.phone || '+234-800-000-0000'}</p>
                <p>Email: ${shopInfo.email || 'info@shop.com'}</p>
            </div>
        </div>
        
        <div class="receipt-details">
            <div class="receipt-info">
                <div class="info-row">
                    <span class="label">Receipt No:</span>
                    <span class="value">#${saleData.id}</span>
                </div>
                <div class="info-row">
                    <span class="label">Date:</span>
                    <span class="value">${new Date(saleData.date).toLocaleDateString()}</span>
                </div>
                <div class="info-row">
                    <span class="label">Time:</span>
                    <span class="value">${new Date(saleData.createdAt).toLocaleTimeString()}</span>
                </div>
                <div class="info-row">
                    <span class="label">Cashier:</span>
                    <span class="value">${currentUser.split('@')[0]}</span>
                </div>
                <div class="info-row">
                    <span class="label">Payment Method:</span>
                    <span class="value">${saleData.paymentMethod}</span>
                </div>
            </div>
        </div>
        
        <div class="receipt-items">
            <h3>Items Purchased</h3>
            <table class="receipt-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${saleData.items.map(item => {
                        const inventoryItem = inventoryData.find(i => i.id == item.itemId);
                        return `
                            <tr>
                                <td>${inventoryItem ? inventoryItem.name : 'Unknown Item'}</td>
                                <td>${item.quantity}</td>
                                <td>₦${parseFloat(item.unitPrice).toLocaleString()}</td>
                                <td>₦${parseFloat(item.totalPrice).toLocaleString()}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="receipt-summary">
            <div class="summary-row">
                <span class="label">Subtotal:</span>
                <span class="value">₦${parseFloat(saleData.subtotal).toLocaleString()}</span>
            </div>
            ${saleData.discount > 0 ? `
                <div class="summary-row">
                    <span class="label">Discount:</span>
                    <span class="value">-₦${parseFloat(saleData.discount).toLocaleString()}</span>
                </div>
            ` : ''}
            <div class="summary-row total">
                <span class="label">Total:</span>
                <span class="value">₦${parseFloat(saleData.totalAmount).toLocaleString()}</span>
            </div>
        </div>
        
        <div class="receipt-footer">
            <p>Thank you for your business!</p>
            <p>Visit us again soon</p>
            <div class="receipt-qr">
                <div class="qr-placeholder">QR Code</div>
                <p>Scan for digital receipt</p>
            </div>
        </div>
    `;
    
    return receiptHTML;
}

function showReceipt(saleData) {
    const receiptContent = document.getElementById('receiptContent');
    receiptContent.innerHTML = generateReceipt(saleData);
    document.getElementById('receiptModal').style.display = 'flex';
}

function closeReceiptModal() {
    document.getElementById('receiptModal').style.display = 'none';
}

function printReceipt(saleId) {
    const saleData = salesData.find(s => s.id == saleId);
    if (!saleData) {
        showToast('Sale not found', 'error');
        return;
    }
    
    const receiptContent = generateReceipt(saleData);
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Receipt</title>
            <style>
                body {
                    font-family: 'Courier New', monospace;
                    margin: 0;
                    padding: 20px;
                    background: white;
                }
                .receipt-header {
                    text-align: center;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #000;
                    padding-bottom: 20px;
                }
                .shop-logo img {
                    max-width: 80px;
                    max-height: 80px;
                }
                .logo-placeholder {
                    font-size: 40px;
                    margin-bottom: 10px;
                }
                .shop-info h2 {
                    margin: 10px 0;
                    font-size: 18px;
                }
                .shop-info p {
                    margin: 2px 0;
                    font-size: 12px;
                }
                .receipt-details {
                    margin-bottom: 20px;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                    font-size: 12px;
                }
                .receipt-items h3 {
                    margin-bottom: 10px;
                    font-size: 14px;
                }
                .receipt-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                .receipt-table th,
                .receipt-table td {
                    border: 1px solid #000;
                    padding: 5px;
                    text-align: left;
                    font-size: 11px;
                }
                .receipt-table th {
                    background: #f0f0f0;
                }
                .receipt-summary {
                    border-top: 2px solid #000;
                    padding-top: 10px;
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                    font-size: 12px;
                }
                .summary-row.total {
                    font-weight: bold;
                    font-size: 14px;
                    border-top: 1px solid #000;
                    padding-top: 5px;
                    margin-top: 10px;
                }
                .receipt-footer {
                    text-align: center;
                    margin-top: 20px;
                    border-top: 1px solid #000;
                    padding-top: 20px;
                }
                .receipt-footer p {
                    margin: 5px 0;
                    font-size: 12px;
                }
                .receipt-qr {
                    margin-top: 15px;
                }
                .qr-placeholder {
                    width: 60px;
                    height: 60px;
                    border: 1px solid #000;
                    margin: 0 auto 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                }
                @media print {
                    body { margin: 0; padding: 10px; }
                }
            </style>
        </head>
        <body>
            ${receiptContent}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

function downloadReceipt() {
    const receiptContent = document.getElementById('receiptContent').innerHTML;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Receipt</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: white;
                }
                .receipt-header {
                    text-align: center;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #10b981;
                    padding-bottom: 20px;
                }
                .shop-logo img {
                    max-width: 80px;
                    max-height: 80px;
                }
                .logo-placeholder {
                    font-size: 40px;
                    margin-bottom: 10px;
                }
                .shop-info h2 {
                    margin: 10px 0;
                    font-size: 18px;
                    color: #2d3748;
                }
                .shop-info p {
                    margin: 2px 0;
                    font-size: 12px;
                    color: #6b7280;
                }
                .receipt-details {
                    margin-bottom: 20px;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                    font-size: 12px;
                }
                .receipt-items h3 {
                    margin-bottom: 10px;
                    font-size: 14px;
                    color: #2d3748;
                }
                .receipt-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                .receipt-table th,
                .receipt-table td {
                    border: 1px solid #e2e8f0;
                    padding: 8px;
                    text-align: left;
                    font-size: 11px;
                }
                .receipt-table th {
                    background: #f7fafc;
                    color: #2d3748;
                    font-weight: 600;
                }
                .receipt-summary {
                    border-top: 2px solid #10b981;
                    padding-top: 10px;
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                    font-size: 12px;
                }
                .summary-row.total {
                    font-weight: bold;
                    font-size: 14px;
                    border-top: 1px solid #e2e8f0;
                    padding-top: 5px;
                    margin-top: 10px;
                    color: #10b981;
                }
                .receipt-footer {
                    text-align: center;
                    margin-top: 20px;
                    border-top: 1px solid #e2e8f0;
                    padding-top: 20px;
                }
                .receipt-footer p {
                    margin: 5px 0;
                    font-size: 12px;
                    color: #6b7280;
                }
                .receipt-qr {
                    margin-top: 15px;
                }
                .qr-placeholder {
                    width: 60px;
                    height: 60px;
                    border: 1px solid #e2e8f0;
                    margin: 0 auto 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    color: #6b7280;
                }
            </style>
        </head>
        <body>
            ${receiptContent}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    // Trigger download
    setTimeout(() => {
        printWindow.document.execCommand('print');
    }, 1000);
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="material-icons-round toast-icon">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}</i>
            <span class="toast-message">${message}</span>
        </div>
    `;
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#38a169' : type === 'error' ? '#e53e3e' : '#3182ce'};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 500;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Sample data functions
function getSampleSalesData() {
    return [
        {
            id: 1001,
            date: new Date().toISOString().split('T')[0],
            customer: 'ABC Construction',
            items: [
                { itemId: 1, quantity: 10, unitPrice: 4000, totalPrice: 40000 },
                { itemId: 2, quantity: 5, unitPrice: 3000, totalPrice: 15000 }
            ],
            subtotal: 55000,
            discount: 0,
            totalAmount: 55000,
            paymentMethod: 'cash',
            status: 'completed',
            notes: '',
            createdAt: new Date().toISOString()
        }
    ];
}

function getSampleCustomers() {
    return [
        { id: 1, name: 'ABC Construction', phone: '+234-800-000-0001', email: 'abc@construction.com' },
        { id: 2, name: 'XYZ Builders', phone: '+234-800-000-0002', email: 'xyz@builders.com' }
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

function getSampleReturnsData() {
    return [
        {
            id: 3001,
            originalSaleId: 1001,
            date: new Date().toISOString().split('T')[0],
            items: [
                { itemId: 1, quantity: 2, unitPrice: 4000, totalPrice: 8000 }
            ],
            refundAmount: 8000,
            reason: 'Damaged goods',
            status: 'processed',
            createdAt: new Date().toISOString()
        }
    ];
}

// User dropdown functions
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    const toggle = document.querySelector('.dropdown-toggle');
    
    if (dropdown && toggle) {
        dropdown.classList.toggle('show');
        toggle.classList.toggle('active');
        
        // Close dropdown when clicking outside
        if (dropdown.classList.contains('show')) {
            document.addEventListener('click', closeDropdownOnClickOutside);
        } else {
            document.removeEventListener('click', closeDropdownOnClickOutside);
        }
    }
}

function closeDropdownOnClickOutside(event) {
    const dropdown = document.getElementById('userDropdown');
    const userInfo = document.querySelector('.user-info');
    
    if (dropdown && userInfo && !userInfo.contains(event.target)) {
        dropdown.classList.remove('show');
        document.querySelector('.dropdown-toggle').classList.remove('active');
        document.removeEventListener('click', closeDropdownOnClickOutside);
    }
}

function openShopSettings() {
    window.location.href = 'shop-settings.html';
}

function openProfileSettings() {
    showToast('Profile Settings - Coming Soon!', 'info');
    closeUserDropdown();
}

function openNotifications() {
    showToast('Notifications - Coming Soon!', 'info');
    closeUserDropdown();
}

function openBackup() {
    showToast('Backup & Restore - Coming Soon!', 'info');
    closeUserDropdown();
}

function openHelp() {
    showToast('Help & Support - Coming Soon!', 'info');
    closeUserDropdown();
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

function closeUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    const toggle = document.querySelector('.dropdown-toggle');
    
    if (dropdown && toggle) {
        dropdown.classList.remove('show');
        toggle.classList.remove('active');
        document.removeEventListener('click', closeDropdownOnClickOutside);
    }
}

// Export functions for global access
window.toggleSidebar = toggleSidebar;
window.openRecordSaleModal = openRecordSaleModal;
window.openReturnModal = openReturnModal;
window.closeModal = closeModal;
window.addItemRow = addItemRow;
window.addReturnItemRow = addReturnItemRow;
window.removeItemRow = removeItemRow;
window.updateItemPrice = updateItemPrice;
window.updateSaleSummary = updateSaleSummary;
window.updateReturnSummary = updateReturnSummary;
window.saveSale = saveSale;
window.processReturn = processReturn;
window.filterSales = filterSales;
window.searchSales = searchSales;
window.exportSales = exportSales;
window.renderReturnsTable = renderReturnsTable;
window.searchReturns = searchReturns;
window.filterReturns = filterReturns;
window.viewReturnDetails = viewReturnDetails;
window.printReturnReceipt = printReturnReceipt;
window.toggleUserDropdown = toggleUserDropdown;
window.openShopSettings = openShopSettings;
window.openProfileSettings = openProfileSettings;
window.openNotifications = openNotifications;
window.openBackup = openBackup;
window.openHelp = openHelp;
window.logout = logout;
window.viewSaleDetails = viewSaleDetails;
window.printReceipt = printReceipt;
window.showReceipt = showReceipt;
window.closeReceiptModal = closeReceiptModal;
window.downloadReceipt = downloadReceipt;
