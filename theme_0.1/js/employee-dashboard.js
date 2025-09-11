// Employee Dashboard JavaScript
// Handles employee-specific functionality and role-based permissions

// Global Variables
let employeeData = {
    id: null,
    name: '',
    role: 'employee',
    salesToday: [],
    performance: {
        weeklySales: 0,
        monthlySales: 0,
        bestDay: null,
        averageSale: 0
    }
};

let currentSection = 'dashboard';
let selectedProduct = null;
let cart = [];
let allSales = [];
let filteredSales = [];
let sidebarCollapsed = false;

// Initialize Employee Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication and role
    if (!checkEmployeeAuthentication()) {
        window.location.href = 'login.html';
        return;
    }

    initializeEmployeeDashboard();
    loadEmployeeData();
    setupEventListeners();
    updateDashboard();
    loadSidebarState();
    loadThemeOnInit();
});

// Check if user is authenticated as employee
function checkEmployeeAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole') || 'owner';
    
    // Allow both employees and owners to access employee dashboard
    return isLoggedIn && (userRole === 'employee' || userRole === 'owner');
}

// Initialize Employee Dashboard
function initializeEmployeeDashboard() {
    console.log('Initializing employee dashboard...');
    
    // Load employee info
    loadEmployeeInfo();
    
    // Set up real-time updates
    setInterval(updateDashboard, 30000); // Update every 30 seconds
}

// Load Employee Information
function loadEmployeeInfo() {
    const employeeName = localStorage.getItem('userName') || 'Employee';
    const shopName = localStorage.getItem('shopName') || 'Construction Shop';
    
    // Update UI
    document.getElementById('employeeName').textContent = employeeName;
    document.getElementById('shopName').textContent = shopName;
    
    // Set avatar initials
    const initials = employeeName.split(' ').map(name => name[0]).join('').toUpperCase();
    document.getElementById('employeeAvatar').textContent = initials;
    
    // Store employee data
    employeeData.id = localStorage.getItem('userId');
    employeeData.name = employeeName;
}

// Load Employee Data
async function loadEmployeeData() {
    try {
        await loadTodaySales();
        await loadStockData();
        await loadProducts();
    } catch (error) {
        console.error('Error loading employee data:', error);
        showToast('Failed to load dashboard data', 'error');
    }
}

// Navigation Functions
function showDashboard() {
    currentSection = 'dashboard';
    updateNavigation();
    showSection('dashboardSection');
    loadEmployeeData();
}

function showProducts() {
    currentSection = 'products';
    updateNavigation();
    showSection('productsSection');
    loadProducts();
}

function showSales() {
    currentSection = 'sales';
    updateNavigation();
    showSection('salesSection');
    loadSalesData();
}

// Update Navigation Active State
function updateNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to current section
    const currentNavItem = document.querySelector(`[onclick="show${currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}()"]`);
    if (currentNavItem) {
        currentNavItem.classList.add('active');
    }
}

// Show Specific Section
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Load Today's Sales for Employee
async function loadTodaySales() {
    try {
        employeeData.salesToday = getEmployeeSalesToday(employeeData.id);
        updateSalesDisplay();
    } catch (error) {
        console.error('Error loading today\'s sales:', error);
    }
}

// Update Sales Display
function updateSalesDisplay() {
    const sales = employeeData.salesToday;
    const cashSales = sales.filter(sale => sale.paymentMethod === 'cash');
    const creditSales = sales.filter(sale => sale.paymentMethod === 'credit');
    
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const itemsSold = sales.reduce((sum, sale) => sum + (sale.items?.length || 0), 0);
    
    // Update stats
    document.getElementById('mySalesToday').textContent = sales.length;
    document.getElementById('myRevenueToday').textContent = formatCurrency(totalRevenue);
    document.getElementById('cashSalesCount').textContent = cashSales.length;
    document.getElementById('creditSalesCount').textContent = creditSales.length;
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('itemsSoldCount').textContent = itemsSold;
    
    // Update recent sales
    updateRecentSalesDisplay();
}

