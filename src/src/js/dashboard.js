
// Global variables
let inventoryData = [];
let salesData = [];
let creditSalesData = [];
let customers = [];
let payments = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing dashboard...');
    
    // Check authentication
    // checkAuthentication();
    
    // Initialize sidebar
    initializeSidebar();
    
    // Initialize dashboard data
    initializeDashboard();
    
    // Initialize theme
    initializeTheme();
    
    // Update user info
    updateUserInfo();
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

// Toggle user dropdown
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

// Close dropdown when clicking outside
function closeDropdownOnClickOutside(event) {
    const dropdown = document.getElementById('userDropdown');
    const userInfo = document.querySelector('.user-info');
    
    if (dropdown && userInfo && !userInfo.contains(event.target)) {
        dropdown.classList.remove('show');
        document.querySelector('.dropdown-toggle').classList.remove('active');
        document.removeEventListener('click', closeDropdownOnClickOutside);
    }
}

// Shop management functions
function openShopSettings() {
    window.location.href = 'shop-settings.html';
}

function openProfileSettings() {
    // Redirect to profile settings page
    window.location.href = 'profile-settings.html';
}

function logout() {
    // Clear authentication data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    
    // Show logout message
    showToast('Logged out successfully', 'success');
    
    // Redirect to login page
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

// Initialize sidebar functionality
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleBtn = document.getElementById('sidebarToggle');
    
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('sidebar-collapsed');
        
        // Update toggle button icon for collapsed state
        const icon = toggleBtn.querySelector('i');
        icon.textContent = 'menu_open';
        toggleBtn.title = 'Expand Sidebar';
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
    console.log('toggleSidebar called'); // Debug log
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleBtn = document.getElementById('sidebarToggle');
    
    if (!sidebar || !mainContent || !toggleBtn) {
        console.error('Required elements not found');
        return;
    }
    
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('sidebar-collapsed');
    
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
    
    // Update toggle button icon
    const icon = toggleBtn.querySelector('i');
    if (isCollapsed) {
        icon.textContent = 'menu_open';
        toggleBtn.title = 'Expand Sidebar';
        console.log('Sidebar collapsed');
    } else {
        icon.textContent = 'menu';
        toggleBtn.title = 'Collapse Sidebar';
        console.log('Sidebar expanded');
    }
}

// Initialize dashboard data
async function initializeDashboard() {
    try {
        // Load data
        await loadInventoryData();
        await loadSalesData();
        await loadCreditSalesData();
        await loadCustomers();
        await loadPayments();
    
    // Update stats
        updateDashboardStats();
    
    // Update stock overview
        updateStockOverview();
    
        // Update low stock alerts
        updateLowStockAlerts();
    
    // Update sales summary
        updateSalesSummary();
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showToast('Failed to load dashboard data', 'error');
    }
}

// Load data from localStorage
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

