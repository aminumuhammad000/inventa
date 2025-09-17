// Credit Sales Management Module
console.log('Credit module loaded');

// Global variables
let creditSalesData = [];
let customers = [];
let payments = [];
let inventoryData = [];

// Initialize credit page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing credit sales...');
    
    // Check authentication
    checkAuthentication();
    
    // Initialize sidebar
    initializeSidebar();
    
    // Initialize credit sales data
    initializeCreditSales();
    
    // Set default dates
    document.getElementById('creditSaleDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('dueDate').value = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    document.getElementById('paymentDate').value = new Date().toISOString().split('T')[0];
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

// Initialize credit sales data
async function initializeCreditSales() {
    try {
        // Load data
        await loadCreditSalesData();
        await loadCustomers();
        await loadPayments();
        await loadInventoryData();
        
        // Render tables
        renderCreditSalesTable();
        renderCustomersTable();
        renderPaymentsTable();
        renderOutstandingTable();
        
        // Update stats
        updateCreditStats();
        
        // Populate dropdowns
        populateDropdowns();
        
    } catch (error) {
        console.error('Error initializing credit sales:', error);
        showToast('Failed to load credit sales data', 'error');
    }
}

// Load data from localStorage
async function loadCreditSalesData() {
    try {
        const savedData = localStorage.getItem('creditSalesData');
        if (savedData) {
            creditSalesData = JSON.parse(savedData);
        } else {
            creditSalesData = getSampleCreditSalesData();
            localStorage.setItem('creditSalesData', JSON.stringify(creditSalesData));
        }
        console.log('Loaded credit sales data:', creditSalesData.length, 'sales');
        
    } catch (error) {
        console.error('Error loading credit sales data:', error);
        creditSalesData = getSampleCreditSalesData();
    }
}

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

async function loadPayments() {
    try {
        const savedData = localStorage.getItem('paymentsData');
        if (savedData) {
            payments = JSON.parse(savedData);
        } else {
            payments = getSamplePayments();
            localStorage.setItem('paymentsData', JSON.stringify(payments));
        }
        console.log('Loaded payments:', payments.length, 'payments');
        
    } catch (error) {
        console.error('Error loading payments:', error);
        payments = getSamplePayments();
    }
}

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

// Render tables
function renderCreditSalesTable() {
    const tbody = document.getElementById('creditSalesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    creditSalesData.forEach(sale => {
        const row = document.createElement('tr');
        const customer = customers.find(c => c.id == sale.customerId);
        const status = getCreditSaleStatus(sale);
        
        row.innerHTML = `
            <td>#${sale.id}</td>
            <td>${customer ? customer.name : 'Unknown Customer'}</td>
            <td>${sale.saleDate}</td>
            <td>₦${parseFloat(sale.totalAmount).toFixed(2)}</td>
            <td>₦${parseFloat(sale.paidAmount).toFixed(2)}</td>
            <td>${sale.dueDate}</td>
            <td>
                <span class="status-badge ${status.class}">${status.text}</span>
            </td>
            <td>
                <button class="btn-icon" onclick="viewCreditSaleDetails(${sale.id})" title="View Details">
                    <i class="material-icons-round">visibility</i>
                </button>
                <button class="btn-icon" onclick="recordPayment(${sale.id})" title="Record Payment">
                    <i class="material-icons-round">payment</i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderCustomersTable() {
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    customers.forEach(customer => {
        const outstanding = getCustomerOutstanding(customer.id);
        const lastPayment = getLastPayment(customer.id);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.phone || 'N/A'}</td>
            <td>${customer.email || 'N/A'}</td>
            <td>₦${parseFloat(customer.creditLimit || 0).toFixed(2)}</td>
            <td>₦${parseFloat(outstanding).toFixed(2)}</td>
            <td>${lastPayment || 'No payments'}</td>
            <td>
                <button class="btn-icon" onclick="editCustomer(${customer.id})" title="Edit">
                    <i class="material-icons-round">edit</i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderPaymentsTable() {
    const tbody = document.getElementById('paymentsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    payments.forEach(payment => {
        const customer = customers.find(c => c.id == payment.customerId);
        const creditSale = creditSalesData.find(s => s.id == payment.creditSaleId);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${payment.id}</td>
            <td>${customer ? customer.name : 'Unknown Customer'}</td>
            <td>#${payment.creditSaleId}</td>
            <td>${payment.paymentDate}</td>
            <td>₦${parseFloat(payment.amount).toFixed(2)}</td>
            <td>
                <span class="payment-method ${payment.paymentMethod}">${payment.paymentMethod}</span>
            </td>
            <td>
                <button class="btn-icon" onclick="viewPaymentDetails(${payment.id})" title="View Details">
                    <i class="material-icons-round">visibility</i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderOutstandingTable() {
    const tbody = document.getElementById('outstandingTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    creditSalesData.forEach(sale => {
        const customer = customers.find(c => c.id == sale.customerId);
        const outstanding = parseFloat(sale.totalAmount) - parseFloat(sale.paidAmount);
        const daysOverdue = getDaysOverdue(sale.dueDate);
        
        if (outstanding > 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer ? customer.name : 'Unknown Customer'}</td>
                <td>#${sale.id}</td>
                <td>₦${parseFloat(sale.totalAmount).toFixed(2)}</td>
                <td>₦${parseFloat(sale.paidAmount).toFixed(2)}</td>
                <td>₦${outstanding.toFixed(2)}</td>
                <td>${sale.dueDate}</td>
                <td>
                    <span class="days-overdue ${daysOverdue > 0 ? 'overdue' : 'current'}">
                        ${daysOverdue > 0 ? `${daysOverdue} days` : 'Current'}
                    </span>
                </td>
                <td>
                    <button class="btn-icon" onclick="recordPayment(${sale.id})" title="Record Payment">
                        <i class="material-icons-round">payment</i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        }
    });
}

// Update stats
function updateCreditStats() {
    const totalCreditSales = creditSalesData.reduce((sum, sale) => sum + parseFloat(sale.totalAmount), 0);
    const totalPaid = creditSalesData.reduce((sum, sale) => sum + parseFloat(sale.paidAmount), 0);
    const outstandingBalance = totalCreditSales - totalPaid;
    const creditCustomers = customers.filter(c => c.creditLimit > 0).length;
    const overduePayments = creditSalesData.filter(sale => {
        const daysOverdue = getDaysOverdue(sale.dueDate);
        const outstanding = parseFloat(sale.totalAmount) - parseFloat(sale.paidAmount);
        return daysOverdue > 0 && outstanding > 0;
    }).length;
    
    document.getElementById('totalCreditSales').textContent = `₦${totalCreditSales.toFixed(2)}`;
    document.getElementById('outstandingBalance').textContent = `₦${outstandingBalance.toFixed(2)}`;
    document.getElementById('creditCustomers').textContent = creditCustomers;
    document.getElementById('overduePayments').textContent = overduePayments;
}

// Helper functions
function getCreditSaleStatus(sale) {
    const outstanding = parseFloat(sale.totalAmount) - parseFloat(sale.paidAmount);
    const daysOverdue = getDaysOverdue(sale.dueDate);
    
    if (outstanding === 0) {
        return { class: 'paid', text: 'Fully Paid' };
    } else if (daysOverdue > 0) {
        return { class: 'overdue', text: 'Overdue' };
    } else if (outstanding < parseFloat(sale.totalAmount)) {
        return { class: 'partial', text: 'Partial Payment' };
    } else {
        return { class: 'pending', text: 'Pending' };
    }
}

function getCustomerOutstanding(customerId) {
    return creditSalesData
        .filter(sale => sale.customerId == customerId)
        .reduce((sum, sale) => sum + parseFloat(sale.totalAmount) - parseFloat(sale.paidAmount), 0);
}

function getLastPayment(customerId) {
    const customerPayments = payments.filter(p => p.customerId == customerId);
    if (customerPayments.length === 0) return null;
    
    const lastPayment = customerPayments.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))[0];
    return lastPayment.paymentDate;
}

function getDaysOverdue(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Tab switching
function switchTab(tabName) {
    // Remove active class from all tabs and panels
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    // Add active class to selected tab and panel
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Modal functions
// New Credit Sale form functions
function toggleNewCreditSaleForm() {
    const formSection = document.getElementById('newCreditSaleSection');
    if (formSection.style.display === 'none') {
        openNewCreditSaleForm();
    } else {
        closeNewCreditSaleForm();
    }
}

function openNewCreditSaleForm() {
    const formSection = document.getElementById('newCreditSaleSection');
    formSection.style.display = 'block';
    populateDropdowns();
    updateCreditSaleSummary();
    
    // Scroll to form
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeNewCreditSaleForm() {
    const formSection = document.getElementById('newCreditSaleSection');
    formSection.style.display = 'none';
    
    // Reset form
    document.getElementById('newCreditSaleForm').reset();
    
    // Reset to single item row
    const itemsContainer = document.getElementById('creditSaleItems');
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
    updateCreditSaleSummary();
}

// Payment form functions
function togglePaymentForm() {
    const formSection = document.getElementById('recordPaymentSection');
    if (formSection.style.display === 'none') {
        openPaymentForm();
    } else {
        closePaymentForm();
    }
}

function openPaymentForm() {
    const formSection = document.getElementById('recordPaymentSection');
    formSection.style.display = 'block';
    populateDropdowns();
    
    // Scroll to form
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closePaymentForm() {
    const formSection = document.getElementById('recordPaymentSection');
    formSection.style.display = 'none';
    
    // Reset form
    document.getElementById('paymentForm').reset();
}

// Customer form functions
function toggleCustomerForm() {
    const formSection = document.getElementById('addCustomerSection');
    if (formSection.style.display === 'none') {
        openCustomerForm();
    } else {
        closeCustomerForm();
    }
}

function openCustomerForm() {
    const formSection = document.getElementById('addCustomerSection');
    formSection.style.display = 'block';
    
    // Scroll to form
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeCustomerForm() {
    const formSection = document.getElementById('addCustomerSection');
    formSection.style.display = 'none';
    
    // Reset form
    document.getElementById('customerForm').reset();
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Populate dropdowns
function populateDropdowns() {
    // Populate customer dropdowns
    const customerSelects = document.querySelectorAll('#creditCustomer, #paymentCustomer');
    customerSelects.forEach(select => {
        select.innerHTML = '<option value="">Select Customer</option>';
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = customer.name;
            select.appendChild(option);
        });
    });
    
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

// Add item row
function addItemRow() {
    const container = document.getElementById('creditSaleItems');
    const newRow = document.createElement('div');
    newRow.className = 'item-row';
    newRow.innerHTML = `
        <select class="item-select" required onchange="updateItemPrice(this)">
            <option value="">Select Item</option>
        </select>
        <input type="number" class="quantity-input" placeholder="Quantity" min="1" required onchange="updateCreditSaleSummary()">
        <input type="number" class="price-input" placeholder="Unit Price" step="0.01" min="0" required onchange="updateCreditSaleSummary()">
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
    updateCreditSaleSummary();
}

// Update item price
function updateItemPrice(select) {
    const priceInput = select.parentElement.querySelector('.price-input');
    const selectedOption = select.options[select.selectedIndex];
    if (selectedOption.dataset.price) {
        priceInput.value = selectedOption.dataset.price;
        updateCreditSaleSummary();
    }
}

// Update credit sale summary
function updateCreditSaleSummary() {
    const itemRows = document.querySelectorAll('#creditSaleItems .item-row');
    let totalAmount = 0;
    
    itemRows.forEach(row => {
        const quantity = parseFloat(row.querySelector('.quantity-input').value) || 0;
        const price = parseFloat(row.querySelector('.price-input').value) || 0;
        totalAmount += quantity * price;
    });
    
    document.getElementById('creditTotalAmount').textContent = `₦${totalAmount.toFixed(2)}`;
}

// Save credit sale
async function saveCreditSale() {
    try {
        const customerId = document.getElementById('creditCustomer').value;
        const saleDate = document.getElementById('creditSaleDate').value;
        const dueDate = document.getElementById('dueDate').value;
        const notes = document.getElementById('creditNotes').value;
        
        if (!customerId || !saleDate || !dueDate) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Get sale items
        const itemRows = document.querySelectorAll('#creditSaleItems .item-row');
        const saleItems = [];
        let totalAmount = 0;
        
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
                
                totalAmount += totalPrice;
            }
        }
        
        if (saleItems.length === 0) {
            showToast('Please add at least one item', 'error');
            return;
        }
        
        // Create credit sale object
        const creditSale = {
            id: Date.now(),
            customerId: customerId,
            saleDate: saleDate,
            totalAmount: totalAmount,
            paidAmount: 0,
            dueDate: dueDate,
            status: 'pending',
            items: saleItems,
            notes: notes,
            createdAt: new Date().toISOString()
        };
        
        // Save credit sale
        creditSalesData.unshift(creditSale);
        localStorage.setItem('creditSalesData', JSON.stringify(creditSalesData));
        
        // Update inventory stock
        for (let item of saleItems) {
            const itemIndex = inventoryData.findIndex(i => i.id == item.itemId);
            if (itemIndex !== -1) {
                inventoryData[itemIndex].current_stock -= item.quantity;
            }
        }
        localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
        
        showToast('Credit sale created successfully!', 'success');
        closeNewCreditSaleForm();
        
        // Reload data
        await loadCreditSalesData();
        renderCreditSalesTable();
        updateCreditStats();
        
    } catch (error) {
        console.error('Error saving credit sale:', error);
        showToast('Failed to create credit sale', 'error');
    }
}

