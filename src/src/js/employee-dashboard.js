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
    window.location.href = '/login';
        return;
    }

    // Force reinitialize data to include new fields
    localStorage.removeItem('employeeDataInitialized');
    localStorage.removeItem('products');
    localStorage.removeItem('sales');
    localStorage.removeItem('customers');

    // Initialize sample data first
    initializeEmployeeData();
    
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
    const employeeName = localStorage.getItem('userName') || 'Usman Umar';
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
    
    // Get products data for image lookup
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    recentSalesList.innerHTML = sales.map(sale => {
        // Get first product image for display
        const firstItem = sale.items?.[0];
        const product = firstItem ? products.find(p => p.id === firstItem.productId) : null;
        const imageUrl = product?.image || 'https://via.placeholder.com/40x40?text=No+Image';
        
        return `
            <div class="sale-item">
                <div class="sale-product-preview">
                    <img src="${imageUrl}" 
                         alt="${firstItem?.name || 'Product'}" 
                         class="recent-sale-thumbnail"
                         onerror="this.src='https://via.placeholder.com/40x40?text=No+Image'">
                </div>
                <div class="sale-info">
                    <h4>Sale #${sale.id || 'N/A'}</h4>
                    <p>${sale.customerName || 'Walk-in Customer'}</p>
                    <p class="sale-items-preview">${sale.items?.length || 0} item(s)</p>
                </div>
                <div class="sale-details">
                    <span class="sale-amount">${formatCurrency(sale.total || 0)}</span>
                    <span class="sale-method ${sale.paymentMethod}">${sale.paymentMethod}</span>
                </div>
                <div class="sale-time">${formatTime(sale.date)}</div>
            </div>
        `;
    }).join('');
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
        
        // Debug: Log products to see if they have image and brand data
        console.log('Products loaded:', products);
        if (products.length > 0) {
            console.log('First product:', products[0]);
        }
        
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
                                 onerror="this.src='https://via.placeholder.com/60x60?text=No+Image'"
                                 onload="console.log('Image loaded successfully:', this.src)"
                                 onerror="console.log('Image failed to load:', this.src)">
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
    const products = JSON.parse(localStorage.getItem('products') || '[]');
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
    const products = JSON.parse(localStorage.getItem('products') || '[]');
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
    localStorage.setItem('employeeCart', JSON.stringify(cart));
    
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

