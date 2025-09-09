// Inventa - Construction Materials Inventory Management System
// Main Application Script

// Global Variables
let currentPage = 'dashboard';
let products = [];
let sales = [];
let customers = [];
let returns = [];
let creditSales = [];
let repayments = [];

// Page Titles and Subtitles
const pageInfo = {
    dashboard: {
        title: 'Dashboard',
        subtitle: 'Welcome back! Here\'s what\'s happening with your business today.'
    },
    inventory: {
        title: 'Inventory Management',
        subtitle: 'Manage your construction materials inventory'
    },
    sales: {
        title: 'Sales Management',
        subtitle: 'Track sales transactions and returns'
    },
    customers: {
        title: 'Customer Management',
        subtitle: 'Manage customer accounts and credit sales'
    },
    reports: {
        title: 'Reports & Analytics',
        subtitle: 'Generate comprehensive business reports'
    },
    analytics: {
        title: 'Analytics',
        subtitle: 'Advanced analytics and insights'
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
        return;
    }

    initializeApp();
    loadData();
    setupEventListeners();
    updateDashboard();
});

// Initialize Application
function initializeApp() {
    console.log('Initializing application...');
    
    // Set up navigation
    setupNavigation();
    
    // Set up search functionality
    setupSearch();
    
    // Set up notifications
    setupNotifications();
    
    // Initialize charts
    initializeCharts();
    
    // Ensure dashboard is shown by default
    setTimeout(() => {
        if (currentPage === 'dashboard') {
            showPage('dashboard');
        }
    }, 100);
}

// Setup Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            console.log('Navigation clicked:', href); // Debug log
            
            if (href && href.endsWith('.html')) {
                // Navigate to separate HTML file
                window.location.href = href;
            } else {
                // Fallback to old page switching method
                const page = this.getAttribute('data-page');
                if (page) {
                    showPage(page);
                }
            }
        });
    });
    
    // Also add click handlers for any other navigation elements
    const allNavLinks = document.querySelectorAll('[data-page]');
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            console.log('Nav link clicked:', page); // Debug log
            if (page) {
                showPage(page);
            }
        });
    });
}

