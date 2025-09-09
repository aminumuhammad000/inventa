// Inventory Management Module
console.log('Inventory module loaded');

// Global variables
let inventoryData = [];
let suppliers = [];
let categories = [];

// Initialize inventory page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing inventory...');
    
    // Check authentication
    checkAuthentication();
    
    // Initialize sidebar
    initializeSidebar();
    
    // Initialize inventory data
    initializeInventory();
    
    // Set default date
    document.getElementById('purchaseDate').value = new Date().toISOString().split('T')[0];
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

// Initialize inventory data
async function initializeInventory() {
    try {
        // Load inventory data
        await loadInventoryData();
        
        // Load suppliers
        await loadSuppliers();
        
        // Load categories
        await loadCategories();
        
        // Render inventory table
        renderInventoryTable();
        
        // Populate dropdowns
        populateDropdowns();
        
    } catch (error) {
        console.error('Error initializing inventory:', error);
        showToast('Failed to load inventory data', 'error');
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

// Load suppliers from localStorage
async function loadSuppliers() {
    try {
        const savedData = localStorage.getItem('suppliersData');
        if (savedData) {
            suppliers = JSON.parse(savedData);
        } else {
            suppliers = getSampleSuppliers();
            localStorage.setItem('suppliersData', JSON.stringify(suppliers));
        }
        console.log('Loaded suppliers:', suppliers.length);
        
    } catch (error) {
        console.error('Error loading suppliers:', error);
        suppliers = getSampleSuppliers();
    }
}

// Load categories from localStorage
async function loadCategories() {
    try {
        const savedData = localStorage.getItem('categoriesData');
        if (savedData) {
            categories = JSON.parse(savedData);
        } else {
            categories = getSampleCategories();
            localStorage.setItem('categoriesData', JSON.stringify(categories));
        }
        console.log('Loaded categories:', categories.length);
        
    } catch (error) {
        console.error('Error loading categories:', error);
        categories = getSampleCategories();
    }
}

// Render inventory table
function renderInventoryTable() {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    inventoryData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.sku || 'N/A'}</td>
            <td>${item.category_name || 'Uncategorized'}</td>
            <td class="stock-cell ${getStockStatusClass(item.current_stock, item.min_stock_level)}">
                ${item.current_stock}
            </td>
            <td>${item.unit}</td>
            <td>₦${parseFloat(item.cost_price).toFixed(2)}</td>
            <td>₦${parseFloat(item.selling_price).toFixed(2)}</td>
            <td>
                <span class="status-badge ${getStockStatusClass(item.current_stock, item.min_stock_level)}">
                    ${getStockStatus(item.current_stock, item.min_stock_level)}
                </span>
            </td>
            <td>
                <button class="btn-icon" onclick="editItem(${item.id})" title="Edit">
                    <i class="material-icons-round">edit</i>
                </button>
                <button class="btn-icon" onclick="viewItemHistory(${item.id})" title="History">
                    <i class="material-icons-round">history</i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Get stock status class
function getStockStatusClass(currentStock, minStock) {
    if (currentStock === 0) return 'out-of-stock';
    if (currentStock <= minStock) return 'low-stock';
    return 'normal-stock';
}

// Get stock status text
function getStockStatus(currentStock, minStock) {
    if (currentStock === 0) return 'Out of Stock';
    if (currentStock <= minStock) return 'Low Stock';
    return 'In Stock';
}

// Populate dropdowns
function populateDropdowns() {
    // Populate supplier dropdown
    const supplierSelect = document.getElementById('supplier');
    if (supplierSelect) {
        supplierSelect.innerHTML = '<option value="">Select Supplier</option>';
        suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.id;
            option.textContent = supplier.name;
            supplierSelect.appendChild(option);
        });
    }
    
    // Populate item dropdowns
    const itemSelects = document.querySelectorAll('.item-select');
    itemSelects.forEach(select => {
        select.innerHTML = '<option value="">Select Item</option>';
        inventoryData.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.name} (${item.sku || 'N/A'})`;
            select.appendChild(option);
        });
    });
    
    // Populate adjustment item dropdown
    const adjustmentItemSelect = document.getElementById('adjustmentItem');
    if (adjustmentItemSelect) {
        adjustmentItemSelect.innerHTML = '<option value="">Select Item</option>';
        inventoryData.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.name} (Current: ${item.current_stock} ${item.unit})`;
            adjustmentItemSelect.appendChild(option);
        });
    }
}

