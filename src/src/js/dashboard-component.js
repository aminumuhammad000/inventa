// Dashboard Component JavaScript
class DashboardComponent {
    constructor() {
        this.inventoryData = [];
        this.salesData = [];
        this.customersData = [];
        this.chart = null;
    }

    // Initialize dashboard component
    async init() {
        try {
            await this.loadData();
            this.updateStats();
            this.loadRecentSales();
            this.loadLowStockItems();
            this.initializeChart();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error initializing dashboard:', error);
        }
    }

    // Load data from localStorage
    async loadData() {
        this.inventoryData = JSON.parse(localStorage.getItem('inventoryData')) || [];
        this.salesData = JSON.parse(localStorage.getItem('salesData')) || [];
        this.customersData = JSON.parse(localStorage.getItem('customersData')) || [];
    }

    // Update statistics
    updateStats() {
        // Total Products
        const totalProducts = this.inventoryData.length;
        document.getElementById('totalProducts').textContent = totalProducts;

        // Total Sales
        const totalSales = this.salesData.reduce((sum, sale) => sum + sale.total, 0);
        document.getElementById('totalSales').textContent = `₦${totalSales.toLocaleString()}`;

        // Total Customers
        const totalCustomers = this.customersData.length;
        document.getElementById('totalCustomers').textContent = totalCustomers;

        // Total Profit
        const totalProfit = this.salesData.reduce((sum, sale) => {
            const profit = sale.items.reduce((itemSum, item) => {
                const inventoryItem = this.inventoryData.find(inv => inv.id === item.productId);
                if (inventoryItem) {
                    return itemSum + (item.quantity * (item.price - inventoryItem.costPrice));
                }
                return itemSum;
            }, 0);
            return sum + profit;
        }, 0);
        document.getElementById('totalProfit').textContent = `₦${totalProfit.toLocaleString()}`;
    }

    // Load recent sales
    loadRecentSales() {
        const recentSalesList = document.getElementById('recentSalesList');
        if (!recentSalesList) return;

        const recentSales = this.salesData.slice(0, 5);
        
        if (recentSales.length === 0) {
            recentSalesList.innerHTML = '<div class="empty-state">No recent sales</div>';
            return;
        }

        recentSalesList.innerHTML = recentSales.map(sale => `
            <div class="sale-item">
                <div class="sale-info">
                    <div class="sale-customer">${sale.customerName}</div>
                    <div class="sale-date">${new Date(sale.date).toLocaleDateString()}</div>
                </div>
                <div class="sale-amount">₦${sale.total.toLocaleString()}</div>
            </div>
        `).join('');
    }

    // Load low stock items
    loadLowStockItems() {
        const lowStockList = document.getElementById('lowStockList');
        if (!lowStockList) return;

        const lowStockItems = this.inventoryData.filter(item => 
            item.quantity <= (item.minStockLevel || 10)
        ).slice(0, 5);

        if (lowStockItems.length === 0) {
            lowStockList.innerHTML = '<div class="empty-state">All items well stocked</div>';
            return;
        }

        lowStockList.innerHTML = lowStockItems.map(item => `
            <div class="stock-item">
                <div class="stock-info">
                    <div class="stock-name">${item.name}</div>
                    <div class="stock-quantity">${item.quantity} left</div>
                </div>
                <div class="stock-status ${item.quantity === 0 ? 'out-of-stock' : 'low-stock'}">
                    ${item.quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                </div>
            </div>
        `).join('');
    }

    // Initialize sales chart
    initializeChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.chart) {
            this.chart.destroy();
        }

        const period = parseInt(document.getElementById('chartPeriod')?.value || 30);
        const chartData = this.getChartData(period);

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Sales',
                    data: chartData.data,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₦' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // Get chart data for specified period
    getChartData(period) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - period);

        const labels = [];
        const data = [];

        for (let i = 0; i < period; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

            const daySales = this.salesData.filter(sale => {
                const saleDate = new Date(sale.date);
                return saleDate.toDateString() === date.toDateString();
            }).reduce((sum, sale) => sum + sale.total, 0);

            data.push(daySales);
        }

        return { labels, data };
    }

    // Setup event listeners
    setupEventListeners() {
        // Chart period change
        const chartPeriod = document.getElementById('chartPeriod');
        if (chartPeriod) {
            chartPeriod.addEventListener('change', () => {
                this.initializeChart();
            });
        }
    }

    // Load dashboard HTML into container
    static async loadDashboard(containerId) {
        try {
            const response = await fetch('components/dashboard.html');
            const dashboardHTML = await response.text();
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = dashboardHTML;
                // Initialize dashboard after loading
                const dashboardComponent = new DashboardComponent();
                await dashboardComponent.init();
                return dashboardComponent;
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }
}

// Export for global access
window.DashboardComponent = DashboardComponent;