// Update Recent Sales Display
function updateRecentSalesDisplay() {
    const recentSalesList = document.getElementById('recentSalesList');
    const sales = employeeData.salesToday.slice(-5).reverse(); // Last 5 sales, most recent first
    
    if (sales.length === 0) {
        recentSalesList.innerHTML = `
            <div class="no-data">
                <i class="material-icons-round">receipt</i>
                <p>No sales recorded today</p>
            </div>
        `;
        return;
    }
    
    recentSalesList.innerHTML = sales.map(sale => `
        <div class="sale-item">
            <div class="sale-info">
                <h4>Sale #${sale.id || 'N/A'}</h4>
                <p>${sale.customerName || 'Walk-in Customer'}</p>
            </div>
            <div class="sale-details">
                <span class="sale-amount">${formatCurrency(sale.total || 0)}</span>
                <span class="sale-method ${sale.paymentMethod}">${sale.paymentMethod}</span>
            </div>
            <div class="sale-time">${formatTime(sale.date)}</div>
        </div>
    `).join('');
}

// Load Performance Data
async function loadPerformanceData() {
    try {
        const performance = calculateEmployeePerformance(employeeData.id);
        
        // Update performance data
        employeeData.performance = {
            weeklySales: performance.week.sales,
            monthlySales: performance.month.sales,
            bestDay: performance.bestDay,
            averageSale: performance.averageSale
        };
        
        updatePerformanceDisplay();
    } catch (error) {
        console.error('Error loading performance data:', error);
    }
}

// Update Performance Display
function updatePerformanceDisplay() {
    const perf = employeeData.performance;
    
    document.getElementById('weeklySales').textContent = `${perf.weeklySales} sales`;
    document.getElementById('monthlySales').textContent = `${perf.monthlySales} sales`;
    document.getElementById('bestDay').textContent = perf.bestDay;
    document.getElementById('averageSale').textContent = formatCurrency(perf.averageSale);
}

// Load Stock Data
async function loadStockData() {
    try {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const lowStockItems = getLowStockItems();
        
        document.getElementById('totalStockItems').textContent = products.length;
        document.getElementById('lowStockCount').textContent = lowStockItems.length;
    } catch (error) {
        console.error('Error loading stock data:', error);
    }
}