// Filter inventory
function filterInventory() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const stockFilter = document.getElementById('stockFilter').value;
    
    let filteredData = [...inventoryData];
    
    // Filter by category
    if (categoryFilter) {
        filteredData = filteredData.filter(item => 
            item.category_name === categoryFilter
        );
    }
    
    // Filter by stock status
    if (stockFilter) {
        filteredData = filteredData.filter(item => {
            switch (stockFilter) {
                case 'low':
                    return item.current_stock <= item.min_stock_level && item.current_stock > 0;
                case 'out':
                    return item.current_stock === 0;
                case 'normal':
                    return item.current_stock > item.min_stock_level;
                default:
                    return true;
            }
        });
    }
    
    renderFilteredTable(filteredData);
}

// Search inventory
function searchInventory() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        renderInventoryTable();
        return;
    }
    
    const filteredData = inventoryData.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        (item.sku && item.sku.toLowerCase().includes(searchTerm)) ||
        (item.category_name && item.category_name.toLowerCase().includes(searchTerm))
    );
    
    renderFilteredTable(filteredData);
}

// Render filtered table
function renderFilteredTable(data) {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.sku || 'N/A'}</td>
            <td>${item.category_name || 'Uncategorized'}</td>
            <td class="stock-cell ${getStockStatusClass(item.current_stock, item.min_stock_level)}">
                ${item.current_stock}
            </td>
            <td>${item.unit}</td>
            <td>₦${parseFloat(item.cost_price).toFixed(2)}</td>
            <td>₦${parseFloat(item.selling_price).toFixed(2)}</td>
            <td>
                <span class="status-badge ${getStockStatusClass(item.current_stock, item.min_stock_level)}">
                    ${getStockStatus(item.current_stock, item.min_stock_level)}
                </span>
            </td>
            <td>
                <button class="btn-icon" onclick="editItem(${item.id})" title="Edit">
                    <i class="material-icons-round">edit</i>
                </button>
                <button class="btn-icon" onclick="viewItemHistory(${item.id})" title="History">
                    <i class="material-icons-round">history</i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Modal functions
function openAddPurchaseModal() {
    document.getElementById('addPurchaseModal').classList.add('show');
    populateDropdowns();
}