// Load customer credit sales
function loadCustomerCreditSales() {
    const customerId = document.getElementById('paymentCustomer').value;
    const creditSaleSelect = document.getElementById('paymentCreditSale');
    
    creditSaleSelect.innerHTML = '<option value="">Select Credit Sale</option>';
    
    if (customerId) {
        const customerCreditSales = creditSalesData.filter(sale => 
            sale.customerId == customerId && 
            parseFloat(sale.totalAmount) > parseFloat(sale.paidAmount)
        );
        
        customerCreditSales.forEach(sale => {
            const option = document.createElement('option');
            option.value = sale.id;
            option.textContent = `#${sale.id} - ₦${parseFloat(sale.totalAmount).toFixed(2)} (Outstanding: ₦${(parseFloat(sale.totalAmount) - parseFloat(sale.paidAmount)).toFixed(2)})`;
            creditSaleSelect.appendChild(option);
        });
    }
}

// Save payment
async function savePayment() {
    try {
        const customerId = document.getElementById('paymentCustomer').value;
        const creditSaleId = document.getElementById('paymentCreditSale').value;
        const amount = parseFloat(document.getElementById('paymentAmount').value);
        const paymentMethod = document.getElementById('paymentMethod').value;
        const paymentDate = document.getElementById('paymentDate').value;
        const notes = document.getElementById('paymentNotes').value;
        
        if (!customerId || !creditSaleId || !amount || !paymentDate) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Create payment object
        const payment = {
            id: Date.now(),
            customerId: customerId,
            creditSaleId: creditSaleId,
            paymentDate: paymentDate,
            amount: amount,
            paymentMethod: paymentMethod,
            notes: notes,
            createdAt: new Date().toISOString()
        };
        
        // Save payment
        payments.unshift(payment);
        localStorage.setItem('paymentsData', JSON.stringify(payments));
        
        // Update credit sale paid amount
        const creditSaleIndex = creditSalesData.findIndex(s => s.id == creditSaleId);
        if (creditSaleIndex !== -1) {
            creditSalesData[creditSaleIndex].paidAmount = parseFloat(creditSalesData[creditSaleIndex].paidAmount) + amount;
            localStorage.setItem('creditSalesData', JSON.stringify(creditSalesData));
        }
        
        showToast('Payment recorded successfully!', 'success');
        closePaymentForm();
        
        // Reload data
        await loadCreditSalesData();
        await loadPayments();
        renderCreditSalesTable();
        renderPaymentsTable();
        renderOutstandingTable();
        updateCreditStats();
        
    } catch (error) {
        console.error('Error saving payment:', error);
        showToast('Failed to record payment', 'error');
    }
}