// Load Products
async function loadProducts() {
    try {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const tableBody = document.getElementById('productsTableBody');
        
        if (products.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="no-data-cell">
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
            const isLowStock = product.quantity <= (product.lowStockThreshold || 10);
            const statusClass = isLowStock ? 'low-stock' : 'in-stock';
            const statusText = isLowStock ? 'Low Stock' : 'In Stock';
            const canAdd = product.quantity > 0;
            const cartItem = cart.find(item => item.productId === product.id);
            const isInCart = cartItem !== undefined;
            
            return `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>${product.quantity}</td>
                    <td>${product.unit || 'units'}</td>
                    <td>${formatCurrency(product.sellingPrice || 0)}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>
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
    const tableRows = document.querySelectorAll('#productsTableBody tr');
    
    tableRows.forEach(row => {
        const productName = row.cells[0]?.textContent.toLowerCase() || '';
        const category = row.cells[1]?.textContent.toLowerCase() || '';
        
        if (productName.includes(searchTerm) || category.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Sales Functions
function startNewSale() {
    showToast('Redirecting to sales page...', 'info');
    // For now, redirect to the main sales page
    setTimeout(() => {
        window.location.href = 'sales.html';
    }, 1000);
}

function viewSaleDetails() {
    const saleDetailsCard = document.getElementById('saleDetailsCard');
    const saleDetailsContent = document.getElementById('saleDetailsContent');
    
    // Load today's sales
    const todaySales = getEmployeeSalesToday(employeeData.id);
    
    if (todaySales.length === 0) {
        saleDetailsContent.innerHTML = `
            <div class="no-data">
                <i class="material-icons-round">receipt</i>
                <p>No sales found for today</p>
            </div>
        `;
    } else {
        saleDetailsContent.innerHTML = `
            <div class="sales-summary-header">
                <h3>Today's Sales Summary</h3>
                <p>Total Sales: ${todaySales.length} | Total Revenue: ${formatCurrency(todaySales.reduce((sum, sale) => sum + (sale.total || 0), 0))}</p>
            </div>
            <div class="sales-details-list">
                ${todaySales.map(sale => `
                    <div class="sale-detail-item">
                        <div class="sale-detail-header">
                            <h4>Sale #${sale.id}</h4>
                            <span class="sale-amount">${formatCurrency(sale.total || 0)}</span>
                        </div>
                        <div class="sale-detail-info">
                            <p><strong>Customer:</strong> ${sale.customerName || 'Walk-in Customer'}</p>
                            <p><strong>Payment:</strong> <span class="payment-method ${sale.paymentMethod}">${sale.paymentMethod}</span></p>
                            <p><strong>Time:</strong> ${formatTime(sale.date)}</p>
                        </div>
                        <div class="sale-items">
                            <h5>Items Sold:</h5>
                            <ul>
                                ${(sale.items || []).map(item => `
                                    <li>${item.name} x${item.quantity} - ${formatCurrency(item.total || 0)}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    saleDetailsCard.style.display = 'block';
}

function closeSaleDetails() {
    const saleDetailsCard = document.getElementById('saleDetailsCard');
    saleDetailsCard.style.display = 'none';
}

// Sales Data Functions
function loadSalesData() {
    try {
        const sales = JSON.parse(localStorage.getItem('sales') || '[]');
        allSales = sales.filter(sale => sale.employeeId === employeeData.id);
        filteredSales = [...allSales];
        
        updateSalesStats();
        loadSalesTable();
    } catch (error) {
        console.error('Error loading sales data:', error);
        showToast('Failed to load sales data', 'error');
    }
}

function updateSalesStats() {
    const totalSales = allSales.length;
    const totalAmount = allSales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const averageAmount = totalSales > 0 ? totalAmount / totalSales : 0;
    
    const today = new Date().toDateString();
    const todaySales = allSales.filter(sale => new Date(sale.date).toDateString() === today);
    
    document.getElementById('totalSalesCount').textContent = totalSales;
    document.getElementById('totalSalesAmount').textContent = formatCurrency(totalAmount);
    document.getElementById('averageSaleAmount').textContent = formatCurrency(averageAmount);
    document.getElementById('todaySalesCount').textContent = todaySales.length;
}

function loadSalesTable() {
    const tableBody = document.getElementById('salesTableBody');
    
    if (filteredSales.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data-cell">
                    <div class="no-data">
                        <i class="material-icons-round">receipt</i>
                        <p>No sales found</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = filteredSales.map(sale => {
        const saleDate = new Date(sale.date);
        const itemsCount = sale.items ? sale.items.length : 0;
        const itemsText = itemsCount === 1 ? '1 item' : `${itemsCount} items`;
        
        return `
            <tr>
                <td>${sale.id || 'N/A'}</td>
                <td>
                    <div class="sale-date">
                        <div class="date">${saleDate.toLocaleDateString()}</div>
                        <div class="time">${saleDate.toLocaleTimeString()}</div>
                    </div>
                </td>
                <td>${sale.customerName || 'Walk-in Customer'}</td>
                <td>${itemsText}</td>
                <td>
                    <span class="payment-badge ${sale.paymentMethod}">${sale.paymentMethod}</span>
                </td>
                <td class="sale-total">${formatCurrency(sale.total || 0)}</td>
                <td>
                    <button class="view-details-btn" onclick="viewSaleDetails('${sale.id}')">
                        <i class="material-icons-round">visibility</i>
                        View
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function filterSales() {
    const searchTerm = document.getElementById('salesSearch').value.toLowerCase();
    const filterValue = document.getElementById('salesFilter').value;
    
    filteredSales = allSales.filter(sale => {
        // Search filter
        const matchesSearch = !searchTerm || 
            sale.id.toLowerCase().includes(searchTerm) ||
            (sale.customerName && sale.customerName.toLowerCase().includes(searchTerm)) ||
            (sale.paymentMethod && sale.paymentMethod.toLowerCase().includes(searchTerm));
        
        // Date/payment filter
        let matchesFilter = true;
        const saleDate = new Date(sale.date);
        const now = new Date();
        
        switch (filterValue) {
            case 'today':
                matchesFilter = saleDate.toDateString() === now.toDateString();
                break;
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                matchesFilter = saleDate >= weekAgo;
                break;
            case 'month':
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                matchesFilter = saleDate >= monthAgo;
                break;
            case 'cash':
                matchesFilter = sale.paymentMethod === 'cash';
                break;
            case 'credit':
                matchesFilter = sale.paymentMethod === 'credit';
                break;
        }
        
        return matchesSearch && matchesFilter;
    });
    
    loadSalesTable();
}

function viewSaleDetails(saleId) {
    const sale = allSales.find(s => s.id === saleId);
    if (!sale) {
        showToast('Sale not found', 'error');
        return;
    }
    
    // Create detailed view modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Sale Details - ${sale.id}</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="material-icons-round">close</i>
                </button>
            </div>
            <div class="modal-body">
                <div class="sale-details-info">
                    <div class="detail-row">
                        <span class="label">Sale ID:</span>
                        <span class="value">${sale.id}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Date & Time:</span>
                        <span class="value">${new Date(sale.date).toLocaleString()}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Customer:</span>
                        <span class="value">${sale.customerName || 'Walk-in Customer'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Payment Method:</span>
                        <span class="value payment-badge ${sale.paymentMethod}">${sale.paymentMethod}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Total Amount:</span>
                        <span class="value total-amount">${formatCurrency(sale.total || 0)}</span>
                    </div>
                </div>
                
                <div class="sale-items-details">
                    <h4>Items Sold:</h4>
                    <div class="items-list">
                        ${(sale.items || []).map(item => `
                            <div class="item-detail">
                                <div class="item-name">${item.name}</div>
                                <div class="item-quantity">Qty: ${item.quantity}</div>
                                <div class="item-price">${formatCurrency(item.price)} each</div>
                                <div class="item-total">${formatCurrency(item.total)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function refreshSales() {
    loadSalesData();
    showToast('Sales data refreshed', 'success');
}

function exportSalesToCSV() {
    if (filteredSales.length === 0) {
        showToast('No sales data to export', 'warning');
        return;
    }
    
    // Prepare CSV data
    const csvHeaders = [
        'Sale ID',
        'Date',
        'Time',
        'Customer Name',
        'Payment Method',
        'Total Amount',
        'Items Count',
        'Items Details'
    ];
    
    const csvData = filteredSales.map(sale => {
        const saleDate = new Date(sale.date);
        const itemsDetails = (sale.items || []).map(item => 
            `${item.name} (${item.quantity}x${formatCurrency(item.price)})`
        ).join('; ');
        
        return [
            sale.id || 'N/A',
            saleDate.toLocaleDateString(),
            saleDate.toLocaleTimeString(),
            sale.customerName || 'Walk-in Customer',
            sale.paymentMethod || 'N/A',
            sale.total || 0,
            (sale.items || []).length,
            itemsDetails
        ];
    });
    
    // Create CSV content
    const csvContent = [csvHeaders, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `employee_sales_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`Exported ${filteredSales.length} sales to CSV`, 'success');
}

// Sidebar Functions
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleBtn = document.getElementById('sidebarToggle');
    
    sidebarCollapsed = !sidebarCollapsed;
    
    if (sidebarCollapsed) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('sidebar-collapsed');
        toggleBtn.innerHTML = '<i class="material-icons-round">menu_open</i>';
    } else {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('sidebar-collapsed');
        toggleBtn.innerHTML = '<i class="material-icons-round">menu</i>';
    }
    
    // Save state to localStorage
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
}

function loadSidebarState() {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState === 'true') {
        toggleSidebar();
    }
}

// User Dropdown Functions
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    const toggleBtn = document.querySelector('.dropdown-toggle');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        toggleBtn.style.transform = 'rotate(0deg)';
    } else {
        dropdown.classList.add('show');
        toggleBtn.style.transform = 'rotate(180deg)';
    }
}

function openEmployeeSettings() {
    currentSection = 'settings';
    updateNavigation();
    showSection('settingsSection');
    loadThemeSettings();
    // Force refresh the current theme to ensure it's applied
    const currentTheme = localStorage.getItem('employeeTheme') || 'green';
    selectTheme(currentTheme, false);
    closeUserDropdown();
}

function openEmployeeProfile() {
    currentSection = 'profile';
    updateNavigation();
    showSection('profileSection');
    loadProfileData();
    closeUserDropdown();
}

function logoutEmployee() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear authentication data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('shopName');
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
    closeUserDropdown();
}

function closeUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    const toggleBtn = document.querySelector('.dropdown-toggle');
    
    dropdown.classList.remove('show');
    toggleBtn.style.transform = 'rotate(0deg)';
}

// Profile Functions
function loadProfileData() {
    try {
        // Load user information
        const userName = localStorage.getItem('userName') || 'Jane Smith';
        const userRole = localStorage.getItem('userRole') || 'Cashier';
        const userEmail = 'jane.smith@company.com'; // This would come from user data
        
        document.getElementById('profileName').textContent = userName;
        document.getElementById('profileRole').textContent = userRole;
        document.getElementById('profileEmail').textContent = userEmail;
        
    } catch (error) {
        console.error('Error loading profile data:', error);
        showToast('Failed to load profile data', 'error');
    }
}

// Theme Management Functions
function loadThemeSettings() {
    const currentTheme = localStorage.getItem('employeeTheme') || 'green';
    selectTheme(currentTheme, false);
}

function selectTheme(themeName, save = true) {
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
    
    // Debug: Log theme application
    console.log(`Theme applied: ${themeName}`);
    console.log('Body classes:', body.className);
    console.log('HTML classes:', html.className);
    
    // Update color options UI
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.theme === themeName) {
            option.classList.add('selected');
        }
    });
    
    // Update preview
    updateThemePreview(themeName);
    
    // Save to localStorage
    if (save) {
        localStorage.setItem('employeeTheme', themeName);
        showToast(`Theme changed to ${themeName.charAt(0).toUpperCase() + themeName.slice(1)}`, 'success');
    }
}

function updateThemePreview(themeName) {
    const preview = document.getElementById('themePreview');
    const themeColors = {
        green: { primary: '#10b981', secondary: '#059669' },
        blue: { primary: '#3b82f6', secondary: '#1d4ed8' },
        purple: { primary: '#8b5cf6', secondary: '#7c3aed' },
        red: { primary: '#ef4444', secondary: '#dc2626' },
        orange: { primary: '#f97316', secondary: '#ea580c' },
        teal: { primary: '#14b8a6', secondary: '#0d9488' }
    };
    
    const colors = themeColors[themeName] || themeColors.green;
    
    // Update preview card styles
    preview.style.setProperty('--theme-primary', colors.primary);
    preview.style.setProperty('--theme-secondary', colors.secondary);
}

function loadThemeOnInit() {
    const savedTheme = localStorage.getItem('globalTheme') || localStorage.getItem('employeeTheme') || 'green';
    selectTheme(savedTheme, false);
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const userInfo = document.querySelector('.user-info');
    const dropdown = document.getElementById('userDropdown');
    
    if (!userInfo.contains(event.target)) {
        closeUserDropdown();
    }
});

// Cart Functions
function addToCart(productId) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
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
    
    updateCartModal();
    document.getElementById('cartModal').style.display = 'flex';
}

function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
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
    const products = JSON.parse(localStorage.getItem('products') || '[]');
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
    const paymentMethod = document.getElementById('paymentMethod').value;
    
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
        customerName: customerName || 'Walk-in Customer'
    };
    
    // Add sale to records
    addEmployeeSale(saleData);
    
    // Update product quantities
    const products = JSON.parse(localStorage.getItem('products') || '[]');
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
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    
    // Close modal
    closeCartModal();
    
    // Refresh products table
    loadProducts();
    
    // Refresh dashboard if on dashboard
    if (currentSection === 'dashboard') {
        loadEmployeeData();
    }
}

// Remove old functions that are no longer needed

// Setup Event Listeners
function setupEventListeners() {
    // Sidebar toggle
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // User dropdown
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', toggleUserDropdown);
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('userDropdown');
        const toggle = document.querySelector('.dropdown-toggle');
        
        if (dropdown && !dropdown.contains(event.target) && !toggle.contains(event.target)) {
            dropdown.classList.remove('show');
        }
    });
    
    // Quantity input change for sale summary
    document.addEventListener('input', function(event) {
        if (event.target.id === 'sellQuantity') {
            updateSaleSummary();
        }
    });
    
    // Close modal when clicking outside
    document.addEventListener('click', function(event) {
        const cartModal = document.getElementById('cartModal');
        if (event.target === cartModal) {
            closeCartModal();
        }
    });
}

// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    
    // Save state
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
}

// Toggle User Dropdown
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

// Update Dashboard
function updateDashboard() {
    loadEmployeeData();
}

// Simplified functions for the new layout

// Open Profile Settings
function openProfileSettings() {
    showToast('Profile settings coming soon...', 'info');
}

// Open Notifications
function openNotifications() {
    showToast('Notification settings coming soon...', 'info');
}

// Open Help
function openHelp() {
    showToast('Help system coming soon...', 'info');
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        window.location.href = 'login.html';
    }
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(amount);
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="material-icons-round">${getToastIcon(type)}</i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

function getToastIcon(type) {
    const icons = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info'
    };
    return icons[type] || 'info';
}

// Initialize sidebar state
document.addEventListener('DOMContentLoaded', function() {
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }
});
