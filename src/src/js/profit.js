// Profit Analysis Module
console.log('Profit module loaded');

// Global variables
let salesData = [];
let inventoryData = [];
let expensesData = [];

// Initialize profit page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing profit analysis...');
    
    // Check authentication
    checkAuthentication();
    
    // Initialize sidebar
    initializeSidebar();
    
    // Initialize profit data
    initializeProfitData();
    
    // Update profit analysis
    updateProfitAnalysis();
    
    // Update profit trends
    updateProfitTrends();
    
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

// Initialize profit data
async function initializeProfitData() {
    try {
        // Load data
        await loadSalesData();
        await loadInventoryData();
        await loadExpensesData();
        
        console.log('Profit data loaded successfully');
        
    } catch (error) {
        console.error('Error initializing profit data:', error);
        showToast('Failed to load profit data', 'error');
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

async function loadExpensesData() {
    try {
        const savedData = localStorage.getItem('expensesData');
        if (savedData) {
            expensesData = JSON.parse(savedData);
        } else {
            expensesData = getSampleExpensesData();
            localStorage.setItem('expensesData', JSON.stringify(expensesData));
        }
        console.log('Loaded expenses data:', expensesData.length, 'expenses');
        
    } catch (error) {
        console.error('Error loading expenses data:', error);
        expensesData = getSampleExpensesData();
    }
}

// Update profit analysis
function updateProfitAnalysis() {
    const period = document.getElementById('revenuePeriod').value;
    const profitData = calculateProfitData(period);
    
    // Update gross profit
    document.getElementById('grossProfitAmount').textContent = `₦${profitData.grossProfit.toLocaleString()}`;
    document.getElementById('grossProfitPeriod').textContent = getPeriodText(period);
    document.getElementById('grossProfitChange').textContent = `+${profitData.grossProfitChange}%`;
    
    // Update net profit
    document.getElementById('netProfitAmount').textContent = `₦${profitData.netProfit.toLocaleString()}`;
    document.getElementById('netProfitPeriod').textContent = getPeriodText(period);
    document.getElementById('netProfitChange').textContent = `+${profitData.netProfitChange}%`;
    
    // Update revenue breakdown
    updateRevenueBreakdown(profitData);
    
    // Update cost breakdown
    updateCostBreakdown(profitData);
    
    // Update profit margins
    updateProfitMargins(profitData);
    
    // Update top performing items
    updateTopPerformingItems(profitData);
    
    // Update summary table
    updateProfitSummaryTable(profitData);
}

// Calculate profit data for a given period
function calculateProfitData(period) {
    const filteredSales = filterSalesByPeriod(salesData, period);
    const filteredExpenses = filterExpensesByPeriod(expensesData, period);
    
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount), 0);
    const totalCostOfGoods = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.costOfGoods), 0);
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    
    const grossProfit = totalRevenue - totalCostOfGoods;
    const netProfit = grossProfit - totalExpenses;
    
    const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue * 100) : 0;
    const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue * 100) : 0;
    
    // Calculate changes (simplified)
    const grossProfitChange = Math.floor(Math.random() * 20) + 5;
    const netProfitChange = Math.floor(Math.random() * 15) + 3;
    
    return {
        totalRevenue,
        totalCostOfGoods,
        totalExpenses,
        grossProfit,
        netProfit,
        grossMargin,
        netMargin,
        grossProfitChange,
        netProfitChange,
        cashSales: totalRevenue * 0.7,
        creditSales: totalRevenue * 0.3
    };
}