function openStockAdjustmentModal() {
    document.getElementById('stockAdjustmentModal').classList.add('show');
    populateDropdowns();
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Add item row for purchase
function addItemRow() {
    const container = document.getElementById('purchaseItems');
    const newRow = document.createElement('div');
    newRow.className = 'item-row';
    newRow.innerHTML = `
        <select class="item-select" required>
            <option value="">Select Item</option>
        </select>
        <input type="number" class="quantity-input" placeholder="Quantity" min="1" required>
        <input type="number" class="cost-input" placeholder="Unit Cost" step="0.01" min="0" required>
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
}

// Save purchase
async function savePurchase() {
    try {
        const form = document.getElementById('addPurchaseForm');
        const formData = new FormData(form);
        
        const supplierId = document.getElementById('supplier').value;
        const purchaseDate = document.getElementById('purchaseDate').value;
        const notes = document.getElementById('notes').value;
        
        if (!supplierId || !purchaseDate) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Get purchase items
        const itemRows = document.querySelectorAll('.item-row');
        const purchaseItems = [];
        let totalAmount = 0;
        
        for (let row of itemRows) {
            const itemSelect = row.querySelector('.item-select');
            const quantityInput = row.querySelector('.quantity-input');
            const costInput = row.querySelector('.cost-input');
            
            if (itemSelect.value && quantityInput.value && costInput.value) {
                const quantity = parseInt(quantityInput.value);
                const unitCost = parseFloat(costInput.value);
                const totalCost = quantity * unitCost;
                
                purchaseItems.push({
                    itemId: itemSelect.value,
                    quantity: quantity,
                    unitCost: unitCost,
                    totalCost: totalCost
                });
                
                totalAmount += totalCost;
            }
        }
        
        if (purchaseItems.length === 0) {
            showToast('Please add at least one item', 'error');
            return;
        }
        
        // Save purchase to localStorage
        const purchaseId = Date.now(); // Simple ID generation
        
        // Update item stock in localStorage
        for (let item of purchaseItems) {
            const itemIndex = inventoryData.findIndex(i => i.id == item.itemId);
            if (itemIndex !== -1) {
                inventoryData[itemIndex].current_stock += item.quantity;
            }
        }
        
        // Save updated inventory data
        localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
        
        showToast('Purchase saved successfully!', 'success');
        closeModal('addPurchaseModal');
        
        // Reload inventory data
        await loadInventoryData();
        renderInventoryTable();
        
    } catch (error) {
        console.error('Error saving purchase:', error);
        showToast('Failed to save purchase', 'error');
    }
}

// Save stock adjustment
async function saveStockAdjustment() {
    try {
        const itemId = document.getElementById('adjustmentItem').value;
        const adjustmentType = document.getElementById('adjustmentType').value;
        const quantity = parseInt(document.getElementById('adjustmentQuantity').value);
        const reason = document.getElementById('adjustmentReason').value;
        
        if (!itemId || !adjustmentType || !quantity || !reason) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        // Get current stock
        const item = inventoryData.find(i => i.id == itemId);
        if (!item) {
            showToast('Item not found', 'error');
            return;
        }
        
        let newStock;
        let movementQuantity;
        
        switch (adjustmentType) {
            case 'increase':
                newStock = item.current_stock + quantity;
                movementQuantity = quantity;
                break;
            case 'decrease':
                newStock = item.current_stock - quantity;
                movementQuantity = -quantity;
                break;
            case 'set':
                newStock = quantity;
                movementQuantity = quantity - item.current_stock;
                break;
        }
        
        if (newStock < 0) {
            showToast('Stock cannot be negative', 'error');
            return;
        }
        
        // Update item stock in localStorage
        const itemIndex = inventoryData.findIndex(i => i.id == itemId);
        if (itemIndex !== -1) {
            inventoryData[itemIndex].current_stock = newStock;
            localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
        }
        
        showToast('Stock adjustment saved successfully!', 'success');
        closeModal('stockAdjustmentModal');
        
        // Reload inventory data
        await loadInventoryData();
        renderInventoryTable();
        
    } catch (error) {
        console.error('Error saving stock adjustment:', error);
        showToast('Failed to save stock adjustment', 'error');
    }
}

// Export inventory
async function exportInventory() {
    try {
        const csvContent = generateInventoryCSV();
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        showToast('Inventory exported successfully!', 'success');
        
    } catch (error) {
        console.error('Error exporting inventory:', error);
        showToast('Failed to export inventory', 'error');
    }
}

// Generate CSV content
function generateInventoryCSV() {
    const headers = ['Name', 'SKU', 'Category', 'Current Stock', 'Unit', 'Cost Price', 'Selling Price', 'Status'];
    const rows = inventoryData.map(item => [
        item.name,
        item.sku || 'N/A',
        item.category_name || 'Uncategorized',
        item.current_stock,
        item.unit,
        parseFloat(item.cost_price).toFixed(2),
        parseFloat(item.selling_price).toFixed(2),
        getStockStatus(item.current_stock, item.min_stock_level)
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

// Edit item (placeholder)
function editItem(itemId) {
    showToast('Edit item functionality coming soon!', 'info');
}

// View item history (placeholder)
function viewItemHistory(itemId) {
    showToast('Item history functionality coming soon!', 'info');
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
            name: 'Paint (White)',
            sku: 'PAINT-WHT-001',
            category_name: 'Finishing Materials',
            current_stock: 5,
            unit: 'gallons',
            cost_price: 8000.00,
            selling_price: 10000.00,
            min_stock_level: 10
        }
    ];
}

function getSampleSuppliers() {
    return [
        { id: 1, name: 'Default Supplier', contact_person: 'John Supplier', phone: '+234-800-000-0000' },
        { id: 2, name: 'ABC Construction Supplies', contact_person: 'Jane Doe', phone: '+234-800-000-0001' }
    ];
}

function getSampleCategories() {
    return [
        { id: 1, name: 'Construction Materials', description: 'Cement, steel, bricks, etc.' },
        { id: 2, name: 'Finishing Materials', description: 'Paint, tiles, flooring, etc.' },
        { id: 3, name: 'Fasteners', description: 'Nails, screws, bolts, etc.' }
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

// CSV Import functionality
let csvData = [];
let csvHeaders = [];

function openImportModal() {
    document.getElementById('importModal').style.display = 'flex';
    setupFileUpload();
}

function closeImportModal() {
    document.getElementById('importModal').style.display = 'none';
    resetImportModal();
}

function resetImportModal() {
    csvData = [];
    csvHeaders = [];
    document.getElementById('fileUploadArea').style.display = 'block';
    document.getElementById('importPreview').style.display = 'none';
    document.getElementById('importBtn').disabled = true;
    document.getElementById('csvFileInput').value = '';
}

function setupFileUpload() {
    const uploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('csvFileInput');
    
    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                fileInput.files = files;
                handleFileSelect({ target: { files: files } });
            } else {
                showToast('Please select a CSV file', 'error');
            }
        }
    });
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.csv')) {
        showToast('Please select a CSV file', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            parseCSVData(e.target.result);
        } catch (error) {
            console.error('Error parsing CSV:', error);
            showToast('Error parsing CSV file', 'error');
        }
    };
    reader.readAsText(file);
}

function parseCSVData(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
        showToast('CSV file must have at least a header row and one data row', 'error');
        return;
    }
    
    // Parse headers
    csvHeaders = parseCSVLine(lines[0]);
    
    // Validate headers
    const requiredHeaders = ['Name', 'SKU', 'Category', 'Current Stock', 'Unit', 'Cost Price', 'Selling Price', 'Min Stock Level'];
    const missingHeaders = requiredHeaders.filter(header => !csvHeaders.includes(header));
    
    if (missingHeaders.length > 0) {
        showToast(`Missing required columns: ${missingHeaders.join(', ')}`, 'error');
        return;
    }
    
    // Parse data rows
    csvData = [];
    for (let i = 1; i < lines.length; i++) {
        const row = parseCSVLine(lines[i]);
        if (row.length === csvHeaders.length) {
            const item = {};
            csvHeaders.forEach((header, index) => {
                item[header] = row[index];
            });
            csvData.push(item);
        }
    }
    
    if (csvData.length === 0) {
        showToast('No valid data rows found in CSV', 'error');
        return;
    }
    
    showPreview();
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}

function showPreview() {
    const previewContainer = document.getElementById('importPreview');
    const previewTableHead = document.getElementById('previewTableHead');
    const previewTableBody = document.getElementById('previewTableBody');
    const importSummary = document.getElementById('importSummary');
    
    // Show preview section
    document.getElementById('fileUploadArea').style.display = 'none';
    previewContainer.style.display = 'block';
    
    // Create table headers
    previewTableHead.innerHTML = '';
    const headerRow = document.createElement('tr');
    csvHeaders.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    previewTableHead.appendChild(headerRow);
    
    // Create table body (show first 10 rows)
    previewTableBody.innerHTML = '';
    const displayRows = csvData.slice(0, 10);
    displayRows.forEach(row => {
        const tr = document.createElement('tr');
        csvHeaders.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header] || '';
            tr.appendChild(td);
        });
        previewTableBody.appendChild(tr);
    });
    
    // Show summary
    const newItems = csvData.filter(item => !inventoryData.some(existing => existing.sku === item.SKU));
    const updatedItems = csvData.filter(item => inventoryData.some(existing => existing.sku === item.SKU));
    
    importSummary.innerHTML = `
        <div class="summary-stats">
            <div class="stat-item">
                <span class="stat-label">Total Rows:</span>
                <span class="stat-value">${csvData.length}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">New Items:</span>
                <span class="stat-value">${newItems.length}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Updated Items:</span>
                <span class="stat-value">${updatedItems.length}</span>
            </div>
        </div>
        ${csvData.length > 10 ? `<p class="preview-note">Showing first 10 rows of ${csvData.length} total rows</p>` : ''}
    `;
    
    // Enable import button
    document.getElementById('importBtn').disabled = false;
}

function importCSVData() {
    try {
        let importedCount = 0;
        let updatedCount = 0;
        
        csvData.forEach(csvItem => {
            const existingIndex = inventoryData.findIndex(item => item.sku === csvItem.SKU);
            
            const itemData = {
                id: existingIndex !== -1 ? inventoryData[existingIndex].id : Date.now() + Math.random(),
                name: csvItem.Name,
                sku: csvItem.SKU,
                category_name: csvItem.Category,
                current_stock: parseInt(csvItem['Current Stock']) || 0,
                unit: csvItem.Unit,
                cost_price: parseFloat(csvItem['Cost Price']) || 0,
                selling_price: parseFloat(csvItem['Selling Price']) || 0,
                min_stock_level: parseInt(csvItem['Min Stock Level']) || 0,
                createdAt: existingIndex !== -1 ? inventoryData[existingIndex].createdAt : new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            if (existingIndex !== -1) {
                // Update existing item
                inventoryData[existingIndex] = itemData;
                updatedCount++;
            } else {
                // Add new item
                inventoryData.push(itemData);
                importedCount++;
            }
        });
        
        // Save to localStorage
        localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
        
        // Refresh the inventory table
        renderInventoryTable();
        updateInventoryStats();
        
        // Close modal and show success message
        closeImportModal();
        showToast(`Import completed! ${importedCount} new items added, ${updatedCount} items updated.`, 'success');
        
    } catch (error) {
        console.error('Error importing CSV data:', error);
        showToast('Error importing data', 'error');
    }
}

// Export functions for global access
window.toggleSidebar = toggleSidebar;
window.openAddPurchaseModal = openAddPurchaseModal;
window.openStockAdjustmentModal = openStockAdjustmentModal;
window.closeModal = closeModal;
window.addItemRow = addItemRow;
window.removeItemRow = removeItemRow;
window.savePurchase = savePurchase;
window.saveStockAdjustment = saveStockAdjustment;
window.filterInventory = filterInventory;
window.searchInventory = searchInventory;
window.exportInventory = exportInventory;
window.openImportModal = openImportModal;
window.closeImportModal = closeImportModal;
window.handleFileSelect = handleFileSelect;
window.importCSVData = importCSVData;
window.editItem = editItem;
window.viewItemHistory = viewItemHistory;
window.toggleUserDropdown = toggleUserDropdown;
window.openShopSettings = openShopSettings;
window.openProfileSettings = openProfileSettings;
window.openNotifications = openNotifications;
window.openBackup = openBackup;
window.openHelp = openHelp;
window.logout = logout;