// Save customer
async function saveCustomer() {
    try {
        const name = document.getElementById('customerName').value;
        const phone = document.getElementById('customerPhone').value;
        const email = document.getElementById('customerEmail').value;
        const address = document.getElementById('customerAddress').value;
        const creditLimit = parseFloat(document.getElementById('creditLimit').value) || 0;
        
        if (!name) {
            showToast('Please enter customer name', 'error');
            return;
        }
        
        // Create customer object
        const customer = {
            id: Date.now(),
            name: name,
            phone: phone,
            email: email,
            address: address,
            creditLimit: creditLimit,
            createdAt: new Date().toISOString()
        };
        
        // Save customer
        customers.unshift(customer);
        localStorage.setItem('customersData', JSON.stringify(customers));
        
        showToast('Customer added successfully!', 'success');
        closeCustomerForm();
        
        // Reload data
        await loadCustomers();
        renderCustomersTable();
        updateCreditStats();
        
    } catch (error) {
        console.error('Error saving customer:', error);
        showToast('Failed to add customer', 'error');
    }
}

// Filter functions
function filterCreditSales() {
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filteredData = [...creditSalesData];
    
    if (statusFilter) {
        filteredData = filteredData.filter(sale => {
            const status = getCreditSaleStatus(sale);
            return status.class === statusFilter;
        });
    }
    
    renderFilteredCreditSalesTable(filteredData);
}