// Show Page
function showPage(pageName) {
    console.log('Showing page:', pageName); // Debug log
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.classList.add('active');
        console.log('Page activated:', pageName);
    } else {
        console.error('Page not found:', pageName);
    }
    
    // Update active nav item
    const activeNavItem = document.querySelector(`[data-page="${pageName}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
        console.log('Nav item activated:', pageName);
    } else {
        console.error('Nav item not found:', pageName);
    }
    
    // Update page title and subtitle
    updatePageHeader(pageName);
    
    // Update current page
    currentPage = pageName;
    
    // Load page-specific data
    loadPageData(pageName);
}

// Update Page Header
function updatePageHeader(pageName) {
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');
    
    if (pageInfo[pageName]) {
        pageTitle.textContent = pageInfo[pageName].title;
        pageSubtitle.textContent = pageInfo[pageName].subtitle;
    }
}

// Load Page Data
function loadPageData(pageName) {
    console.log('Loading page data for:', pageName);
    
    switch (pageName) {
        case 'dashboard':
            console.log('Loading dashboard data...');
            updateDashboard();
            break;
        case 'inventory':
            console.log('Loading inventory data...');
            updateInventoryStats();
            loadInventory();
            break;
        case 'sales':
            console.log('Loading sales data...');
            updateSalesStats();
            loadSales();
            break;
        case 'customers':
            console.log('Loading customers data...');
            updateCustomerStats();
            loadCustomers();
            loadCreditSales();
            loadRepayments();
            break;
        case 'reports':
            console.log('Loading reports data...');
            loadReports();
            break;
        case 'analytics':
            console.log('Loading analytics data...');
            loadAnalytics();
            break;
        default:
            console.log('Unknown page:', pageName);
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Global search
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('input', handleGlobalSearch);
    }
    
    // Tab functionality
    setupTabs();
    
    // Modal functionality
    setupModals();
}

// Setup Search
function setupSearch() {
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleGlobalSearch, 300));
    }
}

// Handle Global Search
function handleGlobalSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
        return;
    }
    
    // Search across products, customers, and sales
    const results = {
        products: products.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.category?.toLowerCase().includes(query)
        ),
        customers: customers.filter(c => 
            c.name.toLowerCase().includes(query) ||
            c.phone.includes(query)
        ),
        sales: sales.filter(s => {
            const product = products.find(p => p.id === s.productId);
            return product && product.name.toLowerCase().includes(query);
        })
    };
    
    // Display search results (implement based on current page)
    displaySearchResults(results);
}

// Display Search Results
function displaySearchResults(results) {
    // This would show search results in a dropdown or modal
    console.log('Search results:', results);
}

// Setup Tabs
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            const parent = this.closest('.tabs').parentElement;
            
            // Remove active class from all tabs and panes
            parent.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            parent.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            this.classList.add('active');
            const targetPane = parent.querySelector(`#${tabName}`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

// Setup Modals
function setupModals() {
    const modalOverlay = document.getElementById('modalOverlay');
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
}

// Load Data from localStorage
function loadData() {
    products = JSON.parse(localStorage.getItem('inventa_products') || '[]');
    sales = JSON.parse(localStorage.getItem('inventa_sales') || '[]');
    customers = JSON.parse(localStorage.getItem('inventa_customers') || '[]');
    returns = JSON.parse(localStorage.getItem('inventa_returns') || '[]');
    creditSales = JSON.parse(localStorage.getItem('inventa_credit_sales') || '[]');
    repayments = JSON.parse(localStorage.getItem('inventa_repayments') || '[]');
    
    // Add sample data if empty
    if (products.length === 0) {
        addSampleData();
    }
}

// Save Data to localStorage
function saveData() {
    localStorage.setItem('inventa_products', JSON.stringify(products));
    localStorage.setItem('inventa_sales', JSON.stringify(sales));
    localStorage.setItem('inventa_customers', JSON.stringify(customers));
    localStorage.setItem('inventa_returns', JSON.stringify(returns));
    localStorage.setItem('inventa_credit_sales', JSON.stringify(creditSales));
    localStorage.setItem('inventa_repayments', JSON.stringify(repayments));
}

// Add Sample Data
function addSampleData() {
    // Sample products
    products = [
        {
            id: 1,
            name: 'Cement Bag (50kg)',
            category: 'Cement',
            cost: 2000,
            price: 2500,
            quantity: 100,
            minStock: 20,
            description: 'High quality cement for construction',
            dateAdded: new Date().toISOString()
        },
        {
            id: 2,
            name: 'Steel Rod (12mm)',
            category: 'Steel',
            cost: 1500,
            price: 1800,
            quantity: 50,
            minStock: 10,
            description: 'Reinforcement steel rod',
            dateAdded: new Date().toISOString()
        },
        {
            id: 3,
            name: 'Sand (Truck Load)',
            category: 'Aggregates',
            cost: 15000,
            price: 18000,
            quantity: 5,
            minStock: 2,
            description: 'Fine sand for construction',
            dateAdded: new Date().toISOString()
        }
    ];
    
    // Sample customers
    customers = [
        {
            id: 1,
            name: 'Aliyu Mohammed',
            phone: '08012345678',
            email: 'aliyu@email.com',
            address: 'Kaduna, Nigeria',
            balance: 5000,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            dateAdded: new Date().toISOString()
        },
        {
            id: 2,
            name: 'Fatima Ibrahim',
            phone: '08087654321',
            email: 'fatima@email.com',
            address: 'Abuja, Nigeria',
            balance: 0,
            dueDate: null,
            dateAdded: new Date().toISOString()
        }
    ];
    
    // Sample sales
    sales = [
        {
            id: 1,
            productId: 1,
            quantity: 2,
            type: 'cash',
            cashier: 'Demo User',
            amount: 5000,
            date: new Date().toISOString(),
            customerId: null
        },
        {
            id: 2,
            productId: 2,
            quantity: 5,
            type: 'credit',
            cashier: 'Demo User',
            amount: 9000,
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            customerId: 1
        }
    ];
    
    saveData();
}

// Update Dashboard
function updateDashboard() {
    updateStats();
    updateLowStockAlerts();
    updateRecentSales();
    updateTopProducts();
    updateQuickStats();
}

// Update Stats
function updateStats() {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + (product.quantity * product.cost), 0);
    const todaySales = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        const today = new Date();
        return saleDate.toDateString() === today.toDateString();
    }).reduce((sum, sale) => sum + sale.amount, 0);
    const totalCredits = customers.reduce((sum, customer) => sum + customer.balance, 0);
    
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalValue').textContent = formatCurrency(totalValue);
    document.getElementById('todaySales').textContent = formatCurrency(todaySales);
    document.getElementById('totalCredits').textContent = formatCurrency(totalCredits);
}

// Update Low Stock Alerts
function updateLowStockAlerts() {
    const lowStockItems = products.filter(product => product.quantity <= product.minStock);
    const alertList = document.getElementById('lowStockList');
    
    if (lowStockItems.length === 0) {
        alertList.innerHTML = `
            <div class="no-data">
                <i class="material-icons-round">inventory_2</i>
                <p>All products are well stocked</p>
            </div>
        `;
    } else {
        alertList.innerHTML = lowStockItems.map(item => `
            <div class="alert-item ${item.quantity === 0 ? 'critical' : 'low'}">
                <div class="alert-text">
                    <strong>${item.name}</strong>
                    <br>
                    <small>Category: ${item.category}</small>
                </div>
                <div class="alert-quantity">${item.quantity} left</div>
            </div>
        `).join('');
    }
}