async function loadCreditSalesData() {
    try {
        const savedData = localStorage.getItem('creditSalesData');
        if (savedData) {
            creditSalesData = JSON.parse(savedData);
        } else {
            creditSalesData = getSampleCreditSalesData();
            localStorage.setItem('creditSalesData', JSON.stringify(creditSalesData));
        }
        console.log('Loaded credit sales data:', creditSalesData.length, 'credit sales');
        
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

// Update dashboard stats
function updateDashboardStats() {
    // Total Items
    const totalItems = inventoryData.reduce((sum, item) => sum + parseInt(item.current_stock), 0);
    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = totalItems.toLocaleString();
    
    // Low Stock Alerts
    const lowStockItems = inventoryData.filter(item => 
        parseInt(item.current_stock) <= parseInt(item.min_stock_level)
    ).length;
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = lowStockItems;
    
    // Today's Sales
    const today = new Date().toISOString().split('T')[0];
    const todaySales = salesData.filter(sale => sale.saleDate === today)
        .reduce((sum, sale) => sum + parseFloat(sale.totalAmount), 0);
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = `₦${todaySales.toLocaleString()}`;
    
    // Today's Profit
    const todayProfit = salesData.filter(sale => sale.saleDate === today)
        .reduce((sum, sale) => sum + parseFloat(sale.profit), 0);
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = `₦${todayProfit.toLocaleString()}`;
}

// Update stock overview
function updateStockOverview() {
    const stockList = document.querySelector('.stock-list');
    if (!stockList) return;
    
    stockList.innerHTML = '';
    
    // Show top 3 items by stock value
    const topItems = inventoryData
        .sort((a, b) => (parseInt(b.current_stock) * parseFloat(b.selling_price)) - (parseInt(a.current_stock) * parseFloat(a.selling_price)))
        .slice(0, 3);
    
    topItems.forEach(item => {
        const stockItem = document.createElement('div');
        stockItem.className = 'stock-item';
        stockItem.innerHTML = `
            <div class="stock-info">
                <h4>${item.name}</h4>
                <p>${item.category_name}</p>
            </div>
            <div class="stock-balance">
                <span class="balance-value">${parseInt(item.current_stock).toLocaleString()}</span>
                <span class="balance-unit">${item.unit}</span>
            </div>
        `;
        stockList.appendChild(stockItem);
    });
}

// Update low stock alerts
function updateLowStockAlerts() {
    const alertList = document.querySelector('.alert-list');
    if (!alertList) return;
    
    alertList.innerHTML = '';
    
    const lowStockItems = inventoryData.filter(item => 
        parseInt(item.current_stock) <= parseInt(item.min_stock_level)
    ).slice(0, 3);
    
    if (lowStockItems.length === 0) {
        alertList.innerHTML = '<div class="no-alerts">No low stock alerts</div>';
        return;
    }
    
    lowStockItems.forEach(item => {
        const alertItem = document.createElement('div');
        const isCritical = parseInt(item.current_stock) <= parseInt(item.min_stock_level) * 0.5;
        alertItem.className = `alert-item ${isCritical ? 'critical' : 'warning'}`;
        alertItem.innerHTML = `
            <div class="alert-icon">
                <i class="material-icons-round">${isCritical ? 'error' : 'warning'}</i>
            </div>
            <div class="alert-content">
                <h4>${item.name}</h4>
                <p>Only ${parseInt(item.current_stock)} ${item.unit} remaining</p>
            </div>
            <div class="alert-action">
                <button class="btn-small" onclick="reorderItem(${item.id})">Reorder</button>
            </div>
        `;
        alertList.appendChild(alertItem);
    });
}

// Update sales summary
function updateSalesSummary() {
    const summaryStats = document.querySelector('.summary-stats');
    if (!summaryStats) return;
    
    const today = new Date().toISOString().split('T')[0];
    const todaySales = salesData.filter(sale => sale.saleDate === today);
    
    const totalSales = todaySales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount), 0);
    const totalProfit = todaySales.reduce((sum, sale) => sum + parseFloat(sale.profit), 0);
    const profitMargin = totalSales > 0 ? (totalProfit / totalSales * 100) : 0;
    const transactionCount = todaySales.length;
    
    summaryStats.innerHTML = `
        <div class="summary-item">
            <div class="summary-label">Total Sales</div>
            <div class="summary-value">₦${totalSales.toLocaleString()}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Gross Profit</div>
            <div class="summary-value">₦${totalProfit.toLocaleString()}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Profit Margin</div>
            <div class="summary-value">${profitMargin.toFixed(1)}%</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Transactions</div>
            <div class="summary-value">${transactionCount}</div>
        </div>
    `;
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
        },
        {
            id: 3,
            name: 'Sand (Truck Load)',
            sku: 'SAND-TRUCK-001',
            category_name: 'Construction Materials',
            current_stock: 12,
            unit: 'loads',
            cost_price: 15000.00,
            selling_price: 18000.00,
            min_stock_level: 5
        },
        {
            id: 4,
            name: 'Paint (White)',
            sku: 'PAINT-WHITE-001',
            category_name: 'Finishing Materials',
            current_stock: 5,
            unit: 'gallons',
            cost_price: 2500.00,
            selling_price: 3000.00,
            min_stock_level: 10
        },
        {
            id: 5,
            name: 'Nails (2 inches)',
            sku: 'NAILS-2IN-001',
            category_name: 'Hardware',
            current_stock: 15,
            unit: 'boxes',
            cost_price: 800.00,
            selling_price: 1000.00,
            min_stock_level: 20
        },
        {
            id: 6,
            name: 'PVC Pipes (4 inches)',
            sku: 'PVC-4IN-001',
            category_name: 'Plumbing',
            current_stock: 8,
            unit: 'pieces',
            cost_price: 2000.00,
            selling_price: 2500.00,
            min_stock_level: 15
        }
    ];
}

function getSampleSalesData() {
    const today = new Date().toISOString().split('T')[0];
    return [
        {
            id: 1001,
            saleDate: today,
            customerName: 'ABC Construction',
            totalAmount: 25000,
            profit: 5000,
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
            items: [
                { itemId: 3, quantity: 1, unitPrice: 18000, totalPrice: 18000 },
                { itemId: 4, quantity: 1, unitPrice: 3000, totalPrice: 3000 }
            ]
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

// Theme initialization function
function initializeTheme() {
    const savedTheme = localStorage.getItem('globalTheme') || localStorage.getItem('ownerTheme') || 'green';
    applyTheme(savedTheme);
}

function applyTheme(themeName) {
    // Remove existing theme classes from both body and html
    const body = document.body;
    const html = document.documentElement;
    const existingThemes = ['green', 'blue', 'purple', 'red', 'orange', 'teal'];
    
    existingThemes.forEach(theme => {
        body.classList.remove(`theme-${theme}`);
        html.classList.remove(`theme-${theme}`);
    });
    
    // Add new theme class to both body and html for better coverage
    body.classList.add(`theme-${themeName}`);
    html.classList.add(`theme-${themeName}`);
}

// Export functions for global access
window.toggleSidebar = toggleSidebar;
window.reorderItem = reorderItem;
window.toggleUserDropdown = toggleUserDropdown;
window.openShopSettings = openShopSettings;
window.openProfileSettings = openProfileSettings;
window.logout = logout;