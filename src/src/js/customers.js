// Customer Management Module
console.log('Customer Management module loaded');

// Global variables
let customersData = [];
let creditSalesData = [];
let paymentsData = [];
let currentCustomer = null;

// Initialize customer management page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing customer management...');
    
    // Check authentication
    checkAuthentication();
    
    // Initialize sidebar
    initializeSidebar();
    
    // Initialize customer data
    initializeCustomers();
    
    // Update user info
    updateUserInfo();
    
    // Set default date
    document.getElementById('paymentDate').value = new Date().toISOString().split('T')[0];
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
}

// Update user info in header
function updateUserInfo() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const userAvatar = document.querySelector('.user-avatar');
        const userName = document.querySelector('.user-name');
        
        if (userAvatar && userName) {
            const initials = currentUser.split('@')[0].substring(0, 2).toUpperCase();
            userAvatar.textContent = initials;
            userName.textContent = currentUser.split('@')[0];
        }
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

// Initialize customer data
async function initializeCustomers() {
    try {
        // Load data
        await loadCustomersData();
        await loadCreditSalesData();
        await loadPaymentsData();
        
        // Update UI
        updateCustomerStats();
        displayCustomers();
        
        console.log('Customer data loaded successfully');
        
    } catch (error) {
        console.error('Error initializing customer data:', error);
        showToast('Failed to load customer data', 'error');
    }
}

// Load data from localStorage
async function loadCustomersData() {
    try {
        const savedData = localStorage.getItem('customersData');
        if (savedData) {
            customersData = JSON.parse(savedData);
        } else {
            customersData = getSampleCustomers();
            localStorage.setItem('customersData', JSON.stringify(customersData));
        }
        console.log('Loaded customers:', customersData.length);
        
    } catch (error) {
        console.error('Error loading customers:', error);
        customersData = getSampleCustomers();
    }
}

async function loadCreditSalesData() {
    try {
        const savedData = localStorage.getItem('creditSalesData');
        if (savedData) {
            creditSalesData = JSON.parse(savedData);
        } else {
            creditSalesData = getSampleCreditSales();
            localStorage.setItem('creditSalesData', JSON.stringify(creditSalesData));
        }
        console.log('Loaded credit sales:', creditSalesData.length);
        
    } catch (error) {
        console.error('Error loading credit sales:', error);
        creditSalesData = getSampleCreditSales();
    }
}

async function loadPaymentsData() {
    try {
        const savedData = localStorage.getItem('paymentsData');
        if (savedData) {
            paymentsData = JSON.parse(savedData);
        } else {
            paymentsData = getSamplePayments();
            localStorage.setItem('paymentsData', JSON.stringify(paymentsData));
        }
        console.log('Loaded payments:', paymentsData.length);
        
    } catch (error) {
        console.error('Error loading payments:', error);
        paymentsData = getSamplePayments();
    }
}

// Update customer statistics
function updateCustomerStats() {
    const totalCustomers = customersData.length;
    const creditCustomers = customersData.filter(customer => customer.creditLimit > 0).length;
    
    // Calculate overdue customers
    const today = new Date();
    const overdueCustomers = creditSalesData.filter(sale => {
        const dueDate = new Date(sale.dueDate);
        return dueDate < today && sale.status !== 'paid';
    }).length;
    
    // Calculate total outstanding
    const totalOutstanding = creditSalesData.reduce((sum, sale) => {
        return sum + (parseFloat(sale.totalAmount) - parseFloat(sale.paidAmount || 0));
    }, 0);
    
    document.getElementById('totalCustomers').textContent = totalCustomers;
    document.getElementById('creditCustomers').textContent = creditCustomers;
    document.getElementById('overdueCustomers').textContent = overdueCustomers;
    document.getElementById('totalOutstanding').textContent = `₦${totalOutstanding.toLocaleString()}`;
}