function searchCreditSales() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        renderCreditSalesTable();
        return;
    }
    
    const filteredData = creditSalesData.filter(sale => {
        const customer = customers.find(c => c.id == sale.customerId);
        return sale.id.toString().includes(searchTerm) ||
               (customer && customer.name.toLowerCase().includes(searchTerm));
    });
    
    renderFilteredCreditSalesTable(filteredData);
}

function renderFilteredCreditSalesTable(data) {
    const tbody = document.getElementById('creditSalesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.forEach(sale => {
        const row = document.createElement('tr');
        const customer = customers.find(c => c.id == sale.customerId);
        const status = getCreditSaleStatus(sale);
        
        row.innerHTML = `
            <td>#${sale.id}</td>
            <td>${customer ? customer.name : 'Unknown Customer'}</td>
            <td>${sale.saleDate}</td>
            <td>₦${parseFloat(sale.totalAmount).toFixed(2)}</td>
            <td>₦${parseFloat(sale.paidAmount).toFixed(2)}</td>
            <td>${sale.dueDate}</td>
            <td>
                <span class="status-badge ${status.class}">${status.text}</span>
            </td>
            <td>
                <button class="btn-icon" onclick="viewCreditSaleDetails(${sale.id})" title="View Details">
                    <i class="material-icons-round">visibility</i>
                </button>
                <button class="btn-icon" onclick="recordPayment(${sale.id})" title="Record Payment">
                    <i class="material-icons-round">payment</i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Placeholder functions
function viewCreditSaleDetails(saleId) {
    const sale = creditSalesData.find(s => s.id === saleId);
    if (!sale) {
        showToast('Credit sale not found!', 'error');
        return;
    }
    
    const customer = customersData.find(c => c.id === sale.customerId);
    
    // Populate sale information
    document.getElementById('detailsSaleId').textContent = `#${sale.id}`;
    document.getElementById('detailsCustomer').textContent = customer ? customer.name : 'Unknown Customer';
    document.getElementById('detailsSaleDate').textContent = sale.saleDate;
    document.getElementById('detailsDueDate').textContent = sale.dueDate;
    document.getElementById('detailsTotalAmount').textContent = `₦${parseFloat(sale.totalAmount).toFixed(2)}`;
    document.getElementById('detailsPaidAmount').textContent = `₦${parseFloat(sale.paidAmount).toFixed(2)}`;
    
    const outstanding = parseFloat(sale.totalAmount) - parseFloat(sale.paidAmount);
    document.getElementById('detailsOutstanding').textContent = `₦${outstanding.toFixed(2)}`;
    
    // Status
    const status = getCreditSaleStatus(sale);
    document.getElementById('detailsStatus').innerHTML = `<span class="status-badge ${status.class}">${status.text}</span>`;
    
    // Populate items sold
    populateItemsTable(sale.items || []);
    
    // Populate payment history
    populatePaymentsTable(saleId);
    
    // Populate customer information
    if (customer) {
        document.getElementById('detailsCustomerName').textContent = customer.name;
        document.getElementById('detailsCustomerPhone').textContent = customer.phone || '-';
        document.getElementById('detailsCustomerEmail').textContent = customer.email || '-';
        document.getElementById('detailsCustomerAddress').textContent = customer.address || '-';
        document.getElementById('detailsCustomerCreditLimit').textContent = `₦${parseFloat(customer.creditLimit || 0).toFixed(2)}`;
    } else {
        document.getElementById('detailsCustomerName').textContent = '-';
        document.getElementById('detailsCustomerPhone').textContent = '-';
        document.getElementById('detailsCustomerEmail').textContent = '-';
        document.getElementById('detailsCustomerAddress').textContent = '-';
        document.getElementById('detailsCustomerCreditLimit').textContent = '-';
    }
    
    // Show details form
    openCreditSaleDetailsForm();
}

// Open credit sale details form
function openCreditSaleDetailsForm() {
    const formSection = document.getElementById('creditSaleDetailsSection');
    formSection.style.display = 'block';
    
    // Scroll to form
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Close credit sale details form
function closeCreditSaleDetailsForm() {
    const formSection = document.getElementById('creditSaleDetailsSection');
    formSection.style.display = 'none';
}

// Populate items table
function populateItemsTable(items) {
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

// Populate payments table
function populatePaymentsTable(saleId) {
    const tbody = document.getElementById('detailsPaymentsTableBody');
    tbody.innerHTML = '';
    
    const payments = paymentsData.filter(p => p.creditSaleId === saleId);
    
    if (payments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #6b7280;">No payments recorded</td></tr>';
        return;
    }
    
    payments.forEach(payment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${payment.paymentDate}</td>
            <td>₦${parseFloat(payment.amount).toFixed(2)}</td>
            <td>${payment.method}</td>
            <td>${payment.notes || '-'}</td>
        `;
        tbody.appendChild(row);
    });
}

// Record payment from details
function recordPaymentFromDetails() {
    const saleId = document.getElementById('detailsSaleId').textContent.replace('#', '');
    recordPayment(parseInt(saleId));
    closeCreditSaleDetailsForm();
}

function recordPayment(saleId) {
    // Pre-select the credit sale
    const creditSaleSelect = document.getElementById('paymentCreditSale');
    creditSaleSelect.value = saleId;
    openPaymentModal();
}

function editCustomer(customerId) {
    showToast('Edit customer functionality coming soon!', 'info');
}

function viewPaymentDetails(paymentId) {
    showToast('Payment details functionality coming soon!', 'info');
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

function getSampleCustomers() {
    return [
        { id: 1, name: 'ABC Construction', phone: '+234-800-000-0001', email: 'abc@construction.com', creditLimit: 500000 },
        { id: 2, name: 'XYZ Builders', phone: '+234-800-000-0002', email: 'xyz@builders.com', creditLimit: 300000 }
    ];
}

function getSamplePayments() {
    return [
        {
            id: 3001,
            customerId: 1,
            creditSaleId: 2001,
            paymentDate: new Date().toISOString().split('T')[0],
            amount: 25000,
            paymentMethod: 'transfer',
            notes: 'Partial payment',
            createdAt: new Date().toISOString()
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
window.switchTab = switchTab;
window.toggleNewCreditSaleForm = toggleNewCreditSaleForm;
window.openNewCreditSaleForm = openNewCreditSaleForm;
window.closeNewCreditSaleForm = closeNewCreditSaleForm;
window.togglePaymentForm = togglePaymentForm;
window.openPaymentForm = openPaymentForm;
window.closePaymentForm = closePaymentForm;
window.toggleCustomerForm = toggleCustomerForm;
window.openCustomerForm = openCustomerForm;
window.closeCustomerForm = closeCustomerForm;
window.closeModal = closeModal;
window.addItemRow = addItemRow;
window.removeItemRow = removeItemRow;
window.updateItemPrice = updateItemPrice;
window.updateCreditSaleSummary = updateCreditSaleSummary;
window.saveCreditSale = saveCreditSale;
window.loadCustomerCreditSales = loadCustomerCreditSales;
window.savePayment = savePayment;
window.saveCustomer = saveCustomer;
window.filterCreditSales = filterCreditSales;
window.searchCreditSales = searchCreditSales;
window.viewCreditSaleDetails = viewCreditSaleDetails;
window.openCreditSaleDetailsForm = openCreditSaleDetailsForm;
window.closeCreditSaleDetailsForm = closeCreditSaleDetailsForm;
window.populateItemsTable = populateItemsTable;
window.populatePaymentsTable = populatePaymentsTable;
window.recordPaymentFromDetails = recordPaymentFromDetails;
window.toggleUserDropdown = toggleUserDropdown;
window.openShopSettings = openShopSettings;
window.openProfileSettings = openProfileSettings;
window.openNotifications = openNotifications;
window.openBackup = openBackup;
window.openHelp = openHelp;
window.logout = logout;
window.recordPayment = recordPayment;
window.editCustomer = editCustomer;
window.viewPaymentDetails = viewPaymentDetails;