// Update Recent Sales
function updateRecentSales() {
    const recentSales = sales.slice(-5).reverse();
    const recentSalesList = document.getElementById('recentSales');
    
    if (recentSales.length === 0) {
        recentSalesList.innerHTML = `
            <div class="no-data">
                <i class="material-icons-round">receipt_long</i>
                <p>No recent sales to display</p>
            </div>
        `;
    } else {
        recentSalesList.innerHTML = recentSales.map(sale => {
            const product = products.find(p => p.id === sale.productId);
            const customer = sale.customerId ? customers.find(c => c.id === sale.customerId) : null;
            
            return `
                <div class="recent-item">
                    <div class="recent-info">
                        <div class="recent-product">${product ? product.name : 'Unknown Product'}</div>
                        <div class="recent-details">
                            ${sale.quantity} units • ${sale.type} • ${customer ? customer.name : 'Walk-in'}
                        </div>
                    </div>
                    <div class="recent-amount">${formatCurrency(sale.amount)}</div>
                </div>
            `;
        }).join('');
    }
}

// Update Top Products
function updateTopProducts() {
    const productSales = {};
    
    sales.forEach(sale => {
        if (productSales[sale.productId]) {
            productSales[sale.productId].quantity += sale.quantity;
            productSales[sale.productId].amount += sale.amount;
        } else {
            productSales[sale.productId] = {
                quantity: sale.quantity,
                amount: sale.amount
            };
        }
    });
    
    const topProducts = Object.entries(productSales)
        .map(([productId, data]) => ({
            product: products.find(p => p.id == productId),
            ...data
        }))
        .filter(item => item.product)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);
    
    const topProductsList = document.getElementById('topProducts');
    
    if (topProducts.length === 0) {
        topProductsList.innerHTML = `
            <div class="no-data">
                <i class="material-icons-round">inventory</i>
                <p>No sales data available</p>
            </div>
        `;
    } else {
        topProductsList.innerHTML = topProducts.map(item => `
            <div class="product-item">
                <div class="product-info">
                    <div class="product-name">${item.product.name}</div>
                    <div class="product-sales">${item.quantity} units sold</div>
                </div>
                <div class="product-amount">${formatCurrency(item.amount)}</div>
            </div>
        `).join('');
    }
}

// Update Quick Stats
function updateQuickStats() {
    const activeCustomers = customers.filter(c => c.balance > 0).length;
    const pendingOrders = creditSales.filter(cs => {
        const dueDate = new Date(cs.dueDate);
        return dueDate > new Date() && cs.amount > 0;
    }).length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    }).reduce((sum, sale) => sum + sale.amount, 0);
    
    document.getElementById('activeCustomers').textContent = activeCustomers;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    document.getElementById('monthlyRevenue').textContent = formatCurrency(monthlyRevenue);
}