// Complete Sale Function - Permanently reduce stock
function completeSale() {
    if (cart.length === 0) {
        showToast('No items in cart to sell!', 'warning');
        return;
    }
    
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    let stockUpdated = false;
    
    // Reduce stock for each item in cart
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        if (product) {
            product.quantity -= cartItem.quantity;
            stockUpdated = true;
        }
    });
    
    if (stockUpdated) {
        // Save updated products
        localStorage.setItem('products', JSON.stringify(products));
        
        // Clear cart
        cart = [];
        localStorage.setItem('employeeCart', JSON.stringify(cart));
        
        // Update displays
        updateCartDisplay();
        loadProducts();
        
        showToast('Sale completed! Stock has been reduced.', 'success');
    }
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
    
    // Get products data for image lookup
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    tableBody.innerHTML = filteredSales.map(sale => {
        const saleDate = new Date(sale.date);
        const itemsCount = sale.items ? sale.items.length : 0;
        const itemsText = itemsCount === 1 ? '1 item' : `${itemsCount} items`;
        
        // Create product images display
        const productImages = (sale.items || []).slice(0, 3).map(item => {
            const product = products.find(p => p.id === item.productId);
            const imageUrl = product?.image || 'https://via.placeholder.com/40x40?text=No+Image';
            return `
                <div class="sale-product-image" title="${item.name}">
                    <img src="${imageUrl}" 
                         alt="${item.name}" 
                         class="sale-product-thumbnail"
                         onerror="this.src='https://via.placeholder.com/40x40?text=No+Image'">
                </div>
            `;
        }).join('');
        
        const moreItemsIndicator = itemsCount > 3 ? `<div class="more-items">+${itemsCount - 3}</div>` : '';
        
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
                <td>
                    <div class="sale-products-container">
                        <div class="sale-product-images">
                            ${productImages}
                            ${moreItemsIndicator}
                        </div>
                        <div class="sale-items-count">${itemsText}</div>
                    </div>
                </td>
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
    
    // Get products data for image lookup
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
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
                        ${(sale.items || []).map(item => {
                            const product = products.find(p => p.id === item.productId);
                            const imageUrl = product?.image || 'https://via.placeholder.com/60x60?text=No+Image';
                            return `
                                <div class="item-detail">
                                    <div class="item-image">
                                        <img src="${imageUrl}" 
                                             alt="${item.name}" 
                                             class="item-thumbnail"
                                             onerror="this.src='https://via.placeholder.com/60x60?text=No+Image'">
                                    </div>
                                    <div class="item-info">
                                        <div class="item-name">${item.name}</div>
                                        <div class="item-brand">${product?.brand || 'N/A'}</div>
                                        <div class="item-quantity">Qty: ${item.quantity}</div>
                                        <div class="item-price">${formatCurrency(item.price)} each</div>
                                        <div class="item-total">${formatCurrency(item.total)}</div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
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
    window.location.href = '/login';
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
        const userName = localStorage.getItem('userName') || 'Usman Umar';
        const userRole = localStorage.getItem('userRole') || 'Cashier';
        const userEmail = 'usman.umar@company.com'; // This would come from user data
        
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
    loadGlobalTheme();
}

function selectTheme(themeName, save = false) {
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
    
    // Update avatar colors
    updateAvatarColors(themeName);
    
    // Update theme status
    updateThemeStatus(`Selected: ${themeName.charAt(0).toUpperCase() + themeName.slice(1)} theme. Click Save to apply globally.`);
    
    // Store the selected theme for saving
    window.currentSelectedTheme = themeName;
    
    // Save to localStorage only if explicitly requested
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

// Global Theme Management Functions
function saveGlobalTheme() {
    console.log('=== SAVE THEME FUNCTION CALLED ===');
    
    // Get the currently selected theme from the UI
    const selectedOption = document.querySelector('.color-option.selected');
    console.log('Selected option:', selectedOption);
    
    if (!selectedOption) {
        console.log('No theme selected, trying to get from stored theme');
        const storedTheme = localStorage.getItem('employeeTheme') || 'green';
        console.log('Using stored theme:', storedTheme);
        saveThemeDirectly(storedTheme);
        return;
    }
    
    const currentTheme = selectedOption.dataset.theme;
    console.log('Selected theme:', currentTheme);
    
    if (!currentTheme) {
        updateThemeStatus('Please select a theme first!', 'error');
        return;
    }
    
    saveThemeDirectly(currentTheme);
}

function saveThemeDirectly(themeName) {
    console.log('Saving theme directly:', themeName);
    
    try {
        // Use global theme manager if available
        if (window.GlobalThemeManager) {
            window.GlobalThemeManager.saveTheme(themeName);
        } else {
            // Fallback to localStorage
        localStorage.setItem('globalTheme', themeName);
        localStorage.setItem('employeeTheme', themeName);
        localStorage.setItem('ownerTheme', themeName);
        }
        
        // Also save employee name
        localStorage.setItem('userName', 'Usman Umar');
        
        console.log('Theme saved to localStorage:', themeName);
        
        // Apply theme immediately
        const body = document.body;
        const html = document.documentElement;
        const existingThemes = ['green', 'blue', 'purple', 'red', 'orange', 'teal'];
        
        existingThemes.forEach(theme => {
            body.classList.remove(`theme-${theme}`);
            html.classList.remove(`theme-${theme}`);
        });
        
        body.classList.add(`theme-${themeName}`);
        html.classList.add(`theme-${themeName}`);
        
        console.log('Theme applied to body and html:', themeName);
        
        // Force avatar color update
        updateAvatarColors(themeName);
        
        // Update employee name display
        updateEmployeeNameDisplay();
        
        // Update theme status
        updateThemeStatus(`✅ ${themeName.charAt(0).toUpperCase() + themeName.slice(1)} theme saved globally!`, 'success');
        
        // Show success message
        showToast(`Theme saved globally! It will apply to all pages including storefront.`, 'success');
        
        // Update save button
        const saveBtn = document.getElementById('saveThemeBtn');
        if (saveBtn) {
            saveBtn.innerHTML = `
                <i class="material-icons-round">check</i>
                Theme Saved
            `;
            saveBtn.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
            
            // Reset button after 3 seconds
            setTimeout(() => {
                saveBtn.innerHTML = `
                    <i class="material-icons-round">save</i>
                    Save Theme
                `;
                saveBtn.style.background = 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))';
            }, 3000);
        }
        
        console.log('Theme save completed successfully');
        
    } catch (error) {
        console.error('Error in saveThemeDirectly:', error);
        updateThemeStatus('❌ Failed to save theme. Please try again.', 'error');
        showToast('Failed to save theme', 'error');
    }
}

// Function to update employee name display
function updateEmployeeNameDisplay() {
    const employeeName = 'Usman Umar';
    const initials = 'UU';
    
    // Update main header
    const employeeNameElement = document.getElementById('employeeName');
    const employeeAvatarElement = document.getElementById('employeeAvatar');
    
    if (employeeNameElement) {
        employeeNameElement.textContent = employeeName;
    }
    
    if (employeeAvatarElement) {
        employeeAvatarElement.textContent = initials;
    }
    
    // Update dropdown
    const dropdownUserNameElement = document.getElementById('dropdownUserName');
    if (dropdownUserNameElement) {
        dropdownUserNameElement.textContent = employeeName;
    }
    
    // Update profile
    const profileNameElement = document.getElementById('profileName');
    if (profileNameElement) {
        profileNameElement.textContent = employeeName;
    }
    
    console.log('Employee name updated to:', employeeName);
}

// Function to update avatar colors based on theme
function updateAvatarColors(themeName) {
    console.log('Updating avatar colors for theme:', themeName);
    
    // Get theme colors
    const themeColors = getThemeColors(themeName);
    
    // Update all avatar elements
    const avatars = document.querySelectorAll('.user-avatar, .user-avatar-small, .profile-avatar-large, .preview-avatar');
    
    avatars.forEach(avatar => {
        avatar.style.background = `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`;
        avatar.style.boxShadow = `0 4px 16px rgba(${themeColors.primaryRgb}, 0.3)`;
    });
    
    console.log('Avatar colors updated:', themeColors);
}

// Function to get theme colors
function getThemeColors(themeName) {
    const themes = {
        green: {
            primary: '#10b981',
            secondary: '#059669',
            primaryRgb: '16, 185, 129'
        },
        blue: {
            primary: '#3b82f6',
            secondary: '#2563eb',
            primaryRgb: '59, 130, 246'
        },
        purple: {
            primary: '#8b5cf6',
            secondary: '#7c3aed',
            primaryRgb: '139, 92, 246'
        },
        red: {
            primary: '#ef4444',
            secondary: '#dc2626',
            primaryRgb: '239, 68, 68'
        },
        orange: {
            primary: '#f97316',
            secondary: '#ea580c',
            primaryRgb: '249, 115, 22'
        },
        teal: {
            primary: '#14b8a6',
            secondary: '#0d9488',
            primaryRgb: '20, 184, 166'
        }
    };
    
    return themes[themeName] || themes.green;
}

function updateThemeStatus(message, type = 'info') {
    const statusElement = document.getElementById('themeStatus');
    if (!statusElement) return;
    
    statusElement.innerHTML = `
        <i class="material-icons-round">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}</i>
        <span>${message}</span>
    `;
    
    // Update status class
    statusElement.className = `theme-status ${type}`;
}

function loadGlobalTheme() {
    const globalTheme = localStorage.getItem('globalTheme');
    if (globalTheme) {
        selectTheme(globalTheme, false);
        updateAvatarColors(globalTheme);
        updateThemeStatus(`Current global theme: ${globalTheme.charAt(0).toUpperCase() + globalTheme.slice(1)}`, 'success');
    } else {
        updateThemeStatus('Select a theme and click Save to apply globally', 'info');
    }
}

// Debug function for theme selection
function debugThemeSelection() {
    console.log('=== THEME DEBUG ===');
    console.log('Current selected theme:', window.currentSelectedTheme);
    console.log('Selected element:', document.querySelector('.color-option.selected'));
    console.log('All color options:', document.querySelectorAll('.color-option'));
    console.log('Global theme:', localStorage.getItem('globalTheme'));
    console.log('Employee theme:', localStorage.getItem('employeeTheme'));
    console.log('Theme manager available:', typeof window.saveGlobalTheme);
    console.log('==================');
}

// Simple test function for theme saving
function testThemeSave() {
    console.log('Testing theme save...');
    const testTheme = 'blue';
    
    try {
        localStorage.setItem('globalTheme', testTheme);
        localStorage.setItem('employeeTheme', testTheme);
        localStorage.setItem('ownerTheme', testTheme);
        
        console.log('Theme saved successfully:', testTheme);
        console.log('Stored values:');
        console.log('- globalTheme:', localStorage.getItem('globalTheme'));
        console.log('- employeeTheme:', localStorage.getItem('employeeTheme'));
        console.log('- ownerTheme:', localStorage.getItem('ownerTheme'));
        
        return true;
    } catch (error) {
        console.error('Theme save test failed:', error);
        return false;
    }
}

// Manual theme save functions for testing
function saveGreenTheme() {
    console.log('Manually saving green theme...');
    saveThemeDirectly('green');
}

function saveBlueTheme() {
    console.log('Manually saving blue theme...');
    saveThemeDirectly('blue');
}

function savePurpleTheme() {
    console.log('Manually saving purple theme...');
    saveThemeDirectly('purple');
}

function saveRedTheme() {
    console.log('Manually saving red theme...');
    saveThemeDirectly('red');
}

function saveOrangeTheme() {
    console.log('Manually saving orange theme...');
    saveThemeDirectly('orange');
}

function saveTealTheme() {
    console.log('Manually saving teal theme...');
    saveThemeDirectly('teal');
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

// Image Modal Functions
function openImageModal(productId) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
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

// Debug function to check data
function debugData() {
    console.log('=== DEBUG DATA ===');
    console.log('Products:', JSON.parse(localStorage.getItem('products') || '[]'));
    console.log('Employee Data Initialized:', localStorage.getItem('employeeDataInitialized'));
    console.log('Cart:', cart);
    console.log('==================');
}

// Function to manually refresh data
function refreshData() {
    localStorage.removeItem('employeeDataInitialized');
    localStorage.removeItem('products');
    localStorage.removeItem('sales');
    localStorage.removeItem('customers');
    
    // Reinitialize data
    initializeEmployeeData();
    loadProducts();
    showToast('Data refreshed successfully', 'success');
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
        const imageModal = document.getElementById('imageModal');
        if (event.target === cartModal) {
            closeCartModal();
        }
        if (event.target === imageModal) {
            closeImageModal();
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
    window.location.href = '/login';
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