// Display customers in table
function displayCustomers() {
    const tbody = document.getElementById('customerTableBody');
    tbody.innerHTML = '';
    
    customersData.forEach(customer => {
        const customerCreditSales = creditSalesData.filter(sale => sale.customerId === customer.id);
        const outstanding = customerCreditSales.reduce((sum, sale) => {
            return sum + (parseFloat(sale.totalAmount) - parseFloat(sale.paidAmount || 0));
        }, 0);
        
        const lastPurchase = customerCreditSales.length > 0 
            ? new Date(Math.max(...customerCreditSales.map(sale => new Date(sale.saleDate))))
            : null;
        
        const status = outstanding > 0 ? 'Credit' : 'Paid';
        const statusClass = outstanding > 0 ? 'status-credit' : 'status-paid';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.email || '-'}</td>
            <td>₦${customer.creditLimit.toLocaleString()}</td>
            <td>₦${outstanding.toLocaleString()}</td>
            <td><span class="status ${statusClass}">${status}</span></td>
            <td>${lastPurchase ? lastPurchase.toLocaleDateString() : 'Never'}</td>
            <td>
                <button class="btn-small" onclick="viewCustomerDetails(${customer.id})">
                    <i class="material-icons-round">visibility</i>
                </button>
                <button class="btn-small" onclick="editCustomer(${customer.id})">
                    <i class="material-icons-round">edit</i>
                </button>
                <button class="btn-small delete" onclick="deleteCustomer(${customer.id})">
                    <i class="material-icons-round">delete</i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Search customers
function searchCustomers() {
    const searchTerm = document.getElementById('customerSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#customerTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Filter customers
function filterCustomers() {
    const filter = document.getElementById('customerFilter').value;
    const rows = document.querySelectorAll('#customerTableBody tr');
    
    rows.forEach(row => {
        const statusCell = row.querySelector('.status');
        const status = statusCell ? statusCell.textContent.toLowerCase() : '';
        
        let show = true;
        switch (filter) {
            case 'credit':
                show = status === 'credit';
                break;
            case 'overdue':
                show = status === 'credit' && row.querySelector('td:nth-child(5)').textContent !== '₦0';
                break;
            case 'active':
                show = status === 'paid';
                break;
            default:
                show = true;
        }
        
        row.style.display = show ? '' : 'none';
    });
}

// Open add customer modal
// Add Customer form functions
function toggleAddCustomerForm() {
    const formSection = document.getElementById('addCustomerSection');
    if (formSection.style.display === 'none') {
        openAddCustomerForm();
    } else {
        closeAddCustomerForm();
    }
}

function openAddCustomerForm() {
    const formSection = document.getElementById('addCustomerSection');
    formSection.style.display = 'block';
    
    // Focus on first input
    document.getElementById('customerName').focus();
    
    // Scroll to form
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeAddCustomerForm() {
    const formSection = document.getElementById('addCustomerSection');
    formSection.style.display = 'none';
    
    // Reset form
    document.getElementById('addCustomerForm').reset();
}

// Save customer
function saveCustomer() {
    const form = document.getElementById('addCustomerForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const customer = {
        id: Date.now(),
        name: document.getElementById('customerName').value,
        phone: document.getElementById('customerPhone').value,
        email: document.getElementById('customerEmail').value,
        address: document.getElementById('customerAddress').value,
        creditLimit: parseFloat(document.getElementById('creditLimit').value) || 0,
        type: document.getElementById('customerType').value,
        notes: document.getElementById('customerNotes').value,
        createdAt: new Date().toISOString()
    };
    
    customersData.push(customer);
    localStorage.setItem('customersData', JSON.stringify(customersData));
    
    updateCustomerStats();
    displayCustomers();
    closeAddCustomerForm();
    showToast('Customer added successfully!', 'success');
}

// View customer details
function viewCustomerDetails(customerId) {
    currentCustomer = customersData.find(c => c.id === customerId);
    if (!currentCustomer) return;
    
    // Update modal title
    document.getElementById('customerDetailsTitle').textContent = currentCustomer.name;
    
    // Load customer data
    loadCustomerProfile();
    loadCustomerPurchases();
    loadCustomerPayments();
    loadCustomerCredit();
    
    document.getElementById('customerDetailsModal').style.display = 'flex';
}

// Load customer profile
function loadCustomerProfile() {
    const customerCreditSales = creditSalesData.filter(sale => sale.customerId === currentCustomer.id);
    const outstanding = customerCreditSales.reduce((sum, sale) => {
        return sum + (parseFloat(sale.totalAmount) - parseFloat(sale.paidAmount || 0));
    }, 0);
    
    const totalPurchases = customerCreditSales.reduce((sum, sale) => {
        return sum + parseFloat(sale.totalAmount);
    }, 0);
    
    document.getElementById('profileName').textContent = currentCustomer.name;
    document.getElementById('profilePhone').textContent = currentCustomer.phone;
    document.getElementById('profileEmail').textContent = currentCustomer.email || 'No email';
    document.getElementById('profileAddress').textContent = currentCustomer.address || 'No address';
    document.getElementById('profileCreditLimit').textContent = `₦${currentCustomer.creditLimit.toLocaleString()}`;
    document.getElementById('profileOutstanding').textContent = `₦${outstanding.toLocaleString()}`;
    document.getElementById('profileTotalPurchases').textContent = `₦${totalPurchases.toLocaleString()}`;
}

// Load customer purchases
function loadCustomerPurchases() {
    const customerCreditSales = creditSalesData.filter(sale => sale.customerId === currentCustomer.id);
    const container = document.getElementById('purchaseHistory');
    
    if (customerCreditSales.length === 0) {
        container.innerHTML = '<div class="no-data">No purchase history found</div>';
        return;
    }
    
    container.innerHTML = `
        <div class="purchase-list">
            ${customerCreditSales.map(sale => `
                <div class="purchase-item">
                    <div class="purchase-info">
                        <h4>Sale #${sale.id}</h4>
                        <p>Date: ${new Date(sale.saleDate).toLocaleDateString()}</p>
                        <p>Due: ${new Date(sale.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div class="purchase-amount">
                        <span class="amount">₦${parseFloat(sale.totalAmount).toLocaleString()}</span>
                        <span class="status ${sale.status}">${sale.status}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Load customer payments
function loadCustomerPayments() {
    const customerPayments = paymentsData.filter(payment => payment.customerId === currentCustomer.id);
    const container = document.getElementById('paymentHistory');
    
    if (customerPayments.length === 0) {
        container.innerHTML = '<div class="no-data">No payment history found</div>';
        return;
    }
    
    container.innerHTML = `
        <div class="payment-list">
            ${customerPayments.map(payment => `
                <div class="payment-item">
                    <div class="payment-info">
                        <h4>Payment #${payment.id}</h4>
                        <p>Date: ${new Date(payment.paymentDate).toLocaleDateString()}</p>
                        <p>Method: ${payment.paymentMethod}</p>
                    </div>
                    <div class="payment-amount">
                        <span class="amount">₦${parseFloat(payment.amount).toLocaleString()}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Load customer credit summary
function loadCustomerCredit() {
    const customerCreditSales = creditSalesData.filter(sale => sale.customerId === currentCustomer.id);
    const customerPayments = paymentsData.filter(payment => payment.customerId === currentCustomer.id);
    
    const totalCredit = customerCreditSales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount), 0);
    const totalPaid = customerPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
    const outstanding = totalCredit - totalPaid;
    
    const container = document.getElementById('creditSummary');
    container.innerHTML = `
        <div class="credit-summary-cards">
            <div class="credit-card">
                <h4>Total Credit</h4>
                <span class="amount">₦${totalCredit.toLocaleString()}</span>
            </div>
            <div class="credit-card">
                <h4>Total Paid</h4>
                <span class="amount">₦${totalPaid.toLocaleString()}</span>
            </div>
            <div class="credit-card">
                <h4>Outstanding</h4>
                <span class="amount ${outstanding > 0 ? 'outstanding' : 'paid'}">₦${outstanding.toLocaleString()}</span>
            </div>
        </div>
    `;
}

// Switch customer tab
function switchCustomerTab(tabName) {
    // Remove active class from all tabs and panels
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    // Add active class to selected tab and panel
    document.querySelector(`[onclick="switchCustomerTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

// Close customer details modal
function closeCustomerDetailsModal() {
    document.getElementById('customerDetailsModal').style.display = 'none';
    currentCustomer = null;
}

// Record payment
function recordPayment() {
    document.getElementById('recordPaymentModal').style.display = 'flex';
    document.getElementById('paymentAmount').focus();
}

// Close record payment modal
function closeRecordPaymentModal() {
    document.getElementById('recordPaymentModal').style.display = 'none';
    document.getElementById('recordPaymentForm').reset();
}

// Save payment
function savePayment() {
    const form = document.getElementById('recordPaymentForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const payment = {
        id: Date.now(),
        customerId: currentCustomer.id,
        amount: parseFloat(document.getElementById('paymentAmount').value),
        paymentMethod: document.getElementById('paymentMethod').value,
        paymentDate: document.getElementById('paymentDate').value,
        notes: document.getElementById('paymentNotes').value,
        createdAt: new Date().toISOString()
    };
    
    paymentsData.push(payment);
    localStorage.setItem('paymentsData', JSON.stringify(paymentsData));
    
    // Update credit sales paid amount
    const customerCreditSales = creditSalesData.filter(sale => sale.customerId === currentCustomer.id);
    // This is a simplified approach - in a real app, you'd need more sophisticated payment allocation
    
    closeRecordPaymentModal();
    loadCustomerPayments();
    loadCustomerCredit();
    updateCustomerStats();
    displayCustomers();
    showToast('Payment recorded successfully!', 'success');
}

// Edit customer
function editCustomer(customerId) {
    const customer = customersData.find(c => c.id === customerId);
    if (!customer) {
        showToast('Customer not found!', 'error');
        return;
    }
    
    // Populate edit form with customer data
    document.getElementById('editCustomerId').value = customer.id;
    document.getElementById('editCustomerName').value = customer.name;
    document.getElementById('editCustomerPhone').value = customer.phone;
    document.getElementById('editCustomerEmail').value = customer.email || '';
    document.getElementById('editCustomerAddress').value = customer.address || '';
    document.getElementById('editCreditLimit').value = customer.creditLimit || 0;
    document.getElementById('editCustomerType').value = customer.type || 'individual';
    document.getElementById('editCustomerNotes').value = customer.notes || '';
    
    // Show edit form
    openEditCustomerForm();
}

// Open edit customer form
function openEditCustomerForm() {
    const formSection = document.getElementById('editCustomerSection');
    formSection.style.display = 'block';
    
    // Focus on first input
    document.getElementById('editCustomerName').focus();
    
    // Scroll to form
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Close edit customer form
function closeEditCustomerForm() {
    const formSection = document.getElementById('editCustomerSection');
    formSection.style.display = 'none';
    
    // Reset form
    document.getElementById('editCustomerForm').reset();
}

// Update customer
function updateCustomer() {
    const form = document.getElementById('editCustomerForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const customerId = parseInt(document.getElementById('editCustomerId').value);
    const customerIndex = customersData.findIndex(c => c.id === customerId);
    
    if (customerIndex === -1) {
        showToast('Customer not found!', 'error');
        return;
    }
    
    // Update customer data
    customersData[customerIndex] = {
        ...customersData[customerIndex],
        name: document.getElementById('editCustomerName').value,
        phone: document.getElementById('editCustomerPhone').value,
        email: document.getElementById('editCustomerEmail').value,
        address: document.getElementById('editCustomerAddress').value,
        creditLimit: parseFloat(document.getElementById('editCreditLimit').value) || 0,
        type: document.getElementById('editCustomerType').value,
        notes: document.getElementById('editCustomerNotes').value,
        updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('customersData', JSON.stringify(customersData));
    
    // Update displays
    updateCustomerStats();
    displayCustomers();
    closeEditCustomerForm();
    showToast('Customer updated successfully!', 'success');
}

// Delete customer
function deleteCustomer(customerId) {
    if (confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
        customersData = customersData.filter(c => c.id !== customerId);
        localStorage.setItem('customersData', JSON.stringify(customersData));
        updateCustomerStats();
        displayCustomers();
        showToast('Customer deleted successfully!', 'success');
    }
}

// Export customers
function exportCustomers() {
    const csvContent = "data:text/csv;charset=utf-8," + 
        "Name,Phone,Email,Address,Credit Limit,Type,Notes\n" +
        customersData.map(customer => 
            `"${customer.name}","${customer.phone}","${customer.email || ''}","${customer.address || ''}","${customer.creditLimit}","${customer.type}","${customer.notes || ''}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Customers exported successfully!', 'success');
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
function getSampleCustomers() {
    return [
        {
            id: 1,
            name: 'ABC Construction Ltd',
            phone: '+234-800-000-0001',
            email: 'info@abcconstruction.com',
            address: '123 Construction Street, Lagos',
            creditLimit: 500000,
            type: 'company',
            notes: 'Regular customer, pays on time',
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            name: 'XYZ Builders',
            phone: '+234-800-000-0002',
            email: 'contact@xyzbuilders.com',
            address: '456 Builder Avenue, Abuja',
            creditLimit: 300000,
            type: 'contractor',
            notes: 'New customer, good credit history',
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            name: 'John Smith',
            phone: '+234-800-000-0003',
            email: 'johnsmith@email.com',
            address: '789 Residential Road, Port Harcourt',
            creditLimit: 100000,
            type: 'individual',
            notes: 'Individual contractor',
            createdAt: new Date().toISOString()
        }
    ];
}

function getSampleCreditSales() {
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
        },
        {
            id: 2002,
            customerId: 2,
            saleDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            totalAmount: 45000,
            paidAmount: 0,
            dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'overdue',
            items: [
                { itemId: 3, quantity: 1, unitPrice: 45000, totalPrice: 45000 }
            ],
            notes: 'Steel materials',
            createdAt: new Date().toISOString()
        }
    ];
}

function getSamplePayments() {
    return [
        {
            id: 3001,
            customerId: 1,
            paymentDate: new Date().toISOString().split('T')[0],
            amount: 25000,
            paymentMethod: 'transfer',
            notes: 'Partial payment for invoice #2001',
            createdAt: new Date().toISOString()
        }
    ];
}

// Export functions for global access
window.toggleSidebar = toggleSidebar;
window.toggleAddCustomerForm = toggleAddCustomerForm;
window.openAddCustomerForm = openAddCustomerForm;
window.closeAddCustomerForm = closeAddCustomerForm;
window.saveCustomer = saveCustomer;
window.editCustomer = editCustomer;
window.openEditCustomerForm = openEditCustomerForm;
window.closeEditCustomerForm = closeEditCustomerForm;
window.updateCustomer = updateCustomer;
window.viewCustomerDetails = viewCustomerDetails;
window.closeCustomerDetailsModal = closeCustomerDetailsModal;
window.switchCustomerTab = switchCustomerTab;
window.recordPayment = recordPayment;
window.closeRecordPaymentModal = closeRecordPaymentModal;
window.savePayment = savePayment;
window.editCustomer = editCustomer;
window.deleteCustomer = deleteCustomer;
window.searchCustomers = searchCustomers;
window.filterCustomers = filterCustomers;
window.exportCustomers = exportCustomers;
window.toggleUserDropdown = toggleUserDropdown;
window.openShopSettings = openShopSettings;
window.openProfileSettings = openProfileSettings;
window.openNotifications = openNotifications;
window.openBackup = openBackup;
window.openHelp = openHelp;
window.logout = logout;