// Load Inventory
function loadInventory() {
    const inventoryTable = document.getElementById('inventoryTable');
    
    if (products.length === 0) {
        inventoryTable.innerHTML = `
            <tr>
                <td colspan="6" class="no-data">
                    <i class="material-icons-round">inventory_2</i>
                    <p>No products added yet</p>
                </td>
            </tr>
        `;
    } else {
        inventoryTable.innerHTML = products.map(product => `
            <tr>
                <td>
                    <div>
                        <strong>${product.name}</strong>
                        <br>
                        <small class="text-muted">${product.category}</small>
                    </div>
                </td>
                <td>${formatCurrency(product.cost)}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>
                    <span class="status-badge ${product.quantity <= product.minStock ? 'error' : 'success'}">
                        ${product.quantity}
                    </span>
                </td>
                <td>${formatCurrency(product.quantity * product.cost)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-outline" onclick="editProduct(${product.id})">
                            <i class="material-icons-round">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="deleteProduct(${product.id})">
                            <i class="material-icons-round">delete</i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// Load Sales
function loadSales() {
    const salesTable = document.getElementById('salesTable');
    
    if (sales.length === 0) {
        salesTable.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">
                    <i class="material-icons-round">receipt_long</i>
                    <p>No sales recorded yet</p>
                </td>
            </tr>
        `;
    } else {
        salesTable.innerHTML = sales.map(sale => {
            const product = products.find(p => p.id === sale.productId);
            const customer = sale.customerId ? customers.find(c => c.id === sale.customerId) : null;
            
            return `
                <tr>
                    <td>${formatDate(sale.date)}</td>
                    <td>${product ? product.name : 'Unknown Product'}</td>
                    <td>${sale.quantity}</td>
                    <td>
                        <span class="status-badge ${sale.type === 'cash' ? 'success' : 'warning'}">
                            ${sale.type}
                        </span>
                    </td>
                    <td>${sale.cashier}</td>
                    <td>${formatCurrency(sale.amount)}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-outline" onclick="viewSale(${sale.id})">
                                <i class="material-icons-round">visibility</i>
                            </button>
                            ${sale.type === 'cash' ? `
                                <button class="btn btn-sm btn-outline" onclick="returnSale(${sale.id})">
                                    <i class="material-icons-round">undo</i>
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

// Load Customers
function loadCustomers() {
    const customersTable = document.getElementById('customersTable');
    
    if (customers.length === 0) {
        customersTable.innerHTML = `
            <tr>
                <td colspan="5" class="no-data">
                    <i class="material-icons-round">people</i>
                    <p>No customers added yet</p>
                </td>
            </tr>
        `;
    } else {
        customersTable.innerHTML = customers.map(customer => `
            <tr>
                <td>
                    <div>
                        <strong>${customer.name}</strong>
                        <br>
                        <small class="text-muted">${customer.email}</small>
                    </div>
                </td>
                <td>${customer.phone}</td>
                <td>
                    <span class="status-badge ${customer.balance > 0 ? 'warning' : 'success'}">
                        ${formatCurrency(customer.balance)}
                    </span>
                </td>
                <td>${customer.dueDate ? formatDate(customer.dueDate) : 'N/A'}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-outline" onclick="editCustomer(${customer.id})">
                            <i class="material-icons-round">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="recordRepayment(${customer.id})">
                            <i class="material-icons-round">payment</i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// Load Reports
function loadReports() {
    // This would load report data and charts
    console.log('Loading reports...');
}

// Load Analytics
function loadAnalytics() {
    // This would load analytics data and charts
    console.log('Loading analytics...');
}

// Modal Functions
function showModal(title, content) {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    modalTitle.textContent = title;
    modalContent.innerHTML = content;
    modalOverlay.classList.add('active');
}

function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.remove('active');
}

// Product Management
function showAddProductModal() {
    const content = `
        <form id="addProductForm">
            <div class="form-group">
                <label class="form-label">Product Name</label>
                <input type="text" class="form-input" id="productName" required>
            </div>
            <div class="form-group">
                <label class="form-label">Category</label>
                <select class="form-select" id="productCategory" required>
                    <option value="">Select Category</option>
                    <option value="Cement">Cement</option>
                    <option value="Steel">Steel</option>
                    <option value="Aggregates">Aggregates</option>
                    <option value="Blocks">Blocks</option>
                    <option value="Tools">Tools</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Cost Price (₦)</label>
                <input type="number" class="form-input" id="productCost" required>
            </div>
            <div class="form-group">
                <label class="form-label">Selling Price (₦)</label>
                <input type="number" class="form-input" id="productPrice" required>
            </div>
            <div class="form-group">
                <label class="form-label">Initial Quantity</label>
                <input type="number" class="form-input" id="productQuantity" required>
            </div>
            <div class="form-group">
                <label class="form-label">Minimum Stock Level</label>
                <input type="number" class="form-input" id="productMinStock" required>
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea" id="productDescription"></textarea>
            </div>
        </form>
    `;
    
    showModal('Add New Product', content);
    
    // Add form submission handler
    document.getElementById('addProductForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addProduct();
    });
}

function addProduct() {
    const product = {
        id: Date.now(),
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        cost: parseFloat(document.getElementById('productCost').value),
        price: parseFloat(document.getElementById('productPrice').value),
        quantity: parseInt(document.getElementById('productQuantity').value),
        minStock: parseInt(document.getElementById('productMinStock').value),
        description: document.getElementById('productDescription').value,
        dateAdded: new Date().toISOString()
    };
    
    products.push(product);
    saveData();
    closeModal();
    showNotification('Product added successfully!', 'success');
    
    if (currentPage === 'inventory') {
        loadInventory();
    }
    updateDashboard();
}

// Sale Management
function showNewSaleModal() {
    const content = `
        <form id="newSaleForm">
            <div class="form-group">
                <label class="form-label">Product</label>
                <select class="form-select" id="saleProduct" required>
                    <option value="">Select Product</option>
                    ${products.map(product => `
                        <option value="${product.id}" data-price="${product.price}" data-stock="${product.quantity}">
                            ${product.name} (₦${product.price} - Stock: ${product.quantity})
                        </option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Quantity</label>
                <input type="number" class="form-input" id="saleQuantity" required min="1">
            </div>
            <div class="form-group">
                <label class="form-label">Sale Type</label>
                <select class="form-select" id="saleType" required>
                    <option value="cash">Cash</option>
                    <option value="credit">Credit</option>
                </select>
            </div>
            <div class="form-group" id="customerGroup" style="display: none;">
                <label class="form-label">Customer</label>
                <select class="form-select" id="saleCustomer">
                    <option value="">Select Customer</option>
                    ${customers.map(customer => `
                        <option value="${customer.id}">${customer.name} (${customer.phone})</option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Cashier</label>
                <input type="text" class="form-input" id="saleCashier" value="Demo User" required>
            </div>
            <div class="form-group">
                <label class="form-label">Total Amount</label>
                <input type="text" class="form-input" id="saleAmount" readonly>
            </div>
        </form>
    `;
    
    showModal('Record New Sale', content);
    
    // Add event listeners
    const saleType = document.getElementById('saleType');
    const customerGroup = document.getElementById('customerGroup');
    const saleProduct = document.getElementById('saleProduct');
    const saleQuantity = document.getElementById('saleQuantity');
    const saleAmount = document.getElementById('saleAmount');
    
    saleType.addEventListener('change', function() {
        customerGroup.style.display = this.value === 'credit' ? 'block' : 'none';
    });
    
    function calculateAmount() {
        const selectedOption = saleProduct.options[saleProduct.selectedIndex];
        if (selectedOption && saleQuantity.value) {
            const price = parseFloat(selectedOption.dataset.price);
            const quantity = parseInt(saleQuantity.value);
            saleAmount.value = formatCurrency(price * quantity);
        }
    }
    
    saleProduct.addEventListener('change', calculateAmount);
    saleQuantity.addEventListener('input', calculateAmount);
    
    // Add form submission handler
    document.getElementById('newSaleForm').addEventListener('submit', function(e) {
        e.preventDefault();
        recordSale();
    });
}

function recordSale() {
    const productId = parseInt(document.getElementById('saleProduct').value);
    const quantity = parseInt(document.getElementById('saleQuantity').value);
    const type = document.getElementById('saleType').value;
    const customerId = document.getElementById('saleCustomer').value;
    const cashier = document.getElementById('saleCashier').value;
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Product not found!', 'error');
        return;
    }
    
    if (product.quantity < quantity) {
        showNotification('Insufficient stock!', 'error');
        return;
    }
    
    const amount = product.price * quantity;
    
    const sale = {
        id: Date.now(),
        productId: productId,
        quantity: quantity,
        type: type,
        cashier: cashier,
        amount: amount,
        date: new Date().toISOString(),
        customerId: type === 'credit' ? parseInt(customerId) : null
    };
    
    // Update product quantity
    product.quantity -= quantity;
    
    // If credit sale, update customer balance
    if (type === 'credit' && customerId) {
        const customer = customers.find(c => c.id === parseInt(customerId));
        if (customer) {
            customer.balance += amount;
            customer.dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        }
    }
    
    sales.push(sale);
    saveData();
    closeModal();
    showNotification('Sale recorded successfully!', 'success');
    
    if (currentPage === 'sales') {
        loadSales();
    }
    updateDashboard();
}

// Customer Management
function showAddCustomerModal() {
    const content = `
        <form id="addCustomerForm">
            <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-input" id="customerName" required>
            </div>
            <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input type="tel" class="form-input" id="customerPhone" required>
            </div>
            <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-input" id="customerEmail">
            </div>
            <div class="form-group">
                <label class="form-label">Address</label>
                <textarea class="form-textarea" id="customerAddress"></textarea>
            </div>
        </form>
    `;
    
    showModal('Add New Customer', content);
    
    // Add form submission handler
    document.getElementById('addCustomerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addCustomer();
    });
}

function addCustomer() {
    const customer = {
        id: Date.now(),
        name: document.getElementById('customerName').value,
        phone: document.getElementById('customerPhone').value,
        email: document.getElementById('customerEmail').value,
        address: document.getElementById('customerAddress').value,
        balance: 0,
        dueDate: null,
        dateAdded: new Date().toISOString()
    };
    
    customers.push(customer);
    saveData();
    closeModal();
    showNotification('Customer added successfully!', 'success');
    
    if (currentPage === 'customers') {
        loadCustomers();
    }
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.innerHTML = `
        <i class="material-icons-round">${type === 'success' ? 'check_circle' : 'error'}</i>
        ${message}
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Setup Notifications
function setupNotifications() {
    // This would set up real-time notifications
    console.log('Setting up notifications...');
}

// Initialize Charts
function initializeCharts() {
    // This would initialize Chart.js charts
    console.log('Initializing charts...');
}

// Logout Function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userData');
        window.location.href = 'login.html';
    }
}

// Additional Functions for Enhanced Features

// Update Inventory Stats
function updateInventoryStats() {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + (product.quantity * product.cost), 0);
    const lowStockItems = products.filter(product => product.quantity <= product.minStock).length;
    const categories = [...new Set(products.map(p => p.category))].length;
    
    document.getElementById('inventoryTotalProducts').textContent = totalProducts;
    document.getElementById('inventoryTotalValue').textContent = formatCurrency(totalValue);
    document.getElementById('inventoryLowStock').textContent = lowStockItems;
    document.getElementById('inventoryCategories').textContent = categories;
}

// Update Sales Stats
function updateSalesStats() {
    const today = new Date();
    const todaySales = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate.toDateString() === today.toDateString();
    }).reduce((sum, sale) => sum + sale.amount, 0);
    
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthlySales = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    }).reduce((sum, sale) => sum + sale.amount, 0);
    
    const totalTransactions = sales.length;
    const averageSale = totalTransactions > 0 ? sales.reduce((sum, sale) => sum + sale.amount, 0) / totalTransactions : 0;
    
    document.getElementById('salesToday').textContent = formatCurrency(todaySales);
    document.getElementById('salesThisMonth').textContent = formatCurrency(monthlySales);
    document.getElementById('salesTotalTransactions').textContent = totalTransactions;
    document.getElementById('salesAverage').textContent = formatCurrency(averageSale);
}

// Update Customer Stats
function updateCustomerStats() {
    const totalCustomers = customers.length;
    const activeCredits = customers.filter(c => c.balance > 0).length;
    const totalOutstanding = customers.reduce((sum, customer) => sum + customer.balance, 0);
    const overdue = customers.filter(c => {
        if (!c.dueDate) return false;
        return new Date(c.dueDate) < new Date() && c.balance > 0;
    }).length;
    
    document.getElementById('customersTotal').textContent = totalCustomers;
    document.getElementById('customersActiveCredits').textContent = activeCredits;
    document.getElementById('customersTotalOutstanding').textContent = formatCurrency(totalOutstanding);
    document.getElementById('customersOverdue').textContent = overdue;
}

// Load Credit Sales
function loadCreditSales() {
    const creditSalesTable = document.getElementById('creditSalesTable');
    const creditSalesData = sales.filter(sale => sale.type === 'credit');
    
    if (creditSalesData.length === 0) {
        creditSalesTable.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">
                    <i class="material-icons-round">credit_card</i>
                    <p>No credit sales recorded yet</p>
                </td>
            </tr>
        `;
    } else {
        creditSalesTable.innerHTML = creditSalesData.map(sale => {
            const product = products.find(p => p.id === sale.productId);
            const customer = customers.find(c => c.id === sale.customerId);
            
            return `
                <tr>
                    <td>${formatDate(sale.date)}</td>
                    <td>${customer ? customer.name : 'Unknown Customer'}</td>
                    <td>${product ? product.name : 'Unknown Product'}</td>
                    <td>${sale.quantity}</td>
                    <td>${formatCurrency(sale.amount)}</td>
                    <td>${customer && customer.dueDate ? formatDate(customer.dueDate) : 'N/A'}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-outline" onclick="viewSale(${sale.id})">
                                <i class="material-icons-round">visibility</i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

// Load Repayments
function loadRepayments() {
    const repaymentsTable = document.getElementById('repaymentsTable');
    
    if (repayments.length === 0) {
        repaymentsTable.innerHTML = `
            <tr>
                <td colspan="5" class="no-data">
                    <i class="material-icons-round">payment</i>
                    <p>No repayments recorded yet</p>
                </td>
            </tr>
        `;
    } else {
        repaymentsTable.innerHTML = repayments.map(repayment => {
            const customer = customers.find(c => c.id === repayment.customerId);
            
            return `
                <tr>
                    <td>${formatDate(repayment.date)}</td>
                    <td>${customer ? customer.name : 'Unknown Customer'}</td>
                    <td>${formatCurrency(repayment.amount)}</td>
                    <td>${repayment.cashier}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-outline" onclick="viewRepayment(${repayment.id})">
                                <i class="material-icons-round">visibility</i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

// Show Return Modal
function showReturnModal() {
    const content = `
        <form id="returnForm">
            <div class="form-group">
                <label class="form-label">Select Sale</label>
                <select class="form-select" id="returnSale" required>
                    <option value="">Select Sale to Return</option>
                    ${sales.filter(sale => sale.type === 'cash').map(sale => {
                        const product = products.find(p => p.id === sale.productId);
                        return `<option value="${sale.id}">${product ? product.name : 'Unknown'} - ${formatDate(sale.date)} - ${formatCurrency(sale.amount)}</option>`;
                    }).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Return Quantity</label>
                <input type="number" class="form-input" id="returnQuantity" required min="1">
            </div>
            <div class="form-group">
                <label class="form-label">Reason for Return</label>
                <select class="form-select" id="returnReason" required>
                    <option value="">Select Reason</option>
                    <option value="defective">Defective Product</option>
                    <option value="wrong_item">Wrong Item</option>
                    <option value="customer_request">Customer Request</option>
                    <option value="damaged">Damaged in Transit</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Cashier</label>
                <input type="text" class="form-input" id="returnCashier" value="Demo User" required>
            </div>
        </form>
    `;
    
    showModal('Process Return', content);
    
    document.getElementById('returnForm').addEventListener('submit', function(e) {
        e.preventDefault();
        processReturn();
    });
}

// Process Return
function processReturn() {
    const saleId = parseInt(document.getElementById('returnSale').value);
    const quantity = parseInt(document.getElementById('returnQuantity').value);
    const reason = document.getElementById('returnReason').value;
    const cashier = document.getElementById('returnCashier').value;
    
    const sale = sales.find(s => s.id === saleId);
    if (!sale) {
        showNotification('Sale not found!', 'error');
        return;
    }
    
    if (quantity > sale.quantity) {
        showNotification('Return quantity cannot exceed original sale quantity!', 'error');
        return;
    }
    
    const product = products.find(p => p.id === sale.productId);
    if (!product) {
        showNotification('Product not found!', 'error');
        return;
    }
    
    const returnAmount = (sale.amount / sale.quantity) * quantity;
    
    const returnRecord = {
        id: Date.now(),
        saleId: saleId,
        productId: sale.productId,
        quantity: quantity,
        amount: returnAmount,
        reason: reason,
        cashier: cashier,
        date: new Date().toISOString()
    };
    
    // Update product quantity
    product.quantity += quantity;
    
    // Add to returns array
    returns.push(returnRecord);
    
    saveData();
    closeModal();
    showNotification('Return processed successfully!', 'success');
    
    if (currentPage === 'sales') {
        loadSales();
    }
    updateDashboard();
}

// Show Repayment Modal
function showRepaymentModal() {
    const content = `
        <form id="repaymentForm">
            <div class="form-group">
                <label class="form-label">Customer</label>
                <select class="form-select" id="repaymentCustomer" required>
                    <option value="">Select Customer</option>
                    ${customers.filter(c => c.balance > 0).map(customer => `
                        <option value="${customer.id}">${customer.name} - ${formatCurrency(customer.balance)}</option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Payment Amount (₦)</label>
                <input type="number" class="form-input" id="repaymentAmount" required min="1">
            </div>
            <div class="form-group">
                <label class="form-label">Cashier</label>
                <input type="text" class="form-input" id="repaymentCashier" value="Demo User" required>
            </div>
        </form>
    `;
    
    showModal('Record Payment', content);
    
    document.getElementById('repaymentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        recordRepayment();
    });
}

// Record Repayment
function recordRepayment() {
    const customerId = parseInt(document.getElementById('repaymentCustomer').value);
    const amount = parseFloat(document.getElementById('repaymentAmount').value);
    const cashier = document.getElementById('repaymentCashier').value;
    
    const customer = customers.find(c => c.id === customerId);
    if (!customer) {
        showNotification('Customer not found!', 'error');
        return;
    }
    
    if (amount > customer.balance) {
        showNotification('Payment amount cannot exceed customer balance!', 'error');
        return;
    }
    
    const repayment = {
        id: Date.now(),
        customerId: customerId,
        amount: amount,
        cashier: cashier,
        date: new Date().toISOString()
    };
    
    // Update customer balance
    customer.balance -= amount;
    if (customer.balance === 0) {
        customer.dueDate = null;
    }
    
    repayments.push(repayment);
    saveData();
    closeModal();
    showNotification('Payment recorded successfully!', 'success');
    
    if (currentPage === 'customers') {
        loadCustomers();
    }
    updateDashboard();
}

// Export Functions
function exportInventory() {
    const csvContent = generateInventoryCSV();
    downloadCSV(csvContent, 'inventory.csv');
}

function exportSales() {
    const csvContent = generateSalesCSV();
    downloadCSV(csvContent, 'sales.csv');
}

function exportCustomers() {
    const csvContent = generateCustomersCSV();
    downloadCSV(csvContent, 'customers.csv');
}

function exportReport() {
    const csvContent = generateReportCSV();
    downloadCSV(csvContent, 'report.csv');
}

// Generate CSV Functions
function generateInventoryCSV() {
    const headers = ['Product Name', 'Category', 'Cost Price', 'Selling Price', 'Quantity', 'Total Value', 'Date Added'];
    const rows = products.map(product => [
        product.name,
        product.category,
        product.cost,
        product.price,
        product.quantity,
        product.quantity * product.cost,
        formatDate(product.dateAdded)
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function generateSalesCSV() {
    const headers = ['Date', 'Product', 'Quantity', 'Type', 'Customer', 'Cashier', 'Amount'];
    const rows = sales.map(sale => {
        const product = products.find(p => p.id === sale.productId);
        const customer = sale.customerId ? customers.find(c => c.id === sale.customerId) : null;
        
        return [
            formatDate(sale.date),
            product ? product.name : 'Unknown',
            sale.quantity,
            sale.type,
            customer ? customer.name : 'Walk-in',
            sale.cashier,
            sale.amount
        ];
    });
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function generateCustomersCSV() {
    const headers = ['Name', 'Phone', 'Email', 'Address', 'Balance', 'Due Date', 'Date Added'];
    const rows = customers.map(customer => [
        customer.name,
        customer.phone,
        customer.email,
        customer.address,
        customer.balance,
        customer.dueDate ? formatDate(customer.dueDate) : 'N/A',
        formatDate(customer.dateAdded)
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function generateReportCSV() {
    const headers = ['Report Type', 'Period', 'Total Sales', 'Total Profit', 'Transactions', 'Average Sale'];
    const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const totalCost = sales.reduce((sum, sale) => {
        const product = products.find(p => p.id === sale.productId);
        return sum + (product ? product.cost * sale.quantity : 0);
    }, 0);
    const totalProfit = totalSales - totalCost;
    const transactions = sales.length;
    const averageSale = transactions > 0 ? totalSales / transactions : 0;
    
    const row = [
        'Sales Report',
        'All Time',
        totalSales,
        totalProfit,
        transactions,
        averageSale
    ];
    
    return [headers, row].map(row => row.join(',')).join('\n');
}

// Download CSV
function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Generate Report
function generateReport() {
    const period = document.getElementById('reportPeriod').value;
    let filteredSales = sales;
    
    // Filter sales by period
    const now = new Date();
    switch (period) {
        case 'today':
            filteredSales = sales.filter(sale => {
                const saleDate = new Date(sale.date);
                return saleDate.toDateString() === now.toDateString();
            });
            break;
        case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredSales = sales.filter(sale => new Date(sale.date) >= weekAgo);
            break;
        case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filteredSales = sales.filter(sale => new Date(sale.date) >= monthAgo);
            break;
        case 'quarter':
            const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            filteredSales = sales.filter(sale => new Date(sale.date) >= quarterAgo);
            break;
        case 'year':
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            filteredSales = sales.filter(sale => new Date(sale.date) >= yearAgo);
            break;
    }
    
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.amount, 0);
    const totalCost = filteredSales.reduce((sum, sale) => {
        const product = products.find(p => p.id === sale.productId);
        return sum + (product ? product.cost * sale.quantity : 0);
    }, 0);
    const grossProfit = totalSales - totalCost;
    const totalTransactions = filteredSales.length;
    const averageSale = totalTransactions > 0 ? totalSales / totalTransactions : 0;
    
    document.getElementById('reportTotalSales').textContent = formatCurrency(totalSales);
    document.getElementById('reportGrossProfit').textContent = formatCurrency(grossProfit);
    document.getElementById('reportTotalTransactions').textContent = totalTransactions;
    document.getElementById('reportAverageSale').textContent = formatCurrency(averageSale);
    
    showNotification('Report generated successfully!', 'success');
}

// Refresh Analytics
function refreshAnalytics() {
    // Calculate analytics metrics
    const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const totalCost = sales.reduce((sum, sale) => {
        const product = products.find(p => p.id === sale.productId);
        return sum + (product ? product.cost * sale.quantity : 0);
    }, 0);
    const grossProfit = totalSales - totalCost;
    const profitMargin = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;
    
    // Calculate growth rate (simplified)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonthSales = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    }).reduce((sum, sale) => sum + sale.amount, 0);
    
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthSales = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate.getMonth() === lastMonth && saleDate.getFullYear() === lastMonthYear;
    }).reduce((sum, sale) => sum + sale.amount, 0);
    
    const growthRate = lastMonthSales > 0 ? ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100 : 0;
    
    // Calculate customer retention (simplified)
    const uniqueCustomers = [...new Set(sales.filter(s => s.customerId).map(s => s.customerId))].length;
    const repeatCustomers = customers.filter(c => {
        const customerSales = sales.filter(s => s.customerId === c.id);
        return customerSales.length > 1;
    }).length;
    const retention = uniqueCustomers > 0 ? (repeatCustomers / uniqueCustomers) * 100 : 0;
    
    // Calculate inventory turnover (simplified)
    const totalInventoryValue = products.reduce((sum, product) => sum + (product.quantity * product.cost), 0);
    const turnover = totalInventoryValue > 0 ? totalSales / totalInventoryValue : 0;
    
    document.getElementById('analyticsGrowthRate').textContent = `${growthRate.toFixed(1)}%`;
    document.getElementById('analyticsRetention').textContent = `${retention.toFixed(1)}%`;
    document.getElementById('analyticsTurnover').textContent = `${turnover.toFixed(1)}x`;
    document.getElementById('analyticsMargin').textContent = `${profitMargin.toFixed(1)}%`;
    
    showNotification('Analytics refreshed successfully!', 'success');
}

// Initialize Charts
function initializeCharts() {
    // Initialize Chart.js charts when the page loads
    if (typeof Chart !== 'undefined') {
        // Sales Chart
        const salesCtx = document.getElementById('salesChart');
        if (salesCtx) {
            new Chart(salesCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Sales',
                        data: [12000, 19000, 15000, 25000, 22000, 30000],
                        borderColor: '#0d9488',
                        backgroundColor: 'rgba(13, 148, 136, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
        
        // Sales Type Chart
        const salesTypeCtx = document.getElementById('salesTypeChart');
        if (salesTypeCtx) {
            const cashSales = sales.filter(s => s.type === 'cash').length;
            const creditSales = sales.filter(s => s.type === 'credit').length;
            
            new Chart(salesTypeCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Cash', 'Credit'],
                    datasets: [{
                        data: [cashSales, creditSales],
                        backgroundColor: ['#0d9488', '#f97316']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }
}

// Global Functions (for onclick handlers)
window.showAddProductModal = showAddProductModal;
window.showNewSaleModal = showNewSaleModal;
window.showAddCustomerModal = showAddCustomerModal;
window.showReports = () => showPage('reports');
window.closeModal = closeModal;
window.logout = logout;
window.showReturnModal = showReturnModal;
window.showRepaymentModal = showRepaymentModal;
window.exportInventory = exportInventory;
window.exportSales = exportSales;
window.exportCustomers = exportCustomers;
window.exportReport = exportReport;
window.generateReport = generateReport;
window.refreshAnalytics = refreshAnalytics;

// Navigation functions
window.showPage = showPage;
window.showDashboard = () => showPage('dashboard');
window.showInventory = () => showPage('inventory');
window.showSales = () => showPage('sales');
window.showCustomers = () => showPage('customers');
window.showAnalytics = () => showPage('analytics');