// Filter sales by period
function filterSalesByPeriod(sales, period) {
    const now = new Date();
    let startDate;
    
    switch (period) {
        case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
        default:
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    return sales.filter(sale => new Date(sale.saleDate) >= startDate);
}

// Filter expenses by period
function filterExpensesByPeriod(expenses, period) {
    const now = new Date();
    let startDate;
    
    switch (period) {
        case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
        default:
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    return expenses.filter(expense => new Date(expense.date) >= startDate);
}

// Get period text
function getPeriodText(period) {
    switch (period) {
        case 'today': return 'Today';
        case 'week': return 'This Week';
        case 'month': return 'This Month';
        case 'year': return 'This Year';
        default: return 'This Month';
    }
}

// Update revenue breakdown
function updateRevenueBreakdown(profitData) {
    const cashPercentage = profitData.totalRevenue > 0 ? (profitData.cashSales / profitData.totalRevenue * 100) : 0;
    const creditPercentage = profitData.totalRevenue > 0 ? (profitData.creditSales / profitData.totalRevenue * 100) : 0;
    
    document.getElementById('cashSalesPercentage').textContent = `${cashPercentage.toFixed(1)}%`;
    document.getElementById('cashSalesAmount').textContent = `₦${profitData.cashSales.toLocaleString()}`;
    document.getElementById('cashSalesBar').style.width = `${cashPercentage}%`;
    
    document.getElementById('creditSalesPercentage').textContent = `${creditPercentage.toFixed(1)}%`;
    document.getElementById('creditSalesAmount').textContent = `₦${profitData.creditSales.toLocaleString()}`;
    document.getElementById('creditSalesBar').style.width = `${creditPercentage}%`;
    
    document.getElementById('totalRevenueAmount').textContent = `₦${profitData.totalRevenue.toLocaleString()}`;
    document.getElementById('totalRevenueBar').style.width = '100%';
}

// Update cost breakdown
function updateCostBreakdown(profitData) {
    document.getElementById('costOfGoodsSold').textContent = `₦${profitData.totalCostOfGoods.toLocaleString()}`;
    document.getElementById('operatingExpenses').textContent = `₦${profitData.totalExpenses.toLocaleString()}`;
    document.getElementById('otherExpenses').textContent = '₦0';
    document.getElementById('totalCosts').textContent = `₦${(profitData.totalCostOfGoods + profitData.totalExpenses).toLocaleString()}`;
}

// Update profit margins
function updateProfitMargins(profitData) {
    document.getElementById('grossMargin').textContent = `${profitData.grossMargin.toFixed(1)}%`;
    document.getElementById('grossMarginBar').style.width = `${Math.min(profitData.grossMargin, 100)}%`;
    
    document.getElementById('netMargin').textContent = `${profitData.netMargin.toFixed(1)}%`;
    document.getElementById('netMarginBar').style.width = `${Math.min(profitData.netMargin, 100)}%`;
}

// Update top performing items
function updateTopPerformingItems(profitData) {
    const topItemsList = document.getElementById('topItemsList');
    topItemsList.innerHTML = '';
    
    // Get top 5 items by profit
    const itemProfits = inventoryData.map(item => ({
        name: item.name,
        profit: parseFloat(item.selling_price) - parseFloat(item.cost_price),
        margin: ((parseFloat(item.selling_price) - parseFloat(item.cost_price)) / parseFloat(item.selling_price) * 100)
    })).sort((a, b) => b.profit - a.profit).slice(0, 5);
    
    itemProfits.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'top-item';
        itemDiv.innerHTML = `
            <div class="item-rank">${index + 1}</div>
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-margin">${item.margin.toFixed(1)}% margin</div>
            </div>
            <div class="item-profit">₦${item.profit.toLocaleString()}</div>
        `;
        topItemsList.appendChild(itemDiv);
    });
}

// Update profit summary table
function updateProfitSummaryTable(profitData) {
    const tbody = document.getElementById('profitSummaryTableBody');
    tbody.innerHTML = '';
    
    const periods = ['Today', 'This Week', 'This Month', 'This Year'];
    const periodValues = ['today', 'week', 'month', 'year'];
    
    periodValues.forEach((period, index) => {
        const data = calculateProfitData(period);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${periods[index]}</td>
            <td>₦${data.totalRevenue.toLocaleString()}</td>
            <td>₦${data.totalCostOfGoods.toLocaleString()}</td>
            <td>₦${data.grossProfit.toLocaleString()}</td>
            <td>₦${data.totalExpenses.toLocaleString()}</td>
            <td>₦${data.netProfit.toLocaleString()}</td>
            <td>${data.grossMargin.toFixed(1)}%</td>
            <td>${data.netMargin.toFixed(1)}%</td>
        `;
        tbody.appendChild(row);
    });
}

// Update profit trends
function updateProfitTrends() {
    const period = document.getElementById('trendPeriod').value;
    const chartPlaceholder = document.getElementById('profitTrendChart');
    
    chartPlaceholder.innerHTML = `
        <div class="chart-placeholder">
            <i class="material-icons-round">show_chart</i>
            <p>Profit trend chart for ${getTrendPeriodText(period)}</p>
            <div class="trend-stats">
                <div class="trend-stat">
                    <span class="trend-label">Average Daily Profit</span>
                    <span class="trend-value">₦${(Math.random() * 50000 + 10000).toLocaleString()}</span>
                </div>
                <div class="trend-stat">
                    <span class="trend-label">Peak Profit Day</span>
                    <span class="trend-value">₦${(Math.random() * 100000 + 50000).toLocaleString()}</span>
                </div>
            </div>
        </div>
    `;
}

// Get trend period text
function getTrendPeriodText(period) {
    switch (period) {
        case '7days': return 'Last 7 Days';
        case '30days': return 'Last 30 Days';
        case '90days': return 'Last 90 Days';
        case '1year': return 'Last Year';
        default: return 'Last 30 Days';
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
            costOfGoods: 15000,
            profit: 10000,
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
            costOfGoods: 12000,
            profit: 8230,
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

function getSampleExpensesData() {
    const today = new Date().toISOString().split('T')[0];
    return [
        {
            id: 1,
            date: today,
            category: 'Operating',
            description: 'Rent',
            amount: 50000
        },
        {
            id: 2,
            date: today,
            category: 'Operating',
            description: 'Utilities',
            amount: 15000
        },
        {
            id: 3,
            date: today,
            category: 'Operating',
            description: 'Staff Salaries',
            amount: 80000
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

// Export functions for global access
window.toggleSidebar = toggleSidebar;
window.updateProfitAnalysis = updateProfitAnalysis;
window.updateProfitTrends = updateProfitTrends;
window.toggleUserDropdown = toggleUserDropdown;
window.openShopSettings = openShopSettings;
window.openProfileSettings = openProfileSettings;
window.openNotifications = openNotifications;
window.openBackup = openBackup;
window.openHelp = openHelp;
window.logout = logout;
