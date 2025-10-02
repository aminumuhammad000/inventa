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
    
    // Initialize theme
    initializeTheme();
    
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
        
        // Setup image preview
        setupImagePreview();
        
        // Populate category and brand dropdowns
        populateCategoryDropdown();
        populateBrandDropdown();
        
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
            <td class="product-image-cell">
                <div class="product-image" onclick="openImageModal('${item.image || 'https://via.placeholder.com/80x80?text=No+Image'}')">
                    <img src="${item.image || 'https://via.placeholder.com/80x80?text=No+Image'}" 
                         alt="${item.name}" 
                         onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'">
                </div>
            </td>
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
                <button class="btn-icon" onclick="openStockAdjustment(${item.id})" title="Stock Adjustment">
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
            <td class="product-image-cell">
                <div class="product-image" onclick="openImageModal('${item.image || 'https://via.placeholder.com/80x80?text=No+Image'}')">
                    <img src="${item.image || 'https://via.placeholder.com/80x80?text=No+Image'}" 
                         alt="${item.name}" 
                         onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'">
                </div>
            </td>
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
                <button class="btn-icon" onclick="openStockAdjustment(${item.id})" title="Stock Adjustment">
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

// Purchase form functions
function togglePurchaseForm() {
    const formSection = document.getElementById('purchaseFormSection');
    if (formSection.style.display === 'none') {
        openPurchaseForm();
    } else {
        closePurchaseForm();
    }
}

