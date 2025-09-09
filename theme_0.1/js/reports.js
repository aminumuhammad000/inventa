// Reports Module
console.log('Reports module loaded');

// Global variables
let salesData = [];
let inventoryData = [];
let creditSalesData = [];

// Initialize reports page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing reports...');
    
    // Check authentication
    checkAuthentication();
    
    // Initialize sidebar
    initializeSidebar();
    
    // Initialize reports data
    initializeReports();
    
    // Update user info
    updateUserInfo();
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

// Initialize reports data
async function initializeReports() {
    try {
        // Load data
        await loadSalesData();
        await loadInventoryData();
        await loadCreditSalesData();
        
        console.log('Reports data loaded successfully');
        
    } catch (error) {
        console.error('Error initializing reports data:', error);
        showToast('Failed to load reports data', 'error');
    }
}

// Load data from localStorage
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

// Generate report function
function generateReport(reportType) {
    showToast(`Generating ${reportType} report...`, 'info');
    
    // Simulate report generation
    setTimeout(() => {
        const reportData = getReportData(reportType);
        displayReport(reportData);
        showToast(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated successfully!`, 'success');
    }, 1500);
}

// Get report data based on type
function getReportData(reportType) {
    const today = new Date().toISOString().split('T')[0];
    
    switch (reportType) {
        case 'daily':
            return {
                type: 'Daily Report',
                date: today,
                sales: salesData.filter(sale => sale.saleDate === today),
                inventory: inventoryData,
                summary: {
                    totalSales: salesData.filter(sale => sale.saleDate === today).reduce((sum, sale) => sum + parseFloat(sale.totalAmount), 0),
                    totalItems: inventoryData.length,
                    lowStockItems: inventoryData.filter(item => parseInt(item.current_stock) <= parseInt(item.min_stock_level)).length
                }
            };
        case 'weekly':
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            return {
                type: 'Weekly Report',
                period: `${weekAgo} to ${today}`,
                sales: salesData.filter(sale => sale.saleDate >= weekAgo),
                inventory: inventoryData,
                summary: {
                    totalSales: salesData.filter(sale => sale.saleDate >= weekAgo).reduce((sum, sale) => sum + parseFloat(sale.totalAmount), 0),
                    totalItems: inventoryData.length,
                    lowStockItems: inventoryData.filter(item => parseInt(item.current_stock) <= parseInt(item.min_stock_level)).length
                }
            };
        case 'monthly':
            const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            return {
                type: 'Monthly Report',
                period: `${monthAgo} to ${today}`,
                sales: salesData.filter(sale => sale.saleDate >= monthAgo),
                inventory: inventoryData,
                summary: {
                    totalSales: salesData.filter(sale => sale.saleDate >= monthAgo).reduce((sum, sale) => sum + parseFloat(sale.totalAmount), 0),
                    totalItems: inventoryData.length,
                    lowStockItems: inventoryData.filter(item => parseInt(item.current_stock) <= parseInt(item.min_stock_level)).length
                }
            };
        default:
            return {
                type: 'General Report',
                date: today,
                sales: salesData,
                inventory: inventoryData,
                summary: {
                    totalSales: salesData.reduce((sum, sale) => sum + parseFloat(sale.totalAmount), 0),
                    totalItems: inventoryData.length,
                    lowStockItems: inventoryData.filter(item => parseInt(item.current_stock) <= parseInt(item.min_stock_level)).length
                }
            };
    }
}

// Display report
function displayReport(reportData) {
    const reportContainer = document.getElementById('reportContainer');
    if (!reportContainer) return;
    
    reportContainer.innerHTML = `
        <div class="report-display">
            <div class="report-header">
                <h2>${reportData.type}</h2>
                <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="report-summary">
                <div class="summary-item">
                    <span class="summary-label">Total Sales</span>
                    <span class="summary-value">₦${reportData.summary.totalSales.toLocaleString()}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Total Items</span>
                    <span class="summary-value">${reportData.summary.totalItems}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Low Stock Items</span>
                    <span class="summary-value">${reportData.summary.lowStockItems}</span>
                </div>
            </div>
            <div class="report-actions">
                <button class="btn-primary" onclick="exportReport('${reportData.type}')">
                    <i class="material-icons-round">download</i>
                    Export Report
                </button>
                <button class="btn-secondary" onclick="printReport()">
                    <i class="material-icons-round">print</i>
                    Print Report
                </button>
            </div>
        </div>
    `;
}

// Export report
function exportReport(reportType) {
    showToast(`Exporting ${reportType}...`, 'info');
    
    // Simulate export
    setTimeout(() => {
        showToast(`${reportType} exported successfully!`, 'success');
    }, 1000);
}

// Print report
function printReport() {
    showToast('Opening print dialog...', 'info');
    window.print();
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

// Export functions for global access
window.toggleSidebar = toggleSidebar;
window.generateReport = generateReport;
window.exportReport = exportReport;
window.printReport = printReport;
window.toggleUserDropdown = toggleUserDropdown;
window.openShopSettings = openShopSettings;
window.openProfileSettings = openProfileSettings;
window.openNotifications = openNotifications;
window.openBackup = openBackup;
window.openHelp = openHelp;
window.logout = logout;
