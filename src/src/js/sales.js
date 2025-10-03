// Sales Management Module
console.log('Sales module loaded');

// Global variables
let salesData = [];
let customers = [];
let inventoryData = [];
let returnsData = [];
let cart = [];
let products = [];
let currentSaleType = 'normal';

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
    window.location.href = '/login';
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
        
        // Update toggle button icon for collapsed state
        const toggleBtn = document.getElementById('sidebarToggle');
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('i');
            icon.textContent = 'menu_open';
            toggleBtn.title = 'Expand Sidebar';
        }
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
    const toggleBtn = document.getElementById('sidebarToggle');
    
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('sidebar-collapsed');
    
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
    
    // Update toggle button icon
    const icon = toggleBtn.querySelector('i');
    if (isCollapsed) {
        icon.textContent = 'menu_open';
        toggleBtn.title = 'Expand Sidebar';
    } else {
        icon.textContent = 'menu';
        toggleBtn.title = 'Collapse Sidebar';
    }
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
        
        // Load products data
        await loadProductsData();
        
        // Render sales table
        renderSalesTable();
        
        // Render returns table
        renderReturnsTable();
        
        // Load products table
        loadProducts();
        
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

// Load products data
async function loadProductsData() {
    try {
        const savedData = localStorage.getItem('products');
        if (savedData) {
            products = JSON.parse(savedData);
        } else {
            products = getSampleProductsData();
            localStorage.setItem('products', JSON.stringify(products));
        }
        console.log('Loaded products data:', products.length, 'products');
        
    } catch (error) {
        console.error('Error loading products data:', error);
        products = getSampleProductsData();
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
// Record Sale form functions
function toggleRecordSaleForm() {
    const formSection = document.getElementById('recordSaleSection');
    if (formSection.style.display === 'none') {
        openRecordSaleForm();
    } else {
        closeRecordSaleForm();
    }
}

function openRecordSaleForm() {
    const formSection = document.getElementById('recordSaleSection');
    formSection.style.display = 'block';
    populateDropdowns();
    updateSaleSummary();
    
    // Scroll to form
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeRecordSaleForm() {
    const formSection = document.getElementById('recordSaleSection');
    formSection.style.display = 'none';
    
    // Reset form
    document.getElementById('recordSaleForm').reset();
    
    // Reset to single item row
    const itemsContainer = document.getElementById('saleItems');
    itemsContainer.innerHTML = `
        <div class="item-row">
            <select class="item-select" required>
                <option value="">Select Item</option>
            </select>
            <input type="number" class="quantity-input" placeholder="Quantity" min="1" required>
            <input type="number" class="price-input" placeholder="Unit Price" step="0.01" min="0" required>
            <button type="button" class="btn-remove" onclick="removeItemRow(this)">
                <i class="material-icons-round">remove</i>
            </button>
        </div>
    `;
    populateDropdowns();
    updateSaleSummary();
}

// Return form functions
function toggleReturnForm() {
    const formSection = document.getElementById('processReturnSection');
    if (formSection.style.display === 'none') {
        openReturnForm();
    } else {
        closeReturnForm();
    }
}

function openReturnForm() {
    const formSection = document.getElementById('processReturnSection');
    formSection.style.display = 'block';
    populateDropdowns();
    
    // Scroll to form
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeReturnForm() {
    const formSection = document.getElementById('processReturnSection');
    formSection.style.display = 'none';
    
    // Reset form
    document.getElementById('returnForm').reset();
    
    // Reset to single item row
    const itemsContainer = document.getElementById('returnItems');
    itemsContainer.innerHTML = `
        <div class="item-row">
            <select class="item-select" required>
                <option value="">Select Item</option>
            </select>
            <input type="number" class="quantity-input" placeholder="Return Qty" min="1" required>
            <input type="number" class="price-input" placeholder="Unit Price" step="0.01" min="0" required>
            <button type="button" class="btn-remove" onclick="removeItemRow(this)">
                <i class="material-icons-round">remove</i>
            </button>
        </div>
    `;
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
        closeRecordSaleForm();
        
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
        closeReturnForm();
        
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
    const returnRecord = returnsData.find(r => r.id === returnId);
    if (!returnRecord) {
        showToast('Return record not found!', 'error');
        return;
    }
    
    // Populate return information
    document.getElementById('detailsReturnId').textContent = `#${returnRecord.id}`;
    document.getElementById('detailsOriginalSaleId').textContent = `#${returnRecord.originalSaleId}`;
    document.getElementById('detailsReturnDate').textContent = returnRecord.date;
    document.getElementById('detailsReturnTime').textContent = returnRecord.time || '-';
    document.getElementById('detailsProcessedBy').textContent = returnRecord.processedBy || 'Staff';
    document.getElementById('detailsRefundMethod').textContent = returnRecord.refundMethod || 'Cash';
    document.getElementById('detailsRefundAmount').textContent = `₦${parseFloat(returnRecord.refundAmount).toFixed(2)}`;
    
    // Status
    const status = returnRecord.status || 'completed';
    document.getElementById('detailsReturnStatus').innerHTML = `<span class="status-badge ${status}">${status}</span>`;
    
    // Return reason
    document.getElementById('detailsReturnReason').textContent = returnRecord.reason || 'No reason provided';
    
    // Populate items returned
    populateReturnItemsTable(returnRecord.items || []);
    
    // Populate return summary
    populateReturnSummary(returnRecord);
    
    // Show details form
    openReturnDetailsForm();
}

// Open return details form
function openReturnDetailsForm() {
    const formSection = document.getElementById('returnDetailsSection');
    formSection.style.display = 'block';
    
    // Scroll to form
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Close return details form
function closeReturnDetailsForm() {
    const formSection = document.getElementById('returnDetailsSection');
    formSection.style.display = 'none';
}

// Populate return items table
function populateReturnItemsTable(items) {
    const tbody = document.getElementById('detailsReturnItemsTableBody');
    tbody.innerHTML = '';
    
    if (!items || items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #6b7280;">No items found</td></tr>';
        return;
    }
    
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₦${parseFloat(item.price).toFixed(2)}</td>
            <td>₦${(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Populate return summary
function populateReturnSummary(returnRecord) {
    const items = returnRecord.items || [];
    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + parseInt(item.quantity), 0);
    const refundAmount = parseFloat(returnRecord.refundAmount);
    const status = returnRecord.status || 'completed';
    
    document.getElementById('detailsReturnTotalItems').textContent = totalItems;
    document.getElementById('detailsReturnTotalQuantity').textContent = totalQuantity;
    document.getElementById('detailsReturnRefundTotal').textContent = `₦${refundAmount.toFixed(2)}`;
    document.getElementById('detailsReturnProcessingStatus').innerHTML = `<span class="status-badge ${status}">${status}</span>`;
}

// Print return receipt from details
function printReturnReceiptFromDetails() {
    const returnId = document.getElementById('detailsReturnId').textContent.replace('#', '');
    printReturnReceipt(parseInt(returnId));
}

// Print return receipt
function printReturnReceipt(returnId) {
    showToast('Return receipt printing coming soon!', 'info');
}

// View sale details
function viewSaleDetails(saleId) {
    const sale = salesData.find(s => s.id === saleId);
    if (!sale) {
        showToast('Sale not found!', 'error');
        return;
    }
    
    // Populate sale information
    document.getElementById('detailsSaleId').textContent = `#${sale.id}`;
    document.getElementById('detailsSaleDate').textContent = sale.date;
    document.getElementById('detailsSaleTime').textContent = sale.time || '-';
    document.getElementById('detailsCustomer').textContent = sale.customer || 'Walk-in Customer';
    document.getElementById('detailsCashier').textContent = sale.cashier || 'Cashier';
    document.getElementById('detailsPaymentMethod').textContent = sale.paymentMethod || 'Cash';
    document.getElementById('detailsSubtotal').textContent = `₦${parseFloat(sale.subtotal || sale.totalAmount).toFixed(2)}`;
    document.getElementById('detailsDiscount').textContent = `₦${parseFloat(sale.discount || 0).toFixed(2)}`;
    document.getElementById('detailsTotalAmount').textContent = `₦${parseFloat(sale.totalAmount).toFixed(2)}`;
    
    // Status
    const status = sale.status || 'completed';
    document.getElementById('detailsStatus').innerHTML = `<span class="status-badge ${status}">${status}</span>`;
    
    // Populate items sold
    populateSaleItemsTable(sale.items || []);
    
    // Populate sale summary
    populateSaleSummary(sale);
    
    // Show details form
    openSaleDetailsForm();
}

// Open sale details form
function openSaleDetailsForm() {
    const formSection = document.getElementById('saleDetailsSection');
    formSection.style.display = 'block';
    
    // Scroll to form
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Close sale details form
function closeSaleDetailsForm() {
    const formSection = document.getElementById('saleDetailsSection');
    formSection.style.display = 'none';
}

// Populate sale items table
function populateSaleItemsTable(items) {
    const tbody = document.getElementById('detailsItemsTableBody');
    tbody.innerHTML = '';
    
    if (!items || items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #6b7280;">No items found</td></tr>';
        return;
    }
    
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₦${parseFloat(item.price).toFixed(2)}</td>
            <td>₦${(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Populate sale summary
function populateSaleSummary(sale) {
    const items = sale.items || [];
    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + parseInt(item.quantity), 0);
    const discount = parseFloat(sale.discount || 0);
    const totalAmount = parseFloat(sale.totalAmount);
    
    document.getElementById('detailsTotalItems').textContent = totalItems;
    document.getElementById('detailsTotalQuantity').textContent = totalQuantity;
    document.getElementById('detailsDiscountApplied').textContent = discount > 0 ? `₦${discount.toFixed(2)}` : 'No discount';
    document.getElementById('detailsFinalTotal').textContent = `₦${totalAmount.toFixed(2)}`;
}

// Print receipt from details
function printReceiptFromDetails() {
    const saleId = document.getElementById('detailsSaleId').textContent.replace('#', '');
    printReceipt(parseInt(saleId));
}

// Show receipt from details
function showReceiptFromDetails() {
    const saleId = document.getElementById('detailsSaleId').textContent.replace('#', '');
    const sale = salesData.find(s => s.id === parseInt(saleId));
    if (sale) {
        showReceipt(sale);
    }
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
                    box-shadow: 0 2px 0 #000;
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
                    box-shadow: 0 0 0 1px #000;
                    padding: 5px;
                    text-align: left;
                    font-size: 11px;
                }
                .receipt-table th {
                    background: #f0f0f0;
                }
                .receipt-summary {
                    box-shadow: 0 -2px 0 #000;
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
                    box-shadow: 0 -1px 0 #000;
                    padding-top: 5px;
                    margin-top: 10px;
                }
                .receipt-footer {
                    text-align: center;
                    margin-top: 20px;
                    box-shadow: 0 -1px 0 #000;
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
                    box-shadow: 0 0 0 1px #000;
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
                    box-shadow: 0 2px 0 #e0e0e0;
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
                    box-shadow: 0 0 0 1px #e2e8f0;
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
                    box-shadow: 0 -2px 0 #e0e0e0;
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
                    box-shadow: 0 -1px 0 #e2e8f0;
                    padding-top: 5px;
                    margin-top: 10px;
                    color: #10b981;
                }
                .receipt-footer {
                    text-align: center;
                    margin-top: 20px;
                    box-shadow: 0 -1px 0 #e2e8f0;
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
                    box-shadow: 0 0 0 1px #e2e8f0;
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
    window.location.href = '/login';
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

// Product Management Functions
function loadProducts() {
    try {
        const tableBody = document.getElementById('productsTableBody');
        
        if (products.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="10" class="no-data-cell">
                        <div class="no-data">
                            <i class="material-icons-round">inventory_2</i>
                            <p>No products found</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = products.map(product => {
            const cartItem = cart.find(item => item.productId === product.id);
            const salesQuantity = cartItem ? cartItem.quantity : 0;
            
            // Calculate available stock (original stock - current cart quantity)
            const availableStock = product.quantity - salesQuantity;
            
            const isLowStock = availableStock <= (product.lowStockThreshold || 10);
            const statusClass = isLowStock ? 'low-stock' : 'in-stock';
            const statusText = isLowStock ? 'Low Stock' : 'In Stock';
            const canAdd = availableStock > 0;
            const isInCart = cartItem !== undefined;
            
            return `
                <tr>
                    <td class="product-image-cell">
                        <div class="product-image-container" onclick="openImageModal(${product.id})">
                            <img src="${product.image || 'https://via.placeholder.com/60x60?text=No+Image'}" 
                                 alt="${product.name}" 
                                 class="product-thumbnail"
                                 onerror="this.src='https://via.placeholder.com/60x60?text=No+Image'">
                            <div class="image-overlay">
                                <i class="material-icons-round">zoom_in</i>
                            </div>
                        </div>
                    </td>
                    <td>${product.name}</td>
                    <td><span class="brand-badge">${product.brand || 'N/A'}</span></td>
                    <td>${product.category}</td>
                    <td>
                        <span class="stock-quantity ${availableStock <= 0 ? 'out-of-stock' : ''}">${availableStock}</span>
                        ${salesQuantity > 0 ? `<span class="in-cart-indicator">(${salesQuantity} in cart)</span>` : ''}
                    </td>
                    <td>${product.unit || 'units'}</td>
                    <td>${formatCurrency(product.sellingPrice || 0)}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td class="sales-quantity-cell">
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease" onclick="decreaseSalesQuantity(${product.id})" ${salesQuantity <= 0 ? 'disabled' : ''}>
                                <i class="material-icons-round">remove</i>
                            </button>
                            <input type="number" 
                                   class="sales-quantity-input" 
                                   value="${salesQuantity}" 
                                   min="0" 
                                   max="${availableStock}"
                                   onchange="updateSalesQuantity(${product.id}, this.value)"
                                   onkeyup="updateSalesQuantity(${product.id}, this.value)">
                            <button class="quantity-btn increase" onclick="increaseSalesQuantity(${product.id})" ${salesQuantity >= availableStock ? 'disabled' : ''}>
                                <i class="material-icons-round">add</i>
                            </button>
                        </div>
                    </td>
                    <td class="actions-cell">
                        <button class="add-btn ${canAdd ? (isInCart ? 'in-cart' : '') : 'disabled'}" 
                                onclick="${canAdd ? `addToCart(${product.id})` : 'return false'}"
                                ${!canAdd ? 'disabled' : ''}>
                            <i class="material-icons-round">${isInCart ? 'check' : 'add'}</i>
                            ${isInCart ? 'Added' : (canAdd ? 'Add' : 'Out of Stock')}
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Filter Products
function filterProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const brandFilter = document.getElementById('brandFilter').value;
    const tableRows = document.querySelectorAll('#productsTableBody tr');
    
    tableRows.forEach(row => {
        const productName = row.cells[1]?.textContent.toLowerCase() || '';
        const brand = row.cells[2]?.textContent.toLowerCase() || '';
        const category = row.cells[3]?.textContent.toLowerCase() || '';
        
        const matchesSearch = !searchTerm || 
            productName.includes(searchTerm) || 
            brand.includes(searchTerm) || 
            category.includes(searchTerm);
        
        const matchesBrand = brandFilter === 'all' || brand.includes(brandFilter.toLowerCase());
        
        if (matchesSearch && matchesBrand) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Sales Quantity Functions
function increaseSalesQuantity(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const cartItem = cart.find(item => item.productId === productId);
    const currentQuantity = cartItem ? cartItem.quantity : 0;
    
    // Calculate available stock (original stock - current cart quantity)
    const availableStock = product.quantity - currentQuantity;
    
    if (currentQuantity >= availableStock) {
        showToast('Cannot exceed available stock!', 'warning');
        return;
    }
    
    const newQuantity = currentQuantity + 1;
    updateSalesQuantity(productId, newQuantity);
}

function decreaseSalesQuantity(productId) {
    const cartItem = cart.find(item => item.productId === productId);
    const currentQuantity = cartItem ? cartItem.quantity : 0;
    
    if (currentQuantity <= 0) return;
    
    const newQuantity = currentQuantity - 1;
    updateSalesQuantity(productId, newQuantity);
}

function updateSalesQuantity(productId, quantity) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const numQuantity = parseInt(quantity) || 0;
    
    // Validate quantity
    if (numQuantity < 0) {
        showToast('Quantity cannot be negative!', 'warning');
        return;
    }
    
    // Get current cart item to calculate available stock
    const existingCartItem = cart.find(item => item.productId === productId);
    const currentCartQuantity = existingCartItem ? existingCartItem.quantity : 0;
    
    // Calculate available stock (original stock - current cart quantity)
    const availableStock = product.quantity - currentCartQuantity;
    
    // Check if new quantity exceeds available stock
    if (numQuantity > availableStock) {
        showToast(`Cannot exceed available stock (${availableStock})!`, 'warning');
        return;
    }
    
    // Update cart
    if (numQuantity === 0) {
        // Remove from cart
        cart = cart.filter(item => item.productId !== productId);
    } else {
        // Add or update cart item
        const existingItem = cart.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity = numQuantity;
        } else {
            cart.push({
                productId: productId,
                name: product.name,
                price: product.sellingPrice,
                quantity: numQuantity,
                image: product.image,
                brand: product.brand
            });
        }
    }
    
    // Save cart to localStorage
    localStorage.setItem('salesCart', JSON.stringify(cart));
    
    // Update cart display
    updateCartDisplay();
    
    // Reload products to update quantity controls and stock display
    loadProducts();
    
    // Show feedback
    if (numQuantity > 0) {
        showToast(`Updated ${product.name} quantity to ${numQuantity}`, 'success');
    } else {
        showToast(`Removed ${product.name} from sales`, 'info');
    }
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showToast('Product not found', 'error');
        return;
    }
    
    if (product.quantity <= 0) {
        showToast('Product is out of stock', 'error');
        return;
    }
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        // Remove from cart
        cart = cart.filter(item => item.productId !== productId);
        showToast(`${product.name} removed from cart`, 'info');
    } else {
        // Add to cart
        cart.push({
            productId: product.id,
            name: product.name,
            price: product.sellingPrice,
            quantity: 1,
            unit: product.unit || 'units',
            total: product.sellingPrice
        });
        showToast(`${product.name} added to cart`, 'success');
    }
    
    // Update cart count and button state
    updateCartDisplay();
    
    // Refresh products table to show updated button states
    loadProducts();
}

function updateCartDisplay() {
    const cartCount = cart.length;
    const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);
    
    document.getElementById('cartCount').textContent = cartCount;
    document.getElementById('markSoldBtn').disabled = cartCount === 0;
    
    // Update cart modal if open
    if (document.getElementById('cartModal').style.display === 'flex') {
        updateCartModal();
    }
}

function openCartModal() {
    if (cart.length === 0) {
        showToast('Cart is empty', 'warning');
        return;
    }
    
    console.log('Opening cart modal, cart items:', cart.length);
    
    // Set current date automatically
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('saleDate').value = today;
    
    // Update form fields based on current sale type
    updateCartModalFields();
    
    updateCartModal();
    
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
        console.log('Modal should be visible now');
    } else {
        console.error('Cart modal element not found');
    }
}

function updateCartModalFields() {
    // Hide all sale type fields first
    document.querySelectorAll('.sale-type-fields').forEach(field => {
        field.style.display = 'none';
    });
    
    // Show fields based on current sale type
    switch (currentSaleType) {
        case 'normal':
            document.getElementById('normalSaleFields').style.display = 'block';
            document.getElementById('submitButton').textContent = 'Complete Sale';
            document.getElementById('cartModalTitle').textContent = 'Complete Sale';
            break;
        case 'credit':
            document.getElementById('creditSaleFields').style.display = 'block';
            document.getElementById('submitButton').textContent = 'Sell on Credit';
            document.getElementById('cartModalTitle').textContent = 'Sell on Credit';
            // Set default due date to 30 days from now
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 30);
            document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];
            break;
        case 'return':
            document.getElementById('returnSaleFields').style.display = 'block';
            document.getElementById('submitButton').textContent = 'Process Return';
            document.getElementById('cartModalTitle').textContent = 'Process Return';
            break;
    }
}

function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
    document.getElementById('cartModal').classList.remove('show');
}

function updateCartModal() {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="no-data">
                <i class="material-icons-round">shopping_cart</i>
                <p>Cart is empty</p>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${formatCurrency(item.price)} per ${item.unit}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateCartQuantity(${index}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${index}, 1)">+</button>
                </div>
                <div class="cart-item-total">
                    ${formatCurrency(item.total)}
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">
                    <i class="material-icons-round">close</i>
                </button>
            </div>
        `).join('');
    }
    
    document.getElementById('totalItemsCount').textContent = totalItemsCount;
    document.getElementById('totalAmountDisplay').textContent = formatCurrency(totalAmount);
}

function updateCartQuantity(index, change) {
    if (index < 0 || index >= cart.length) return;
    
    const newQuantity = cart[index].quantity + change;
    
    if (newQuantity <= 0) {
        removeFromCart(index);
        return;
    }
    
    // Check stock availability
    const product = products.find(p => p.id === cart[index].productId);
    
    if (newQuantity > product.quantity) {
        showToast('Not enough stock available', 'error');
        return;
    }
    
    cart[index].quantity = newQuantity;
    cart[index].total = cart[index].quantity * cart[index].price;
    
    updateCartDisplay();
    updateCartModal();
}

function removeFromCart(index) {
    if (index < 0 || index >= cart.length) return;
    
    cart.splice(index, 1);
    updateCartDisplay();
    loadProducts(); // Refresh to update button states
    updateCartModal();
}

function processCartSale(event) {
    event.preventDefault();
    
    if (cart.length === 0) {
        showToast('Cart is empty', 'error');
        return;
    }
    
    const customerName = document.getElementById('customerName').value.trim();
    
    // Handle different sale types
    switch (currentSaleType) {
        case 'normal':
            processNormalSale(customerName);
            break;
        case 'credit':
            processCreditSale(customerName);
            break;
        case 'return':
            processReturnSale(customerName);
            break;
    }
}

function processNormalSale(customerName) {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const saleDate = document.getElementById('saleDate').value;
    
    // Create sale record
    const saleData = {
        items: cart.map(item => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.total
        })),
        total: cart.reduce((sum, item) => sum + item.total, 0),
        paymentMethod: paymentMethod,
        customerName: customerName || 'Walk-in Customer',
        saleType: 'normal',
        date: saleDate
    };
    
    // Add sale to records
    addSaleToRecords(saleData);
    
    // Update product quantities (reduce stock)
    cart.forEach(cartItem => {
        const productIndex = products.findIndex(p => p.id === cartItem.productId);
        if (productIndex !== -1) {
            products[productIndex].quantity -= cartItem.quantity;
        }
    });
    localStorage.setItem('products', JSON.stringify(products));
    
    // Show success message
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    showToast(`Sale completed! ${totalItems} items sold for ${formatCurrency(saleData.total)}`, 'success');
    
    // Clear cart and close modal
    clearCartAndClose();
    
    // Show receipt modal automatically
    showReceipt(saleData);
}

function processCreditSale(customerName) {
    const creditLimit = document.getElementById('creditLimit').value;
    const dueDate = document.getElementById('dueDate').value;
    const creditNotes = document.getElementById('creditNotes').value;
    
    if (!dueDate) {
        showToast('Please select a due date', 'error');
        return;
    }
    
    // Create credit sale record
    const saleData = {
        items: cart.map(item => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.total
        })),
        total: cart.reduce((sum, item) => sum + item.total, 0),
        paymentMethod: 'credit',
        customerName: customerName || 'Walk-in Customer',
        saleType: 'credit',
        creditLimit: parseFloat(creditLimit) || 0,
        dueDate: dueDate,
        notes: creditNotes
    };
    
    // Add sale to records
    addSaleToRecords(saleData);
    
    // Update product quantities (reduce stock)
    cart.forEach(cartItem => {
        const productIndex = products.findIndex(p => p.id === cartItem.productId);
        if (productIndex !== -1) {
            products[productIndex].quantity -= cartItem.quantity;
        }
    });
    localStorage.setItem('products', JSON.stringify(products));
    
    // Show success message
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    showToast(`Credit sale completed! ${totalItems} items sold for ${formatCurrency(saleData.total)}`, 'success');
    
    // Clear cart and close modal
    clearCartAndClose();
    
    // Show receipt modal automatically
    showReceipt(saleData);
}

function processReturnSale(customerName) {
    const originalSaleId = document.getElementById('originalSaleId').value;
    const returnReason = document.getElementById('returnReason').value;
    const returnNotes = document.getElementById('returnNotes').value;
    
    if (!originalSaleId || !returnReason) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Create return record
    const returnData = {
        items: cart.map(item => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.total
        })),
        total: cart.reduce((sum, item) => sum + item.total, 0),
        customerName: customerName || 'Walk-in Customer',
        originalSaleId: originalSaleId,
        returnReason: returnReason,
        notes: returnNotes,
        returnType: 'return'
    };
    
    // Add return to records
    addReturnToRecords(returnData);
    
    // Update product quantities (increase stock for returns)
    cart.forEach(cartItem => {
        const productIndex = products.findIndex(p => p.id === cartItem.productId);
        if (productIndex !== -1) {
            products[productIndex].quantity += cartItem.quantity;
        }
    });
    localStorage.setItem('products', JSON.stringify(products));
    
    // Show success message
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    showToast(`Return processed! ${totalItems} items returned for ${formatCurrency(returnData.total)}`, 'success');
    
    // Clear cart and close modal
    clearCartAndClose();
}

function addReturnToRecords(returnData) {
    const returnRecord = {
        id: Date.now(),
        originalSaleId: returnData.originalSaleId,
        date: new Date().toISOString().split('T')[0],
        items: returnData.items,
        refundAmount: returnData.total,
        reason: returnData.returnReason,
        status: 'processed',
        customerName: returnData.customerName,
        notes: returnData.notes,
        createdAt: new Date().toISOString()
    };
    
    // Add to returns data
    returnsData.unshift(returnRecord);
    localStorage.setItem('returnsData', JSON.stringify(returnsData));
}

function clearCartAndClose() {
    // Clear cart
    cart = [];
    updateCartDisplay();
    
    // Close modal
    closeCartModal();
    
    // Refresh products table
    loadProducts();
    
    // Refresh sales table
    renderSalesTable();
    updateSalesStats();
}

// Image Modal Functions
function openImageModal(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showToast('Product not found', 'error');
        return;
    }
    
    const modal = document.getElementById('imageModal');
    const imagePreview = document.getElementById('imagePreview');
    const imageModalTitle = document.getElementById('imageModalTitle');
    const imageInfo = document.getElementById('imageInfo');
    
    // Set image
    imagePreview.src = product.image || 'https://via.placeholder.com/400x300?text=No+Image';
    imagePreview.alt = product.name;
    
    // Set title
    imageModalTitle.textContent = product.name;
    
    // Set product info
    imageInfo.innerHTML = `
        <div class="product-details">
            <h4>${product.name}</h4>
            <p><strong>Brand:</strong> ${product.brand || 'N/A'}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Price:</strong> ${formatCurrency(product.sellingPrice || 0)}</p>
            <p><strong>Quantity:</strong> ${product.quantity} ${product.unit || 'units'}</p>
            <p><strong>Status:</strong> 
                <span class="status-badge ${product.quantity <= (product.lowStockThreshold || 10) ? 'low-stock' : 'in-stock'}">
                    ${product.quantity <= (product.lowStockThreshold || 10) ? 'Low Stock' : 'In Stock'}
                </span>
            </p>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

// Add sale to records
function addSaleToRecords(saleData) {
    const sale = {
        id: Date.now(),
        date: saleData.date || new Date().toISOString().split('T')[0],
        customer: saleData.customerName,
        items: saleData.items,
        subtotal: saleData.total,
        discount: 0,
        totalAmount: saleData.total,
        paymentMethod: saleData.paymentMethod,
        status: 'completed',
        notes: '',
        saleType: saleData.saleType || 'normal',
        createdAt: new Date().toISOString()
    };
    
    // Add to sales data
    salesData.unshift(sale);
    localStorage.setItem('salesData', JSON.stringify(salesData));
}

// Sale Type Switching Functions
function switchSaleType(saleType) {
    currentSaleType = saleType;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(saleType + 'SaleBtn').classList.add('active');
    
    // Handle return sells differently - show returns history
    if (saleType === 'return') {
        showReturnsHistory();
        return;
    }
    
    // For normal and credit sales, show product table
    showProductTable();
    
    // Update title and button text based on sale type
    const titleElement = document.getElementById('saleTypeTitle');
    const buttonTextElement = document.getElementById('markSoldText');
    
    switch (saleType) {
        case 'normal':
            titleElement.textContent = 'Select Products to Sell';
            buttonTextElement.textContent = 'Mark as Sold';
            break;
        case 'credit':
            titleElement.textContent = 'Select Products for Credit Sale';
            buttonTextElement.textContent = 'Sell on Credit';
            break;
    }
    
    // Clear cart when switching sale types
    cart = [];
    updateCartDisplay();
    
    // Reload products to reset any previous selections
    loadProducts();
    
    showToast(`Switched to ${getSaleTypeDisplayName(saleType)}`, 'info');
}

function getSaleTypeDisplayName(saleType) {
    switch (saleType) {
        case 'normal': return 'Normal Sale';
        case 'credit': return 'Credit Sale';
        case 'return': return 'Return Sale';
        default: return 'Sale';
    }
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(amount);
}

// Sample Products Data
function getSampleProductsData() {
    return [
        {
            id: 1,
            name: 'Cement (50kg)',
            brand: 'Dangote',
            category: 'Construction Materials',
            quantity: 245,
            unit: 'bags',
            sellingPrice: 4000.00,
            image: 'https://via.placeholder.com/60x60?text=Cement',
            lowStockThreshold: 50
        },
        {
            id: 2,
            name: 'Steel Rods (12mm)',
            brand: 'Steel Works',
            category: 'Construction Materials',
            quantity: 89,
            unit: 'pieces',
            sellingPrice: 3000.00,
            image: 'https://via.placeholder.com/60x60?text=Steel',
            lowStockThreshold: 20
        },
        {
            id: 3,
            name: 'Sand (Truck Load)',
            brand: 'Premium Sand',
            category: 'Construction Materials',
            quantity: 12,
            unit: 'loads',
            sellingPrice: 18000.00,
            image: 'https://via.placeholder.com/60x60?text=Sand',
            lowStockThreshold: 5
        },
        {
            id: 4,
            name: 'Paint (White)',
            brand: 'Dulux',
            category: 'Finishing Materials',
            quantity: 5,
            unit: 'gallons',
            sellingPrice: 3000.00,
            image: 'https://via.placeholder.com/60x60?text=Paint',
            lowStockThreshold: 10
        },
        {
            id: 5,
            name: 'Nails (2 inches)',
            brand: 'Hardware Pro',
            category: 'Hardware',
            quantity: 15,
            unit: 'boxes',
            sellingPrice: 1000.00,
            image: 'https://via.placeholder.com/60x60?text=Nails',
            lowStockThreshold: 20
        },
        {
            id: 6,
            name: 'PVC Pipes (4 inches)',
            brand: 'AquaFlow',
            category: 'Plumbing',
            quantity: 8,
            unit: 'pieces',
            sellingPrice: 2500.00,
            image: 'https://via.placeholder.com/60x60?text=PVC',
            lowStockThreshold: 15
        }
    ];
}

// Show returns history table
function showReturnsHistory() {
    const recordSaleSection = document.getElementById('recordSaleSection');
    if (recordSaleSection) {
        recordSaleSection.innerHTML = `
            <div class="form-card">
                <div class="form-header">
                    <h3>Returns History</h3>
                    <button class="btn-primary" onclick="openAddReturnForm()">
                        <i class="material-icons-round">add</i>
                        Add Return
                    </button>
                </div>
                <div class="table-container">
                    <table class="data-table" id="returnsHistoryTable">
                        <thead>
                            <tr>
                                <th>Return ID</th>
                                <th>Date</th>
                                <th>Original Sale ID</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="returnsHistoryBody">
                            <!-- Returns data will be loaded here -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // Load returns history
        loadReturnsHistory();
    }
}

// Show product table for normal/credit sales
function showProductTable() {
    const recordSaleSection = document.getElementById('recordSaleSection');
    if (recordSaleSection) {
        recordSaleSection.innerHTML = `
            <div class="form-card">
                <div class="form-header">
                    <h3 id="saleTypeTitle">Select Products to Sell</h3>
                    <div class="header-actions">
                        <div class="search-box">
                            <input type="text" id="productSearch" placeholder="Search products..." onkeyup="filterProducts()">
                            <i class="material-icons-round">search</i>
                        </div>
                        <div class="filter-actions">
                            <select id="brandFilter" onchange="filterProducts()">
                                <option value="all">All Brands</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="products-table-container">
                    <table class="products-table" id="productsTable">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product</th>
                                <th>Brand</th>
                                <th>Stock</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="productsTableBody">
                            <!-- Products will be loaded here -->
                        </tbody>
                    </table>
                </div>
                
                <div class="cart-summary">
                    <div class="summary-row">
                        <div class="summary-label">Total Items:</div>
                        <div class="summary-value" id="totalItemsCount">0</div>
                    </div>
                    <div class="summary-row total-row">
                        <div class="summary-label">Total Amount:</div>
                        <div class="summary-value total-amount" id="totalAmountDisplay">₦0</div>
                    </div>
                </div>
                
                <div class="cart-actions">
                    <div class="cart-info">
                        <span class="cart-count" id="cartCount">0</span>
                        <button class="mark-sold-btn" onclick="openCartModal()" id="markSoldBtn" disabled>
                            <i class="material-icons-round">shopping_cart</i>
                            <span id="markSoldText">Mark as Sold</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Load products
        loadProducts();
        
        // Update button text based on current sale type
        updateSaleTypeButton();
    }
}

// Update sale type button text
function updateSaleTypeButton() {
    const buttonTextElement = document.getElementById('markSoldText');
    const titleElement = document.getElementById('saleTypeTitle');
    
    if (buttonTextElement && titleElement) {
        switch (currentSaleType) {
            case 'normal':
                titleElement.textContent = 'Select Products to Sell';
                buttonTextElement.textContent = 'Mark as Sold';
                break;
            case 'credit':
                titleElement.textContent = 'Select Products for Credit Sale';
                buttonTextElement.textContent = 'Mark as Sold (Credit)';
                break;
        }
    }
}

// Load returns history
function loadReturnsHistory() {
    const tbody = document.getElementById('returnsHistoryBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (returnsData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">
                    <div class="no-data-content">
                        <i class="material-icons-round">inbox</i>
                        <p>No returns found</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    returnsData.forEach(returnItem => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${returnItem.id}</td>
            <td>${returnItem.date}</td>
            <td>#${returnItem.originalSaleId}</td>
            <td>${returnItem.productName}</td>
            <td>${returnItem.quantity}</td>
            <td>${returnItem.reason}</td>
            <td>
                <span class="status-badge ${returnItem.status === 'completed' ? 'success' : 'pending'}">
                    ${returnItem.status}
                </span>
            </td>
            <td>
                <button class="btn-icon" onclick="viewReturnDetails(${returnItem.id})" title="View Details">
                    <i class="material-icons-round">visibility</i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Open add return form
function openAddReturnForm() {
    const modal = document.getElementById('addReturnModal');
    if (modal) {
        // Set current date
        document.getElementById('returnDate').value = new Date().toISOString().split('T')[0];
        modal.style.display = 'flex';
        modal.classList.add('show');
    }
}

// Close add return modal
function closeAddReturnModal() {
    const modal = document.getElementById('addReturnModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        document.getElementById('addReturnForm').reset();
    }
}

// Load sale details when Sale ID is entered
function loadSaleDetails() {
    const saleId = document.getElementById('saleIdInput').value.trim();
    if (!saleId) return;
    
    // Find sale by ID
    const sale = salesData.find(s => s.id == saleId);
    if (sale) {
        const saleDetailsCard = document.getElementById('saleDetailsCard');
        const saleDetailsSection = document.getElementById('saleDetailsSection');
        
        saleDetailsCard.innerHTML = `
            <div class="sale-info">
                <h4>Sale #${sale.id}</h4>
                <p><strong>Date:</strong> ${sale.date}</p>
                <p><strong>Customer:</strong> ${sale.customer}</p>
                <p><strong>Total:</strong> ₦${sale.totalAmount}</p>
                <div class="sale-items">
                    <h5>Items:</h5>
                    <ul>
                        ${sale.items.map(item => `<li>${item.name} - Qty: ${item.quantity} - ₦${item.price}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        saleDetailsSection.style.display = 'block';
    } else {
        showToast('Sale not found', 'error');
    }
}

// Load product details when Product ID is entered
function loadProductDetails() {
    const productId = document.getElementById('productIdInput').value.trim();
    if (!productId) return;
    
    // Find product by ID
    const product = products.find(p => p.id == productId);
    if (product) {
        const saleDetailsCard = document.getElementById('saleDetailsCard');
        const saleDetailsSection = document.getElementById('saleDetailsSection');
        
        saleDetailsCard.innerHTML = `
            <div class="product-info">
                <h4>Product #${product.id}</h4>
                <p><strong>Name:</strong> ${product.name}</p>
                <p><strong>Brand:</strong> ${product.brand}</p>
                <p><strong>Price:</strong> ₦${product.price}</p>
                <p><strong>Stock:</strong> ${product.stock}</p>
            </div>
        `;
        saleDetailsSection.style.display = 'block';
    } else {
        showToast('Product not found', 'error');
    }
}

// Process add return
function processAddReturn() {
    try {
        const returnData = {
            id: Date.now(),
            date: document.getElementById('returnDate').value,
            originalSaleId: document.getElementById('saleIdInput').value,
            productId: document.getElementById('productIdInput').value,
            productName: '', // Will be filled from sale or product data
            quantity: parseInt(document.getElementById('returnQuantity').value),
            reason: document.getElementById('returnReason').value,
            notes: document.getElementById('returnNotes').value,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        // Validate required fields
        if (!returnData.date || !returnData.quantity || !returnData.reason) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Add to returns data
        returnsData.unshift(returnData);
        localStorage.setItem('returnsData', JSON.stringify(returnsData));
        
        // Close modal and show success
        closeAddReturnModal();
        showToast('Return added successfully!', 'success');
        
        // Refresh returns history if visible
        if (currentSaleType === 'return') {
            loadReturnsHistory();
        }
        
    } catch (error) {
        console.error('Error processing return:', error);
        showToast('Failed to add return', 'error');
    }
}

// Invoice Generation Functions
let currentInvoiceData = null;

// Generate invoice
function generateInvoice() {
    console.log('generateInvoice called');
    console.log('Cart length:', cart.length);
    console.log('Cart items:', cart);
    
    // Get current sale data from cart or recent sale
    if (cart.length === 0) {
        showToast('No items in cart to generate invoice', 'error');
        return;
    }
    
    // Prepare invoice data
    currentInvoiceData = {
        invoiceNumber: generateInvoiceNumber(),
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.total
        })),
        subtotal: cart.reduce((sum, item) => sum + item.total, 0),
        tax: 0, // You can add tax calculation here
        total: cart.reduce((sum, item) => sum + item.total, 0),
        customerName: document.getElementById('customerName')?.value || 'Walk-in Customer',
        paymentMethod: document.getElementById('paymentMethod')?.value || 'Cash'
    };
    
    console.log('Invoice data prepared:', currentInvoiceData);
    
    // Open invoice modal
    openInvoiceModal();
}

// Open invoice modal
function openInvoiceModal() {
    console.log('openInvoiceModal called');
    const modal = document.getElementById('invoiceModal');
    console.log('Modal element:', modal);
    console.log('Current invoice data:', currentInvoiceData);
    
    if (modal && currentInvoiceData) {
        console.log('Modal found, populating fields');
        // Populate form fields
        document.getElementById('invoiceNumber').value = currentInvoiceData.invoiceNumber;
        document.getElementById('invoiceDate').value = currentInvoiceData.invoiceDate;
        document.getElementById('dueDate').value = currentInvoiceData.dueDate;
        
        // Generate invoice preview
        generateInvoicePreview();
        
        modal.style.display = 'flex';
        modal.classList.add('show');
        console.log('Modal should be visible now');
    } else {
        console.error('Modal not found or no invoice data');
        if (!modal) console.error('invoiceModal element not found');
        if (!currentInvoiceData) console.error('No currentInvoiceData');
    }
}

// Close invoice modal
function closeInvoiceModal() {
    const modal = document.getElementById('invoiceModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
    }
}

// Generate invoice number
function generateInvoiceNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}${day}-${random}`;
}

// Generate invoice preview
function generateInvoicePreview() {
    const preview = document.getElementById('invoicePreview');
    if (!preview || !currentInvoiceData) return;
    
    preview.innerHTML = `
        <div class="invoice-document">
            <div class="invoice-header">
                <div class="company-info">
                    <h2>🏪 Inventa Store</h2>
                    <p>📍 123 Business Avenue, Downtown</p>
                    <p>📞 Phone: (555) 123-4567</p>
                    <p>📧 Email: info@inventastore.com</p>
                    <p>🌐 Website: www.inventastore.com</p>
                </div>
                <div class="invoice-details">
                    <div class="invoice-status">PAID</div>
                    <h3>INVOICE</h3>
                    <p><strong>Invoice #:</strong> ${currentInvoiceData.invoiceNumber}</p>
                    <p><strong>Date:</strong> ${new Date(currentInvoiceData.invoiceDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</p>
                    <p><strong>Due Date:</strong> ${new Date(currentInvoiceData.dueDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</p>
                </div>
            </div>
            
            <div class="invoice-body">
                <div class="bill-to">
                    <h4>Bill To:</h4>
                    <p><strong>${currentInvoiceData.customerName}</strong></p>
                    <p>💳 Payment Method: ${currentInvoiceData.paymentMethod}</p>
                    <p>📅 Transaction Date: ${new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</p>
                </div>
                
                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>📦 Item Description</th>
                            <th>🔢 Qty</th>
                            <th>💰 Unit Price</th>
                            <th>💵 Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${currentInvoiceData.items.map(item => `
                            <tr>
                                <td><strong>${item.name}</strong></td>
                                <td>${item.quantity}</td>
                                <td>₦${item.price.toFixed(2)}</td>
                                <td><strong>₦${item.total.toFixed(2)}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3"><strong>Subtotal:</strong></td>
                            <td><strong>₦${currentInvoiceData.subtotal.toFixed(2)}</strong></td>
                        </tr>
                        <tr>
                            <td colspan="3"><strong>Tax (0%):</strong></td>
                            <td><strong>₦${currentInvoiceData.tax.toFixed(2)}</strong></td>
                        </tr>
                        <tr class="total-row">
                            <td colspan="3"><strong>🎯 TOTAL AMOUNT:</strong></td>
                            <td class="invoice-amount"><strong>₦${currentInvoiceData.total.toFixed(2)}</strong></td>
                        </tr>
                    </tfoot>
                </table>
                
                <div class="invoice-footer">
                    <p><strong>Thank you for your business! 🙏</strong></p>
                    <p>Payment received and processed successfully ✅</p>
                    <p>For any questions about this invoice, please contact us at (555) 123-4567</p>
                    <p>This invoice was generated on ${new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</p>
                </div>
            </div>
        </div>
    `;
}

// Print invoice
function printInvoice() {
    const printContent = document.getElementById('invoicePreview').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Invoice ${currentInvoiceData?.invoiceNumber || ''}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .invoice-document { max-width: 800px; margin: 0 auto; }
                    .invoice-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
                    .invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .invoice-table th, .invoice-table td { box-shadow: 0 0 0 1px #ddd; padding: 8px; text-align: left; }
                    .invoice-table th { background-color: #f2f2f2; }
                    .total-row { background-color: #f9f9f9; font-weight: bold; }
                    .invoice-footer { margin-top: 30px; }
                </style>
            </head>
            <body>${printContent}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Download invoice as PDF
function downloadInvoice() {
    const printContent = document.getElementById('invoicePreview').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Invoice ${currentInvoiceData?.invoiceNumber || ''}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .invoice-document { max-width: 800px; margin: 0 auto; }
                    .invoice-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
                    .invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .invoice-table th, .invoice-table td { box-shadow: 0 0 0 1px #ddd; padding: 8px; text-align: left; }
                    .invoice-table th { background-color: #f2f2f2; }
                    .total-row { background-color: #f9f9f9; font-weight: bold; }
                    .invoice-footer { margin-top: 30px; }
                </style>
            </head>
            <body>${printContent}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Share invoice link
function shareInvoiceLink() {
    if (navigator.share) {
        navigator.share({
            title: `Invoice ${currentInvoiceData?.invoiceNumber || ''}`,
            text: `Invoice for ${currentInvoiceData?.customerName || 'Customer'}`,
            url: window.location.href
        }).then(() => {
            showToast('Invoice shared successfully!', 'success');
        }).catch((error) => {
            console.error('Error sharing:', error);
            showToast('Failed to share invoice', 'error');
        });
    } else {
        // Fallback: copy to clipboard
        const invoiceText = `Invoice ${currentInvoiceData?.invoiceNumber || ''} for ${currentInvoiceData?.customerName || 'Customer'} - Total: ₦${currentInvoiceData?.total?.toFixed(2) || '0.00'}`;
        navigator.clipboard.writeText(invoiceText).then(() => {
            showToast('Invoice details copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Failed to copy invoice details', 'error');
        });
    }
}

// Email invoice
function emailInvoice() {
    const customerEmail = document.getElementById('customerEmail').value;
    if (!customerEmail) {
        showToast('Please enter customer email address', 'error');
        return;
    }
    
    const subject = `Invoice ${currentInvoiceData?.invoiceNumber || ''} - Inventa Shoe Store`;
    const body = `Dear ${currentInvoiceData?.customerName || 'Customer'},

Please find attached your invoice for the recent purchase.

Invoice Number: ${currentInvoiceData?.invoiceNumber || ''}
Total Amount: ₦${currentInvoiceData?.total?.toFixed(2) || '0.00'}
Due Date: ${currentInvoiceData?.dueDate || ''}

Thank you for your business!

Best regards,
Inventa Shoe Store`;

    const mailtoLink = `mailto:${customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
    showToast('Email client opened with invoice details', 'success');
}

// Share invoice (from receipt modal)
function shareInvoice() {
    generateInvoice();
}

// Generate invoice from most recent sale
function generateInvoiceFromRecentSale() {
    console.log('generateInvoiceFromRecentSale called');
    showToast('Invoice button clicked!', 'success');
    
    console.log('salesData length:', salesData.length);
    console.log('salesData:', salesData);
    
    if (salesData.length === 0) {
        showToast('No sales found to generate invoice. Please complete a sale first.', 'error');
        return;
    }
    
    // Get the most recent sale
    const recentSale = salesData[0];
    console.log('Recent sale:', recentSale);
    
    if (!recentSale || !recentSale.items) {
        showToast('Invalid sale data found', 'error');
        return;
    }
    
    // Create sample invoice data directly
    currentInvoiceData = {
        invoiceNumber: generateInvoiceNumber(),
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: recentSale.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.total
        })),
        subtotal: recentSale.items.reduce((sum, item) => sum + item.total, 0),
        tax: 0,
        total: recentSale.items.reduce((sum, item) => sum + item.total, 0),
        customerName: recentSale.customerName || 'Walk-in Customer',
        paymentMethod: recentSale.paymentMethod || 'Cash'
    };
    
    console.log('Invoice data prepared:', currentInvoiceData);
    
    // Open invoice modal directly
    const modal = document.getElementById('invoiceModal');
    if (modal) {
        // Populate form fields
        document.getElementById('invoiceNumber').value = currentInvoiceData.invoiceNumber;
        document.getElementById('invoiceDate').value = currentInvoiceData.invoiceDate;
        document.getElementById('dueDate').value = currentInvoiceData.dueDate;
        
        // Generate invoice preview
        generateInvoicePreview();
        
        modal.style.display = 'flex';
        modal.classList.add('show');
        console.log('Modal should be visible now');
    } else {
        console.error('Invoice modal not found');
        showToast('Invoice modal not found', 'error');
    }
}

// Export functions for global access
window.toggleSidebar = toggleSidebar;
window.toggleRecordSaleForm = toggleRecordSaleForm;
window.openRecordSaleForm = openRecordSaleForm;
window.closeRecordSaleForm = closeRecordSaleForm;
window.toggleReturnForm = toggleReturnForm;
window.openReturnForm = openReturnForm;
window.closeReturnForm = closeReturnForm;
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
window.openReturnDetailsForm = openReturnDetailsForm;
window.closeReturnDetailsForm = closeReturnDetailsForm;
window.populateReturnItemsTable = populateReturnItemsTable;
window.populateReturnSummary = populateReturnSummary;
window.printReturnReceiptFromDetails = printReturnReceiptFromDetails;
window.printReturnReceipt = printReturnReceipt;
window.toggleUserDropdown = toggleUserDropdown;
window.openShopSettings = openShopSettings;
window.openProfileSettings = openProfileSettings;
window.openNotifications = openNotifications;
window.openBackup = openBackup;
window.openHelp = openHelp;
window.logout = logout;
window.viewSaleDetails = viewSaleDetails;
window.openSaleDetailsForm = openSaleDetailsForm;
window.closeSaleDetailsForm = closeSaleDetailsForm;
window.populateSaleItemsTable = populateSaleItemsTable;
window.populateSaleSummary = populateSaleSummary;
window.printReceiptFromDetails = printReceiptFromDetails;
window.showReceiptFromDetails = showReceiptFromDetails;
window.printReceipt = printReceipt;
window.showReceipt = showReceipt;
window.closeReceiptModal = closeReceiptModal;
window.downloadReceipt = downloadReceipt;
// New product and cart functions
window.loadProducts = loadProducts;
window.filterProducts = filterProducts;
window.increaseSalesQuantity = increaseSalesQuantity;
window.decreaseSalesQuantity = decreaseSalesQuantity;
window.updateSalesQuantity = updateSalesQuantity;
window.addToCart = addToCart;
window.updateCartDisplay = updateCartDisplay;
window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;
window.updateCartModal = updateCartModal;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.processCartSale = processCartSale;
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;
window.showReturnsHistory = showReturnsHistory;
window.showProductTable = showProductTable;
window.loadReturnsHistory = loadReturnsHistory;
window.openAddReturnForm = openAddReturnForm;
window.closeAddReturnModal = closeAddReturnModal;
window.loadSaleDetails = loadSaleDetails;
window.loadProductDetails = loadProductDetails;
window.processAddReturn = processAddReturn;
window.updateSaleTypeButton = updateSaleTypeButton;
// Sale type switching functions
window.switchSaleType = switchSaleType;
window.getSaleTypeDisplayName = getSaleTypeDisplayName;
window.updateCartModalFields = updateCartModalFields;
window.processNormalSale = processNormalSale;
window.processCreditSale = processCreditSale;
window.processReturnSale = processReturnSale;
window.addReturnToRecords = addReturnToRecords;
window.clearCartAndClose = clearCartAndClose;
// Invoice functions
window.generateInvoice = generateInvoice;
window.openInvoiceModal = openInvoiceModal;
window.closeInvoiceModal = closeInvoiceModal;
window.printInvoice = printInvoice;
window.downloadInvoice = downloadInvoice;
window.shareInvoiceLink = shareInvoiceLink;
window.emailInvoice = emailInvoice;
window.shareInvoice = shareInvoice;
window.generateInvoiceFromRecentSale = generateInvoiceFromRecentSale;

// Simple fallback function to show invoice modal
function showInvoiceModalDirectly() {
    console.log('showInvoiceModalDirectly called');
    const modal = document.getElementById('invoiceModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
        console.log('Modal should be visible now');
        showToast('Invoice modal opened directly', 'success');
    } else {
        console.error('Invoice modal not found');
        showToast('Invoice modal not found', 'error');
    }
}

window.showInvoiceModalDirectly = showInvoiceModalDirectly;