function openPurchaseForm() {
    const formSection = document.getElementById('purchaseFormSection');
    formSection.style.display = 'block';
    populateDropdowns();
    
    // Scroll to form
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closePurchaseForm() {
    const formSection = document.getElementById('purchaseFormSection');
    formSection.style.display = 'none';
    
    // Reset form
    document.getElementById('addPurchaseForm').reset();
    
    // Reset to single item row
    const itemsContainer = document.getElementById('purchaseItems');
    itemsContainer.innerHTML = `
        <div class="item-row">
            <select class="item-select" required>
                <option value="">Select Item</option>
            </select>
            <input type="number" class="quantity-input" placeholder="Quantity" min="1" required>
            <input type="number" class="cost-input" placeholder="Unit Cost" step="0.01" min="0" required>
            <button type="button" class="btn-remove" onclick="removeItemRow(this)">
                <i class="material-icons-round">remove</i>
            </button>
        </div>
    `;
    populateDropdowns();
}

// Stock Adjustment form functions
function toggleStockAdjustmentForm() {
    const formSection = document.getElementById('stockAdjustmentSection');
    if (formSection.style.display === 'none') {
        openStockAdjustmentForm();
    } else {
        closeStockAdjustmentForm();
    }
}

function openStockAdjustmentForm() {
    const formSection = document.getElementById('stockAdjustmentSection');
    formSection.style.display = 'block';
    populateDropdowns();
    
    // Scroll to form
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeStockAdjustmentForm() {
    const formSection = document.getElementById('stockAdjustmentSection');
    formSection.style.display = 'none';
    
    // Reset form
    document.getElementById('stockAdjustmentForm').reset();
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
        closePurchaseForm();
        
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
        closeStockAdjustmentForm();
        
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

// Edit item
function editItem(itemId) {
    const item = inventoryData.find(i => i.id === itemId);
    if (!item) {
        showToast('Item not found!', 'error');
        return;
    }
    
    // Populate edit form with item data
    document.getElementById('editItemId').value = item.id;
    document.getElementById('editItemName').value = item.name;
    document.getElementById('editItemSku').value = item.sku;
    document.getElementById('editItemCategory').value = item.category;
    document.getElementById('editItemUnit').value = item.unit;
    document.getElementById('editItemCostPrice').value = item.cost_price;
    document.getElementById('editItemSellingPrice').value = item.selling_price;
    document.getElementById('editItemCurrentStock').value = item.current_stock;
    document.getElementById('editItemMinStock').value = item.min_stock_level;
    document.getElementById('editItemDescription').value = item.description || '';
    document.getElementById('editItemImage').value = item.image || '';
    
    // Show edit form
    openEditItemForm();
}

// Open edit item form
function openEditItemForm() {
    const formSection = document.getElementById('editItemSection');
    formSection.style.display = 'block';
    
    // Focus on first input
    document.getElementById('editItemName').focus();
    
    // Scroll to form
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Close edit item form
function closeEditItemForm() {
    const formSection = document.getElementById('editItemSection');
    formSection.style.display = 'none';
    
    // Reset form
    document.getElementById('editItemForm').reset();
}

// Update item
function updateItem() {
    const form = document.getElementById('editItemForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const itemId = parseInt(document.getElementById('editItemId').value);
    const itemIndex = inventoryData.findIndex(i => i.id === itemId);
    
    if (itemIndex === -1) {
        showToast('Item not found!', 'error');
        return;
    }
    
    // Check if SKU is unique (excluding current item)
    const newSku = document.getElementById('editItemSku').value;
    const existingItem = inventoryData.find(i => i.sku === newSku && i.id !== itemId);
    if (existingItem) {
        showToast('SKU already exists! Please use a different SKU.', 'error');
        return;
    }
    
    // Update item data
    inventoryData[itemIndex] = {
        ...inventoryData[itemIndex],
        name: document.getElementById('editItemName').value,
        sku: document.getElementById('editItemSku').value,
        category: document.getElementById('editItemCategory').value,
        unit: document.getElementById('editItemUnit').value,
        cost_price: parseFloat(document.getElementById('editItemCostPrice').value),
        selling_price: parseFloat(document.getElementById('editItemSellingPrice').value),
        current_stock: parseInt(document.getElementById('editItemCurrentStock').value),
        min_stock_level: parseInt(document.getElementById('editItemMinStock').value),
        description: document.getElementById('editItemDescription').value,
        image: document.getElementById('editItemImage').value,
        updated_at: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
    
    // Update displays
    updateInventoryStats();
    renderInventoryTable();
    closeEditItemForm();
    showToast('Item updated successfully!', 'success');
}

// View item history
function viewItemHistory(itemId) {
    const item = inventoryData.find(i => i.id === itemId);
    if (!item) {
        showToast('Item not found!', 'error');
        return;
    }
    
    // Populate item information
    document.getElementById('historyItemName').textContent = item.name;
    document.getElementById('historyItemSku').textContent = item.sku;
    document.getElementById('historyItemCategory').textContent = item.category;
    document.getElementById('historyItemCurrentStock').textContent = `${item.current_stock} ${item.unit}`;
    
    // Load stock movement history
    loadStockMovementHistory(itemId);
    
    // Load price history
    loadPriceHistory(itemId);
    
    // Calculate and display statistics
    calculateItemStatistics(itemId);
    
    // Show history form
    openItemHistoryForm();
}

// Open item history form
function openItemHistoryForm() {
    const formSection = document.getElementById('itemHistorySection');
    formSection.style.display = 'block';
    
    // Scroll to form
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Close item history form
function closeItemHistoryForm() {
    const formSection = document.getElementById('itemHistorySection');
    formSection.style.display = 'none';
}

// Load stock movement history
function loadStockMovementHistory(itemId) {
    const tbody = document.getElementById('stockHistoryTableBody');
    tbody.innerHTML = '';
    
    // Get stock movements from localStorage or create sample data
    const stockMovements = JSON.parse(localStorage.getItem('stockMovements') || '[]');
    const itemMovements = stockMovements.filter(movement => movement.itemId === itemId);
    
    if (itemMovements.length === 0) {
        // Create sample data for demonstration
        const sampleMovements = [
            {
                id: 1,
                itemId: itemId,
                date: new Date().toISOString().split('T')[0],
                type: 'Purchase',
                quantity: 50,
                previousStock: 0,
                newStock: 50,
                reason: 'Initial stock purchase',
                user: 'Admin'
            },
            {
                id: 2,
                itemId: itemId,
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                type: 'Sale',
                quantity: 5,
                previousStock: 50,
                newStock: 45,
                reason: 'Customer purchase',
                user: 'Cashier'
            },
            {
                id: 3,
                itemId: itemId,
                date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
                type: 'Adjustment',
                quantity: -2,
                previousStock: 45,
                newStock: 43,
                reason: 'Damaged items',
                user: 'Manager'
            }
        ];
        
        sampleMovements.forEach(movement => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${movement.date}</td>
                <td><span class="movement-type ${movement.type.toLowerCase()}">${movement.type}</span></td>
                <td>${movement.quantity > 0 ? '+' : ''}${movement.quantity}</td>
                <td>${movement.previousStock}</td>
                <td>${movement.newStock}</td>
                <td>${movement.reason}</td>
                <td>${movement.user}</td>
            `;
            tbody.appendChild(row);
        });
    } else {
        itemMovements.forEach(movement => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${movement.date}</td>
                <td><span class="movement-type ${movement.type.toLowerCase()}">${movement.type}</span></td>
                <td>${movement.quantity > 0 ? '+' : ''}${movement.quantity}</td>
                <td>${movement.previousStock}</td>
                <td>${movement.newStock}</td>
                <td>${movement.reason}</td>
                <td>${movement.user}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Load price history
function loadPriceHistory(itemId) {
    const tbody = document.getElementById('priceHistoryTableBody');
    tbody.innerHTML = '';
    
    // Get price history from localStorage or create sample data
    const priceHistory = JSON.parse(localStorage.getItem('priceHistory') || '[]');
    const itemPriceHistory = priceHistory.filter(history => history.itemId === itemId);
    
    if (itemPriceHistory.length === 0) {
        // Create sample data for demonstration
        const samplePriceHistory = [
            {
                id: 1,
                itemId: itemId,
                date: new Date().toISOString().split('T')[0],
                type: 'Cost Price',
                previousPrice: 0,
                newPrice: 1500,
                change: '+₦1,500.00',
                user: 'Admin'
            },
            {
                id: 2,
                itemId: itemId,
                date: new Date().toISOString().split('T')[0],
                type: 'Selling Price',
                previousPrice: 0,
                newPrice: 2500,
                change: '+₦2,500.00',
                user: 'Admin'
            },
            {
                id: 3,
                itemId: itemId,
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                type: 'Selling Price',
                previousPrice: 2500,
                newPrice: 2300,
                change: '-₦200.00',
                user: 'Manager'
            }
        ];
        
        samplePriceHistory.forEach(history => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${history.date}</td>
                <td><span class="price-type ${history.type.toLowerCase().replace(' ', '-')}">${history.type}</span></td>
                <td>₦${parseFloat(history.previousPrice).toFixed(2)}</td>
                <td>₦${parseFloat(history.newPrice).toFixed(2)}</td>
                <td><span class="price-change ${history.change.startsWith('+') ? 'increase' : 'decrease'}">${history.change}</span></td>
                <td>${history.user}</td>
            `;
            tbody.appendChild(row);
        });
    } else {
        itemPriceHistory.forEach(history => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${history.date}</td>
                <td><span class="price-type ${history.type.toLowerCase().replace(' ', '-')}">${history.type}</span></td>
                <td>₦${parseFloat(history.previousPrice).toFixed(2)}</td>
                <td>₦${parseFloat(history.newPrice).toFixed(2)}</td>
                <td><span class="price-change ${history.change.startsWith('+') ? 'increase' : 'decrease'}">${history.change}</span></td>
                <td>${history.user}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Calculate item statistics
function calculateItemStatistics(itemId) {
    const stockMovements = JSON.parse(localStorage.getItem('stockMovements') || '[]');
    const priceHistory = JSON.parse(localStorage.getItem('priceHistory') || '[]');
    
    const itemMovements = stockMovements.filter(movement => movement.itemId === itemId);
    const itemPriceHistory = priceHistory.filter(history => history.itemId === itemId);
    
    // Calculate statistics
    const totalMovements = itemMovements.length || 3; // Sample data count
    const totalStockIn = itemMovements.filter(m => m.quantity > 0).reduce((sum, m) => sum + m.quantity, 0) || 50;
    const totalStockOut = Math.abs(itemMovements.filter(m => m.quantity < 0).reduce((sum, m) => sum + m.quantity, 0)) || 7;
    const priceChanges = itemPriceHistory.length || 3; // Sample data count
    
    // Display statistics
    document.getElementById('historyTotalMovements').textContent = totalMovements;
    document.getElementById('historyTotalStockIn').textContent = totalStockIn;
    document.getElementById('historyTotalStockOut').textContent = totalStockOut;
    document.getElementById('historyPriceChanges').textContent = priceChanges;
}

// Export item history
function exportItemHistory() {
    const itemName = document.getElementById('historyItemName').textContent;
    const itemSku = document.getElementById('historyItemSku').textContent;
    
    // Get stock movements
    const stockMovements = document.getElementById('stockHistoryTableBody').innerHTML;
    const priceHistory = document.getElementById('priceHistoryTableBody').innerHTML;
    
    // Create CSV content
    const csvContent = `Item History Report\nItem: ${itemName} (${itemSku})\nGenerated: ${new Date().toLocaleString()}\n\nStock Movement History\nDate,Type,Quantity,Previous Stock,New Stock,Reason,User\n${stockMovements}\n\nPrice History\nDate,Type,Previous Price,New Price,Change,User\n${priceHistory}`;
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `item-history-${itemSku}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showToast('Item history exported successfully!', 'success');
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

// Import form functions
function toggleImportForm() {
    const formSection = document.getElementById('importFormSection');
    if (formSection.style.display === 'none') {
        openImportForm();
    } else {
        closeImportForm();
    }
}

function openImportForm() {
    const formSection = document.getElementById('importFormSection');
    formSection.style.display = 'block';
    setupFileUpload();
    
    // Scroll to form
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeImportForm() {
    const formSection = document.getElementById('importFormSection');
    formSection.style.display = 'none';
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
        
        // Close form and show success message
        closeImportForm();
        showToast(`Import completed! ${importedCount} new items added, ${updatedCount} items updated.`, 'success');
        
    } catch (error) {
        console.error('Error importing CSV data:', error);
        showToast('Error importing data', 'error');
    }
}

// Open stock adjustment for specific item
function openStockAdjustment(itemId) {
    const item = inventoryData.find(i => i.id === itemId);
    if (!item) {
        showToast('Item not found!', 'error');
        return;
    }
    
    // Set the item in the adjustment form
    document.getElementById('adjustmentItem').value = itemId;
    document.getElementById('adjustmentItemName').textContent = item.name;
    
    // Open the stock adjustment form
    openStockAdjustmentForm();
}

// Open image modal
function openImageModal(imageUrl) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    if (modal && modalImage) {
        modalImage.src = imageUrl;
        modal.style.display = 'flex';
        modal.classList.add('show');
    }
}

// Close image modal
function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
    }
}

// Save new product
async function saveNewProduct() {
    try {
        // Get image as base64
        const imageBase64 = await getImageBase64();
        
        // Get form data
        const productData = {
            id: Date.now(),
            name: document.getElementById('productName').value.trim(),
            sku: document.getElementById('productSku').value.trim() || `SKU-${Date.now()}`,
            category: document.getElementById('productCategory').value,
            brand: document.getElementById('productBrand').value,
            current_stock: parseInt(document.getElementById('productQuantity').value),
            unit: document.getElementById('productUnit').value,
            cost_price: parseFloat(document.getElementById('productCostPrice').value),
            selling_price: parseFloat(document.getElementById('productSellingPrice').value),
            min_stock_level: parseInt(document.getElementById('productMinStock').value) || 5,
            max_stock_level: parseInt(document.getElementById('productMaxStock').value) || null,
            image: imageBase64 || null,
            description: document.getElementById('productDescription').value.trim(),
            specifications: document.getElementById('productSpecifications').value.trim(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Validate required fields
        if (!productData.name || !productData.category || !productData.brand || 
            !productData.current_stock || !productData.unit || 
            !productData.cost_price || !productData.selling_price) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        // Add to inventory data
        inventoryData.push(productData);
        
        // Save to localStorage
        localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
        
        // Update displays
        updateInventoryStats();
        renderInventoryTable();
        
        // Close form and show success
        closePurchaseForm();
        showToast('Product added successfully!', 'success');
        
        // Reset form
        document.getElementById('addProductForm').reset();
        
    } catch (error) {
        console.error('Error saving product:', error);
        showToast('Failed to save product', 'error');
    }
}

// Open category modal
function openCategoryModal() {
    document.getElementById('categoryModal').style.display = 'flex';
    document.getElementById('categoryModal').classList.add('show');
}

// Close category modal
function closeCategoryModal() {
    document.getElementById('categoryModal').style.display = 'none';
    document.getElementById('categoryModal').classList.remove('show');
    document.getElementById('categoryForm').reset();
}

// Save new category
function saveNewCategory() {
    try {
        const categoryName = document.getElementById('newCategoryName').value.trim();
        const categoryDescription = document.getElementById('newCategoryDescription').value.trim();
        
        if (!categoryName) {
            showToast('Please enter category name', 'error');
            return;
        }
        
        // Add to categories
        const newCategory = {
            id: Date.now(),
            name: categoryName,
            description: categoryDescription,
            created_at: new Date().toISOString()
        };
        
        categories.push(newCategory);
        localStorage.setItem('categories', JSON.stringify(categories));
        
        // Update category dropdown
        populateCategoryDropdown();
        
        // Close modal and show success
        closeCategoryModal();
        showToast('Category added successfully!', 'success');
        
    } catch (error) {
        console.error('Error saving category:', error);
        showToast('Failed to save category', 'error');
    }
}

// Open brand modal
function openBrandModal() {
    document.getElementById('brandModal').style.display = 'flex';
    document.getElementById('brandModal').classList.add('show');
}

// Close brand modal
function closeBrandModal() {
    document.getElementById('brandModal').style.display = 'none';
    document.getElementById('brandModal').classList.remove('show');
    document.getElementById('brandForm').reset();
}

// Save new brand
function saveNewBrand() {
    try {
        const brandName = document.getElementById('newBrandName').value.trim();
        const brandDescription = document.getElementById('newBrandDescription').value.trim();
        
        if (!brandName) {
            showToast('Please enter brand name', 'error');
            return;
        }
        
        // Add to brands (assuming we have a brands array)
        const newBrand = {
            id: Date.now(),
            name: brandName,
            description: brandDescription,
            created_at: new Date().toISOString()
        };
        
        // If brands array doesn't exist, create it
        if (!window.brands) {
            window.brands = [];
        }
        window.brands.push(newBrand);
        localStorage.setItem('brands', JSON.stringify(window.brands));
        
        // Update brand dropdown
        populateBrandDropdown();
        
        // Close modal and show success
        closeBrandModal();
        showToast('Brand added successfully!', 'success');
        
    } catch (error) {
        console.error('Error saving brand:', error);
        showToast('Failed to save brand', 'error');
    }
}

// Populate category dropdown
function populateCategoryDropdown() {
    const categorySelect = document.getElementById('productCategory');
    if (!categorySelect) return;
    
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

// Populate brand dropdown
function populateBrandDropdown() {
    const brandSelect = document.getElementById('productBrand');
    if (!brandSelect) return;
    
    brandSelect.innerHTML = '<option value="">Select Brand</option>';
    if (window.brands) {
        window.brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand.name;
            option.textContent = brand.name;
            brandSelect.appendChild(option);
        });
    }
}

// Image preview functionality
function setupImagePreview() {
    const imageInput = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const fileUploadArea = document.getElementById('fileUploadArea');
    
    if (imageInput && imagePreview && previewImg && fileUploadArea) {
        imageInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    showToast('Please select a valid image file', 'error');
                    return;
                }
                
                // Validate file size (5MB max)
                if (file.size > 5 * 1024 * 1024) {
                    showToast('Image size must be less than 5MB', 'error');
                    return;
                }
                
                // Create preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    imagePreview.style.display = 'block';
                    fileUploadArea.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Remove image
function removeImage() {
    const imageInput = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    const fileUploadArea = document.getElementById('fileUploadArea');
    
    if (imageInput && imagePreview && fileUploadArea) {
        imageInput.value = '';
        imagePreview.style.display = 'none';
        fileUploadArea.style.display = 'block';
    }
}

// Convert file to base64 for storage
function getImageBase64() {
    const imageInput = document.getElementById('productImage');
    if (imageInput.files && imageInput.files[0]) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(imageInput.files[0]);
        });
    }
    return null;
}

// Export functions for global access
window.toggleSidebar = toggleSidebar;
window.togglePurchaseForm = togglePurchaseForm;
window.openPurchaseForm = openPurchaseForm;
window.closePurchaseForm = closePurchaseForm;
window.toggleStockAdjustmentForm = toggleStockAdjustmentForm;
window.openStockAdjustmentForm = openStockAdjustmentForm;
window.closeStockAdjustmentForm = closeStockAdjustmentForm;
window.openStockAdjustment = openStockAdjustment;
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;
window.saveNewProduct = saveNewProduct;
window.openCategoryModal = openCategoryModal;
window.closeCategoryModal = closeCategoryModal;
window.saveNewCategory = saveNewCategory;
window.openBrandModal = openBrandModal;
window.closeBrandModal = closeBrandModal;
window.saveNewBrand = saveNewBrand;
window.removeImage = removeImage;
window.toggleImportForm = toggleImportForm;
window.openImportForm = openImportForm;
window.closeImportForm = closeImportForm;
window.closeModal = closeModal;
window.addItemRow = addItemRow;
window.removeItemRow = removeItemRow;
window.savePurchase = savePurchase;
window.saveStockAdjustment = saveStockAdjustment;
window.filterInventory = filterInventory;
window.searchInventory = searchInventory;
window.exportInventory = exportInventory;
window.handleFileSelect = handleFileSelect;
window.importCSVData = importCSVData;
window.editItem = editItem;
window.openEditItemForm = openEditItemForm;
window.closeEditItemForm = closeEditItemForm;
window.updateItem = updateItem;
window.viewItemHistory = viewItemHistory;
window.openItemHistoryForm = openItemHistoryForm;
window.closeItemHistoryForm = closeItemHistoryForm;
window.loadStockMovementHistory = loadStockMovementHistory;
window.loadPriceHistory = loadPriceHistory;
window.calculateItemStatistics = calculateItemStatistics;
window.exportItemHistory = exportItemHistory;
window.reorderItem = reorderItem;
window.openReorderForm = openReorderForm;
window.closeReorderForm = closeReorderForm;
window.updateReorderSummary = updateReorderSummary;
window.processReorder = processReorder;
window.toggleUserDropdown = toggleUserDropdown;
window.openShopSettings = openShopSettings;
window.logout = logout;

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

// Reorder item
function reorderItem(itemId) {
    const item = inventoryData.find(i => i.id === itemId);
    if (!item) {
        showToast('Item not found!', 'error');
        return;
    }
    
    // Populate item information
    document.getElementById('reorderItemId').value = item.id;
    document.getElementById('reorderItemName').textContent = item.name;
    document.getElementById('reorderItemSku').textContent = item.sku;
    document.getElementById('reorderCurrentStock').textContent = `${item.current_stock} ${item.unit}`;
    document.getElementById('reorderMinStock').textContent = `${item.min_stock_level} ${item.unit}`;
    
    // Set default values
    document.getElementById('reorderQuantity').value = Math.max(item.min_stock_level - item.current_stock, 10);
    document.getElementById('reorderUnitCost').value = item.cost_price;
    
    // Set default expected date (7 days from now)
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + 7);
    document.getElementById('reorderExpectedDate').value = expectedDate.toISOString().split('T')[0];
    
    // Update summary
    updateReorderSummary();
    
    // Show reorder form
    openReorderForm();
}

// Open reorder form
function openReorderForm() {
    const formSection = document.getElementById('reorderSection');
    formSection.style.display = 'block';
    
    // Focus on first input
    document.getElementById('reorderQuantity').focus();
    
    // Scroll to form
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Close reorder form
function closeReorderForm() {
    const formSection = document.getElementById('reorderSection');
    formSection.style.display = 'none';
    
    // Reset form
    document.getElementById('reorderForm').reset();
}

// Update reorder summary
function updateReorderSummary() {
    const quantity = parseInt(document.getElementById('reorderQuantity').value) || 0;
    const unitCost = parseFloat(document.getElementById('reorderUnitCost').value) || 0;
    const itemId = parseInt(document.getElementById('reorderItemId').value);
    
    const item = inventoryData.find(i => i.id === itemId);
    if (!item) return;
    
    const totalCost = quantity * unitCost;
    const newStockLevel = item.current_stock + quantity;
    
    document.getElementById('reorderSummaryQuantity').textContent = quantity;
    document.getElementById('reorderSummaryUnitCost').textContent = `₦${unitCost.toFixed(2)}`;
    document.getElementById('reorderSummaryTotalCost').textContent = `₦${totalCost.toFixed(2)}`;
    document.getElementById('reorderSummaryNewStock').textContent = `${newStockLevel} ${item.unit}`;
}

// Process reorder
function processReorder() {
    const form = document.getElementById('reorderForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const itemId = parseInt(document.getElementById('reorderItemId').value);
    const item = inventoryData.find(i => i.id === itemId);
    
    if (!item) {
        showToast('Item not found!', 'error');
        return;
    }
    
    const reorderData = {
        id: Date.now(),
        itemId: itemId,
        itemName: item.name,
        itemSku: item.sku,
        quantity: parseInt(document.getElementById('reorderQuantity').value),
        unitCost: parseFloat(document.getElementById('reorderUnitCost').value),
        supplier: document.getElementById('reorderSupplier').value,
        expectedDate: document.getElementById('reorderExpectedDate').value,
        notes: document.getElementById('reorderNotes').value,
        status: 'pending',
        createdAt: new Date().toISOString(),
        createdBy: localStorage.getItem('currentUser') || 'Admin'
    };
    
    // Save reorder to localStorage
    const reorders = JSON.parse(localStorage.getItem('reorders') || '[]');
    reorders.push(reorderData);
    localStorage.setItem('reorders', JSON.stringify(reorders));
    
    // Create stock movement record
    const stockMovement = {
        id: Date.now(),
        itemId: itemId,
        date: new Date().toISOString().split('T')[0],
        type: 'Reorder',
        quantity: reorderData.quantity,
        previousStock: item.current_stock,
        newStock: item.current_stock + reorderData.quantity,
        reason: `Reorder from ${reorderData.supplier || 'supplier'}`,
        user: reorderData.createdBy
    };
    
    const stockMovements = JSON.parse(localStorage.getItem('stockMovements') || '[]');
    stockMovements.push(stockMovement);
    localStorage.setItem('stockMovements', JSON.stringify(stockMovements));
    
    // Update item stock
    const itemIndex = inventoryData.findIndex(i => i.id === itemId);
    inventoryData[itemIndex].current_stock += reorderData.quantity;
    inventoryData[itemIndex].cost_price = reorderData.unitCost; // Update cost price
    inventoryData[itemIndex].updated_at = new Date().toISOString();
    
    // Save updated inventory
    localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
    
    // Update displays
    updateInventoryStats();
    renderInventoryTable();
    closeReorderForm();
    
    showToast(`Reorder processed successfully! ${reorderData.quantity} units added to stock.`, 'success');
}
